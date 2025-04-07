import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ForgeParser, ExprContext, PredDeclContext } from './forge-antlr/ForgeParser';
import { ForgeLexer } from './forge-antlr/ForgeLexer';
import { ForgeListenerImpl } from './forge-antlr/ForgeListenerImpl';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker';
import { ForgeExprEvaluator } from './ForgeExprEvaluator';
import { DatumParsed } from './types';
import { Predicate } from './types';
import { extractPredicates } from './predicateExtactor';

export class ForgeExprEvaluatorUtil {

	datum: DatumParsed;
	predicates: Predicate[];
	forgeListener : ForgeListenerImpl = new ForgeListenerImpl();
	walker : ParseTreeWalker = new ParseTreeWalker();
	gotPredicateParseTrees;

	constructor(datum: DatumParsed, sourceCode: string) {
		this.datum = datum;
		this.predicates = extractPredicates(sourceCode);
		this.gotPredicateParseTrees = false;
	}

  getPredParseTree(forgePred: string) {
		const inputStream = CharStreams.fromString(forgePred);
		const lexer = new ForgeLexer(inputStream);
		const tokenStream = new CommonTokenStream(lexer);
		const parser = new ForgeParser(tokenStream);
		parser.buildParseTree = true;

		// Parse the input using the new entry point
		const tree = parser.predDecl();

		return tree;
	}

	getExpressionParseTree(forgeExpr: string) {
    const inputStream = CharStreams.fromString(forgeExpr);
    const lexer = new ForgeLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new ForgeParser(tokenStream);
    parser.buildParseTree = true;
    
    // Parse the input using the new entry point
    const tree = parser.parseExpr();
    
    return tree;
	}

  private getPredicateParseTrees() {
		for (const predicate of this.predicates) {
			const tree = this.getPredParseTree(predicate.predicateString);
			predicate.predTree = tree;
		}
		this.gotPredicateParseTrees = true;
	}

	evaluateExpression(forgeExpr: string, instanceIndex: number = 0) {
		// get the parse trees for all the predicates before we do anything else
		if (!this.gotPredicateParseTrees) {
			this.getPredicateParseTrees();
		}

		// now, we can actually evaluate the expression
    const tree = this.getExpressionParseTree(forgeExpr);
    const evaluator = new ForgeExprEvaluator(this.datum, instanceIndex, this.predicates);

		// ensure we're visiting an ExprContext
		return evaluator.visit(tree instanceof ExprContext ? tree : tree.getChild(0));
	}
}