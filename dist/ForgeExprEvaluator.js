"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeExprEvaluator = void 0;
const AbstractParseTreeVisitor_1 = require("antlr4ts/tree/AbstractParseTreeVisitor");
const lodash_1 = require("lodash");
const TRUE_LITERAL = '#t';
const FALSE_LITERAL = '#f';
///// HELPER FUNCTIONS /////
function isSingleValue(value) {
    return typeof value === 'string';
}
function isTupleArray(value) {
    return Array.isArray(value);
}
function getBooleanValue(value) {
    if (value === 'true' || value === TRUE_LITERAL) {
        return true;
    }
    if (value === 'false' || value === FALSE_LITERAL) {
        return false;
    }
    throw new Error('Expected value to be boolean');
}
function getNumberValue(value) {
    if (typeof value === 'string') {
        return Number(value);
    }
    throw new Error('Expected value to be a number');
}
function areTuplesEqual(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
}
function isTupleArraySubset(a, b) {
    return a.every(tupleA => b.some(tupleB => areTuplesEqual(tupleA, tupleB)));
}
function areTupleArraysEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    return (isTupleArraySubset(a, b) &&
        isTupleArraySubset(b, a));
}
function deduplicateTuples(tuples) {
    const result = [];
    for (const tuple of tuples) {
        if (!result.some(existing => areTuplesEqual(existing, tuple))) {
            result.push(tuple);
        }
    }
    return result;
}
function getCombinations(arrays) {
    // first, turn each string[][] into a string[] by flattening
    const valueSets = arrays.map(tuple => tuple.flat());
    // now, recursively compute the cartesian product
    function cartesianProduct(arrays) {
        if (arrays.length === 0)
            return [[]];
        const [first, ...rest] = arrays;
        const restProduct = cartesianProduct(rest);
        return first.flatMap(value => restProduct.map(product => [value, ...product]));
    }
    return cartesianProduct(valueSets);
}
/**
 * A recursive evaluator for Forge expressions.
 * This visitor walks the parse tree and prints the type of operation encountered.
 */
class ForgeExprEvaluator extends AbstractParseTreeVisitor_1.AbstractParseTreeVisitor {
    constructor(datum, instanceIndex, predicates) {
        super();
        this.datum = datum;
        this.instanceIndex = instanceIndex;
        this.instanceData = this.datum.parsed.instances[this.instanceIndex];
        this.predicates = predicates;
        this.environmentStack = [];
        this.quantDeclEnvironmentStack = [];
    }
    // helper function
    isPredicateName(name) {
        return this.predicates.some((pred) => pred.name === name);
    }
    // helper function
    getPredicate(name) {
        const predicate = this.predicates.find((pred) => pred.name === name);
        if (predicate === undefined) {
            throw new Error(`Predicate ${name} not found`);
        }
        return predicate;
    }
    // helper function
    callPredicate(predicate, evaluatedArgs) {
        console.log('trying to call predicate:', predicate.name);
        // check if the expected number of args has been provided
        const expectedArgs = predicate.args ? predicate.args.length : 0;
        const providedArgs = Array.isArray(evaluatedArgs) ? evaluatedArgs.length : 1;
        if (expectedArgs !== providedArgs) {
            throw new Error(`Expected ${expectedArgs} arguments, but got ${providedArgs}`);
        }
        // make bindings for the args
        const argNames = predicate.args?.map((arg) => arg.split(':')[0]); // remove type info
        const bindings = {};
        if (argNames) {
            for (let i = 0; i < argNames.length; i++) {
                let argValue = Array.isArray(evaluatedArgs) ? evaluatedArgs[i] : evaluatedArgs;
                if (Array.isArray(argValue) && argValue.length === 1) {
                    argValue = argValue[0]; // if it's a single value in an array, just use the value
                }
                bindings[argNames[i]] =
                    typeof argValue === 'string' ? argValue : [argValue];
            }
        }
        console.log('bindings:', bindings);
        // add the environment for the callee onto the stack
        this.environmentStack.push(bindings);
        // get the parse tree for the predicate
        const tree = predicate.predTree;
        console.log('tree:', tree);
        if (tree === undefined) {
            throw new Error(`No parse tree found for predicate ${predicate.name}`);
        }
        // evaluate the predicate
        const result = this.visit(tree);
        console.log('pred evaluated; result:', result);
        // remove the environment for the callee from the stack
        this.environmentStack.pop();
        return result;
    }
    // THIS SEEMS KINDA JANKY... IS THIS REALLY WHAT WE WANT??
    aggregateResult(aggregate, nextResult) {
        if (aggregate.length === 0)
            return nextResult; // Prioritize non-default values
        if (nextResult.length === 0)
            return aggregate;
        // return aggregate.concat(nextResult); // Merge results when possible
        if (isSingleValue(aggregate)) {
            if (isSingleValue(nextResult)) {
                return nextResult;
            }
            else {
                throw new Error('Expected nextResult to be a single value');
            }
        }
        else {
            if (isSingleValue(nextResult)) {
                return aggregate.concat([nextResult]);
            }
            else {
                return aggregate.concat(nextResult);
            }
        }
    }
    defaultResult() {
        console.log('default result');
        return [];
    }
    visitPredDecl(ctx) {
        console.log('visiting pred');
        console.log('ctx.block().text:', ctx.block().text);
        const visitResult = this.visit(ctx.block());
        return visitResult;
    }
    visitBlock(ctx) {
        console.log('visiting block');
        console.log('ctx.text:', ctx.text);
        let result = undefined;
        for (const expr of ctx.expr()) {
            const exprResult = this.visit(expr);
            if (result === undefined) {
                result = exprResult;
            }
            else {
                const resultBool = getBooleanValue(result);
                const exprBool = getBooleanValue(exprResult);
                result = resultBool && exprBool ? TRUE_LITERAL : FALSE_LITERAL;
            }
        }
        console.log('returning from block:', result);
        if (result === undefined) {
            throw new Error('Expected result to be defined');
        }
        return result;
    }
    visitExpr(ctx) {
        console.log('visiting expr: ', ctx.text);
        let results = undefined;
        if (ctx.LET_TOK()) {
            results = [];
            results.push(['**UNIMPLEMENTED** Let Binding (`let x = ...`)']);
        }
        if (ctx.BIND_TOK()) {
            throw new Error('**NOT IMPLEMENTING FOR NOW** Bind Expression');
        }
        if (ctx.quant()) {
            results = [];
            results.push([
                '**UNIMPLEMENTED** Quantified Expression (`all`, `some`, `no`, etc.)'
            ]);
        }
        // TODO: fix this!
        const childrenResults = this.visitChildren(ctx);
        console.log('childrenResults in expr:', childrenResults);
        if (results === undefined) {
            console.log('returning childrenResults in expr:', childrenResults);
            return childrenResults;
        }
        if (isSingleValue(results)) {
            throw new Error('Expected results to be a tuple array');
        }
        if (isSingleValue(childrenResults)) {
            results.push([childrenResults]);
        }
        else {
            results = results.concat(childrenResults);
        }
        console.log('results being returned in expr:', results);
        return results;
    }
    visitExpr1(ctx) {
        console.log('visiting expr1:', ctx.text);
        if (ctx.OR_TOK()) {
            const leftChildValue = this.visit(ctx.expr1());
            const rightChildValue = this.visitChildren(ctx);
            const leftBool = getBooleanValue(leftChildValue);
            const rightBool = getBooleanValue(rightChildValue);
            return leftBool || rightBool ? TRUE_LITERAL : FALSE_LITERAL;
        }
        const childrenResults = this.visitChildren(ctx);
        console.log('childrenResults in expr1:', childrenResults);
        return childrenResults;
    }
    visitExpr1_5(ctx) {
        console.log('visiting expr1_5:', ctx.text);
        if (ctx.XOR_TOK()) {
            const leftChildValue = this.visit(ctx.expr1_5());
            const rightChildValue = this.visitChildren(ctx);
            const leftBool = getBooleanValue(leftChildValue);
            const rightBool = getBooleanValue(rightChildValue);
            return leftBool !== rightBool ? TRUE_LITERAL : FALSE_LITERAL;
        }
        const childrenResults = this.visitChildren(ctx);
        console.log('childrenResults in expr1_5:', childrenResults);
        return childrenResults;
    }
    visitExpr2(ctx) {
        console.log('visiting expr2:', ctx.text);
        if (ctx.IFF_TOK()) {
            const leftChildValue = this.visit(ctx.expr2());
            const rightChildValue = this.visitChildren(ctx);
            const leftBool = getBooleanValue(leftChildValue);
            const rightBool = getBooleanValue(rightChildValue);
            return leftBool === rightBool ? TRUE_LITERAL : FALSE_LITERAL;
        }
        const childrenResults = this.visitChildren(ctx);
        console.log('childrenResults in expr2:', childrenResults);
        return childrenResults;
    }
    visitExpr3(ctx) {
        console.log('visiting expr3:', ctx.text);
        if (ctx.IMP_TOK()) {
            const leftChildValue = this.visit(ctx.expr4());
            const rightChildValue = this.visitChildren(ctx);
            const leftBool = getBooleanValue(leftChildValue);
            const rightBool = getBooleanValue(rightChildValue);
            return !leftBool || rightBool ? TRUE_LITERAL : FALSE_LITERAL;
        }
        const childrenResults = this.visitChildren(ctx);
        console.log('childrenResults in expr3:', childrenResults);
        return childrenResults;
    }
    visitExpr4(ctx) {
        console.log('visiting expr4:', ctx.text);
        if (ctx.AND_TOK()) {
            const leftChildValue = this.visit(ctx.expr4());
            const rightChildValue = this.visitChildren(ctx);
            const leftBool = getBooleanValue(leftChildValue);
            const rightBool = getBooleanValue(rightChildValue);
            return leftBool && rightBool ? TRUE_LITERAL : FALSE_LITERAL;
        }
        const childrenResults = this.visitChildren(ctx);
        console.log('childrenResults in expr4:', childrenResults);
        return childrenResults;
    }
    visitExpr4_5(ctx) {
        console.log('visiting expr4_5:', ctx.text);
        let results = [];
        if (ctx.UNTIL_TOK()) {
            results.push(['**UNIMPLEMENTED** Temporal Operator (`until`)']);
            // results = results.concat(this.visit(ctx.expr5()[0]));
            // TODO: get left child value (as per the line commented out line above)
            //       then get right child value by calling visitChildren
            //       then apply the UNTIL implementation
            // TODO: returning for now without going to children since this is just
            // unimplemented
            return results;
        }
        if (ctx.RELEASE_TOK()) {
            results.push(['**UNIMPLEMENTED** Temporal Operator (`release`)']);
            // results = results.concat(this.visit(ctx.expr5()[0]));
            // TODO: get left child value (as per the line commented out line above)
            //       then get right child value by calling visitChildren
            //       then apply the RELEASE implementation
            // TODO: returning for now without going to children since this is just
            // unimplemented
            return results;
        }
        if (ctx.SINCE_TOK()) {
            results.push(['**UNIMPLEMENTED** Temporal Operator (`since`)']);
            // results = results.concat(this.visit(ctx.expr5()[0]));
            // TODO: get left child value (as per the line commented out line above)
            //       then get right child value by calling visitChildren
            //       then apply the SINCE implementation
            // TODO: returning for now without going to children since this is just
            // unimplemented
            return results;
        }
        if (ctx.TRIGGERED_TOK()) {
            results.push(['**UNIMPLEMENTED** Temporal Operator (`triggered`)']);
            // results = results.concat(this.visit(ctx.expr5()[0]));
            // TODO: get left child value (as per the line commented out line above)
            //       then get right child value by calling visitChildren
            //       then apply the TRIGGERED implementation
            // TODO: returning for now without going to children since this is just
            // unimplemented
            return results;
        }
        const childrenResults = this.visitChildren(ctx);
        console.log('childrenResults in expr4_5:', childrenResults);
        return childrenResults;
    }
    visitExpr5(ctx) {
        console.log('visiting expr5:', ctx.text);
        let results = [];
        const childrenResults = this.visitChildren(ctx);
        console.log('childrenResults in expr5:', childrenResults);
        if (ctx.NEG_TOK()) {
            const childValue = getBooleanValue(childrenResults);
            return childValue ? FALSE_LITERAL : TRUE_LITERAL;
        }
        if (ctx.ALWAYS_TOK()) {
            results.push(['**UNIMPLEMENTED** Temporal Operator (`always`)']);
            // TODO: implement the ALWAYS operation on the value in childrenResults
            //       and then return the result
            //       just returning results as is right now
            return results;
        }
        if (ctx.EVENTUALLY_TOK()) {
            results.push(['**UNIMPLEMENTED** Temporal Operator (`eventually`)']);
            // TODO: implement the EVENTUALLY operation on the value in childrenResults
            //       and then return the result
            //       just returning results as is right now
            return results;
        }
        if (ctx.AFTER_TOK()) {
            results.push(['**UNIMPLEMENTED** Temporal Operator (`after`)']);
            // TODO: implement the AFTER operation on the value in childrenResults
            //       and then return the result
            //       just returning results as is right now
            return results;
        }
        if (ctx.BEFORE_TOK()) {
            results.push(['**UNIMPLEMENTED** Temporal Operator (`before`)']);
            // TODO: implement the BEFORE operation on the value in childrenResults
            //       and then return the result
            //       just returning results as is right now
            return results;
        }
        if (ctx.ONCE_TOK()) {
            results.push(['**UNIMPLEMENTED** Temporal Operator (`once`)']);
            // TODO: implement the ONCE operation on the value in childrenResults
            //       and then return the result
            //       just returning results as is right now
            return results;
        }
        if (ctx.HISTORICALLY_TOK()) {
            results.push(['**UNIMPLEMENTED** Temporal Operator (`historically`)']);
            // TODO: implement the HISTORICALLY operation on the value in childrenResults
            //       and then return the result
            //       just returning results as is right now
            return results;
        }
        console.log('returning from the bottom:', childrenResults);
        return childrenResults;
    }
    visitExpr6(ctx) {
        console.log('visiting expr6:', ctx.text);
        let results = [];
        let toNegate = false;
        let foundValue = false;
        if (ctx.NEG_TOK()) {
            toNegate = true;
        }
        if (ctx.compareOp()) {
            foundValue = true;
            if (ctx.expr6() === undefined || ctx.expr7() === undefined) {
                throw new Error('Expected the compareOp to have 2 operands!');
            }
            const leftChildValue = this.visit(ctx.expr6());
            const rightChildValue = this.visit(ctx.expr7());
            console.log('left child value:', leftChildValue);
            console.log('right child value:', rightChildValue);
            switch (ctx.compareOp()?.text) {
                case '=':
                    // results.push(['**UNIMPLEMENTED** Equality Check (`=`)']);
                    // TODO: this equality implementation DOES NOT MATCH FORGE RIGHT NOW!!
                    // THIS IS JUST A TEMPORARY JANKY THING TO TEST OUT SOME VIZ STUFF THAT RELIED ON EQUALITY
                    if (isSingleValue(leftChildValue) && isSingleValue(rightChildValue)) {
                        results = leftChildValue === rightChildValue ? TRUE_LITERAL : FALSE_LITERAL;
                    }
                    else {
                        results =
                            JSON.stringify(leftChildValue) === JSON.stringify(rightChildValue)
                                ? TRUE_LITERAL
                                : FALSE_LITERAL;
                    }
                    break;
                case '<':
                    results =
                        getNumberValue(leftChildValue) < getNumberValue(rightChildValue)
                            ? TRUE_LITERAL
                            : FALSE_LITERAL;
                    break;
                case '>':
                    results =
                        getNumberValue(leftChildValue) > getNumberValue(rightChildValue)
                            ? TRUE_LITERAL
                            : FALSE_LITERAL;
                    console.log('setting the result here:', results);
                    break;
                case '<=':
                    results =
                        getNumberValue(leftChildValue) <= getNumberValue(rightChildValue)
                            ? TRUE_LITERAL
                            : FALSE_LITERAL;
                    break;
                case '>=':
                    results =
                        getNumberValue(leftChildValue) >= getNumberValue(rightChildValue)
                            ? TRUE_LITERAL
                            : FALSE_LITERAL;
                    break;
                case 'in':
                    // this should be true if the left value is equal to the right value,
                    // or a subset of it
                    if (isTupleArray(leftChildValue) && isTupleArray(rightChildValue)) {
                        if (areTupleArraysEqual(leftChildValue, rightChildValue)) {
                            results = TRUE_LITERAL;
                        }
                        else {
                            // check if left is subset of right
                            results = isTupleArraySubset(leftChildValue, rightChildValue) ? TRUE_LITERAL : FALSE_LITERAL;
                        }
                    }
                    else if (isTupleArray(rightChildValue)) {
                        results = rightChildValue.some((tuple) => tuple.length === 1 && tuple[0] === leftChildValue) ? TRUE_LITERAL : FALSE_LITERAL;
                    }
                    else { // left is a tuple array but right is a single value, so false
                        results = FALSE_LITERAL;
                    }
                    break;
                case 'is':
                    throw new Error('**NOT IMPLEMENTING FOR NOW** Type Check (`is`)');
                case 'ni':
                    results.push(['**UNIMPLEMENTED** Set Non-Membership (`ni`)']);
                    // TODO: implement this using leftValue and rightValue
                    //       for now, just returning over here. what we need to do instead
                    //       is to implement this, set the value of results to what we get
                    //       from this, and then call break (so that we can negate before
                    //       returning the final value, if required)
                    return results;
                    break; // redundant, but it won't be once we implement the TODO above
                // since the return above it will be removed
                default:
                    throw new Error(`Unexpected compare operator provided: ${ctx.compareOp()?.text}`);
            }
        }
        if (toNegate) {
            return getBooleanValue(results) ? FALSE_LITERAL : TRUE_LITERAL;
        }
        if (foundValue) {
            console.log('found value; returning:', results);
            return results;
        }
        return this.visitChildren(ctx);
    }
    visitExpr7(ctx) {
        console.log('visiting expr7:', ctx.text);
        let results = [];
        const childrenResults = this.visitChildren(ctx);
        console.log('childrenResults:', childrenResults);
        if (ctx.SET_TOK()) {
            throw new Error('**NOT IMPLEMENTING FOR NOW** Set (`set`)');
        }
        if (ctx.ONE_TOK()) {
            if (isTupleArray(childrenResults) && childrenResults.length === 1) {
                return TRUE_LITERAL;
            }
            return FALSE_LITERAL;
        }
        if (ctx.TWO_TOK()) {
            throw new Error('**NOT IMPLEMENTING FOR NOW** Two (`two`)');
        }
        if (ctx.NO_TOK()) {
            if (isTupleArray(childrenResults) && childrenResults.length === 0) {
                return TRUE_LITERAL;
            }
            return FALSE_LITERAL;
        }
        if (ctx.SOME_TOK()) {
            if (isTupleArray(childrenResults) && childrenResults.length > 0) {
                return TRUE_LITERAL;
            }
            return FALSE_LITERAL;
        }
        if (ctx.LONE_TOK()) {
            if (isTupleArray(childrenResults) && childrenResults.length <= 1) {
                return TRUE_LITERAL;
            }
            return FALSE_LITERAL;
        }
        return childrenResults;
    }
    visitExpr8(ctx) {
        console.log('visiting expr8:', ctx.text);
        if (ctx.PLUS_TOK()) {
            const leftChildValue = this.visit(ctx.expr8());
            const rightChildValue = this.visit(ctx.expr10());
            // should only work if arities are the same
            if (isSingleValue(leftChildValue) && isSingleValue(rightChildValue)) {
                return [[leftChildValue], [rightChildValue]];
            }
            else if (isSingleValue(leftChildValue) && isTupleArray(rightChildValue)) {
                if (rightChildValue.length === 0) {
                    return leftChildValue;
                }
                if (rightChildValue[0].length === 1) {
                    return deduplicateTuples([[leftChildValue], ...rightChildValue]);
                }
                throw new Error('arity mismatch in set union!');
            }
            else if (isTupleArray(leftChildValue) && isSingleValue(rightChildValue)) {
                if (leftChildValue.length === 0) {
                    return rightChildValue;
                }
                if (leftChildValue[0].length === 1) {
                    return deduplicateTuples([...leftChildValue, [rightChildValue]]);
                }
                throw new Error('arity mismatch in set union!');
            }
            else if (isTupleArray(leftChildValue) && isTupleArray(rightChildValue)) {
                if (leftChildValue.length === 0 && rightChildValue.length === 0) {
                    return [];
                }
                if (leftChildValue.length === 0) {
                    return rightChildValue;
                }
                if (rightChildValue.length === 0) {
                    return leftChildValue;
                }
                if (leftChildValue[0].length === rightChildValue[0].length) {
                    return deduplicateTuples([...leftChildValue, ...rightChildValue]);
                }
            }
            else {
                throw new Error('unexpected error: expressions added are not well defined!');
            }
        }
        if (ctx.MINUS_TOK()) {
            const leftChildValue = this.visit(ctx.expr8());
            const rightChildValue = this.visit(ctx.expr10());
            // should only work if arities are the same
            if (isSingleValue(leftChildValue) && isSingleValue(rightChildValue)) {
                if (leftChildValue === rightChildValue) {
                    return [];
                }
                console.log('returning leftChildValue:', leftChildValue);
                return leftChildValue;
            }
            else if (isSingleValue(leftChildValue) && isTupleArray(rightChildValue)) {
                if (rightChildValue.length === 0) {
                    return leftChildValue;
                }
                if (rightChildValue[0].length === 1) {
                    return rightChildValue.some((tuple) => tuple[0] === leftChildValue) ? [] : leftChildValue;
                }
                throw new Error('arity mismatch in set difference!');
            }
            else if (isTupleArray(leftChildValue) && isSingleValue(rightChildValue)) {
                if (leftChildValue.length === 0) {
                    return [];
                }
                if (leftChildValue[0].length === 1) {
                    return leftChildValue.filter((tuple) => tuple[0] !== rightChildValue);
                }
                throw new Error('arity mismatch in set difference!');
            }
            else if (isTupleArray(leftChildValue) && isTupleArray(rightChildValue)) {
                if (leftChildValue.length === 0) {
                    return [];
                }
                if (rightChildValue.length === 0) {
                    return leftChildValue;
                }
                if (leftChildValue[0].length === rightChildValue[0].length) {
                    return leftChildValue.filter((tuple) => !rightChildValue.some((rightTuple) => areTuplesEqual(tuple, rightTuple)));
                }
            }
            else {
                throw new Error('unexpected error: expressions subtracted are not well defined!');
            }
        }
        return this.visitChildren(ctx);
    }
    visitExpr9(ctx) {
        console.log('visiting expr9:', ctx.text);
        const childrenResults = this.visitChildren(ctx);
        console.log('childrenResults in expr9:', childrenResults);
        if (ctx.CARD_TOK()) {
            return `${childrenResults.length}`;
        }
        return childrenResults;
    }
    visitExpr10(ctx) {
        console.log('visiting expr10:', ctx.text);
        let results = [];
        if (ctx.PPLUS_TOK()) {
            const leftChildValue = this.visit(ctx.expr10());
            const rightChildValue = this.visitChildren(ctx);
            throw new Error('**NOT IMPLEMENTING FOR NOW** pplus (`++`)');
        }
        return this.visitChildren(ctx);
    }
    visitExpr11(ctx) {
        console.log('visiting expr11:', ctx.text);
        if (ctx.AMP_TOK()) {
            const leftChildValue = this.visit(ctx.expr11());
            const rightChildValue = this.visitChildren(ctx);
            // should only work if arities are the same
            if (isSingleValue(leftChildValue) && isSingleValue(rightChildValue)) {
                return leftChildValue === rightChildValue ? leftChildValue : [];
            }
            else if (isSingleValue(leftChildValue) && isTupleArray(rightChildValue)) {
                if (rightChildValue.length === 0) {
                    return [];
                }
                if (rightChildValue[0].length === 1) {
                    return rightChildValue.some((tuple) => tuple[0] === leftChildValue) ? leftChildValue : [];
                }
                throw new Error('arity mismatch in set intersection!');
            }
            else if (isTupleArray(leftChildValue) && isSingleValue(rightChildValue)) {
                if (leftChildValue.length === 0) {
                    return [];
                }
                if (leftChildValue[0].length === 1) {
                    return leftChildValue.some((tuple) => tuple[0] === rightChildValue) ? rightChildValue : [];
                }
                throw new Error('arity mismatch in set intersection!');
            }
            else if (isTupleArray(leftChildValue) && isTupleArray(rightChildValue)) {
                if (leftChildValue.length === 0 || rightChildValue.length === 0) {
                    return [];
                }
                if (leftChildValue[0].length === rightChildValue[0].length) {
                    return leftChildValue.filter((tuple) => rightChildValue.some((rightTuple) => areTuplesEqual(tuple, rightTuple)));
                }
            }
            else {
                throw new Error('unexpected error: expressions intersected are not well defined!');
            }
        }
        return this.visitChildren(ctx);
    }
    visitExpr12(ctx) {
        console.log('visiting expr12:', ctx.text);
        if (ctx.arrowOp()) {
            const leftChildValue = this.visit(ctx.expr12());
            const rightChildValue = this.visitChildren(ctx);
            // Ensure both values are tuple arrays
            const leftTuples = isSingleValue(leftChildValue) ? [[leftChildValue]] : leftChildValue;
            const rightTuples = isSingleValue(rightChildValue) ? [[rightChildValue]] : rightChildValue;
            if (!isTupleArray(leftTuples) || !isTupleArray(rightTuples)) {
                throw new Error('Arrow operator operands must be tuple arrays or single values');
            }
            // Compute the Cartesian product
            const result = [];
            for (const leftTuple of leftTuples) {
                for (const rightTuple of rightTuples) {
                    result.push([...leftTuple, ...rightTuple]);
                }
            }
            // Deduplicate the result
            return deduplicateTuples(result);
        }
        return this.visitChildren(ctx);
    }
    visitExpr13(ctx) {
        console.log('visiting expr13:', ctx.text);
        let results = [];
        if (ctx.SUPT_TOK()) {
            const leftChildValue = this.visit(ctx.expr13());
            const rightChildValue = this.visitChildren(ctx);
            throw new Error('**NOT IMPLEMENTING FOR NOW** Supertype Operator (`:>`)');
        }
        if (ctx.SUBT_TOK()) {
            const leftChildValue = this.visit(ctx.expr13());
            const rightChildValue = this.visitChildren(ctx);
            throw new Error('**NOT IMPLEMENTING FOR NOW** Subtype Operator (`<:`)');
        }
        return this.visitChildren(ctx);
    }
    visitExpr14(ctx) {
        console.log('visiting expr14:', ctx.text);
        let results = [];
        if (ctx.LEFT_SQUARE_TOK()) {
            const beforeBracesExpr = this.visit(ctx.expr14());
            const insideBracesExprs = this.visit(ctx.exprList());
            console.log('beforeBracesExpr:', beforeBracesExpr);
            console.log('insideBracesExprs:', insideBracesExprs);
            // check if it is a predicate that is being called
            console.log('predicates:', this.predicates);
            if (isSingleValue(beforeBracesExpr) && this.isPredicateName(beforeBracesExpr)) {
                const predicate = this.getPredicate(beforeBracesExpr);
                return this.callPredicate(predicate, insideBracesExprs);
            }
            // support for some forge-native functions:
            // add
            if (beforeBracesExpr === 'add') {
                if (isSingleValue(insideBracesExprs)) {
                    throw new Error('expected 2 arguments for add');
                }
                else {
                    // const arg1 = getNumberValue(insideBracesExprs[0][0]);
                    let arg1;
                    if ((0, lodash_1.isArray)(insideBracesExprs[0])) {
                        arg1 = getNumberValue(insideBracesExprs[0][0]);
                    }
                    else {
                        arg1 = getNumberValue(insideBracesExprs[0]);
                    }
                    // const arg2 = getNumberValue(insideBracesExprs[1][0]);
                    let arg2;
                    if ((0, lodash_1.isArray)(insideBracesExprs[1])) {
                        arg2 = getNumberValue(insideBracesExprs[1][0]);
                    }
                    else {
                        arg2 = getNumberValue(insideBracesExprs[1]);
                    }
                    // **UNIMPLEMENTED**: implement wraparound for numerical values (bitwidth)
                    return `${arg1 + arg2}`;
                }
            }
            // subtract
            if (beforeBracesExpr === 'subtract') {
                if (isSingleValue(insideBracesExprs)) {
                    throw new Error('expected 2 arguments for subtract');
                }
                else {
                    // const arg1 = getNumberValue(insideBracesExprs[0][0]);
                    let arg1;
                    if ((0, lodash_1.isArray)(insideBracesExprs[0])) {
                        arg1 = getNumberValue(insideBracesExprs[0][0]);
                    }
                    else {
                        arg1 = getNumberValue(insideBracesExprs[0]);
                    }
                    // const arg2 = getNumberValue(insideBracesExprs[1][0]);
                    let arg2;
                    if ((0, lodash_1.isArray)(insideBracesExprs[1])) {
                        arg2 = getNumberValue(insideBracesExprs[1][0]);
                    }
                    else {
                        arg2 = getNumberValue(insideBracesExprs[1]);
                    }
                    // **UNIMPLEMENTED**: implement wraparound for numerical values (bitwidth)
                    return `${arg1 - arg2}`;
                }
            }
            if (isTupleArray(beforeBracesExpr)) {
                if (isSingleValue(insideBracesExprs)) {
                    results = beforeBracesExpr
                        .filter((tuple) => tuple[0] === insideBracesExprs)
                        .map((tuple) => tuple.slice(1));
                    return results;
                }
                else {
                    throw new Error('Expected the expression inside the braces to be a single value (atom)');
                }
            }
            else {
                throw new Error('Expected the expression before the braces to be a tuple array (relation)');
            }
        }
        return this.visitChildren(ctx);
    }
    visitExpr15(ctx) {
        console.log('visiting expr15:', ctx.text);
        let results = [];
        if (ctx.DOT_TOK()) {
            const beforeDotExpr = this.visit(ctx.expr15());
            const afterDotExpr = this.visitChildren(ctx);
            console.log('beforeExpr:', beforeDotExpr);
            console.log('afterExpr:', afterDotExpr);
            if (isTupleArray(beforeDotExpr) &&
                beforeDotExpr.length === 1 &&
                beforeDotExpr[0].length === 1) {
                const joinValue = beforeDotExpr[0][0];
                if (isTupleArray(afterDotExpr)) {
                    results = afterDotExpr
                        .filter((tuple) => tuple[0] === joinValue)
                        .map((tuple) => tuple.slice(1));
                    return results;
                }
                else {
                    throw new Error('Expected the expression after the dot to be a tuple array (relation)');
                }
            }
            else {
                throw new Error('Expected the expression before the dot to be a single value (atom)');
            }
        }
        if (ctx.LEFT_SQUARE_TOK()) {
            const beforeBracesName = this.visit(ctx.name());
            const insideBracesExprs = this.visit(ctx.exprList());
            results.push(['**UNIMPLEMENTED** _[_]']);
            // TODO: we need to implement this using beforeBracesName and
            //       insideBracesExprs and then return the result
            //       just returning results here for now
            return results;
        }
        // return results.concat(this.visitChildren(ctx));
        return this.visitChildren(ctx);
    }
    visitExpr16(ctx) {
        console.log('visiting expr16:', ctx.text);
        let results = [];
        if (ctx.PRIME_TOK()) {
            const leftChildValue = this.visit(ctx.expr16());
            const rightChildValue = this.visitChildren(ctx);
            results.push(["**UNIMPLEMENTED** Primed Expression _'"]);
            // TODO: we need to implement PRIME (') using leftChildValue and rightChildValue
            //       and then return the result
            //       just returning results here for now
            return results;
        }
        return this.visitChildren(ctx);
    }
    visitExpr17(ctx) {
        console.log('visiting expr17:', ctx.text);
        let results = [];
        const childrenResults = this.visitChildren(ctx);
        if (ctx.TILDE_TOK()) {
            // this flips the order of the elements in the tuples of a relation if
            // the relation has arity 2
            if (isTupleArray(childrenResults) && childrenResults.length > 0 && childrenResults[0].length === 2) {
                return childrenResults.map((tuple) => [tuple[1], tuple[0]]);
            }
            throw new Error('expected the expression provided to ~ to have arity 2; bad arity received!');
        }
        if (ctx.EXP_TOK()) {
            results.push(['**UNIMPLEMENTED** ^']);
            // TODO: we need to implement ^ using childrenResults
            //       and then return the result
            //       just returning results here for now
            return results;
        }
        if (ctx.STAR_TOK()) {
            results.push(['**UNIMPLEMENTED** *']);
            // TODO: we need to implement * using childrenResults
            //       and then return the result
            //       just returning results here for now
            return results;
        }
        return childrenResults;
    }
    // helper function to get a list of names from a nameList
    getNameListValues(ctx) {
        if (ctx.COMMA_TOK()) {
            // there is a comma, so we need to get the value from the head of the list
            // and then move onto the tail after that
            const headValue = ctx.name().text;
            const tailValues = this.getNameListValues(ctx.nameList());
            return [headValue, ...tailValues];
        }
        else {
            // there is no comma so there is just a single name that we need to deal with here
            return [ctx.name().text];
        }
    }
    // helper function to get the values each var is bound to in a single quantDecl
    getQuantDeclValues(ctx) {
        // NOTE: **UNIMPLEMENTED**: discuss use of `disj` with Tim
        // const isDisjoint = quantDecl.DISJ_TOK() !== undefined;
        const nameList = ctx.nameList();
        const names = this.getNameListValues(nameList);
        // NOTE: **UNIMPLEMENTED**: discuss use of `set` with Tim
        const quantExpr = ctx.expr();
        let exprValue = this.visitExpr(quantExpr);
        if (isSingleValue(exprValue)) {
            exprValue = [[exprValue]];
        }
        const quantDeclValues = {};
        for (const name of names) {
            quantDeclValues[name] = exprValue;
        }
        return quantDeclValues;
    }
    // helper function to get the values each var is bound to in a quantDeclList
    getQuantDeclListValues(ctx) {
        if (ctx.COMMA_TOK()) {
            // there is a comma, so we need to get the value from the head of the list
            // and then move onto the tail after that
            const head = ctx.quantDecl();
            const tail = ctx.quantDeclList();
            if (tail === undefined) {
                throw new Error('expected a quantDeclList after the comma');
            }
            const headValue = this.getQuantDeclValues(head);
            const tailValues = this.getQuantDeclListValues(tail);
            return { ...headValue, ...tailValues };
        }
        else {
            // there is no comma so there is just a single quantDecl that we need to
            // deal with here
            return this.getQuantDeclValues(ctx.quantDecl());
        }
    }
    visitExpr18(ctx) {
        console.log('visiting expr18:', ctx.text);
        let results = [];
        if (ctx.const()) {
            return `${ctx.const()?.text}`;
        }
        if (ctx.qualName()) {
            return this.visitChildren(ctx);
        }
        if (ctx.AT_TOK()) {
            throw new Error('`@` operator is Alloy specific; it is not supported by Forge!');
        }
        if (ctx.BACKQUOTE_TOK()) {
            const name = this.visitChildren(ctx);
            results.push(['**UNIMPLEMENTED** Backquoted Name (`` `x` ``)']);
            // TODO: implement this using name and then return the result
            return results;
        }
        if (ctx.THIS_TOK()) {
            throw new Error('`this` is Alloy specific; it is not supported by Forge!');
        }
        if (ctx.LEFT_CURLY_TOK()) {
            // first, we need to get the variables from the quantDeclList
            if (ctx.quantDeclList() === undefined) {
                throw new Error('expected a quantDeclList in the set comprehension!');
            }
            const varQuantifiedSets = this.getQuantDeclListValues(ctx.quantDeclList());
            // NOTE: this doesn't support the situation in which blockOrBar is a block
            // here (DISCUSS WITH Tim)
            const blockOrBar = ctx.blockOrBar();
            if (blockOrBar === undefined) {
                throw new Error('expected a blockOrBar in the set comprehension!');
            }
            if (blockOrBar.BAR_TOK() === undefined || blockOrBar.expr() === undefined) {
                throw new Error('expected a bar followed by an expr in the set comprehension!');
            }
            const barExpr = blockOrBar.expr();
            const varNames = [];
            const quantifiedSets = [];
            for (const varName in varQuantifiedSets) {
                varNames.push(varName);
                quantifiedSets.push(varQuantifiedSets[varName]);
            }
            const product = getCombinations(quantifiedSets);
            const result = [];
            for (let i = 0; i < product.length; i++) {
                const tuple = product[i];
                const quantDeclEnv = {};
                for (let j = 0; j < varNames.length; j++) {
                    const varName = varNames[j];
                    const varValue = tuple[j];
                    quantDeclEnv[varName] = varValue;
                }
                this.quantDeclEnvironmentStack.push(quantDeclEnv);
                // now, we want to evaluate the barExpr
                const barExprValue = this.visit(barExpr);
                if (getBooleanValue(barExprValue)) { // will error if not boolean val, which we want
                    result.push(tuple);
                }
                this.quantDeclEnvironmentStack.pop();
            }
            return result;
        }
        if (ctx.LEFT_PAREN_TOK()) {
            // NOTE: we just return the result of evaluating the expr that is inside
            // the parentheses; need to do some testing to ensure that this is working
            // in a wide range of situations (worked fine on some initial tests)
            return this.visit(ctx.expr());
        }
        if (ctx.block()) {
            // NOTE: not sure if there are any situations in which we actually get here
            // (couldn't find any yet)
            return this.visitBlock(ctx.block());
        }
        if (ctx.sexpr()) {
            throw new Error('**NOT IMPLEMENTING FOR NOW** S-Expression');
        }
        return this.visitChildren(ctx);
    }
    visitExprList(ctx) {
        console.log('visiting exprList:', ctx.text);
        let results = [];
        if (ctx.COMMA_TOK()) {
            const headValue = this.visit(ctx.expr());
            const tailValues = this.visitChildren(ctx);
            console.log('headValue:', headValue);
            console.log('tailValues:', tailValues);
            // this isn't necessarily correct; just trying to get something that would
            // work for things like add, subtract, predicate calls for now
            if (isSingleValue(headValue)) {
                results.push([headValue]);
            }
            else {
                results = headValue;
            }
            if (isTupleArray(tailValues)) {
                results = results.concat(tailValues);
            }
            else {
                results.push([tailValues]);
            }
            return results;
        }
        return this.visitChildren(ctx);
    }
    visitName(ctx) {
        console.log('visiting name:', ctx.text);
        // if `true` or `false`, return the corresponding value
        const identifier = ctx.IDENTIFIER_TOK().text;
        if (identifier === 'true') {
            return TRUE_LITERAL;
        }
        if (identifier === 'false') {
            return FALSE_LITERAL;
        }
        console.log('need to find an identifier:', identifier);
        // console.log(this.instanceData);
        // temporary
        // if (identifier === 'b') {
        //   return '1';
        // }
        // if this is the name of a pred (without args), call the predicate
        if (this.isPredicateName(identifier)) {
            const predicate = this.getPredicate(identifier);
            if (predicate.args === undefined || predicate.args.length === 0) {
                return this.callPredicate(predicate, []);
            }
        }
        // if this is a var that has a value due to a quantDecl, get the value for
        // the current combination of the space being searched
        for (let i = this.quantDeclEnvironmentStack.length - 1; i >= 0; i--) {
            const quantDeclEnv = this.quantDeclEnvironmentStack[i];
            if (quantDeclEnv[identifier] !== undefined) {
                return quantDeclEnv[identifier];
            }
        }
        // if this is an arg to the pred being evaluated, return it
        const latestEnvironment = this.environmentStack.length > 0
            ? this.environmentStack[this.environmentStack.length - 1]
            : undefined;
        if (latestEnvironment !== undefined &&
            latestEnvironment[identifier] !== undefined) {
            return latestEnvironment[identifier];
        }
        let result = undefined;
        // check if this is a type
        const typeNames = Object.keys(this.instanceData.types).map((key) => this.instanceData.types[key].id);
        if (typeNames.includes(identifier)) {
            const typeAtoms = this.instanceData.types[identifier].atoms;
            const desiredValues = typeAtoms.map((atom) => atom.id);
            result = desiredValues.map((singleValue) => [singleValue]);
        }
        // check if this is an instance of a type
        for (const typeName of typeNames) {
            const atomIds = this.instanceData.types[typeName].atoms.map((atom) => atom.id);
            if (atomIds.includes(identifier)) {
                result = [[identifier]];
                break;
            }
        }
        // check if this is a parent type
        // we will need some kind of tree-search approach to check this: for example, in the TTT
        // example, the query "Player" should return "((X0) (O0))", and we can figure this out
        // from the instance by looking at the fact that in the object for the X type, the
        // type field is an array with 2 values: 'X', and 'Player'.
        // Presumably, for a query like "Player", we will need to look through
        // all the types with Player as a parent, and then all the types with these types as
        // a parent (essentially a basic tree search) and use that to populate the result.
        const toSearch = [identifier];
        while (toSearch.length > 0) {
            const currSearch = toSearch.pop();
            if (currSearch === undefined) {
                throw new Error('unexpected error: no identifier could be searched!');
            }
            for (const typeName of typeNames) {
                if (typeName === currSearch) {
                    continue; // prevent infinite loop of seeing itself as its parent repeatedly
                }
                const registeredTypes = this.instanceData.types[typeName].types;
                if (registeredTypes.includes(currSearch)) {
                    if (result === undefined) {
                        result = [];
                    }
                    const atomIds = this.instanceData.types[typeName].atoms.map((atom) => atom.id);
                    for (const atomId of atomIds) {
                        result.push([atomId]);
                    }
                    toSearch.push(this.instanceData.types[typeName].id);
                }
            }
        }
        // check if it is a relation
        const relationKeys = Object.keys(this.instanceData.relations);
        for (const relationKey of relationKeys) {
            const relationName = this.instanceData.relations[relationKey].name;
            if (relationName === identifier) {
                const relationAtoms = this.instanceData.relations[relationKey].tuples.map((tuple) => tuple.atoms);
                return relationAtoms;
            }
        }
        if (result !== undefined) {
            return result;
        }
        return identifier;
    }
    visitQualName(ctx) {
        // NOTE: this currently only supports Int; doesn't support other branches
        // of the qualName nonterminal
        console.log('visiting qualName:', ctx.text);
        if (ctx.INT_TOK()) {
            const intVals = this.instanceData.types.Int.atoms.map((atom) => [atom.id]);
            return intVals;
        }
        return this.visitChildren(ctx);
    }
}
exports.ForgeExprEvaluator = ForgeExprEvaluator;
