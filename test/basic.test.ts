import { ForgeExprEvaluatorUtil } from "../src";
import { DatumParsed } from "../src/types";
import tttDatum from "./examples/ttt-basic/datum.json";

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
});
