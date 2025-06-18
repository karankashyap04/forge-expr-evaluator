import { EvaluationResult, ForgeExprEvaluatorUtil } from "../src";
import { DatumParsed } from "../src/types";
import tttDatum from "./examples/ttt-basic/datum.json";
import interSigDatum from "./examples/inter-sig/datum.json";
import gridCellDatum from "./examples/grid-cell/datum.json";
import { Tuple, areTupleArraysEqual } from "../src/ForgeExprEvaluator";

// helper function to get module source code from datum
function getCodeFromDatum(datum: DatumParsed): string {
  const xmlParser = new DOMParser();
  const xmlDoc = xmlParser.parseFromString(datum.data, "application/xml");

  if (xmlDoc.documentElement.nodeName === "parsererror") {
    throw new Error(`XML parsing error: ${xmlDoc.documentElement.textContent}`);
  }

  const sourceElement = xmlDoc.querySelector("source");
  if (sourceElement === null) {
    throw new Error("No source element found in XML");
  }
  const content = sourceElement.getAttribute("content");
  if (content === null) {
    throw new Error("No content attribute found in source element");
  }
  return content;
}

// helper function to check if an evaluated result is equivalent to a given tuple
// array (when treated as a set of tuples)
function areEquivalentTupleArrays(result: EvaluationResult, expected: Tuple[]) {
  // check if result is a Tuple[]
  if (Array.isArray(result)) {
    const resultTuples = result as Tuple[];
    return areTupleArraysEqual(resultTuples, expected);
  }
  return false;
}

describe("forge-expr-evaluator", () => {
  it("can evaluate a basic expression", () => {
    // tttDatum is being read from a JSON file. This is the DatumParsed<any>
    // object that is used in Sterling -- if one is using Sterling, they should
    // be able to pass in the DatumParsed<any> object from there directly into this
    // tool
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "add[1, 1]";
    const instanceIdx = 0; // could choose a different index if we wanted to
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(result).toBe(2);
  });

  it("can evaluate an instance-specific expression", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "Board6.board[0][0]";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    // expect(result).toEqual([["O0"]]);
    expect(areEquivalentTupleArrays(result, [["O0"]])).toBe(true);
  });

  it("can evaluate Int qualName", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "Int";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(
      areEquivalentTupleArrays(result, [
        [-8],
        [-7],
        [-6],
        [-5],
        [-4],
        [-3],
        [-2],
        [-1],
        [0],
        [1],
        [2],
        [3],
        [4],
        [5],
        [6],
        [7],
      ])
    ).toBe(true);
  });

  it("can evaluate a set comprehension", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "{i, j: Int | some Board6.board[i][j]}";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(
      areEquivalentTupleArrays(result, [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1],
        [2, 0],
      ])
    ).toBe(true);
  });

  it("can evaluate cardinality on the result of a set comprehension", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "#{i, j: Int | some Board6.board[i][j]}";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(result).toBe(6);
  });

  it("can evaluate a set comprehension over a set that isn't just `Int`", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "{i: X0 + O0 | true}";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(areEquivalentTupleArrays(result, [["X0"], ["O0"]])).toBe(true);
  });

  it("can evaluate -> operation", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "X->O->X";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(areEquivalentTupleArrays(result, [["X0", "O0", "X0"]])).toBe(true);
  });

  it("can evaluate basic inter and intra-sig relations", () => {
    const datum: DatumParsed = interSigDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const instanceIdx = 0;

    const expr1 = "A in A";
    const result1 = evaluatorUtil.evaluateExpression(expr1, instanceIdx);
    expect(result1).toEqual(true);

    const expr2 = "A0 in A";
    const result2 = evaluatorUtil.evaluateExpression(expr2, instanceIdx);
    expect(result2).toEqual(true);
  });

  it("can evaluate a reference to a sig", () => {
    const datum: DatumParsed = interSigDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "A0";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(areEquivalentTupleArrays(result, [["A0"]])).toBe(true);
  });

  it("can quantify in a truthy way", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const instanceIdx = 0;

    const expr1 = "some i : Int | i < 4";
    const result1 = evaluatorUtil.evaluateExpression(expr1, instanceIdx);
    expect(result1).toEqual(true);

    const expr2 = "some i : Int | i > 7";
    const result2 = evaluatorUtil.evaluateExpression(expr2, instanceIdx);
    expect(result2).toEqual(false);

    const expr3 = "all i : Int | i = i";
    const result3 = evaluatorUtil.evaluateExpression(expr3, instanceIdx);
    expect(result3).toEqual(true);

    const expr4 = "all i : Int | i < 4";
    const result4 = evaluatorUtil.evaluateExpression(expr4, instanceIdx);
    expect(result4).toEqual(false);

    const expr5 = "no i : Int | i > 7";
    const result5 = evaluatorUtil.evaluateExpression(expr5, instanceIdx);
    expect(result5).toEqual(true);

    const expr6 = "no i : Int | i < 4";
    const result6 = evaluatorUtil.evaluateExpression(expr6, instanceIdx);
    expect(result6).toEqual(false);

    const expr7 = "one i : Int | i = 2";
    const result7 = evaluatorUtil.evaluateExpression(expr7, instanceIdx);
    expect(result7).toEqual(true);

    const expr8 = "one i : Int | i > 2";
    const result8 = evaluatorUtil.evaluateExpression(expr8, instanceIdx);
    expect(result8).toEqual(false);

    const expr9 = "lone i : Int | i > 7";
    const result9 = evaluatorUtil.evaluateExpression(expr9, instanceIdx);
    expect(result9).toEqual(true);

    const expr10 = "lone i : Int | i < 4";
    const result10 = evaluatorUtil.evaluateExpression(expr10, instanceIdx);
    expect(result10).toEqual(false);
  });

  it("can quantify in a truthy way if there is a block after the bar", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "some i : Int | { i < 4 \n i > 2}";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(result).toEqual(true);
  });

  it("can perform truthy quantifications when specifying disjoint", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const instanceIdx = 0;

    const expr1 = "all disj i, j : Int | { not i = j }";
    const result1 = evaluatorUtil.evaluateExpression(expr1, instanceIdx);
    expect(result1).toEqual(true);

    const expr2 = "some disj i, j : Int | { i = j }";
    const result2 = evaluatorUtil.evaluateExpression(expr2, instanceIdx);
    expect(result2).toEqual(false);
  });

  it("can avoid variable shadowing issues across predicate args and quantified vars", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    // quantified x is shadowed by the x which is the argument to argPred1
    // if shadowing doesn't work properly, this will return #f
    const expr = "all x : Int | argPred1[3, 3]";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(result).toEqual(true);
  });

  it("can evaluate chained dot joins", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "Game.next.Board1";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(areEquivalentTupleArrays(result, [["Board0"]])).toBe(true);
  });

  it("can evaluate a dot join when neither relation is a singleton", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "Game.next.(Game.next)";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(
      areEquivalentTupleArrays(result, [
        ["Board0", "Board2"],
        ["Board1", "Board3"],
        ["Board2", "Board4"],
        ["Board3", "Board5"],
        ["Board4", "Board6"],
      ])
    ).toBe(true);
  });

  it("can evaluate a dot join with an implicit single value -> singleton set conversion", () => {
    const datum: DatumParsed = gridCellDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "{c : Cell, i : Int | (Int.(Grid.cells).c = i)}";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(
      areEquivalentTupleArrays(result, [
        ["Cell0", 2],
        ["Cell1", 1],
        ["Cell2", 0],
        ["Cell3", 2],
        ["Cell4", 1],
        ["Cell5", 0],
        ["Cell6", 2],
        ["Cell7", 1],
        ["Cell8", 0],
      ])
    ).toBe(true);
  });

  it("can evaluate a number", () => {
    const datum: DatumParsed = interSigDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "1";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(result).toEqual(1);
  });

  it("can evaluate basic boolean operations", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);
    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const instanceIdx = 0;

    const expr1 = "false and false";
    const result1 = evaluatorUtil.evaluateExpression(expr1, instanceIdx);
    expect(result1).toEqual(false);

    const expr2 = "false and true";
    const result2 = evaluatorUtil.evaluateExpression(expr2, instanceIdx);
    expect(result2).toEqual(false);

    const expr3 = "true and false";
    const result3 = evaluatorUtil.evaluateExpression(expr3, instanceIdx);
    expect(result3).toEqual(false);

    const expr4 = "true and true";
    const result4 = evaluatorUtil.evaluateExpression(expr4, instanceIdx);
    expect(result4).toEqual(true);

    const expr5 = "false or false";
    const result5 = evaluatorUtil.evaluateExpression(expr5, instanceIdx);
    expect(result5).toEqual(false);

    const expr6 = "false or true";
    const result6 = evaluatorUtil.evaluateExpression(expr6, instanceIdx);
    expect(result6).toEqual(true);

    const expr7 = "true or false";
    const result7 = evaluatorUtil.evaluateExpression(expr7, instanceIdx);
    expect(result7).toEqual(true);

    const expr8 = "true or true";
    const result8 = evaluatorUtil.evaluateExpression(expr8, instanceIdx);
    expect(result8).toEqual(true);

    const expr9 = "false implies false";
    const result9 = evaluatorUtil.evaluateExpression(expr9, instanceIdx);
    expect(result9).toEqual(true);

    const expr10 = "false implies true";
    const result10 = evaluatorUtil.evaluateExpression(expr10, instanceIdx);
    expect(result10).toEqual(true);

    const expr11 = "true implies false";
    const result11 = evaluatorUtil.evaluateExpression(expr11, instanceIdx);
    expect(result11).toEqual(false);

    const expr12 = "true implies true";
    const result12 = evaluatorUtil.evaluateExpression(expr12, instanceIdx);
    expect(result12).toEqual(true);
  });

  it("can evaluate a complex set comprehension", () => {
    const datum: DatumParsed = gridCellDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr =
      "{ c1, c2 : Cell | some i,j,k,m : Int | (Grid->i->j->c1 in cells) and (Grid->k->m->c2 in cells) and (i < k) }";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(
      areEquivalentTupleArrays(result, [
        ["Cell3", "Cell0"],
        ["Cell3", "Cell1"],
        ["Cell3", "Cell2"],
        ["Cell4", "Cell0"],
        ["Cell4", "Cell1"],
        ["Cell4", "Cell2"],
        ["Cell5", "Cell0"],
        ["Cell5", "Cell1"],
        ["Cell5", "Cell2"],
        ["Cell6", "Cell0"],
        ["Cell6", "Cell1"],
        ["Cell6", "Cell2"],
        ["Cell6", "Cell3"],
        ["Cell6", "Cell4"],
        ["Cell6", "Cell5"],
        ["Cell7", "Cell0"],
        ["Cell7", "Cell1"],
        ["Cell7", "Cell2"],
        ["Cell7", "Cell3"],
        ["Cell7", "Cell4"],
        ["Cell7", "Cell5"],
        ["Cell8", "Cell0"],
        ["Cell8", "Cell1"],
        ["Cell8", "Cell2"],
        ["Cell8", "Cell3"],
        ["Cell8", "Cell4"],
        ["Cell8", "Cell5"],
      ])
    ).toBe(true);
  });

  it("can evaluate a transitive closure", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);
    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "^(Game0.next)";
    const instanceIdx = 0;

    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);
    expect(
      areEquivalentTupleArrays(result, [
        ["Board0", "Board1"],
        ["Board0", "Board2"],
        ["Board0", "Board3"],
        ["Board0", "Board4"],
        ["Board0", "Board5"],
        ["Board0", "Board6"],
        ["Board1", "Board2"],
        ["Board1", "Board3"],
        ["Board1", "Board4"],
        ["Board1", "Board5"],
        ["Board1", "Board6"],
        ["Board2", "Board3"],
        ["Board2", "Board4"],
        ["Board2", "Board5"],
        ["Board2", "Board6"],
        ["Board3", "Board4"],
        ["Board3", "Board5"],
        ["Board3", "Board6"],
        ["Board4", "Board5"],
        ["Board4", "Board6"],
        ["Board5", "Board6"],
      ])
    ).toBe(true);
  });

  it("errors if transitive closure is attempted on a relation of arity other than 2", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);
    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "^(Board6.board)"; // has arity 3
    const instanceIdx = 0;

    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);
    expect(result).toHaveProperty("error");
  });

  it("can evaluate a reflexive transitive closure", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);
    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "*(Game.next)";

    const result = evaluatorUtil.evaluateExpression(expr, 0);
    expect(
      areEquivalentTupleArrays(result, [
        [-8, -8],
        [-7, -7],
        [-6, -6],
        [-5, -5],
        [-4, -4],
        [-3, -3],
        [-2, -2],
        [-1, -1],
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5],
        [6, 6],
        [7, 7],
        ["X0", "X0"],
        ["O0", "O0"],
        ["Board0", "Board0"],
        ["Board0", "Board1"],
        ["Board0", "Board2"],
        ["Board0", "Board3"],
        ["Board0", "Board4"],
        ["Board0", "Board5"],
        ["Board0", "Board6"],
        ["Board1", "Board1"],
        ["Board1", "Board2"],
        ["Board1", "Board3"],
        ["Board1", "Board4"],
        ["Board1", "Board5"],
        ["Board1", "Board6"],
        ["Board2", "Board2"],
        ["Board2", "Board3"],
        ["Board2", "Board4"],
        ["Board2", "Board5"],
        ["Board2", "Board6"],
        ["Board3", "Board3"],
        ["Board3", "Board4"],
        ["Board3", "Board5"],
        ["Board3", "Board6"],
        ["Board4", "Board4"],
        ["Board4", "Board5"],
        ["Board4", "Board6"],
        ["Board5", "Board5"],
        ["Board5", "Board6"],
        ["Board6", "Board6"],
        ["Game0", "Game0"],
      ])
    ).toBe(true);
  });

  it("errors if reflexive transitive closure is attempted on a relation of arity other than 2", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);
    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "*(Board6.board)"; // has arity 3
    const instanceIdx = 0;

    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);
    expect(result).toHaveProperty("error");
  });

  it("respects integer bitwidth and wraps around", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);
    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const instanceIdx = 0;
    // NOTE: the bitwidth for this instance is 4

    const expr1 = "add[7, 1]";
    const result1 = evaluatorUtil.evaluateExpression(expr1, instanceIdx);
    expect(result1).toEqual(-8);

    const expr2 = "add[7, 3]";
    const result2 = evaluatorUtil.evaluateExpression(expr2, instanceIdx);
    expect(result2).toEqual(-6);

    const expr4 = "subtract[subtract[-6, 1], 2]";
    const result4 = evaluatorUtil.evaluateExpression(expr4, instanceIdx);
    expect(result4).toEqual(7);

    const expr5 = "#Int";
    const result5 = evaluatorUtil.evaluateExpression(expr5, instanceIdx);
    expect(result5).toEqual(0);
  });

  it("errors if the user writes a number that is outside the bitwidth", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);
    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const instanceIdx = 0;

    const expr = "8";
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(result).toHaveProperty("error");
  });


  it("implements multiply", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);
    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const instanceIdx = 0;

    const expr = "multiply[2,3]";
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(result).toEqual(6);
  });

  it("implements divide", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);
    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const instanceIdx = 0;

    const expr = "divide[6,3]";
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(result).toEqual(2);
  }
  );

  it("cannot divide by zero", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);
    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const instanceIdx = 0;

    const expr = "divide[6,0]";
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(result).toHaveProperty("error");
  });

  it("implements remainder", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);
    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const instanceIdx = 0;

    const expr = "remainder[6,4]";
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(result).toEqual(2);
  }
  );

  it("cannot evaluate remainder with zero", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);
    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const instanceIdx = 0;

    const expr = "remainder[6,0]";
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(result).toHaveProperty("error");
  });

  it("can evaluate absolute value", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);
    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const instanceIdx = 0;

    const expr = "abs[-3]";
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(result).toEqual(3);

    const expr2 = "abs[3]";
    const result2 = evaluatorUtil.evaluateExpression(expr2, instanceIdx);
    expect(result2).toEqual(3);
  }
  );

  it("can determine the sign of a number", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);
    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const instanceIdx = 0;

    const expr = "sign[-3]";
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(result).toEqual(-1);

    const expr2 = "sign[3]";
    const result2 = evaluatorUtil.evaluateExpression(expr2, instanceIdx);
    expect(result2).toEqual(1);

    const expr3 = "sign[0]";
    const result3 = evaluatorUtil.evaluateExpression(expr3, instanceIdx);
    expect(result3).toEqual(0);
  });

  // TODO: Perhaps we should have tests with bitwidth becomes a factor.

  it("can compare two singleton set numbers", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);
    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const instanceIdx = 0;

    const expr1 = "Int.(0->1) < Int.(0->0)";
    const result1 = evaluatorUtil.evaluateExpression(expr1, instanceIdx);
    expect(result1).toEqual(false);
    const expr2 = "Int.(0->1) > Int.(0->0)";
    const result2 = evaluatorUtil.evaluateExpression(expr2, instanceIdx);

    expect(result2).toEqual(true);

  });

  it("implements simple box join.", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);
    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const instanceIdx = 0;

    const expr1 = "((0->1)[Int]) < Int.(0->0)";
    const result1 = evaluatorUtil.evaluateExpression(expr1, instanceIdx);
    expect(result1).toEqual(false);


    // I *think*?
    const expr2 = "Board1[Game.next]";
    const result2 = evaluatorUtil.evaluateExpression(expr2, instanceIdx);

    expect(areEquivalentTupleArrays(result2, [["Board0"]])).toBe(true);


    const expr3 = "(Int.(0->0)) = ((0->0)[Int])";
    const result3 = evaluatorUtil.evaluateExpression(expr3, instanceIdx);
    expect(result3).toEqual(true);

  });

  it("reports parse errors", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);
    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const instanceIdx = 0;

    const expr1 = "Int.(0->1";
    const result1 = evaluatorUtil.evaluateExpression(expr1, instanceIdx);
    
    // Expect result to be an error
    expect(result1).toHaveProperty("error");


  });


    it("allows $", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);
    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const instanceIdx = 0;

    const expr1 = "some a$1, b$2 : Int | (a$1 = b$2 )";
    const result1 = evaluatorUtil.evaluateExpression(expr1, instanceIdx);
    
    // Expect result to be an error
    expect(result1).toEqual(true);


  });
});
