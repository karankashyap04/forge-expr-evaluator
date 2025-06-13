import { ANTLRErrorListener, Recognizer, RecognitionException } from "antlr4ts";

export class ParseErrorListener implements ANTLRErrorListener<any> {
  syntaxError(
    recognizer: Recognizer<any, any>,
    offendingSymbol: any,
    line: number,
    charPositionInLine: number,
    msg: string,
    e: RecognitionException | undefined
  ) {
    throw new Error(`Parse error at ${line}:${charPositionInLine}: ${msg}`);
  }
}