import { ATN } from "antlr4ts/atn/ATN";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { RuleContext } from "antlr4ts/RuleContext";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { ForgeListener } from "./ForgeListener";
import { ForgeVisitor } from "./ForgeVisitor";
export declare class ForgeParser extends Parser {
    static readonly OPEN_TOK = 1;
    static readonly LEFT_SQUARE_TOK = 2;
    static readonly RIGHT_SQUARE_TOK = 3;
    static readonly AS_TOK = 4;
    static readonly FILE_PATH_TOK = 5;
    static readonly VAR_TOK = 6;
    static readonly ABSTRACT_TOK = 7;
    static readonly SIG_TOK = 8;
    static readonly LEFT_CURLY_TOK = 9;
    static readonly RIGHT_CURLY_TOK = 10;
    static readonly EXTENDS_TOK = 11;
    static readonly IN_TOK = 12;
    static readonly PLUS_TOK = 13;
    static readonly LONE_TOK = 14;
    static readonly SOME_TOK = 15;
    static readonly ONE_TOK = 16;
    static readonly TWO_TOK = 17;
    static readonly SET_TOK = 18;
    static readonly FUNC_TOK = 19;
    static readonly PFUNC_TOK = 20;
    static readonly DISJ_TOK = 21;
    static readonly COLON_TOK = 22;
    static readonly WHEAT_TOK = 23;
    static readonly PRED_TOK = 24;
    static readonly DOT_TOK = 25;
    static readonly FUN_TOK = 26;
    static readonly LEFT_PAREN_TOK = 27;
    static readonly RIGHT_PAREN_TOK = 28;
    static readonly ASSERT_TOK = 29;
    static readonly RUN_TOK = 30;
    static readonly CHECK_TOK = 31;
    static readonly FOR_TOK = 32;
    static readonly BUT_TOK = 33;
    static readonly EXACTLY_TOK = 34;
    static readonly NONE_TOK = 35;
    static readonly UNIV_TOK = 36;
    static readonly IDEN_TOK = 37;
    static readonly MINUS_TOK = 38;
    static readonly IS_TOK = 39;
    static readonly SAT_TOK = 40;
    static readonly UNSAT_TOK = 41;
    static readonly THEOREM_TOK = 42;
    static readonly FORGE_ERROR_TOK = 43;
    static readonly CHECKED_TOK = 44;
    static readonly TEST_TOK = 45;
    static readonly EXPECT_TOK = 46;
    static readonly SUITE_TOK = 47;
    static readonly BAR_TOK = 48;
    static readonly ALL_TOK = 49;
    static readonly SUFFICIENT_TOK = 50;
    static readonly NECESSARY_TOK = 51;
    static readonly CONSISTENT_TOK = 52;
    static readonly INCONSISTENT_TOK = 53;
    static readonly WITH_TOK = 54;
    static readonly LET_TOK = 55;
    static readonly BIND_TOK = 56;
    static readonly OR_TOK = 57;
    static readonly XOR_TOK = 58;
    static readonly IFF_TOK = 59;
    static readonly IMP_TOK = 60;
    static readonly ELSE_TOK = 61;
    static readonly AND_TOK = 62;
    static readonly UNTIL_TOK = 63;
    static readonly RELEASE_TOK = 64;
    static readonly SINCE_TOK = 65;
    static readonly TRIGGERED_TOK = 66;
    static readonly NEG_TOK = 67;
    static readonly ALWAYS_TOK = 68;
    static readonly EVENTUALLY_TOK = 69;
    static readonly AFTER_TOK = 70;
    static readonly BEFORE_TOK = 71;
    static readonly ONCE_TOK = 72;
    static readonly HISTORICALLY_TOK = 73;
    static readonly CARD_TOK = 74;
    static readonly PPLUS_TOK = 75;
    static readonly AMP_TOK = 76;
    static readonly SUBT_TOK = 77;
    static readonly SUPT_TOK = 78;
    static readonly PRIME_TOK = 79;
    static readonly TILDE_TOK = 80;
    static readonly EXP_TOK = 81;
    static readonly STAR_TOK = 82;
    static readonly AT_TOK = 83;
    static readonly BACKQUOTE_TOK = 84;
    static readonly THIS_TOK = 85;
    static readonly SEXPR_TOK = 86;
    static readonly INST_TOK = 87;
    static readonly EVAL_TOK = 88;
    static readonly EXAMPLE_TOK = 89;
    static readonly ARROW_TOK = 90;
    static readonly EQ_TOK = 91;
    static readonly LT_TOK = 92;
    static readonly GT_TOK = 93;
    static readonly LEQ_TOK = 94;
    static readonly GEQ_TOK = 95;
    static readonly NI_TOK = 96;
    static readonly NO_TOK = 97;
    static readonly SUM_TOK = 98;
    static readonly INT_TOK = 99;
    static readonly OPTION_TOK = 100;
    static readonly COMMA_TOK = 101;
    static readonly SLASH_TOK = 102;
    static readonly NUM_CONST_TOK = 103;
    static readonly IDENTIFIER_TOK = 104;
    static readonly WS = 105;
    static readonly CCOMMENT = 106;
    static readonly COMMENT = 107;
    static readonly MULTCOMMENT = 108;
    static readonly LANG_DECL = 109;
    static readonly RULE_predDecl = 0;
    static readonly RULE_parseExpr = 1;
    static readonly RULE_alloyModule = 2;
    static readonly RULE_importDecl = 3;
    static readonly RULE_paragraph = 4;
    static readonly RULE_sigDecl = 5;
    static readonly RULE_sigExt = 6;
    static readonly RULE_mult = 7;
    static readonly RULE_arrowMult = 8;
    static readonly RULE_helperMult = 9;
    static readonly RULE_paraDecl = 10;
    static readonly RULE_quantDecl = 11;
    static readonly RULE_arrowDecl = 12;
    static readonly RULE_predType = 13;
    static readonly RULE_funDecl = 14;
    static readonly RULE_paraDecls = 15;
    static readonly RULE_assertDecl = 16;
    static readonly RULE_cmdDecl = 17;
    static readonly RULE_testDecl = 18;
    static readonly RULE_testExpectDecl = 19;
    static readonly RULE_testBlock = 20;
    static readonly RULE_scope = 21;
    static readonly RULE_typescope = 22;
    static readonly RULE_const = 23;
    static readonly RULE_satisfiabilityDecl = 24;
    static readonly RULE_quantifiedPropertyDecl = 25;
    static readonly RULE_propertyDecl = 26;
    static readonly RULE_consistencyDecl = 27;
    static readonly RULE_testSuiteDecl = 28;
    static readonly RULE_testConstruct = 29;
    static readonly RULE_arrowOp = 30;
    static readonly RULE_compareOp = 31;
    static readonly RULE_letDecl = 32;
    static readonly RULE_block = 33;
    static readonly RULE_blockOrBar = 34;
    static readonly RULE_quant = 35;
    static readonly RULE_qualName = 36;
    static readonly RULE_optionDecl = 37;
    static readonly RULE_name = 38;
    static readonly RULE_nameList = 39;
    static readonly RULE_qualNameList = 40;
    static readonly RULE_paraDeclList = 41;
    static readonly RULE_quantDeclList = 42;
    static readonly RULE_arrowDeclList = 43;
    static readonly RULE_letDeclList = 44;
    static readonly RULE_typescopeList = 45;
    static readonly RULE_exprList = 46;
    static readonly RULE_expr = 47;
    static readonly RULE_expr1 = 48;
    static readonly RULE_expr1_5 = 49;
    static readonly RULE_expr2 = 50;
    static readonly RULE_expr3 = 51;
    static readonly RULE_expr4 = 52;
    static readonly RULE_expr4_5 = 53;
    static readonly RULE_expr5 = 54;
    static readonly RULE_expr6 = 55;
    static readonly RULE_expr7 = 56;
    static readonly RULE_expr8 = 57;
    static readonly RULE_expr9 = 58;
    static readonly RULE_expr10 = 59;
    static readonly RULE_expr11 = 60;
    static readonly RULE_expr12 = 61;
    static readonly RULE_expr13 = 62;
    static readonly RULE_expr14 = 63;
    static readonly RULE_expr15 = 64;
    static readonly RULE_expr16 = 65;
    static readonly RULE_expr17 = 66;
    static readonly RULE_expr18 = 67;
    static readonly RULE_arrowExpr = 68;
    static readonly RULE_sexprDecl = 69;
    static readonly RULE_sexpr = 70;
    static readonly RULE_instDecl = 71;
    static readonly RULE_evalRelDecl = 72;
    static readonly RULE_evalDecl = 73;
    static readonly RULE_exampleDecl = 74;
    static readonly RULE_queryDecl = 75;
    static readonly RULE_numberList = 76;
    static readonly RULE_number = 77;
    static readonly RULE_bounds = 78;
    static readonly RULE_atomNameOrNumber = 79;
    static readonly RULE_bound = 80;
    static readonly RULE_boundLHS = 81;
    static readonly RULE_bindRHSUnion = 82;
    static readonly RULE_bindRHSProduct = 83;
    static readonly RULE_bindRHSProductBase = 84;
    static readonly ruleNames: string[];
    private static readonly _LITERAL_NAMES;
    private static readonly _SYMBOLIC_NAMES;
    static readonly VOCABULARY: Vocabulary;
    get vocabulary(): Vocabulary;
    get grammarFileName(): string;
    get ruleNames(): string[];
    get serializedATN(): string;
    protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException;
    constructor(input: TokenStream);
    predDecl(): PredDeclContext;
    parseExpr(): ParseExprContext;
    alloyModule(): AlloyModuleContext;
    importDecl(): ImportDeclContext;
    paragraph(): ParagraphContext;
    sigDecl(): SigDeclContext;
    sigExt(): SigExtContext;
    mult(): MultContext;
    arrowMult(): ArrowMultContext;
    helperMult(): HelperMultContext;
    paraDecl(): ParaDeclContext;
    quantDecl(): QuantDeclContext;
    arrowDecl(): ArrowDeclContext;
    predType(): PredTypeContext;
    funDecl(): FunDeclContext;
    paraDecls(): ParaDeclsContext;
    assertDecl(): AssertDeclContext;
    cmdDecl(): CmdDeclContext;
    testDecl(): TestDeclContext;
    testExpectDecl(): TestExpectDeclContext;
    testBlock(): TestBlockContext;
    scope(): ScopeContext;
    typescope(): TypescopeContext;
    const(): ConstContext;
    satisfiabilityDecl(): SatisfiabilityDeclContext;
    quantifiedPropertyDecl(): QuantifiedPropertyDeclContext;
    propertyDecl(): PropertyDeclContext;
    consistencyDecl(): ConsistencyDeclContext;
    testSuiteDecl(): TestSuiteDeclContext;
    testConstruct(): TestConstructContext;
    arrowOp(): ArrowOpContext;
    compareOp(): CompareOpContext;
    letDecl(): LetDeclContext;
    block(): BlockContext;
    blockOrBar(): BlockOrBarContext;
    quant(): QuantContext;
    qualName(): QualNameContext;
    optionDecl(): OptionDeclContext;
    name(): NameContext;
    nameList(): NameListContext;
    qualNameList(): QualNameListContext;
    paraDeclList(): ParaDeclListContext;
    quantDeclList(): QuantDeclListContext;
    arrowDeclList(): ArrowDeclListContext;
    letDeclList(): LetDeclListContext;
    typescopeList(): TypescopeListContext;
    exprList(): ExprListContext;
    expr(): ExprContext;
    expr1(): Expr1Context;
    expr1(_p: number): Expr1Context;
    expr1_5(): Expr1_5Context;
    expr1_5(_p: number): Expr1_5Context;
    expr2(): Expr2Context;
    expr2(_p: number): Expr2Context;
    expr3(): Expr3Context;
    expr4(): Expr4Context;
    expr4(_p: number): Expr4Context;
    expr4_5(): Expr4_5Context;
    expr5(): Expr5Context;
    expr6(): Expr6Context;
    expr6(_p: number): Expr6Context;
    expr7(): Expr7Context;
    expr8(): Expr8Context;
    expr8(_p: number): Expr8Context;
    expr9(): Expr9Context;
    expr10(): Expr10Context;
    expr10(_p: number): Expr10Context;
    expr11(): Expr11Context;
    expr11(_p: number): Expr11Context;
    expr12(): Expr12Context;
    expr12(_p: number): Expr12Context;
    expr13(): Expr13Context;
    expr13(_p: number): Expr13Context;
    expr14(): Expr14Context;
    expr14(_p: number): Expr14Context;
    expr15(): Expr15Context;
    expr15(_p: number): Expr15Context;
    expr16(): Expr16Context;
    expr16(_p: number): Expr16Context;
    expr17(): Expr17Context;
    expr18(): Expr18Context;
    arrowExpr(): ArrowExprContext;
    sexprDecl(): SexprDeclContext;
    sexpr(): SexprContext;
    instDecl(): InstDeclContext;
    evalRelDecl(): EvalRelDeclContext;
    evalDecl(): EvalDeclContext;
    exampleDecl(): ExampleDeclContext;
    queryDecl(): QueryDeclContext;
    numberList(): NumberListContext;
    number(): NumberContext;
    bounds(): BoundsContext;
    atomNameOrNumber(): AtomNameOrNumberContext;
    bound(): BoundContext;
    boundLHS(): BoundLHSContext;
    bindRHSUnion(): BindRHSUnionContext;
    bindRHSUnion(_p: number): BindRHSUnionContext;
    bindRHSProduct(): BindRHSProductContext;
    bindRHSProduct(_p: number): BindRHSProductContext;
    bindRHSProductBase(): BindRHSProductBaseContext;
    sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean;
    private expr1_sempred;
    private expr1_5_sempred;
    private expr2_sempred;
    private expr4_sempred;
    private expr6_sempred;
    private expr8_sempred;
    private expr10_sempred;
    private expr11_sempred;
    private expr12_sempred;
    private expr13_sempred;
    private expr14_sempred;
    private expr15_sempred;
    private expr16_sempred;
    private bindRHSUnion_sempred;
    private bindRHSProduct_sempred;
    private static readonly _serializedATNSegments;
    private static readonly _serializedATNSegment0;
    private static readonly _serializedATNSegment1;
    static readonly _serializedATN: string;
    static __ATN: ATN;
    static get _ATN(): ATN;
}
export declare class PredDeclContext extends ParserRuleContext {
    PRED_TOK(): TerminalNode;
    name(): NameContext;
    block(): BlockContext;
    EOF(): TerminalNode;
    predType(): PredTypeContext | undefined;
    qualName(): QualNameContext | undefined;
    DOT_TOK(): TerminalNode | undefined;
    paraDecls(): ParaDeclsContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class ParseExprContext extends ParserRuleContext {
    expr(): ExprContext;
    EOF(): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class AlloyModuleContext extends ParserRuleContext {
    importDecl(): ImportDeclContext[];
    importDecl(i: number): ImportDeclContext;
    paragraph(): ParagraphContext[];
    paragraph(i: number): ParagraphContext;
    evalDecl(): EvalDeclContext[];
    evalDecl(i: number): EvalDeclContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class ImportDeclContext extends ParserRuleContext {
    OPEN_TOK(): TerminalNode;
    qualName(): QualNameContext | undefined;
    LEFT_SQUARE_TOK(): TerminalNode | undefined;
    qualNameList(): QualNameListContext | undefined;
    RIGHT_SQUARE_TOK(): TerminalNode | undefined;
    AS_TOK(): TerminalNode | undefined;
    name(): NameContext | undefined;
    FILE_PATH_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class ParagraphContext extends ParserRuleContext {
    sigDecl(): SigDeclContext | undefined;
    predDecl(): PredDeclContext | undefined;
    funDecl(): FunDeclContext | undefined;
    assertDecl(): AssertDeclContext | undefined;
    cmdDecl(): CmdDeclContext | undefined;
    testExpectDecl(): TestExpectDeclContext | undefined;
    sexprDecl(): SexprDeclContext | undefined;
    queryDecl(): QueryDeclContext | undefined;
    evalRelDecl(): EvalRelDeclContext | undefined;
    optionDecl(): OptionDeclContext | undefined;
    instDecl(): InstDeclContext | undefined;
    exampleDecl(): ExampleDeclContext | undefined;
    propertyDecl(): PropertyDeclContext | undefined;
    quantifiedPropertyDecl(): QuantifiedPropertyDeclContext | undefined;
    satisfiabilityDecl(): SatisfiabilityDeclContext | undefined;
    consistencyDecl(): ConsistencyDeclContext | undefined;
    testSuiteDecl(): TestSuiteDeclContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class SigDeclContext extends ParserRuleContext {
    SIG_TOK(): TerminalNode;
    nameList(): NameListContext;
    LEFT_CURLY_TOK(): TerminalNode;
    RIGHT_CURLY_TOK(): TerminalNode;
    VAR_TOK(): TerminalNode | undefined;
    ABSTRACT_TOK(): TerminalNode | undefined;
    mult(): MultContext | undefined;
    sigExt(): SigExtContext | undefined;
    arrowDeclList(): ArrowDeclListContext | undefined;
    block(): BlockContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class SigExtContext extends ParserRuleContext {
    EXTENDS_TOK(): TerminalNode | undefined;
    qualName(): QualNameContext[];
    qualName(i: number): QualNameContext;
    IN_TOK(): TerminalNode | undefined;
    PLUS_TOK(): TerminalNode[];
    PLUS_TOK(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class MultContext extends ParserRuleContext {
    LONE_TOK(): TerminalNode | undefined;
    SOME_TOK(): TerminalNode | undefined;
    ONE_TOK(): TerminalNode | undefined;
    TWO_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class ArrowMultContext extends ParserRuleContext {
    LONE_TOK(): TerminalNode | undefined;
    SET_TOK(): TerminalNode | undefined;
    ONE_TOK(): TerminalNode | undefined;
    TWO_TOK(): TerminalNode | undefined;
    FUNC_TOK(): TerminalNode | undefined;
    PFUNC_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class HelperMultContext extends ParserRuleContext {
    LONE_TOK(): TerminalNode | undefined;
    SET_TOK(): TerminalNode | undefined;
    ONE_TOK(): TerminalNode | undefined;
    FUNC_TOK(): TerminalNode | undefined;
    PFUNC_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class ParaDeclContext extends ParserRuleContext {
    nameList(): NameListContext;
    COLON_TOK(): TerminalNode;
    expr(): ExprContext;
    DISJ_TOK(): TerminalNode | undefined;
    helperMult(): HelperMultContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class QuantDeclContext extends ParserRuleContext {
    nameList(): NameListContext;
    COLON_TOK(): TerminalNode;
    expr(): ExprContext;
    DISJ_TOK(): TerminalNode | undefined;
    SET_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class ArrowDeclContext extends ParserRuleContext {
    nameList(): NameListContext;
    COLON_TOK(): TerminalNode;
    arrowMult(): ArrowMultContext;
    arrowExpr(): ArrowExprContext;
    VAR_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class PredTypeContext extends ParserRuleContext {
    WHEAT_TOK(): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class FunDeclContext extends ParserRuleContext {
    FUN_TOK(): TerminalNode;
    name(): NameContext;
    COLON_TOK(): TerminalNode;
    expr(): ExprContext[];
    expr(i: number): ExprContext;
    LEFT_CURLY_TOK(): TerminalNode;
    RIGHT_CURLY_TOK(): TerminalNode;
    qualName(): QualNameContext | undefined;
    DOT_TOK(): TerminalNode | undefined;
    paraDecls(): ParaDeclsContext | undefined;
    helperMult(): HelperMultContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class ParaDeclsContext extends ParserRuleContext {
    LEFT_PAREN_TOK(): TerminalNode | undefined;
    RIGHT_PAREN_TOK(): TerminalNode | undefined;
    paraDeclList(): ParaDeclListContext | undefined;
    LEFT_SQUARE_TOK(): TerminalNode | undefined;
    RIGHT_SQUARE_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class AssertDeclContext extends ParserRuleContext {
    ASSERT_TOK(): TerminalNode;
    block(): BlockContext;
    name(): NameContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class CmdDeclContext extends ParserRuleContext {
    RUN_TOK(): TerminalNode | undefined;
    CHECK_TOK(): TerminalNode | undefined;
    name(): NameContext | undefined;
    COLON_TOK(): TerminalNode | undefined;
    qualName(): QualNameContext | undefined;
    block(): BlockContext | undefined;
    scope(): ScopeContext | undefined;
    FOR_TOK(): TerminalNode | undefined;
    bounds(): BoundsContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class TestDeclContext extends ParserRuleContext {
    IS_TOK(): TerminalNode;
    SAT_TOK(): TerminalNode | undefined;
    UNSAT_TOK(): TerminalNode | undefined;
    THEOREM_TOK(): TerminalNode | undefined;
    CHECKED_TOK(): TerminalNode | undefined;
    FORGE_ERROR_TOK(): TerminalNode | undefined;
    qualName(): QualNameContext | undefined;
    block(): BlockContext | undefined;
    name(): NameContext | undefined;
    COLON_TOK(): TerminalNode | undefined;
    scope(): ScopeContext | undefined;
    FOR_TOK(): TerminalNode | undefined;
    bounds(): BoundsContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class TestExpectDeclContext extends ParserRuleContext {
    EXPECT_TOK(): TerminalNode;
    testBlock(): TestBlockContext;
    TEST_TOK(): TerminalNode | undefined;
    name(): NameContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class TestBlockContext extends ParserRuleContext {
    LEFT_CURLY_TOK(): TerminalNode;
    RIGHT_CURLY_TOK(): TerminalNode;
    testDecl(): TestDeclContext[];
    testDecl(i: number): TestDeclContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class ScopeContext extends ParserRuleContext {
    FOR_TOK(): TerminalNode;
    number(): NumberContext | undefined;
    BUT_TOK(): TerminalNode | undefined;
    typescopeList(): TypescopeListContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class TypescopeContext extends ParserRuleContext {
    number(): NumberContext;
    qualName(): QualNameContext;
    EXACTLY_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class ConstContext extends ParserRuleContext {
    NONE_TOK(): TerminalNode | undefined;
    UNIV_TOK(): TerminalNode | undefined;
    IDEN_TOK(): TerminalNode | undefined;
    number(): NumberContext | undefined;
    MINUS_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class SatisfiabilityDeclContext extends ParserRuleContext {
    ASSERT_TOK(): TerminalNode;
    expr(): ExprContext;
    IS_TOK(): TerminalNode;
    SAT_TOK(): TerminalNode | undefined;
    UNSAT_TOK(): TerminalNode | undefined;
    FORGE_ERROR_TOK(): TerminalNode | undefined;
    scope(): ScopeContext | undefined;
    FOR_TOK(): TerminalNode | undefined;
    bounds(): BoundsContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class QuantifiedPropertyDeclContext extends ParserRuleContext {
    ASSERT_TOK(): TerminalNode;
    ALL_TOK(): TerminalNode;
    quantDeclList(): QuantDeclListContext;
    BAR_TOK(): TerminalNode;
    expr(): ExprContext;
    IS_TOK(): TerminalNode;
    FOR_TOK(): TerminalNode[];
    FOR_TOK(i: number): TerminalNode;
    name(): NameContext;
    SUFFICIENT_TOK(): TerminalNode | undefined;
    NECESSARY_TOK(): TerminalNode | undefined;
    DISJ_TOK(): TerminalNode | undefined;
    LEFT_SQUARE_TOK(): TerminalNode | undefined;
    exprList(): ExprListContext | undefined;
    RIGHT_SQUARE_TOK(): TerminalNode | undefined;
    scope(): ScopeContext | undefined;
    bounds(): BoundsContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class PropertyDeclContext extends ParserRuleContext {
    ASSERT_TOK(): TerminalNode;
    expr(): ExprContext;
    IS_TOK(): TerminalNode;
    FOR_TOK(): TerminalNode[];
    FOR_TOK(i: number): TerminalNode;
    name(): NameContext;
    SUFFICIENT_TOK(): TerminalNode | undefined;
    NECESSARY_TOK(): TerminalNode | undefined;
    scope(): ScopeContext | undefined;
    bounds(): BoundsContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class ConsistencyDeclContext extends ParserRuleContext {
    ASSERT_TOK(): TerminalNode;
    expr(): ExprContext;
    IS_TOK(): TerminalNode;
    WITH_TOK(): TerminalNode;
    name(): NameContext;
    CONSISTENT_TOK(): TerminalNode | undefined;
    INCONSISTENT_TOK(): TerminalNode | undefined;
    scope(): ScopeContext | undefined;
    FOR_TOK(): TerminalNode | undefined;
    bounds(): BoundsContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class TestSuiteDeclContext extends ParserRuleContext {
    TEST_TOK(): TerminalNode;
    SUITE_TOK(): TerminalNode;
    FOR_TOK(): TerminalNode;
    name(): NameContext;
    LEFT_CURLY_TOK(): TerminalNode;
    RIGHT_CURLY_TOK(): TerminalNode;
    testConstruct(): TestConstructContext[];
    testConstruct(i: number): TestConstructContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class TestConstructContext extends ParserRuleContext {
    exampleDecl(): ExampleDeclContext | undefined;
    testExpectDecl(): TestExpectDeclContext | undefined;
    quantifiedPropertyDecl(): QuantifiedPropertyDeclContext | undefined;
    propertyDecl(): PropertyDeclContext | undefined;
    satisfiabilityDecl(): SatisfiabilityDeclContext | undefined;
    consistencyDecl(): ConsistencyDeclContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class ArrowOpContext extends ParserRuleContext {
    ARROW_TOK(): TerminalNode;
    mult(): MultContext[];
    mult(i: number): MultContext;
    SET_TOK(): TerminalNode[];
    SET_TOK(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class CompareOpContext extends ParserRuleContext {
    IN_TOK(): TerminalNode | undefined;
    EQ_TOK(): TerminalNode | undefined;
    LT_TOK(): TerminalNode | undefined;
    GT_TOK(): TerminalNode | undefined;
    LEQ_TOK(): TerminalNode | undefined;
    GEQ_TOK(): TerminalNode | undefined;
    IS_TOK(): TerminalNode | undefined;
    NI_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class LetDeclContext extends ParserRuleContext {
    name(): NameContext;
    EQ_TOK(): TerminalNode;
    expr(): ExprContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class BlockContext extends ParserRuleContext {
    LEFT_CURLY_TOK(): TerminalNode;
    RIGHT_CURLY_TOK(): TerminalNode;
    expr(): ExprContext[];
    expr(i: number): ExprContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class BlockOrBarContext extends ParserRuleContext {
    block(): BlockContext | undefined;
    BAR_TOK(): TerminalNode | undefined;
    expr(): ExprContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class QuantContext extends ParserRuleContext {
    ALL_TOK(): TerminalNode | undefined;
    NO_TOK(): TerminalNode | undefined;
    SUM_TOK(): TerminalNode | undefined;
    mult(): MultContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class QualNameContext extends ParserRuleContext {
    name(): NameContext[];
    name(i: number): NameContext;
    THIS_TOK(): TerminalNode | undefined;
    SLASH_TOK(): TerminalNode[];
    SLASH_TOK(i: number): TerminalNode;
    INT_TOK(): TerminalNode | undefined;
    SUM_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class OptionDeclContext extends ParserRuleContext {
    OPTION_TOK(): TerminalNode;
    qualName(): QualNameContext[];
    qualName(i: number): QualNameContext;
    FILE_PATH_TOK(): TerminalNode | undefined;
    number(): NumberContext | undefined;
    MINUS_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class NameContext extends ParserRuleContext {
    IDENTIFIER_TOK(): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class NameListContext extends ParserRuleContext {
    name(): NameContext;
    COMMA_TOK(): TerminalNode | undefined;
    nameList(): NameListContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class QualNameListContext extends ParserRuleContext {
    qualName(): QualNameContext;
    COMMA_TOK(): TerminalNode | undefined;
    qualNameList(): QualNameListContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class ParaDeclListContext extends ParserRuleContext {
    paraDecl(): ParaDeclContext;
    COMMA_TOK(): TerminalNode | undefined;
    paraDeclList(): ParaDeclListContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class QuantDeclListContext extends ParserRuleContext {
    quantDecl(): QuantDeclContext;
    COMMA_TOK(): TerminalNode | undefined;
    quantDeclList(): QuantDeclListContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class ArrowDeclListContext extends ParserRuleContext {
    arrowDecl(): ArrowDeclContext;
    COMMA_TOK(): TerminalNode | undefined;
    arrowDeclList(): ArrowDeclListContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class LetDeclListContext extends ParserRuleContext {
    letDecl(): LetDeclContext;
    COMMA_TOK(): TerminalNode | undefined;
    letDeclList(): LetDeclListContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class TypescopeListContext extends ParserRuleContext {
    typescope(): TypescopeContext;
    COMMA_TOK(): TerminalNode | undefined;
    typescopeList(): TypescopeListContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class ExprListContext extends ParserRuleContext {
    expr(): ExprContext;
    COMMA_TOK(): TerminalNode | undefined;
    exprList(): ExprListContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class ExprContext extends ParserRuleContext {
    expr1(): Expr1Context | undefined;
    LET_TOK(): TerminalNode | undefined;
    letDeclList(): LetDeclListContext | undefined;
    blockOrBar(): BlockOrBarContext | undefined;
    BIND_TOK(): TerminalNode | undefined;
    quant(): QuantContext | undefined;
    quantDeclList(): QuantDeclListContext | undefined;
    DISJ_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr1Context extends ParserRuleContext {
    expr1_5(): Expr1_5Context;
    expr1(): Expr1Context | undefined;
    OR_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr1_5Context extends ParserRuleContext {
    expr2(): Expr2Context;
    expr1_5(): Expr1_5Context | undefined;
    XOR_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr2Context extends ParserRuleContext {
    expr3(): Expr3Context;
    expr2(): Expr2Context | undefined;
    IFF_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr3Context extends ParserRuleContext {
    expr4(): Expr4Context;
    IMP_TOK(): TerminalNode | undefined;
    expr3(): Expr3Context[];
    expr3(i: number): Expr3Context;
    ELSE_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr4Context extends ParserRuleContext {
    expr4_5(): Expr4_5Context;
    expr4(): Expr4Context | undefined;
    AND_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr4_5Context extends ParserRuleContext {
    expr5(): Expr5Context[];
    expr5(i: number): Expr5Context;
    UNTIL_TOK(): TerminalNode | undefined;
    RELEASE_TOK(): TerminalNode | undefined;
    SINCE_TOK(): TerminalNode | undefined;
    TRIGGERED_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr5Context extends ParserRuleContext {
    expr6(): Expr6Context | undefined;
    NEG_TOK(): TerminalNode | undefined;
    expr5(): Expr5Context | undefined;
    ALWAYS_TOK(): TerminalNode | undefined;
    EVENTUALLY_TOK(): TerminalNode | undefined;
    AFTER_TOK(): TerminalNode | undefined;
    BEFORE_TOK(): TerminalNode | undefined;
    ONCE_TOK(): TerminalNode | undefined;
    HISTORICALLY_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr6Context extends ParserRuleContext {
    expr7(): Expr7Context;
    expr6(): Expr6Context | undefined;
    compareOp(): CompareOpContext | undefined;
    NEG_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr7Context extends ParserRuleContext {
    expr8(): Expr8Context;
    NO_TOK(): TerminalNode | undefined;
    SOME_TOK(): TerminalNode | undefined;
    LONE_TOK(): TerminalNode | undefined;
    ONE_TOK(): TerminalNode | undefined;
    TWO_TOK(): TerminalNode | undefined;
    SET_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr8Context extends ParserRuleContext {
    expr9(): Expr9Context | undefined;
    expr8(): Expr8Context | undefined;
    expr10(): Expr10Context | undefined;
    PLUS_TOK(): TerminalNode | undefined;
    MINUS_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr9Context extends ParserRuleContext {
    expr10(): Expr10Context | undefined;
    CARD_TOK(): TerminalNode | undefined;
    expr9(): Expr9Context | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr10Context extends ParserRuleContext {
    expr11(): Expr11Context;
    expr10(): Expr10Context | undefined;
    PPLUS_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr11Context extends ParserRuleContext {
    expr12(): Expr12Context;
    expr11(): Expr11Context | undefined;
    AMP_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr12Context extends ParserRuleContext {
    expr13(): Expr13Context;
    expr12(): Expr12Context | undefined;
    arrowOp(): ArrowOpContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr13Context extends ParserRuleContext {
    expr14(): Expr14Context;
    expr13(): Expr13Context | undefined;
    SUBT_TOK(): TerminalNode | undefined;
    SUPT_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr14Context extends ParserRuleContext {
    expr15(): Expr15Context | undefined;
    expr14(): Expr14Context | undefined;
    LEFT_SQUARE_TOK(): TerminalNode | undefined;
    exprList(): ExprListContext | undefined;
    RIGHT_SQUARE_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr15Context extends ParserRuleContext {
    expr16(): Expr16Context | undefined;
    expr15(): Expr15Context | undefined;
    DOT_TOK(): TerminalNode | undefined;
    name(): NameContext | undefined;
    LEFT_SQUARE_TOK(): TerminalNode | undefined;
    exprList(): ExprListContext | undefined;
    RIGHT_SQUARE_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr16Context extends ParserRuleContext {
    expr17(): Expr17Context | undefined;
    expr16(): Expr16Context | undefined;
    PRIME_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr17Context extends ParserRuleContext {
    expr18(): Expr18Context | undefined;
    expr17(): Expr17Context | undefined;
    TILDE_TOK(): TerminalNode | undefined;
    EXP_TOK(): TerminalNode | undefined;
    STAR_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class Expr18Context extends ParserRuleContext {
    const(): ConstContext | undefined;
    qualName(): QualNameContext | undefined;
    AT_TOK(): TerminalNode | undefined;
    name(): NameContext | undefined;
    BACKQUOTE_TOK(): TerminalNode | undefined;
    THIS_TOK(): TerminalNode | undefined;
    LEFT_CURLY_TOK(): TerminalNode | undefined;
    quantDeclList(): QuantDeclListContext | undefined;
    blockOrBar(): BlockOrBarContext | undefined;
    RIGHT_CURLY_TOK(): TerminalNode | undefined;
    LEFT_PAREN_TOK(): TerminalNode | undefined;
    expr(): ExprContext | undefined;
    RIGHT_PAREN_TOK(): TerminalNode | undefined;
    block(): BlockContext | undefined;
    sexpr(): SexprContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class ArrowExprContext extends ParserRuleContext {
    qualName(): QualNameContext;
    ARROW_TOK(): TerminalNode | undefined;
    arrowExpr(): ArrowExprContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class SexprDeclContext extends ParserRuleContext {
    sexpr(): SexprContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class SexprContext extends ParserRuleContext {
    SEXPR_TOK(): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class InstDeclContext extends ParserRuleContext {
    INST_TOK(): TerminalNode;
    name(): NameContext;
    bounds(): BoundsContext;
    scope(): ScopeContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class EvalRelDeclContext extends ParserRuleContext {
    arrowDecl(): ArrowDeclContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class EvalDeclContext extends ParserRuleContext {
    EVAL_TOK(): TerminalNode;
    expr(): ExprContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class ExampleDeclContext extends ParserRuleContext {
    EXAMPLE_TOK(): TerminalNode;
    name(): NameContext;
    IS_TOK(): TerminalNode;
    expr(): ExprContext;
    FOR_TOK(): TerminalNode;
    bounds(): BoundsContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class QueryDeclContext extends ParserRuleContext {
    name(): NameContext;
    COLON_TOK(): TerminalNode;
    arrowExpr(): ArrowExprContext;
    EQ_TOK(): TerminalNode;
    expr(): ExprContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class NumberListContext extends ParserRuleContext {
    number(): NumberContext;
    COMMA_TOK(): TerminalNode | undefined;
    numberList(): NumberListContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class NumberContext extends ParserRuleContext {
    NUM_CONST_TOK(): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class BoundsContext extends ParserRuleContext {
    LEFT_CURLY_TOK(): TerminalNode | undefined;
    RIGHT_CURLY_TOK(): TerminalNode | undefined;
    bound(): BoundContext[];
    bound(i: number): BoundContext;
    qualName(): QualNameContext | undefined;
    EXACTLY_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class AtomNameOrNumberContext extends ParserRuleContext {
    BACKQUOTE_TOK(): TerminalNode | undefined;
    name(): NameContext | undefined;
    number(): NumberContext | undefined;
    MINUS_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class BoundContext extends ParserRuleContext {
    boundLHS(): BoundLHSContext | undefined;
    compareOp(): CompareOpContext | undefined;
    bindRHSUnion(): BindRHSUnionContext | undefined;
    NO_TOK(): TerminalNode | undefined;
    qualName(): QualNameContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class BoundLHSContext extends ParserRuleContext {
    CARD_TOK(): TerminalNode | undefined;
    qualName(): QualNameContext[];
    qualName(i: number): QualNameContext;
    atomNameOrNumber(): AtomNameOrNumberContext | undefined;
    DOT_TOK(): TerminalNode[];
    DOT_TOK(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class BindRHSUnionContext extends ParserRuleContext {
    bindRHSProduct(): BindRHSProductContext | undefined;
    bindRHSUnion(): BindRHSUnionContext | undefined;
    PLUS_TOK(): TerminalNode | undefined;
    LEFT_PAREN_TOK(): TerminalNode | undefined;
    RIGHT_PAREN_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class BindRHSProductContext extends ParserRuleContext {
    LEFT_PAREN_TOK(): TerminalNode | undefined;
    bindRHSProduct(): BindRHSProductContext | undefined;
    RIGHT_PAREN_TOK(): TerminalNode | undefined;
    bindRHSProductBase(): BindRHSProductBaseContext | undefined;
    COMMA_TOK(): TerminalNode | undefined;
    ARROW_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
export declare class BindRHSProductBaseContext extends ParserRuleContext {
    atomNameOrNumber(): AtomNameOrNumberContext | undefined;
    qualName(): QualNameContext | undefined;
    LEFT_PAREN_TOK(): TerminalNode | undefined;
    bindRHSUnion(): BindRHSUnionContext | undefined;
    RIGHT_PAREN_TOK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: ForgeListener): void;
    exitRule(listener: ForgeListener): void;
    accept<Result>(visitor: ForgeVisitor<Result>): Result;
}
