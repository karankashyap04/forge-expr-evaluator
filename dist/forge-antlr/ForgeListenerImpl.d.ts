import { ForgeListener } from './ForgeListener';
import { TerminalNode } from 'antlr4ts/tree/TerminalNode';
import { ErrorNode } from 'antlr4ts/tree/ErrorNode';
import { ParserRuleContext } from 'antlr4ts/ParserRuleContext';
import { ConsistencyDeclContext } from "./ForgeParser";
import { SigDeclContext } from "./ForgeParser";
import { PredDeclContext } from "./ForgeParser";
import { FunDeclContext } from "./ForgeParser";
import { TestDeclContext } from "./ForgeParser";
import { SatisfiabilityDeclContext } from "./ForgeParser";
import { PropertyDeclContext } from "./ForgeParser";
import { QuantifiedPropertyDeclContext } from "./ForgeParser";
import { NameContext } from "./ForgeParser";
import { NameListContext } from "./ForgeParser";
import { ExprContext } from "./ForgeParser";
import { InstDeclContext } from "./ForgeParser";
import { ExampleDeclContext } from "./ForgeParser";
import { Sig, Predicate, Test, AssertionTest, Example, QuantifiedAssertionTest, SatisfiabilityAssertionTest, ConsistencyAssertionTest } from './ForgeSyntaxConstructs';
export declare class ForgeListenerImpl implements ForgeListener {
    private _sigs;
    private _predicates;
    private _tests;
    private _assertions;
    private _examples;
    private _quantifiedAssertions;
    private _satisfiabilityAssertions;
    private _functions;
    private _consistencyAssertions;
    get sigs(): Sig[];
    get predicates(): Predicate[];
    get tests(): Test[];
    get assertions(): AssertionTest[];
    get examples(): Example[];
    get quantifiedAssertions(): QuantifiedAssertionTest[];
    get satisfiabilityAssertions(): SatisfiabilityAssertionTest[];
    get functions(): Function[];
    get consistencyAssertions(): ConsistencyAssertionTest[];
    /**
     * Exit a parse tree produced by `ForgeParser.sigDecl`.
     * @param ctx the parse tree
     */
    exitSigDecl?(ctx: SigDeclContext): void;
    /**
     * Exit a parse tree produced by `ForgeParser.predDecl`.
     * @param ctx the parse tree
     */
    exitPredDecl?(ctx: PredDeclContext): void;
    /**
     * Exit a parse tree produced by `ForgeParser.funDecl`.
     * @param ctx the parse tree
     */
    exitFunDecl?(ctx: FunDeclContext): void;
    /**
     * Exit a parse tree produced by `ForgeParser.testDecl`.
     * @param ctx the parse tree
     */
    exitTestDecl?(ctx: TestDeclContext): void;
    /**
     * Exit a parse tree produced by `ForgeParser.satisfiabilityDecl`.
     * @param ctx the parse tree
     */
    exitSatisfiabilityDecl?(ctx: SatisfiabilityDeclContext): void;
    /**
     * Exit a parse tree produced by `ForgeParser.propertyDecl`.
     * @param ctx the parse tree
     */
    exitPropertyDecl?(ctx: PropertyDeclContext): void;
    /**
     * Exit a parse tree produced by `ForgeParser.quantifiedPropertyDecl`.
     * @param ctx the parse tree
     *
     */
    exitQuantifiedPropertyDecl?(ctx: QuantifiedPropertyDeclContext): void;
    /**
     * Exit a parse tree produced by `ForgeParser.consistencyDecl`.
     * @param ctx the parse tree
     */
    exitConsistencyDecl?(ctx: ConsistencyDeclContext): void;
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
    exitExampleDecl?(ctx: ExampleDeclContext): void;
    visitTerminal?: (/*@NotNull*/ node: TerminalNode) => void;
    visitErrorNode?: (/*@NotNull*/ node: ErrorNode) => void;
    enterEveryRule?: (/*@NotNull*/ ctx: ParserRuleContext) => void;
    exitEveryRule?: (/*@NotNull*/ ctx: ParserRuleContext) => void;
    /**
     * Collects all names from the given NameListContext.
     * @param ctx the NameListContext
     * @returns an array of NameContext
     */
    getAllNames(ctx: NameListContext): string[];
}
