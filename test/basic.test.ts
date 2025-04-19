import { ForgeExprEvaluatorUtil } from "../src";
import { DatumParsed } from "../src/types";
import tttDatum from "./examples/ttt-basic/datum.json";
import interSigDatum from "./examples/inter-sig/datum.json";
import gridCellDatum from "./examples/grid-cell/datum.json";

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

    expect(result).toEqual([["O0"]]);
  });

  it("can evaluate Int qualName", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "Int";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(result).toEqual([
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
    ]);
  });

  it("can evaluate a set comprehension", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "{i, j: Int | some Board6.board[i][j]}";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(result).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
      [2, 0],
    ]);
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

    expect(result).toEqual([["X0"], ["O0"]]);
  });

  it("can evaluate -> operation", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "X->O->X";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(result).toEqual([["X0", "O0", "X0"]]);
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

    expect(result).toEqual([["A0"]]);
  });

  it("can quantify in a truthy way", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "some i : Int | i < 4";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(result).toEqual(true);
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

    expect(result).toEqual([["Board0"]]);
  });

  it("can evaluate a dot join when neither relation is a singleton", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "Game.next.(Game.next)";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    console.log('result:', result);

    expect(result).toEqual([
      ["Board0", "Board2"],
      ["Board1", "Board3"],
      ["Board2", "Board4"],
      ["Board3", "Board5"],
      ["Board4", "Board6"],
    ]);
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

  // it("can evaluate a complex set comprehension", () => {
  //   const datum: DatumParsed = gridCellDatum;
  //   const sourceCode = getCodeFromDatum(datum);

  //   const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
  //   const expr = "{ c1, c2 : Cell | some i,j,k,m : Int | (Grid->i->j->c1 in cells) and (Grid->k->m->c2 in cells) and (i < k) }";
  //   const instanceIdx = 0;
  //   const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

  //   expect(result).toEqual([
  //     ["Cell3", "Cell0"],
  //     ["Cell3", "Cell1"],
  //     ["Cell3", "Cell2"],
  //     ["Cell4", "Cell0"],
  //     ["Cell4", "Cell1"],
  //     ["Cell4", "Cell2"],
  //     ["Cell5", "Cell0"],
  //     ["Cell5", "Cell1"],
  //     ["Cell5", "Cell2"],
  //     ["Cell6", "Cell0"],
  //     ["Cell6", "Cell1"],
  //     ["Cell6", "Cell2"],
  //     ["Cell6", "Cell3"],
  //     ["Cell6", "Cell4"],
  //     ["Cell6", "Cell5"],
  //     ["Cell7", "Cell0"],
  //     ["Cell7", "Cell1"],
  //     ["Cell7", "Cell2"],
  //     ["Cell7", "Cell3"],
  //     ["Cell7", "Cell4"],
  //     ["Cell7", "Cell5"],
  //     ["Cell8", "Cell0"],
  //     ["Cell8", "Cell1"],
  //     ["Cell8", "Cell2"],
  //     ["Cell8", "Cell3"],
  //     ["Cell8", "Cell4"],
  //     ["Cell8", "Cell5"]
  //   ]);
  // });
});
