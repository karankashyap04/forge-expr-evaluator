"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeListenerImpl = void 0;
const ForgeSyntaxConstructs_1 = require("./ForgeSyntaxConstructs");
/*
    We don't really need a whole AST right now right?
    Just need to find:
    - Locations and types of sigs
    - Locations and types of predicates
    - Locations and types of functions
    - Locations and types of tests

*/
function getRandomName() {
    return Math.random().toString(36).substring(7);
}
function exitExpr(ctx) {
    const { startLine, startColumn, endLine, endColumn } = getLocations(ctx);
    const exprTree = getLocationOnlyExpr(ctx);
    console.log("Parsed Expression Tree:", exprTree);
}
function getLocations(ctx) {
    const startLine = ctx.start.line; // This is 1 based line number
    const startColumn = ctx.start.charPositionInLine; // This is 0 based offset
    const endLine = ctx.stop ? ctx.stop.line : -1;
    const endColumn = ctx.stop ? ctx.stop.charPositionInLine + (ctx.stop.text?.length || 0) : 0;
    return { startLine, startColumn, endLine, endColumn };
}
/**
 *
 * @param ctx Some parser rule context
 * @returns A block with only the locations of the text in the ctx.
 */
function getLocationOnlyBlock(ctx) {
    const { startLine, startColumn, endLine, endColumn } = getLocations(ctx);
    const block = new ForgeSyntaxConstructs_1.Block(startLine, startColumn, endLine, endColumn, []);
    return block;
}
function getLocationOnlyExpr(ctx) {
    const { startLine, startColumn, endLine, endColumn } = getLocations(ctx);
    const expr = new ForgeSyntaxConstructs_1.Expr(startLine, startColumn, endLine, endColumn, "");
    return expr;
}
/*
    TODO: Rename this to a listener for TOADUS PONENS


    TODO: Update this to implement the NEW assertions.
*/
class ForgeListenerImpl {
    constructor() {
        this._sigs = [];
        this._predicates = [];
        this._tests = [];
        this._assertions = [];
        this._examples = [];
        this._quantifiedAssertions = [];
        this._satisfiabilityAssertions = [];
        this._functions = [];
        this._consistencyAssertions = [];
    }
    get sigs() {
        return this._sigs;
    }
    get predicates() {
        return this._predicates;
    }
    get tests() {
        return this._tests;
    }
    get assertions() {
        return this._assertions;
    }
    get examples() {
        return this._examples;
    }
    get quantifiedAssertions() {
        return this._quantifiedAssertions;
    }
    get satisfiabilityAssertions() {
        return this._satisfiabilityAssertions;
    }
    get functions() {
        return this._functions;
    }
    get consistencyAssertions() {
        return this._consistencyAssertions;
    }
    /**
     * Exit a parse tree produced by `ForgeParser.sigDecl`.
     * @param ctx the parse tree
     */
    exitSigDecl(ctx) {
        const { startLine, startColumn, endLine, endColumn } = getLocations(ctx);
        // Could have definied multiple names here.
        const sigNames = this.getAllNames(ctx.nameList());
        const multiplicity = ctx.mult()?.toStringTree(); // This is not ideal, but will do for now.
        const inheritsFrom = ctx.sigExt()?.toStringTree(); // This is not ideal, but will do for now.
        const sigBlock = ctx.block();
        const sigBody = sigBlock ? getLocationOnlyBlock(sigBlock) : undefined;
        for (const sigName of sigNames) {
            let s = new ForgeSyntaxConstructs_1.Sig(startLine, startColumn, endLine, endColumn, sigName, sigBody, inheritsFrom, multiplicity);
            this._sigs.push(s);
        }
    }
    /**
     * Exit a parse tree produced by `ForgeParser.predDecl`.
     * @param ctx the parse tree
     */
    exitPredDecl(ctx) {
        const { startLine, startColumn, endLine, endColumn } = getLocations(ctx);
        const predName = ctx.name().text;
        // We don't care about the pred type for now (wheat or not.) In fact, this should maybe be removed from FORGE.
        // There is also the PRED qualName that I don't know what to do with here.
        // Ideally, predArgs should look something like this.
        //const predArgs : Record<string, string> = {}; // TODO: This needs to be fixed!!
        const paraDecls = ctx.paraDecls();
        const predArgsBlock = paraDecls ? getLocationOnlyBlock(paraDecls) : undefined;
        // Get the pred body (block)
        const predBody = ctx.block();
        // Block start, block end.
        let predBlock = getLocationOnlyBlock(predBody);
        const predBodyStatements = []; // TODO
        let p = new ForgeSyntaxConstructs_1.Predicate(startLine, startColumn, endLine, endColumn, predName, predArgsBlock, predBlock);
        this._predicates.push(p);
    }
    /**
     * Exit a parse tree produced by `ForgeParser.funDecl`.
     * @param ctx the parse tree
     */
    exitFunDecl(ctx) {
        const { startLine, startColumn, endLine, endColumn } = getLocations(ctx);
        const funName = ctx.name().text;
        let f = new Function(startLine, startColumn, endLine, endColumn, funName);
        this._functions.push(f);
    }
    /**
     * Exit a parse tree produced by `ForgeParser.testDecl`.
     * @param ctx the parse tree
     */
    exitTestDecl(ctx) {
        const { startLine, startColumn, endLine, endColumn } = getLocations(ctx);
        const testName = ctx.name()?.IDENTIFIER_TOK().text || getRandomName();
        // IGNORE qualName (the alternative to block) for now, unsure what it is. TODO!!
        const testBlock = ctx.block();
        const testBody = testBlock ? getLocationOnlyBlock(testBlock) : undefined;
        const testScope = ctx.scope()?.toStringTree(); // This is not ideal, but will do for now.
        const testBounds = ctx.bounds()?.toStringTree(); // This is not ideal, but will do for now.
        const check = ctx.SAT_TOK() ? "sat" :
            ctx.UNSAT_TOK() ? "unsat" :
                ctx.THEOREM_TOK() ? "theorem" :
                    ctx.FORGE_ERROR_TOK() ? "forge_error" :
                        ctx.CHECKED_TOK() ? "checked" : "unknown";
        let t = new ForgeSyntaxConstructs_1.Test(startLine, startColumn, endLine, endColumn, testName, check, testBody, testBounds, testScope);
        this._tests.push(t);
    }
    /**
     * Exit a parse tree produced by `ForgeParser.satisfiabilityDecl`.
     * @param ctx the parse tree
     */
    exitSatisfiabilityDecl(ctx) {
        const { startLine, startColumn, endLine, endColumn } = getLocations(ctx);
        const expr = getLocationOnlyExpr(ctx.expr());
        const testScope = ctx.scope()?.toStringTree(); // This is not ideal, but will do for now.
        const testBounds = ctx.bounds()?.toStringTree(); // This is not ideal, but will do for now.
        // Hmm, why did we avoid theorem here I wonder
        const check = ctx.SAT_TOK() ? "sat" :
            ctx.UNSAT_TOK() ? "unsat" :
                ctx.FORGE_ERROR_TOK() ? "forge_error" : "unknown";
        const st = new ForgeSyntaxConstructs_1.SatisfiabilityAssertionTest(startLine, startColumn, endLine, endColumn, expr, check, testBounds, testScope);
        this._satisfiabilityAssertions.push(st);
    }
    /**
     * Exit a parse tree produced by `ForgeParser.propertyDecl`.
     * @param ctx the parse tree
     */
    exitPropertyDecl(ctx) {
        // ALWAYS OF THE FORM pred => prop
        const { startLine, startColumn, endLine, endColumn } = getLocations(ctx);
        // First get if necessary or sufficient
        const rel = ctx.SUFFICIENT_TOK() ? "sufficient"
            : ctx.NECESSARY_TOK() ? "necessary"
                : "unknown";
        // Assert that the relation is necessary or sufficient
        if (rel === "unknown") {
            throw new Error("Property relation must be either necessary or sufficient.");
        }
        const expr = getLocationOnlyExpr(ctx.expr());
        const predName = ctx.name().text;
        const testScope = ctx.scope()?.toStringTree(); // This is not ideal, but will do for now.
        const testBounds = ctx.bounds()?.toStringTree(); // This is not ideal, but will do for now.
        const at = new ForgeSyntaxConstructs_1.AssertionTest(startLine, startColumn, endLine, endColumn, predName, expr, rel, testBounds, testScope);
        this._assertions.push(at);
    }
    /**
     * Exit a parse tree produced by `ForgeParser.quantifiedPropertyDecl`.
     * @param ctx the parse tree
     *
     */
    exitQuantifiedPropertyDecl(ctx) {
        // ALWAYS OF THE FORM pred => prop
        const { startLine, startColumn, endLine, endColumn } = getLocations(ctx);
        const disj = ctx.DISJ_TOK() ? true : false;
        // First get if necessary or sufficient
        const rel = ctx.SUFFICIENT_TOK() ? "sufficient"
            : ctx.NECESSARY_TOK() ? "necessary"
                : "unknown";
        // Assert that the relation is necessary or sufficient
        if (rel === "unknown") {
            throw new Error("Property relation must be either necessary or sufficient.");
        }
        let predIndex = (rel === "sufficient") ? 0 : 1;
        let propIndex = (rel === "sufficient") ? 1 : 0;
        const predName = ctx.name().text;
        const expr = getLocationOnlyExpr(ctx.expr());
        let argsT = ctx.exprList();
        let predArgsBlock = (argsT) ? getLocationOnlyBlock(argsT) : undefined;
        const testScope = ctx.scope()?.toStringTree(); // This is not ideal, but will do for now.
        const testBounds = ctx.bounds()?.toStringTree(); // This is not ideal, but will do for now.
        // TODO: Improve this, which is not ideal
        const quantDecls = ctx.quantDeclList();
        const quantDeclsBlock = quantDecls ? getLocationOnlyBlock(quantDecls) : undefined;
        let qa = new ForgeSyntaxConstructs_1.QuantifiedAssertionTest(startLine, startColumn, endLine, endColumn, predName, expr, rel, disj, quantDeclsBlock, testBounds, testScope, predArgsBlock);
        this._quantifiedAssertions.push(qa);
    }
    /**
     * Exit a parse tree produced by `ForgeParser.consistencyDecl`.
     * @param ctx the parse tree
     */
    exitConsistencyDecl(ctx) {
        // ALWAYS OF THE FORM pred => prop
        // TODO: FILL
        const { startLine, startColumn, endLine, endColumn } = getLocations(ctx);
        let consistencyType = ctx.CONSISTENT_TOK() ? "consistent" :
            ctx.INCONSISTENT_TOK() ? "inconsistent" :
                "unknown";
        if (consistencyType === "unknown") {
            throw new Error("Consistency assertion relation must be either consistent or inconsistent.");
        }
        let consistent = (consistencyType === "consistent") ? true : false;
        const predName = ctx.name().text;
        const expr = getLocationOnlyExpr(ctx.expr());
        const testScope = ctx.scope()?.toStringTree(); // This is not ideal, but will do for now.
        const testBounds = ctx.bounds()?.toStringTree(); // This is not ideal, but will do for now.
        const ct = new ForgeSyntaxConstructs_1.ConsistencyAssertionTest(startLine, startColumn, endLine, endColumn, predName, expr, consistent, testBounds, testScope);
        this._consistencyAssertions.push(ct);
    }
    /**
     * Exit a parse tree produced by `ForgeParser.exampleDecl`.
     * @param ctx the parse tree
     *
     *
     *      * TODO: THIS IS HARD, WE NEED TO PARSE THE EXPRLIST (WHICH WILL ALWAYS BE ALL)
     *
     */
    exitExampleDecl(ctx) {
        const { startLine, startColumn, endLine, endColumn } = getLocations(ctx);
        const exampleName = ctx.name().text;
        const testExpr = ctx.expr();
        const testExprBlock = getLocationOnlyBlock(testExpr);
        const bounds = ctx.bounds();
        const boundsBlock = getLocationOnlyBlock(bounds);
        let e = new ForgeSyntaxConstructs_1.Example(startLine, startColumn, endLine, endColumn, exampleName, testExprBlock, boundsBlock);
        this._examples.push(e);
    }
    /////////////////////
    /**
     * Collects all names from the given NameListContext.
     * @param ctx the NameListContext
     * @returns an array of NameContext
     */
    getAllNames(ctx) {
        const names = [];
        // Helper function to traverse the NameListContext
        function collectNames(nameListCtx) {
            if (nameListCtx.name()) {
                names.push(nameListCtx.name());
            }
            const nestedNameList = nameListCtx.nameList();
            if (nestedNameList) {
                collectNames(nestedNameList);
            }
        }
        // Start the collection from the given context
        collectNames(ctx);
        return names.map(nameCtx => nameCtx.IDENTIFIER_TOK().text);
    }
}
exports.ForgeListenerImpl = ForgeListenerImpl;
