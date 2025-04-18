"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeExprEvaluatorUtil = void 0;
const antlr4ts_1 = require("antlr4ts");
const ForgeParser_1 = require("./forge-antlr/ForgeParser");
const ForgeLexer_1 = require("./forge-antlr/ForgeLexer");
const ForgeListenerImpl_1 = require("./forge-antlr/ForgeListenerImpl");
const ParseTreeWalker_1 = require("antlr4ts/tree/ParseTreeWalker");
const ForgeExprEvaluator_1 = require("./ForgeExprEvaluator");
const predicateExtactor_1 = require("./predicateExtactor");
class ForgeExprEvaluatorUtil {
    constructor(datum, sourceCode) {
        this.forgeListener = new ForgeListenerImpl_1.ForgeListenerImpl();
        this.walker = new ParseTreeWalker_1.ParseTreeWalker();
        this.datum = datum;
        this.predicates = (0, predicateExtactor_1.extractPredicates)(sourceCode);
        this.gotPredicateParseTrees = false;
    }
    getPredParseTree(forgePred) {
        const inputStream = antlr4ts_1.CharStreams.fromString(forgePred);
        const lexer = new ForgeLexer_1.ForgeLexer(inputStream);
        const tokenStream = new antlr4ts_1.CommonTokenStream(lexer);
        const parser = new ForgeParser_1.ForgeParser(tokenStream);
        parser.buildParseTree = true;
        // Parse the input using the new entry point
        const tree = parser.predDecl();
        return tree;
    }
    getExpressionParseTree(forgeExpr) {
        const inputStream = antlr4ts_1.CharStreams.fromString(forgeExpr);
        const lexer = new ForgeLexer_1.ForgeLexer(inputStream);
        const tokenStream = new antlr4ts_1.CommonTokenStream(lexer);
        const parser = new ForgeParser_1.ForgeParser(tokenStream);
        parser.buildParseTree = true;
        // Parse the input using the new entry point
        const tree = parser.parseExpr();
        return tree;
    }
    getPredicateParseTrees() {
        for (const predicate of this.predicates) {
            const tree = this.getPredParseTree(predicate.predicateString);
            predicate.predTree = tree;
        }
        this.gotPredicateParseTrees = true;
    }
    evaluateExpression(forgeExpr, instanceIndex = 0) {
        // get the parse trees for all the predicates before we do anything else
        if (!this.gotPredicateParseTrees) {
            this.getPredicateParseTrees();
        }
        // now, we can actually evaluate the expression
        const tree = this.getExpressionParseTree(forgeExpr);
        const evaluator = new ForgeExprEvaluator_1.ForgeExprEvaluator(this.datum, instanceIndex, this.predicates);
        try {
            // ensure we're visiting an ExprContext
            return evaluator.visit(tree instanceof ForgeParser_1.ExprContext ? tree : tree.getChild(0));
        }
        catch (error) {
            if (error instanceof Error) {
                const stackTrace = error.stack;
                const errorMessage = error.message;
                return {
                    error: new Error(`Error evaluating expression "${forgeExpr}": ${errorMessage}`),
                    stackTrace: stackTrace
                };
            }
            return {
                error: new Error(`Error evaluating expression "${forgeExpr}"`)
            };
        }
    }
}
exports.ForgeExprEvaluatorUtil = ForgeExprEvaluatorUtil;
