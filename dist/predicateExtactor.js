"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPredicates = extractPredicates;
const entities_1 = require("entities");
function removeCommentLines(fileContent) {
    // NOTE: this currently DOES NOT filter out block comments or lines that
    // don't start with a comment but are commented at some point onwards
    let result = '';
    const lines = fileContent.split('\n');
    for (const line of lines) {
        if (!line.trim().startsWith('//') && !line.trim().startsWith('--')) {
            result += line + '\n';
        }
    }
    return result;
}
// extract predicates
function extractPredicates(fileContent) {
    console.log('fileContent:', fileContent);
    const decodedContent = (0, entities_1.decodeHTML)(fileContent); // HTML encoded string -> plain string
    const cleanedContent = removeCommentLines(decodedContent);
    console.log('cleanedContent:', cleanedContent);
    const predicateRegex = /pred\s+(\w+)(\[[^\]]*\])?\s*\{([\s\S]*?)\}/g;
    let match;
    const predicates = [];
    while ((match = predicateRegex.exec(cleanedContent)) !== null) {
        const name = match[1]; // Predicate name
        const args = match[2] || ''; // Arguments (optional)
        let body = match[3]; // Predicate body
        console.log('body:', body);
        // filter out occurrences of "// " from the body
        body = body.replaceAll('// ', '');
        const predicate = {
            name: name,
            args: args ? args.substring(1, args.length - 1).split(',').map(arg => arg.trim()) : undefined,
            body: body,
            predicateString: `pred ${name}${args} {${body}}`
        };
        predicates.push(predicate);
    }
    return predicates;
}
