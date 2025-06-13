import { CharStreams, CommonTokenStream, ParserRuleContext } from "antlr4ts";
import { ForgeLexer } from "./forge-antlr/ForgeLexer";
import { ForgeParser, PredDeclContext,  } from "./forge-antlr/ForgeParser";
import { ForgeListener } from "./forge-antlr/ForgeListener";
import { Predicate } from "./types";
import { ParseTreeWalker } from "antlr4ts/tree/ParseTreeWalker";
import { decodeHTML } from "entities";



/**
 * Extracts a block of text from the given string using 1-indexed line numbers and 0-indexed columns.
 */
export function getTextBlock(
  fromRow: number,
  toRow: number,
  fromColumn: number,
  toColumn: number,
  text: string
): string {
  const lines = text.split("\n");
  let block = "";
  const sameRow = fromRow === toRow;

  for (let i = fromRow; i <= toRow; i++) {
    const line = lines[i - 1]; // 1-indexed adjustment

    if (i === fromRow) {
      if (sameRow) {
        block += line.substring(fromColumn, toColumn);
      } else {
        block += line.substring(fromColumn);
      }
    } else if (i === toRow) {
      block += line.substring(0, toColumn);
    } else {
      block += line;
    }

    if (i < toRow) {
      block += "\n";
    }
  }

  return block;
}



// Listener implementation to collect predicates
class PredicateCollector implements ForgeListener {
  //public predicates: Predicate[] = [];
  
  public predicateSkeletons : {
            startLine: number,
            startColumn: number,
            endLine: number,
            endColumn: number,
            predName: string,
            predArgsBlock?: { startLine: number, startColumn: number, endLine: number, endColumn: number }, // This is the location of the args block.
            predBlock: { startLine: number, startColumn: number, endLine: number, endColumn: number } // This is the location of the predicate body block.
        }[] = []; // This is a list of predicate skeletons, not full predicates. 


    getLocations(ctx: ParserRuleContext): { startLine : number, startColumn : number, endLine : number, endColumn : number } {
      const startLine = ctx.start.line;                 // This is 1 based line number
      const startColumn = ctx.start.charPositionInLine; // This is 0 based offset

      const endLine = ctx.stop ? ctx.stop.line : -1;
      const endColumn = ctx.stop ? ctx.stop.charPositionInLine + (ctx.stop.text?.length || 0) : 0;

      return { startLine, startColumn, endLine, endColumn };
  }

  /**
     * Exit a parse tree produced by `ForgeParser.predDecl`.
     * @param ctx the parse tree
     */
    exitPredDecl? (ctx: PredDeclContext) {

        const {startLine, startColumn, endLine, endColumn} = this.getLocations(ctx);
        const predName = ctx.name().text;

        // We don't care about the pred type for now (wheat or not.) In fact, this should maybe be removed from FORGE.
        // There is also the PRED qualName that I don't know what to do with here.

        // Ideally, predArgs should look something like this.
        //const predArgs : Record<string, string> = {}; // TODO: This needs to be fixed!!
        const paraDecls = ctx.paraDecls();
        const predArgsBlock = paraDecls ? this.getLocations(paraDecls) : undefined; 
        
        // Get the pred body (block)
        const predBody = ctx.block();
        // Block start, block end.
        let predBlock = this.getLocations(predBody);

        let p = {
            startLine, 
            startColumn, 
            endLine, 
            endColumn,
            predName,
            predArgsBlock,
            predBlock
        };

        this.predicateSkeletons.push(p);
    }
}

export function extractPredicates(fileContent: string): Predicate[] {
  const decodedContent = decodeHTML(fileContent);

  // Set up ANTLR parsing
  const inputStream = CharStreams.fromString(decodedContent);
  const lexer = new ForgeLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new ForgeParser(tokenStream);
  parser.buildParseTree = true;
  const tree = parser.alloyModule();

  // Walk the tree and collect predicates
  const collector = new PredicateCollector();
  ParseTreeWalker.DEFAULT.walk(collector as ForgeListener, tree);


  /*


  export type Predicate = {
  name: string;
  args?: string[]; // list of argument names
  body: string;
  predicateString: string; // full string of the predicate
  predTree?: PredDeclContext; // parse tree of the predicate
}

*/

  let predicates : Predicate[] = collector.predicateSkeletons.map((pred) => {
    
    let name = pred.predName;
    let predicateString = getTextBlock(
      pred.startLine,
      pred.endLine,
      pred.startColumn,
      pred.endColumn,
      fileContent
    );

    let predBody = getTextBlock(
      pred.predBlock.startLine,
      pred.predBlock.endLine,
      pred.predBlock.startColumn,
      pred.predBlock.endColumn,
      fileContent
    );
    let args: string[] | undefined = undefined;
    if (pred.predArgsBlock) {
      let atext = getTextBlock(
        pred.predArgsBlock.startLine,
        pred.predArgsBlock.endLine,
        pred.predArgsBlock.startColumn,
        pred.predArgsBlock.endColumn,
        fileContent
      );
      
      // If atext starts with [ and ends with ], remove those.
      if (atext.startsWith("[") && atext.endsWith("]")) {
        atext = atext.substring(1, atext.length - 1).trim();
      }
      
      args = atext.split(",").map(arg => arg.trim());
    }

    // I think? this is right?. Now assemble the Predicate object.
    return {
      name: name,
      args: args,
      body: predBody,
      predicateString: predicateString,
      // predTree: undefined // We don't have the parse tree here, so we set it to undefined.
    };
    
    
  });

  return predicates;
}