import { PredDeclContext } from './forge-antlr/ForgeParser';
import { ForgeListenerImpl } from './forge-antlr/ForgeListenerImpl';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker';
import { EvalResult } from './ForgeExprEvaluator';
import { DatumParsed } from './types';
import { Predicate } from './types';
export type ErrorResult = {
    error: Error;
    stackTrace?: string;
};
export type EvaluationResult = EvalResult | ErrorResult;
export declare class ForgeExprEvaluatorUtil {
    datum: DatumParsed;
    predicates: Predicate[];
    forgeListener: ForgeListenerImpl;
    walker: ParseTreeWalker;
    gotPredicateParseTrees: boolean;
    constructor(datum: DatumParsed, sourceCode: string);
    getPredParseTree(forgePred: string): PredDeclContext;
    getExpressionParseTree(forgeExpr: string): import("./forge-antlr/ForgeParser").ParseExprContext;
    private getPredicateParseTrees;
    evaluateExpression(forgeExpr: string, instanceIndex?: number): EvaluationResult;
}
