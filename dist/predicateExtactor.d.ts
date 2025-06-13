import { Predicate } from "./types";
/**
 * Extracts a block of text from the given string using 1-indexed line numbers and 0-indexed columns.
 */
export declare function getTextBlock(fromRow: number, toRow: number, fromColumn: number, toColumn: number, text: string): string;
export declare function extractPredicates(fileContent: string): Predicate[];
