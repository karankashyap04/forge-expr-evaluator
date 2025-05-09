import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { ParseTree } from "antlr4ts/tree/ParseTree";
import { ForgeVisitor } from "./forge-antlr/ForgeVisitor";
import { DatumParsed, Predicate } from "./types";
import { BlockContext, Expr10Context, Expr11Context, Expr12Context, Expr13Context, Expr14Context, Expr15Context, Expr16Context, Expr17Context, Expr18Context, Expr1Context, Expr1_5Context, Expr2Context, Expr3Context, Expr4Context, Expr4_5Context, Expr5Context, Expr6Context, Expr7Context, Expr8Context, Expr9Context, ExprContext, ExprListContext, NameContext, NameListContext, PredDeclContext, QuantDeclContext, QuantDeclListContext } from "./forge-antlr/ForgeParser";
export type FreeVariables = Map<ParseTree, Set<string>>;
/**
 * A recursive visitor to find all the free variables referenced in a forge
 * expression.
 */
export declare class ForgeExprFreeVariableFinder extends AbstractParseTreeVisitor<FreeVariables> implements ForgeVisitor<FreeVariables> {
    private datum;
    private instanceIndex;
    private instanceData;
    private predicates;
    constructor(datum: DatumParsed, instanceIndex: number, predicates: Predicate[]);
    protected aggregateResult(aggregate: FreeVariables, nextResult: FreeVariables): FreeVariables;
    private addCtxToFreeVariableMap;
    protected defaultResult(): FreeVariables;
    visitPredDecl(ctx: PredDeclContext): FreeVariables;
    visitBlock(ctx: BlockContext): FreeVariables;
    getNameListValues(ctx: NameListContext): Set<string>;
    getQuantDeclVarNames(ctx: QuantDeclContext): Set<string>;
    getQuantDeclListVarNames(ctx: QuantDeclListContext): Set<string>;
    visitExpr(ctx: ExprContext): FreeVariables;
    visitExpr1(ctx: Expr1Context): FreeVariables;
    visitExpr1_5(ctx: Expr1_5Context): FreeVariables;
    visitExpr2(ctx: Expr2Context): FreeVariables;
    visitExpr3(ctx: Expr3Context): FreeVariables;
    visitExpr4(ctx: Expr4Context): FreeVariables;
    visitExpr4_5(ctx: Expr4_5Context): FreeVariables;
    visitExpr5(ctx: Expr5Context): FreeVariables;
    visitExpr6(ctx: Expr6Context): FreeVariables;
    visitExpr7(ctx: Expr7Context): FreeVariables;
    visitExpr8(ctx: Expr8Context): FreeVariables;
    visitExpr9(ctx: Expr9Context): FreeVariables;
    visitExpr10(ctx: Expr10Context): FreeVariables;
    visitExpr11(ctx: Expr11Context): FreeVariables;
    visitExpr12(ctx: Expr12Context): FreeVariables;
    visitExpr13(ctx: Expr13Context): FreeVariables;
    visitExpr14(ctx: Expr14Context): FreeVariables;
    visitExpr15(ctx: Expr15Context): FreeVariables;
    visitExpr16(ctx: Expr16Context): FreeVariables;
    visitExpr17(ctx: Expr17Context): FreeVariables;
    visitExpr18(ctx: Expr18Context): FreeVariables;
    visitExprList(ctx: ExprListContext): FreeVariables;
    private isPredicateName;
    visitName(ctx: NameContext): FreeVariables;
}
