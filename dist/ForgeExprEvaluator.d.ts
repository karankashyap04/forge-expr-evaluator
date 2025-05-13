import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { ForgeVisitor } from "./forge-antlr/ForgeVisitor";
import { ExprContext, Expr1Context, Expr1_5Context, Expr2Context, Expr3Context, Expr4Context, Expr4_5Context, Expr5Context, Expr6Context, Expr7Context, Expr8Context, Expr9Context, Expr10Context, Expr11Context, Expr12Context, Expr13Context, Expr14Context, Expr15Context, Expr16Context, Expr17Context, Expr18Context, ExprListContext, NameContext, PredDeclContext, BlockContext, QualNameContext, QuantDeclListContext, NameListContext, QuantDeclContext } from "./forge-antlr/ForgeParser";
import { DatumParsed } from "./types";
import { Predicate } from "./types";
export type SingleValue = string | number | boolean;
export type Tuple = SingleValue[];
export type EvalResult = SingleValue | Tuple[];
export declare const SUPPORTED_BUILTINS: string[];
/**
 * A recursive evaluator for Forge expressions.
 * This visitor walks the parse tree and prints the type of operation encountered.
 */
export declare class ForgeExprEvaluator extends AbstractParseTreeVisitor<EvalResult> implements ForgeVisitor<EvalResult> {
    private datum;
    private instanceIndex;
    private instanceData;
    private bitwidth;
    private predicates;
    private environmentStack;
    private freeVariableFinder;
    private freeVariables;
    private cachedResults;
    constructor(datum: DatumParsed, instanceIndex: number, predicates: Predicate[]);
    private isPredicateName;
    private getPredicate;
    private callPredicate;
    private updateFreeVariables;
    private constructFreeVariableKey;
    private cacheResult;
    protected aggregateResult(aggregate: EvalResult, nextResult: EvalResult): EvalResult;
    protected defaultResult(): EvalResult;
    visitPredDecl(ctx: PredDeclContext): EvalResult;
    visitBlock(ctx: BlockContext): EvalResult;
    visitExpr(ctx: ExprContext): EvalResult;
    visitExpr1(ctx: Expr1Context): EvalResult;
    visitExpr1_5(ctx: Expr1_5Context): EvalResult;
    visitExpr2(ctx: Expr2Context): EvalResult;
    visitExpr3(ctx: Expr3Context): EvalResult;
    visitExpr4(ctx: Expr4Context): EvalResult;
    visitExpr4_5(ctx: Expr4_5Context): EvalResult;
    visitExpr5(ctx: Expr5Context): EvalResult;
    visitExpr6(ctx: Expr6Context): EvalResult;
    visitExpr7(ctx: Expr7Context): EvalResult;
    visitExpr8(ctx: Expr8Context): EvalResult;
    visitExpr9(ctx: Expr9Context): EvalResult;
    visitExpr10(ctx: Expr10Context): EvalResult;
    visitExpr11(ctx: Expr11Context): EvalResult;
    visitExpr12(ctx: Expr12Context): EvalResult;
    visitExpr13(ctx: Expr13Context): EvalResult;
    visitExpr14(ctx: Expr14Context): EvalResult;
    visitExpr15(ctx: Expr15Context): EvalResult;
    visitExpr16(ctx: Expr16Context): EvalResult;
    visitExpr17(ctx: Expr17Context): EvalResult;
    getNameListValues(ctx: NameListContext): string[];
    getQuantDeclValues(ctx: QuantDeclContext): Record<string, Tuple[]>;
    getQuantDeclListValues(ctx: QuantDeclListContext): Record<string, Tuple[]>;
    visitExpr18(ctx: Expr18Context): EvalResult;
    visitExprList(ctx: ExprListContext): EvalResult;
    visitName(ctx: NameContext): EvalResult;
    visitQualName(ctx: QualNameContext): EvalResult;
}
