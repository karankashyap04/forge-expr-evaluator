import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { ParseTree } from "antlr4ts/tree/ParseTree";
import { ForgeVisitor } from "./ForgeVisitor";
import { Atom, DatumParsed, InstanceData, Predicate } from "../types";
import {
  BlockContext,
  Expr10Context,
  Expr11Context,
  Expr12Context,
  Expr13Context,
  Expr14Context,
  Expr15Context,
  Expr16Context,
  Expr17Context,
  Expr18Context,
  Expr1Context,
  Expr1_5Context,
  Expr2Context,
  Expr3Context,
  Expr4Context,
  Expr4_5Context,
  Expr5Context,
  Expr6Context,
  Expr7Context,
  Expr8Context,
  Expr9Context,
  ExprContext,
  ExprListContext,
  NameContext,
  NameListContext,
  PredDeclContext,
  QuantDeclContext,
  QuantDeclListContext,
} from "./ForgeParser";
import { SUPPORTED_BUILTINS } from "../ForgeExprEvaluator";

// defining the return type for the visitor
export type FreeVariables = Map<ParseTree, Set<string>>;

// define helper function on the FreeVariables type
function getAllFreeVariables(freeVariables: FreeVariables): Set<string> {
  const allVariables = new Set<string>();
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
export class ForgeExprFreeVariableFinder
  extends AbstractParseTreeVisitor<FreeVariables>
  implements ForgeVisitor<FreeVariables>
{
  private datum: DatumParsed;
  private instanceIndex: number;
  private instanceData: InstanceData;
  private predicates: Predicate[];

  constructor(datum: DatumParsed, instanceIndex: number, predicates: Predicate[]) {
    super();
    this.datum = datum;
    this.instanceIndex = instanceIndex;
    this.instanceData = this.datum.parsed.instances[this.instanceIndex];
    this.predicates = predicates;
  }

  protected aggregateResult(aggregate: FreeVariables, nextResult: FreeVariables): FreeVariables {
    if (!aggregate) {
      return nextResult;
    }
    if (!nextResult) {
      return aggregate;
    }
    // Merge the two maps
    for (const [contextNode, variables] of nextResult.entries()) {
      if (!aggregate.has(contextNode)) {
        aggregate.set(contextNode, new Set<string>());
      }
      const existingVariables = aggregate.get(contextNode)!;
      for (const variable of variables) {
        existingVariables.add(variable);
      }
    }
    return aggregate;
  }

  private addCtxToFreeVariableMap(ctx: ParseTree, freeVariables: FreeVariables, additionalVars?: Set<string>): FreeVariables {
    if (!freeVariables.has(ctx)) {
      freeVariables.set(ctx, getAllFreeVariables(freeVariables));
    }
    const variables = freeVariables.get(ctx)!;
    if (additionalVars !== undefined) {
      for (const variable in additionalVars) {
        variables.add(variable);
      }
    }
    return freeVariables;
  }

  protected defaultResult(): FreeVariables {
    return new Map<ParseTree, Set<string>>();
  }

  visitPredDecl(ctx: PredDeclContext): FreeVariables {
    const visitResult = this.visit(ctx.block());
    return this.addCtxToFreeVariableMap(ctx, visitResult);
  }

  visitBlock(ctx: BlockContext): FreeVariables {
    let result = this.defaultResult(); // aggregator

    for (const expr of ctx.expr()) {
      const exprResult = this.visit(expr);
      result = this.aggregateResult(result, exprResult);
    }
    return this.addCtxToFreeVariableMap(ctx, result);
  }

  // helper function to get a list of names from a nameList
  getNameListValues(ctx: NameListContext): Set<string> {
    if (ctx.COMMA_TOK()) {
      // there is a comma, so we need to get the value from the head of the list
      // and then move onto the tail after that
      const headValue = ctx.name().text;
      const tailValues = this.getNameListValues(ctx.nameList()!);
      tailValues.add(headValue);
      return tailValues;
    } else {
      // there is no comma so there is just a single name that we need to deal with here
      return new Set<string>([ctx.name().text]);
    }
  }

  // helper function to get the names of each var in a quantDecl
  getQuantDeclVarNames(ctx: QuantDeclContext): Set<string> {
    // NOTE: **UNIMPLEMENTED**: discuss use of `disj` with Tim
    // const isDisjoint = quantDecl.DISJ_TOK() !== undefined;
    const nameList = ctx.nameList();
    return this.getNameListValues(nameList);
  }

  // helper function to get the values each var is bound to in a quantDeclList
  getQuantDeclListVarNames(ctx: QuantDeclListContext): Set<string> {
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
    } else {
      // there is no comma so there is just a single quantDecl that we need to
      // deal with here
      return this.getQuantDeclVarNames(ctx.quantDecl());
    }
  }

  // helper function to add the current context to the list obtained from
  // visiting children

  visitExpr(ctx: ExprContext): FreeVariables {
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
      const quantDeclListVars = this.getQuantDeclListVarNames(ctx.quantDeclList()!);

      // we need to get all the vars referenced here other than the vars
      // bound by the quantifier (in quantDeclListVars)
      const blockOrBar = ctx.blockOrBar();
      if (blockOrBar === undefined) {
        throw new Error("expected to quantify over something!");
      }
      if (blockOrBar.BAR_TOK() === undefined || blockOrBar.expr() === undefined) {
        throw new Error("Expected the quantifier to have a bar followed by an expr!");
      }
      let allFreeVars: FreeVariables;
      if (blockOrBar.block() !== undefined) {
        allFreeVars = this.visit(blockOrBar.block()!);
      } else {
        allFreeVars = this.visit(blockOrBar.expr()!);
      }
      // remove the variables bound by the quantifier from the result
      for (const [contextNode, variables] of allFreeVars.entries()) {
        const filteredVariables = new Set<string>();
        for (const variable of variables) {
          if (!quantDeclListVars.has(variable)) {
            filteredVariables.add(variable);
          }
        }
        allFreeVars.set(contextNode, filteredVariables);
      }
      return this.addCtxToFreeVariableMap(ctx, allFreeVars);
    }

    const childrenResults = this.visitChildren(ctx);
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr1(ctx: Expr1Context): FreeVariables {
    const childrenResults = this.visitChildren(ctx);
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr1_5(ctx: Expr1_5Context): FreeVariables {
    const childrenResults = this.visitChildren(ctx);
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr2(ctx: Expr2Context): FreeVariables {
    const childrenResults = this.visitChildren(ctx);
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr3(ctx: Expr3Context): FreeVariables {
    const childrenResults = this.visitChildren(ctx);
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr4(ctx: Expr4Context): FreeVariables {
    const childrenResults = this.visitChildren(ctx);
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr4_5(ctx: Expr4_5Context): FreeVariables {
    const childrenResults = this.visitChildren(ctx);
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr5(ctx: Expr5Context): FreeVariables {
    const childrenResults = this.visitChildren(ctx);
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr6(ctx: Expr6Context): FreeVariables {
    const childrenResults = this.visitChildren(ctx);
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr7(ctx: Expr7Context): FreeVariables {
    const childrenResults = this.visit(ctx.expr8());
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr8(ctx: Expr8Context): FreeVariables {
    const childrenResults = this.visitChildren(ctx);
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr9(ctx: Expr9Context): FreeVariables {
    const childrenResults = this.visitChildren(ctx);
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr10(ctx: Expr10Context): FreeVariables {
    const childrenResults = this.visitChildren(ctx);
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr11(ctx: Expr11Context): FreeVariables {
    const childrenResults = this.visitChildren(ctx);
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr12(ctx: Expr12Context): FreeVariables {
    const childrenResults = this.visitChildren(ctx);
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr13(ctx: Expr13Context): FreeVariables {
    const childrenResults = this.visitChildren(ctx);
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr14(ctx: Expr14Context): FreeVariables {
    const childrenResults = this.visitChildren(ctx);
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr15(ctx: Expr15Context): FreeVariables {
    const childrenResults = this.visitChildren(ctx); // presumably this will include the
    // result from visitName as well (NameContext should be visited in the
    // recursive descent if there is a NameContext in the expr)
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr16(ctx: Expr16Context): FreeVariables {
    const childrenResults = this.visitChildren(ctx);
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr17(ctx: Expr17Context): FreeVariables {
    const childrenResults = this.visitChildren(ctx);
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExpr18(ctx: Expr18Context): FreeVariables {
    if (ctx.LEFT_CURLY_TOK()) { // set comprehension
      if (ctx.quantDeclList() === undefined) {
        throw new Error('expected a quantDeclList in the set comprehension!');
      }
      const quantDeclListVars = this.getQuantDeclListVarNames(ctx.quantDeclList()!);

      // we need to get all the vars referenced here other than the vars
      // bound by the quantifier (in quantDeclListVars)
      const blockOrBar = ctx.blockOrBar();
      if (blockOrBar === undefined) {
        throw new Error('expected a blockOrBar in the set comprehension!');
      }
      if (blockOrBar.BAR_TOK() === undefined || blockOrBar.expr() === undefined) {
        throw new Error('expected a bar followed by an expr in the set comprehension!');
      }
      let allFreeVars: FreeVariables;
      if (blockOrBar.block() !== undefined) {
        allFreeVars = this.visit(blockOrBar.block()!);
      } else {
        allFreeVars = this.visit(blockOrBar.expr()!);
      }
      // remove the variables bound by the quantifier from the result
      for (const [contextNode, variables] of allFreeVars.entries()) {
        const filteredVariables = new Set<string>();
        for (const variable of variables) {
          if (!quantDeclListVars.has(variable)) {
            filteredVariables.add(variable);
          }
        }
        allFreeVars.set(contextNode, filteredVariables);
      }
      return this.addCtxToFreeVariableMap(ctx, allFreeVars);
    }
    
    const childrenResults = this.visitChildren(ctx);
    return this.addCtxToFreeVariableMap(ctx, childrenResults);
  }

  visitExprList(ctx: ExprListContext): FreeVariables {
    let result = this.defaultResult(); // aggregator
    if (ctx.COMMA_TOK()) {
      if (ctx.exprList() === undefined) {
        throw new Error('exprList with a comma must have a tail!');
      }
      const headFreeVars = this.visit(ctx.expr());
      const tailFreeVars = this.visit(ctx.exprList()!);
      result = this.aggregateResult(result, headFreeVars);
      result = this.aggregateResult(result, tailFreeVars);
    } else {
      const exprFreeVars = this.visit(ctx.expr());
      result = this.aggregateResult(result, exprFreeVars);
    }
    return this.addCtxToFreeVariableMap(ctx, result);
  }

  // helper function
  private isPredicateName(name: string): boolean {
    return this.predicates.some((pred) => pred.name === name);
  }

  visitName(ctx: NameContext): FreeVariables {
    const identifier = ctx.IDENTIFIER_TOK().text;

    if (identifier === 'true' || identifier === 'false') { // these aren't free variables
      return this.defaultResult();
    }

    // if predicate name then not a free variable
    if (this.isPredicateName(identifier)) {
      return this.defaultResult();
    }

    // if it is a type, then it is not a free variable
    const typeNames = Object.keys(this.instanceData.types).map(
      (key) => this.instanceData.types[key].id
    );
    if (typeNames.includes(identifier)) {
      return this.defaultResult();
    }

    // if it is an instance of a type, then it is not a free variable
    for (const typeName of typeNames) {
      const atomIds = this.instanceData.types[typeName].atoms.map(
        (atom: Atom) => atom.id
      );
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
    if (SUPPORTED_BUILTINS.includes(identifier)) {
      return this.defaultResult();
    }

    // otherwise, it is a free variable
    const freeVariables = this.defaultResult();
    freeVariables.set(ctx, new Set<string>([identifier]));
    return freeVariables;
  }
}
