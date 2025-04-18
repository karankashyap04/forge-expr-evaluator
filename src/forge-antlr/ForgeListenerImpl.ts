import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker';
import { ForgeListener } from './ForgeListener';
import { TerminalNode } from 'antlr4ts/tree/TerminalNode';
import { ErrorNode } from 'antlr4ts/tree/ErrorNode';
import {ParserRuleContext} from 'antlr4ts/ParserRuleContext';

import { AlloyModuleContext, ConsistencyDeclContext } from "./ForgeParser";
import { ImportDeclContext } from "./ForgeParser";
import { ParagraphContext } from "./ForgeParser";
import { SigDeclContext } from "./ForgeParser";
import { SigExtContext } from "./ForgeParser";
import { MultContext } from "./ForgeParser";
import { ArrowMultContext } from "./ForgeParser";
import { HelperMultContext } from "./ForgeParser";
import { ParaDeclContext } from "./ForgeParser";
import { QuantDeclContext } from "./ForgeParser";
import { ArrowDeclContext } from "./ForgeParser";
import { PredTypeContext } from "./ForgeParser";
import { PredDeclContext } from "./ForgeParser";
import { FunDeclContext } from "./ForgeParser";
import { ParaDeclsContext } from "./ForgeParser";
import { AssertDeclContext } from "./ForgeParser";
import { CmdDeclContext } from "./ForgeParser";
import { TestDeclContext } from "./ForgeParser";
import { TestExpectDeclContext } from "./ForgeParser";
import { TestBlockContext } from "./ForgeParser";
import { ScopeContext } from "./ForgeParser";
import { TypescopeContext } from "./ForgeParser";
import { ConstContext } from "./ForgeParser";
import { SatisfiabilityDeclContext } from "./ForgeParser";
import { PropertyDeclContext } from "./ForgeParser";
import { QuantifiedPropertyDeclContext } from "./ForgeParser";
import { TestSuiteDeclContext } from "./ForgeParser";
import { TestConstructContext } from "./ForgeParser";
import { ArrowOpContext } from "./ForgeParser";
import { CompareOpContext } from "./ForgeParser";
import { LetDeclContext } from "./ForgeParser";
import { BlockContext } from "./ForgeParser";
import { BlockOrBarContext } from "./ForgeParser";
import { QuantContext } from "./ForgeParser";
import { QualNameContext } from "./ForgeParser";
import { OptionDeclContext } from "./ForgeParser";
import { NameContext } from "./ForgeParser";
import { NameListContext } from "./ForgeParser";
import { QualNameListContext } from "./ForgeParser";
import { ParaDeclListContext } from "./ForgeParser";
import { QuantDeclListContext } from "./ForgeParser";
import { ArrowDeclListContext } from "./ForgeParser";
import { LetDeclListContext } from "./ForgeParser";
import { TypescopeListContext } from "./ForgeParser";
import { ExprListContext } from "./ForgeParser";
import { ExprContext } from "./ForgeParser";
import { Expr1Context } from "./ForgeParser";
import { Expr1_5Context } from "./ForgeParser";
import { Expr2Context } from "./ForgeParser";
import { Expr3Context } from "./ForgeParser";
import { Expr4Context } from "./ForgeParser";
import { Expr4_5Context } from "./ForgeParser";
import { Expr5Context } from "./ForgeParser";
import { Expr6Context } from "./ForgeParser";
import { Expr7Context } from "./ForgeParser";
import { Expr8Context } from "./ForgeParser";
import { Expr9Context } from "./ForgeParser";
import { Expr10Context } from "./ForgeParser";
import { Expr11Context } from "./ForgeParser";
import { Expr12Context } from "./ForgeParser";
import { Expr13Context } from "./ForgeParser";
import { Expr14Context } from "./ForgeParser";
import { Expr15Context } from "./ForgeParser";
import { Expr16Context } from "./ForgeParser";
import { Expr17Context } from "./ForgeParser";
import { Expr18Context } from "./ForgeParser";
import { ArrowExprContext } from "./ForgeParser";
import { SexprDeclContext } from "./ForgeParser";
import { SexprContext } from "./ForgeParser";
import { InstDeclContext } from "./ForgeParser";
import { EvalRelDeclContext } from "./ForgeParser";
import { EvalDeclContext } from "./ForgeParser";
import { ExampleDeclContext } from "./ForgeParser";
import { QueryDeclContext } from "./ForgeParser";
import { NumberListContext } from "./ForgeParser";
import { NumberContext } from "./ForgeParser";
import { BoundsContext } from "./ForgeParser";
import { AtomNameOrNumberContext } from "./ForgeParser";
import { BoundContext } from "./ForgeParser";
import { BoundLHSContext } from "./ForgeParser";
import { BindRHSUnionContext } from "./ForgeParser";
import { BindRHSProductContext } from "./ForgeParser";
import { BindRHSProductBaseContext } from "./ForgeParser";

import { SyntaxNode, Sig, Predicate, Test, Block, AssertionTest, Example, 
        Expr, QuantifiedAssertionTest, SatisfiabilityAssertionTest, ConsistencyAssertionTest } from './ForgeSyntaxConstructs';
import { Parser } from 'antlr4ts';


/*
    We don't really need a whole AST right now right?
    Just need to find:
    - Locations and types of sigs
    - Locations and types of predicates
    - Locations and types of functions
    - Locations and types of tests

*/


function getRandomName() : string {
    return Math.random().toString(36).substring(7);
}

function exitExpr(ctx: ExprContext) {
    const { startLine, startColumn, endLine, endColumn } = getLocations(ctx);
    const exprTree = getLocationOnlyExpr(ctx);
    
    //console.log("Parsed Expression Tree:", exprTree);
}


function getLocations(ctx: ParserRuleContext): any {
    const startLine = ctx.start.line;                 // This is 1 based line number
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
function getLocationOnlyBlock(ctx : ParserRuleContext) : Block {
    const {startLine, startColumn, endLine, endColumn} = getLocations(ctx);
    const block = new Block(startLine, startColumn, endLine, endColumn, []);
    return block;
}


function getLocationOnlyExpr(ctx: ParserRuleContext) : Expr {
    const {startLine, startColumn, endLine, endColumn} = getLocations(ctx);
    const expr = new Expr(startLine, startColumn, endLine, endColumn, "");
    return expr;
}


/*
    TODO: Rename this to a listener for TOADUS PONENS


    TODO: Update this to implement the NEW assertions.
*/
export class ForgeListenerImpl implements ForgeListener {

    
    private _sigs : Sig[] = [];
    private _predicates : Predicate[] = [];
    private _tests : Test[] = [];
    private _assertions : AssertionTest[] = [];
    private _examples : Example[] = [];
    private _quantifiedAssertions : QuantifiedAssertionTest[] = [];
    private _satisfiabilityAssertions : SatisfiabilityAssertionTest[] = [];
    private _functions : Function[] = [];
    private _consistencyAssertions : ConsistencyAssertionTest[] = [];

    public get sigs() : Sig[] {
        return this._sigs;
    }

    public get predicates() : Predicate[] {
        return this._predicates;
    }


    public get tests() : Test[] {
        return this._tests;
    }

    public get assertions() : AssertionTest[] {
        return this._assertions;
    }

    public get examples() : Example[] {
        return this._examples;
    }

    public get quantifiedAssertions() : QuantifiedAssertionTest[] {
        return this._quantifiedAssertions;
    }

    public get satisfiabilityAssertions() : SatisfiabilityAssertionTest[] {
        return this._satisfiabilityAssertions;
    }

    public get functions() : Function[] {
        return this._functions;
    }

    public get consistencyAssertions() : ConsistencyAssertionTest[] {
        return this._consistencyAssertions;
    }

    /**
     * Exit a parse tree produced by `ForgeParser.sigDecl`.
     * @param ctx the parse tree
     */
    exitSigDecl? (ctx: SigDeclContext) {
        const {startLine, startColumn, endLine, endColumn} = getLocations(ctx);

        // Could have definied multiple names here.
        const sigNames = this.getAllNames(ctx.nameList());
        const multiplicity = ctx.mult()?.toStringTree(); // This is not ideal, but will do for now.
        const inheritsFrom = ctx.sigExt()?.toStringTree(); // This is not ideal, but will do for now.
        const sigBlock = ctx.block();
        const sigBody : Block | undefined = sigBlock ? getLocationOnlyBlock(sigBlock) : undefined;
        for (const sigName of sigNames) {
            let s = new Sig(
                startLine, 
                startColumn, 
                endLine, 
                endColumn,
                sigName,
                sigBody,
                inheritsFrom,
                multiplicity);
            this._sigs.push(s);
        }
    }

    
    /**
     * Exit a parse tree produced by `ForgeParser.predDecl`.
     * @param ctx the parse tree
     */
    exitPredDecl? (ctx: PredDeclContext) {

        const {startLine, startColumn, endLine, endColumn} = getLocations(ctx);
        const predName = ctx.name().text;

        // We don't care about the pred type for now (wheat or not.) In fact, this should maybe be removed from FORGE.
        // There is also the PRED qualName that I don't know what to do with here.

        // Ideally, predArgs should look something like this.
        //const predArgs : Record<string, string> = {}; // TODO: This needs to be fixed!!
        const paraDecls = ctx.paraDecls();
        const predArgsBlock : Block | undefined = paraDecls ? getLocationOnlyBlock(paraDecls) : undefined; 
        
        // Get the pred body (block)
        const predBody = ctx.block();
        // Block start, block end.
        let predBlock = getLocationOnlyBlock(predBody);
        const predBodyStatements : SyntaxNode[] = []; // TODO

        let p = new Predicate(
            startLine, 
            startColumn, 
            endLine, 
            endColumn,
            predName,
            predArgsBlock,
            predBlock
        );

        this._predicates.push(p);
    }


    /**
     * Exit a parse tree produced by `ForgeParser.funDecl`.
     * @param ctx the parse tree
     */
    exitFunDecl? (ctx: FunDeclContext) {

        const {startLine, startColumn, endLine, endColumn} = getLocations(ctx);
        const funName = ctx.name().text;

        let f = new Function(
            startLine, 
            startColumn, 
            endLine, 
            endColumn,
            funName
        );
        this._functions.push(f);
    }

    /**
     * Exit a parse tree produced by `ForgeParser.testDecl`.
     * @param ctx the parse tree
     */
    exitTestDecl? (ctx: TestDeclContext){

        const {startLine, startColumn, endLine, endColumn} = getLocations(ctx);
        const testName = ctx.name()?.IDENTIFIER_TOK().text || getRandomName();
        // IGNORE qualName (the alternative to block) for now, unsure what it is. TODO!!
        const testBlock = ctx.block();
        const testBody : Block | undefined = testBlock ? getLocationOnlyBlock(testBlock) : undefined;

        const testScope = ctx.scope()?.toStringTree(); // This is not ideal, but will do for now.
        const testBounds = ctx.bounds()?.toStringTree(); // This is not ideal, but will do for now.
        

        const check = ctx.SAT_TOK() ? "sat" : 
                        ctx.UNSAT_TOK() ? "unsat" :
                        ctx.THEOREM_TOK() ? "theorem" :
                        ctx.FORGE_ERROR_TOK() ? "forge_error" : 
                        ctx.CHECKED_TOK() ? "checked" : "unknown";

        let t = new Test(
            startLine, 
            startColumn, 
            endLine, 
            endColumn,
            testName,
            check,
            testBody,
            testBounds,
            testScope
        );
        this._tests.push(t);
    }

    
    /**
     * Exit a parse tree produced by `ForgeParser.satisfiabilityDecl`.
     * @param ctx the parse tree
     */
    exitSatisfiabilityDecl? (ctx: SatisfiabilityDeclContext) {
        const {startLine, startColumn, endLine, endColumn} = getLocations(ctx);

        const expr = getLocationOnlyExpr(ctx.expr());

        const testScope = ctx.scope()?.toStringTree(); // This is not ideal, but will do for now.
        const testBounds = ctx.bounds()?.toStringTree(); // This is not ideal, but will do for now.
        
        // Hmm, why did we avoid theorem here I wonder
        const check = ctx.SAT_TOK() ? "sat" : 
                        ctx.UNSAT_TOK() ? "unsat" :
                        ctx.FORGE_ERROR_TOK() ? "forge_error" : "unknown";
        
        const st = new SatisfiabilityAssertionTest(
            startLine, 
            startColumn, 
            endLine, 
            endColumn,
            expr,
            check,
            testBounds,
            testScope
        );
        this._satisfiabilityAssertions.push(st);
    }

    /**
     * Exit a parse tree produced by `ForgeParser.propertyDecl`.
     * @param ctx the parse tree
     */
    exitPropertyDecl? (ctx: PropertyDeclContext) {

        // ALWAYS OF THE FORM pred => prop
        const {startLine, startColumn, endLine, endColumn} = getLocations(ctx);
        
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

        const at = new AssertionTest(
            startLine, 
            startColumn, 
            endLine, 
            endColumn,
            predName,
            expr,
            rel,
            testBounds,
            testScope
        );
        this._assertions.push(at);
    }

    /**
     * Exit a parse tree produced by `ForgeParser.quantifiedPropertyDecl`.
     * @param ctx the parse tree
     * 
     */
    exitQuantifiedPropertyDecl? (ctx: QuantifiedPropertyDeclContext) {
                // ALWAYS OF THE FORM pred => prop

        const {startLine, startColumn, endLine, endColumn} = getLocations(ctx);

        const disj : boolean = ctx.DISJ_TOK() ? true : false;
        
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
        let predArgsBlock : Block | undefined = (argsT) ? getLocationOnlyBlock(argsT) : undefined;

        const testScope = ctx.scope()?.toStringTree(); // This is not ideal, but will do for now.
        const testBounds = ctx.bounds()?.toStringTree(); // This is not ideal, but will do for now.

        // TODO: Improve this, which is not ideal
        const quantDecls = ctx.quantDeclList();
        const quantDeclsBlock : Block | undefined = quantDecls ? getLocationOnlyBlock(quantDecls) : undefined;

        let qa = new QuantifiedAssertionTest(
            startLine, 
            startColumn, 
            endLine, 
            endColumn,
            predName,
            expr,
            rel,
            disj,
            quantDeclsBlock,
            testBounds,
            testScope,
            predArgsBlock
        );
        this._quantifiedAssertions.push(qa);
    }


    /**
     * Exit a parse tree produced by `ForgeParser.consistencyDecl`.
     * @param ctx the parse tree
     */
    exitConsistencyDecl? (ctx: ConsistencyDeclContext) {

        // ALWAYS OF THE FORM pred => prop


        // TODO: FILL
        const {startLine, startColumn, endLine, endColumn} = getLocations(ctx);
        
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

        const ct = new ConsistencyAssertionTest(
            startLine, 
            startColumn, 
            endLine, 
            endColumn,
            predName,
            expr,
            consistent,
            testBounds,
            testScope
        );

        this._consistencyAssertions.push(ct);
    }


    /**
     * Exit a parse tree produced by `ForgeParser.name`.
     * @param ctx the parse tree
     * 
     * 
     * TODO: THIS MAY BE USEFUL FOR NAME LOCATIONS (CLICK TO GO TO DEFN OR SOMETHING?)
     * 
     * 
     */
    exitName?: (ctx: NameContext) => void;

    /**
     * Exit a parse tree produced by `ForgeParser.expr`.
     * @param ctx the parse tree
     * 
     * 
     * 
     * TODO: It feels like this is too important to not be useful at some point.
     * 
     * 
     */
    exitExpr?: (ctx: ExprContext) => void;



    /**
     * Exit a parse tree produced by `ForgeParser.instDecl`.
     * @param ctx the parse tree
     * 
     * 
     * Useful for examples or tests???
     */
    exitInstDecl?: (ctx: InstDeclContext) => void;

   

    /**
     * Exit a parse tree produced by `ForgeParser.exampleDecl`.
     * @param ctx the parse tree
     * 
     * 
     *      * TODO: THIS IS HARD, WE NEED TO PARSE THE EXPRLIST (WHICH WILL ALWAYS BE ALL)
     * 
     */
    exitExampleDecl? (ctx: ExampleDeclContext) {

        const {startLine, startColumn, endLine, endColumn} = getLocations(ctx);

        const exampleName = ctx.name().text;

        const testExpr = ctx.expr();
        const testExprBlock : Block = getLocationOnlyBlock(testExpr);

        const bounds = ctx.bounds();
        const boundsBlock : Block = getLocationOnlyBlock(bounds);

        let e = new Example(
            startLine, 
            startColumn, 
            endLine, 
            endColumn,
            exampleName,
            testExprBlock,
            boundsBlock
        );
        this._examples.push(e);
    }

  


    //// Inherited from ParseTreeListener
    visitTerminal?: (/*@NotNull*/ node: TerminalNode) => void;
    visitErrorNode?: (/*@NotNull*/ node: ErrorNode) => void;
    enterEveryRule?: (/*@NotNull*/ ctx: ParserRuleContext) => void;
    exitEveryRule?: (/*@NotNull*/ ctx: ParserRuleContext) => void;
    /////////////////////



    /**
     * Collects all names from the given NameListContext.
     * @param ctx the NameListContext
     * @returns an array of NameContext
     */
    getAllNames(ctx: NameListContext): string[] {
        const names: NameContext[] = [];

        // Helper function to traverse the NameListContext
        function collectNames(nameListCtx: NameListContext) {
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