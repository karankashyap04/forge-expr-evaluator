"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeExprFreeVariableFinder = void 0;
const AbstractParseTreeVisitor_1 = require("antlr4ts/tree/AbstractParseTreeVisitor");
const ForgeExprEvaluator_1 = require("./ForgeExprEvaluator");
// define helper function on the FreeVariables type
function getAllFreeVariables(freeVariables) {
    const allVariables = new Set();
    for (const variables of freeVariables.values()) {
        for (const variable of variables) {
            allVariables.add(variable);
        }
    }
    return allVariables;
}
/**
 * A recursive visitor to find all the free variables referenced in a forge
 * expression.
 */
class ForgeExprFreeVariableFinder extends AbstractParseTreeVisitor_1.AbstractParseTreeVisitor {
    constructor(datum, instanceIndex, predicates) {
        super();
        this.datum = datum;
        this.instanceIndex = instanceIndex;
        this.instanceData = this.datum.parsed.instances[this.instanceIndex];
        this.predicates = predicates;
    }
    aggregateResult(aggregate, nextResult) {
        if (!aggregate) {
            return nextResult;
        }
        if (!nextResult) {
            return aggregate;
        }
        // Merge the two maps
        for (const [contextNode, variables] of nextResult.entries()) {
            if (!aggregate.has(contextNode)) {
                aggregate.set(contextNode, new Set());
            }
            const existingVariables = aggregate.get(contextNode);
            for (const variable of variables) {
                existingVariables.add(variable);
            }
        }
        return aggregate;
    }
    addCtxToFreeVariableMap(ctx, freeVariables, additionalVars) {
        if (!freeVariables.has(ctx)) {
            freeVariables.set(ctx, getAllFreeVariables(freeVariables));
        }
        const variables = freeVariables.get(ctx);
        if (additionalVars !== undefined) {
            for (const variable in additionalVars) {
                variables.add(variable);
            }
        }
        return freeVariables;
    }
    defaultResult() {
        return new Map();
    }
    visitPredDecl(ctx) {
        const visitResult = this.visit(ctx.block());
        return this.addCtxToFreeVariableMap(ctx, visitResult);
    }
    visitBlock(ctx) {
        let result = this.defaultResult(); // aggregator
        for (const expr of ctx.expr()) {
            const exprResult = this.visit(expr);
            result = this.aggregateResult(result, exprResult);
        }
        return this.addCtxToFreeVariableMap(ctx, result);
    }
    // helper function to get a list of names from a nameList
    getNameListValues(ctx) {
        if (ctx.COMMA_TOK()) {
            // there is a comma, so we need to get the value from the head of the list
            // and then move onto the tail after that
            const headValue = ctx.name().text;
            const tailValues = this.getNameListValues(ctx.nameList());
            tailValues.add(headValue);
            return tailValues;
        }
        else {
            // there is no comma so there is just a single name that we need to deal with here
            return new Set([ctx.name().text]);
        }
    }
    // helper function to get the names of each var in a quantDecl
    getQuantDeclVarNames(ctx) {
        // NOTE: **UNIMPLEMENTED**: discuss use of `disj` with Tim
        // const isDisjoint = quantDecl.DISJ_TOK() !== undefined;
        const nameList = ctx.nameList();
        return this.getNameListValues(nameList);
    }
    // helper function to get the values each var is bound to in a quantDeclList
    getQuantDeclListVarNames(ctx) {
        if (ctx.COMMA_TOK()) {
            // there is a comma, so we need to get the value from the head of the list
            // and then move onto the tail after that
            const head = ctx.quantDecl();
            const tail = ctx.quantDeclList();
            if (tail === undefined) {
                throw new Error("expected a quantDeclList after the comma");
            }
            const headValue = this.getQuantDeclVarNames(head);
            const tailValues = this.getQuantDeclListVarNames(tail);
            for (const variable of headValue) {
                tailValues.add(variable);
            }
            return tailValues;
        }
        else {
            // there is no comma so there is just a single quantDecl that we need to
            // deal with here
            return this.getQuantDeclVarNames(ctx.quantDecl());
        }
    }
    // helper function to add the current context to the list obtained from
    // visiting children
    visitExpr(ctx) {
        if (ctx.LET_TOK()) {
            throw new Error("**UNIMPLEMENTED**: Let binding not yet implemented");
        }
        if (ctx.BIND_TOK()) {
            throw new Error("**NOT IMPLEMENTING FOR NOW**: Bind Expression");
        }
        if (ctx.quant()) {
            if (ctx.quantDeclList() === undefined) {
                throw new Error("Expected the quantifier to have a quantDeclList");
            }
            const quantDeclListVars = this.getQuantDeclListVarNames(ctx.quantDeclList());
            // we need to get all the vars referenced here other than the vars
            // bound by the quantifier (in quantDeclListVars)
            const blockOrBar = ctx.blockOrBar();
            if (blockOrBar === undefined) {
                throw new Error("expected to quantify over something!");
            }
            if (blockOrBar.BAR_TOK() === undefined ||
                blockOrBar.expr() === undefined) {
                throw new Error("Expected the quantifier to have a bar followed by an expr!");
            }
            let allFreeVars;
            if (blockOrBar.block() !== undefined) {
                allFreeVars = this.visit(blockOrBar.block());
            }
            else {
                allFreeVars = this.visit(blockOrBar.expr());
            }
            // // remove the variables bound by the quantifier from the result
            // for (const [contextNode, variables] of allFreeVars.entries()) {
            //   const filteredVariables = new Set<string>();
            //   for (const variable of variables) {
            //     if (!quantDeclListVars.has(variable)) {
            //       filteredVariables.add(variable);
            //     }
            //   }
            //   allFreeVars.set(contextNode, filteredVariables);
            // }
            // the context node for the quantifier as a whole shouldn't have _all_ of these
            // free vars; specifically, it should not include the vars that are being
            // bound by the quantifier
            // so we need to remove the variables bound by the quantifier from the result
            const allVars = getAllFreeVariables(allFreeVars);
            const filteredVariables = new Set();
            for (const variable of allVars) {
                if (!quantDeclListVars.has(variable)) {
                    filteredVariables.add(variable);
                }
            }
            allFreeVars.set(ctx, filteredVariables);
            return allFreeVars;
        }
        const childrenResults = this.visitChildren(ctx);
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr1(ctx) {
        const childrenResults = this.visitChildren(ctx);
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr1_5(ctx) {
        const childrenResults = this.visitChildren(ctx);
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr2(ctx) {
        const childrenResults = this.visitChildren(ctx);
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr3(ctx) {
        const childrenResults = this.visitChildren(ctx);
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr4(ctx) {
        const childrenResults = this.visitChildren(ctx);
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr4_5(ctx) {
        const childrenResults = this.visitChildren(ctx);
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr5(ctx) {
        const childrenResults = this.visitChildren(ctx);
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr6(ctx) {
        const childrenResults = this.visitChildren(ctx);
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr7(ctx) {
        const childrenResults = this.visit(ctx.expr8());
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr8(ctx) {
        const childrenResults = this.visitChildren(ctx);
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr9(ctx) {
        const childrenResults = this.visitChildren(ctx);
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr10(ctx) {
        const childrenResults = this.visitChildren(ctx);
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr11(ctx) {
        const childrenResults = this.visitChildren(ctx);
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr12(ctx) {
        const childrenResults = this.visitChildren(ctx);
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr13(ctx) {
        const childrenResults = this.visitChildren(ctx);
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr14(ctx) {
        const childrenResults = this.visitChildren(ctx);
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr15(ctx) {
        const childrenResults = this.visitChildren(ctx); // presumably this will include the
        // result from visitName as well (NameContext should be visited in the
        // recursive descent if there is a NameContext in the expr)
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr16(ctx) {
        const childrenResults = this.visitChildren(ctx);
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr17(ctx) {
        const childrenResults = this.visitChildren(ctx);
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExpr18(ctx) {
        if (ctx.LEFT_CURLY_TOK()) {
            // set comprehension
            if (ctx.quantDeclList() === undefined) {
                throw new Error("expected a quantDeclList in the set comprehension!");
            }
            const quantDeclListVars = this.getQuantDeclListVarNames(ctx.quantDeclList());
            // we need to get all the vars referenced here other than the vars
            // bound by the quantifier (in quantDeclListVars)
            const blockOrBar = ctx.blockOrBar();
            if (blockOrBar === undefined) {
                throw new Error("expected a blockOrBar in the set comprehension!");
            }
            if (blockOrBar.BAR_TOK() === undefined ||
                blockOrBar.expr() === undefined) {
                throw new Error("expected a bar followed by an expr in the set comprehension!");
            }
            let allFreeVars;
            if (blockOrBar.block() !== undefined) {
                allFreeVars = this.visit(blockOrBar.block());
            }
            else {
                allFreeVars = this.visit(blockOrBar.expr());
            }
            // // remove the variables bound by the quantifier from the result
            // for (const [contextNode, variables] of allFreeVars.entries()) {
            //   const filteredVariables = new Set<string>();
            //   for (const variable of variables) {
            //     if (!quantDeclListVars.has(variable)) {
            //       filteredVariables.add(variable);
            //     }
            //   }
            //   allFreeVars.set(contextNode, filteredVariables);
            // }
            // return this.addCtxToFreeVariableMap(ctx, allFreeVars);
            // the context node for the quantifier as a whole shouldn't have _all_ of these
            // free vars; specifically, it should not include the vars that are being
            // bound by the quantifier
            // so we need to remove the variables bound by the quantifier from the result
            const allVars = getAllFreeVariables(allFreeVars);
            const filteredVariables = new Set();
            for (const variable of allVars) {
                if (!quantDeclListVars.has(variable)) {
                    filteredVariables.add(variable);
                }
            }
            allFreeVars.set(ctx, filteredVariables);
            return allFreeVars;
        }
        const childrenResults = this.visitChildren(ctx);
        return this.addCtxToFreeVariableMap(ctx, childrenResults);
    }
    visitExprList(ctx) {
        let result = this.defaultResult(); // aggregator
        if (ctx.COMMA_TOK()) {
            if (ctx.exprList() === undefined) {
                throw new Error("exprList with a comma must have a tail!");
            }
            const headFreeVars = this.visit(ctx.expr());
            const tailFreeVars = this.visit(ctx.exprList());
            result = this.aggregateResult(result, headFreeVars);
            result = this.aggregateResult(result, tailFreeVars);
        }
        else {
            const exprFreeVars = this.visit(ctx.expr());
            result = this.aggregateResult(result, exprFreeVars);
        }
        return this.addCtxToFreeVariableMap(ctx, result);
    }
    // helper function
    isPredicateName(name) {
        return this.predicates.some((pred) => pred.name === name);
    }
    visitName(ctx) {
        const identifier = ctx.IDENTIFIER_TOK().text;
        if (identifier === "true" || identifier === "false") {
            // these aren't free variables
            return this.defaultResult();
        }
        // if predicate name then not a free variable
        if (this.isPredicateName(identifier)) {
            return this.defaultResult();
        }
        // if it is a type, then it is not a free variable
        const typeNames = Object.keys(this.instanceData.types).map((key) => this.instanceData.types[key].id);
        if (typeNames.includes(identifier)) {
            return this.defaultResult();
        }
        // if it is an instance of a type, then it is not a free variable
        for (const typeName of typeNames) {
            const atomIds = this.instanceData.types[typeName].atoms.map((atom) => atom.id);
            if (atomIds.includes(identifier)) {
                return this.defaultResult();
            }
        }
        // if it is a relation, then it is not a free variable
        const relationKeys = Object.keys(this.instanceData.relations);
        for (const relationKey of relationKeys) {
            const relationName = this.instanceData.relations[relationKey].name;
            if (relationName === identifier) {
                return this.defaultResult();
            }
        }
        // if this is a supported builtin, then it is not a free variable
        if (ForgeExprEvaluator_1.SUPPORTED_BUILTINS.includes(identifier)) {
            return this.defaultResult();
        }
        // otherwise, it is a free variable
        const freeVariables = this.defaultResult();
        freeVariables.set(ctx, new Set([identifier]));
        return freeVariables;
    }
}
exports.ForgeExprFreeVariableFinder = ForgeExprFreeVariableFinder;
