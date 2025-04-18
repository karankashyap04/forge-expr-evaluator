import { PredDeclContext } from "./forge-antlr/ForgeParser";

export type Predicate = {
  name: string;
  args?: string[]; // list of argument names
  body: string;
  predicateString: string; // full string of the predicate
  predTree?: PredDeclContext; // parse tree of the predicate
}

// The following type is used to be a generic version of the DatumParsed used by Sterling.
// Passing in the DatumParsed object that is available in Sterling should work fine with this.
export interface DatumParsed {
  parsed: ParsedValue;
  data: string;

  // could have other fields (we don't care about them)
  [key: string]: any;
}

export interface ParsedValue {
  instances: InstanceData[];
  bitwidth: number;
  
  // could have other fields (we don't care about them)
  [key: string]: any;
}

export interface InstanceData {
  types: {
    "seq/Int": BuiltinType;
    Int: BuiltinType;
    univ: BuiltinType;

    // types for Sigs
    [key: string]: Sig;
  };
  relations: {
    [key: string]: Relation;
  };
  skolems: any;
}

export interface BuiltinType {
  "_": string;
  id: string;
  types: string[];
  atoms: Atom[];
  meta: {
    builtin: boolean;
  }
}

export interface Sig {
  "_": string;
  id: string;
  types: string[];
  atoms: Atom[];
}

export interface Atom {
  "_": string;
  id: string;
  type: string;
}

export interface Relation {
  "_": string;
  id: string;
  name: string;
  types: string[];
  tuples: ForgeTuple[];
}

export interface ForgeTuple {
  "_": string;
  types: string[];
  atoms: string[];
}
