"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expr = exports.ConsistencyAssertionTest = exports.SatisfiabilityAssertionTest = exports.Example = exports.QuantifiedAssertionTest = exports.AssertionTest = exports.Test = exports.Function = exports.Predicate = exports.Sig = exports.Block = exports.SyntaxNode = void 0;
// Base class for all AST nodes
class SyntaxNode {
    constructor(startRow, startColumn, endRow, endColumn) {
        this.startRow = startRow;
        this.startColumn = startColumn;
        this.endRow = endRow;
        this.endColumn = endColumn;
    }
}
exports.SyntaxNode = SyntaxNode;
class Block extends SyntaxNode {
    constructor(startRow, startColumn, endRow, endColumn, statements) {
        super(startRow, startColumn, endRow, endColumn);
        this.statements = statements;
    }
}
exports.Block = Block;
class Sig extends SyntaxNode {
    constructor(startRow, startColumn, endRow, endColumn, name, body, inheritsFrom, // This could be 'SIG'. We are just ignoring this for now.
    annotation) {
        super(startRow, startColumn, endRow, endColumn);
        this.name = name;
        this.body = body;
        this.inheritsFrom = inheritsFrom;
        this.annotation = annotation;
    }
}
exports.Sig = Sig;
// We don't really care about formula contents for now.
class Formula extends SyntaxNode {
    constructor(startRow, startColumn, endRow, endColumn, formula) {
        super(startRow, startColumn, endRow, endColumn);
        this.formula = formula;
    }
}
// We don't really care about expr contents for now.
class Expr extends SyntaxNode {
    constructor(startRow, startColumn, endRow, endColumn, expr) {
        super(startRow, startColumn, endRow, endColumn);
        this.expr = expr;
    }
}
exports.Expr = Expr;
class Predicate extends SyntaxNode {
    constructor(startRow, startColumn, endRow, endColumn, name, params, // FOr now, just a location block. We should change this as we get as things get more sophisticated.
    body) {
        super(startRow, startColumn, endRow, endColumn);
        this.name = name;
        this.params = params;
        this.body = body;
    }
}
exports.Predicate = Predicate;
// TODO: Implement these
class Test extends SyntaxNode {
    constructor(startRow, startColumn, endRow, endColumn, name, check, body, bounds, scope) {
        super(startRow, startColumn, endRow, endColumn);
        this.name = name;
        this.check = check;
        this.body = body;
        this.bounds = bounds;
        this.scope = scope;
    }
}
exports.Test = Test;
class AssertionTest extends SyntaxNode {
    constructor(startRow, startColumn, endRow, endColumn, pred, prop, check, bounds, scope) {
        super(startRow, startColumn, endRow, endColumn);
        this.pred = pred;
        this.prop = prop;
        this.check = check;
        this.bounds = bounds;
        this.scope = scope;
    }
}
exports.AssertionTest = AssertionTest;
class QuantifiedAssertionTest extends SyntaxNode {
    constructor(startRow, startColumn, endRow, endColumn, pred, prop, check, disj, quantDecls, bounds, scope, predArgs) {
        super(startRow, startColumn, endRow, endColumn);
        this.pred = pred;
        this.prop = prop;
        this.check = check;
        this.disj = disj;
        this.quantDecls = quantDecls;
        this.bounds = bounds;
        this.scope = scope;
        this.predArgs = predArgs;
    }
}
exports.QuantifiedAssertionTest = QuantifiedAssertionTest;
class Example extends SyntaxNode {
    constructor(startRow, startColumn, endRow, endColumn, name, testExpr, bounds) {
        super(startRow, startColumn, endRow, endColumn);
        this.name = name;
        this.testExpr = testExpr;
        this.bounds = bounds;
    }
}
exports.Example = Example;
class Function extends SyntaxNode {
    constructor(startRow, startColumn, endRow, endColumn, name, params, // FOr now, just a location block. We should change this as we get as things get more sophisticated.
    body) {
        super(startRow, startColumn, endRow, endColumn);
        this.name = name;
        this.params = params;
        this.body = body;
    }
}
exports.Function = Function;
class SatisfiabilityAssertionTest extends SyntaxNode {
    constructor(startRow, startColumn, endRow, endColumn, exp, check, bounds, scope) {
        super(startRow, startColumn, endRow, endColumn);
        this.exp = exp;
        this.check = check;
        this.bounds = bounds;
        this.scope = scope;
    }
}
exports.SatisfiabilityAssertionTest = SatisfiabilityAssertionTest;
class ConsistencyAssertionTest extends SyntaxNode {
    constructor(startRow, startColumn, endRow, endColumn, pred, prop, consistent, bounds, scope) {
        super(startRow, startColumn, endRow, endColumn);
        this.pred = pred;
        this.prop = prop;
        this.consistent = consistent;
        this.bounds = bounds;
        this.scope = scope;
    }
}
exports.ConsistencyAssertionTest = ConsistencyAssertionTest;
