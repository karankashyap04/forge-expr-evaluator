import { ForgeExprEvaluatorUtil } from "../src";
import { DatumParsed } from "../src/types";
import tttDatum from "./examples/ttt-basic/datum.json";
import interSigDatum from "./examples/inter-sig/datum.json";

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

    expect(result).toBe("2");
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
      ["-8"],
      ["-7"],
      ["-6"],
      ["-5"],
      ["-4"],
      ["-3"],
      ["-2"],
      ["-1"],
      ["0"],
      ["1"],
      ["2"],
      ["3"],
      ["4"],
      ["5"],
      ["6"],
      ["7"],
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
      ["0", "0"],
      ["0", "1"],
      ["0", "2"],
      ["1", "0"],
      ["1", "1"],
      ["2", "0"],
    ]);
  });

  it("can evaluate cardinality on the result of a set comprehension", () => {
    const datum: DatumParsed = tttDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const expr = "#{i, j: Int | some Board6.board[i][j]}";
    const instanceIdx = 0;
    const result = evaluatorUtil.evaluateExpression(expr, instanceIdx);

    expect(result).toBe("6");
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

  it("can evaluate basic inter and intra-sig relations", () => {
    const datum: DatumParsed = interSigDatum;
    const sourceCode = getCodeFromDatum(datum);

    const evaluatorUtil = new ForgeExprEvaluatorUtil(datum, sourceCode);
    const instanceIdx = 0;

    const expr1 = "A in A";
    const result1 = evaluatorUtil.evaluateExpression(expr1, instanceIdx);
    expect(result1).toEqual("#t");

    const expr2 = "A0 in A";
    const result2 = evaluatorUtil.evaluateExpression(expr2, instanceIdx);
    expect(result2).toEqual("#t");
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
});
