"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseErrorListener = void 0;
class ParseErrorListener {
    syntaxError(recognizer, offendingSymbol, line, charPositionInLine, msg, e) {
        throw new Error(`Parse error at ${line}:${charPositionInLine}: ${msg}`);
    }
}
exports.ParseErrorListener = ParseErrorListener;
