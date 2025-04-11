export declare abstract class SyntaxNode {
    startRow: number;
    startColumn: number;
    endRow: number;
    endColumn: number;
    constructor(startRow: number, startColumn: number, endRow: number, endColumn: number);
}
declare class Block extends SyntaxNode {
    statements: SyntaxNode[];
    constructor(startRow: number, startColumn: number, endRow: number, endColumn: number, statements: SyntaxNode[]);
}
declare class Sig extends SyntaxNode {
    name: string;
    body?: Block | undefined;
    inheritsFrom?: string | undefined;
    annotation?: string | undefined;
    constructor(startRow: number, startColumn: number, endRow: number, endColumn: number, name: string, body?: Block | undefined, inheritsFrom?: string | undefined, // This could be 'SIG'. We are just ignoring this for now.
    annotation?: string | undefined);
}
declare class Expr extends SyntaxNode {
    expr: string;
    constructor(startRow: number, startColumn: number, endRow: number, endColumn: number, expr: string);
}
declare class Predicate extends SyntaxNode {
    name: string;
    params?: Block | undefined;
    body?: Block | undefined;
    constructor(startRow: number, startColumn: number, endRow: number, endColumn: number, name: string, params?: Block | undefined, // FOr now, just a location block. We should change this as we get as things get more sophisticated.
    body?: Block | undefined);
}
declare class Test extends SyntaxNode {
    name: string;
    check: string;
    body?: Block | undefined;
    bounds?: string | undefined;
    scope?: string | undefined;
    constructor(startRow: number, startColumn: number, endRow: number, endColumn: number, name: string, check: string, body?: Block | undefined, bounds?: string | undefined, scope?: string | undefined);
}
declare class AssertionTest extends SyntaxNode {
    pred: string;
    prop: Expr;
    check: string;
    bounds?: string | undefined;
    scope?: string | undefined;
    constructor(startRow: number, startColumn: number, endRow: number, endColumn: number, pred: string, prop: Expr, check: string, bounds?: string | undefined, scope?: string | undefined);
}
declare class QuantifiedAssertionTest extends SyntaxNode {
    pred: string;
    prop: Expr;
    check: string;
    disj?: boolean | undefined;
    quantDecls?: Block | undefined;
    bounds?: string | undefined;
    scope?: string | undefined;
    predArgs?: Block | undefined;
    constructor(startRow: number, startColumn: number, endRow: number, endColumn: number, pred: string, prop: Expr, check: string, disj?: boolean | undefined, quantDecls?: Block | undefined, bounds?: string | undefined, scope?: string | undefined, predArgs?: Block | undefined);
}
declare class Example extends SyntaxNode {
    name: string;
    testExpr: Block;
    bounds: Block;
    constructor(startRow: number, startColumn: number, endRow: number, endColumn: number, name: string, testExpr: Block, bounds: Block);
}
declare class Function extends SyntaxNode {
    name: string;
    params?: Block | undefined;
    body?: Block | undefined;
    constructor(startRow: number, startColumn: number, endRow: number, endColumn: number, name: string, params?: Block | undefined, // FOr now, just a location block. We should change this as we get as things get more sophisticated.
    body?: Block | undefined);
}
declare class SatisfiabilityAssertionTest extends SyntaxNode {
    exp: Expr;
    check: string;
    bounds?: string | undefined;
    scope?: string | undefined;
    constructor(startRow: number, startColumn: number, endRow: number, endColumn: number, exp: Expr, check: string, bounds?: string | undefined, scope?: string | undefined);
}
declare class ConsistencyAssertionTest extends SyntaxNode {
    pred: string;
    prop: Expr;
    consistent: boolean;
    bounds?: string | undefined;
    scope?: string | undefined;
    constructor(startRow: number, startColumn: number, endRow: number, endColumn: number, pred: string, prop: Expr, consistent: boolean, bounds?: string | undefined, scope?: string | undefined);
}
export { Block, Sig, Predicate, Function, Test, AssertionTest, QuantifiedAssertionTest, Example, SatisfiabilityAssertionTest, ConsistencyAssertionTest, Expr };
