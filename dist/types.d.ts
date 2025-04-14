import { PredDeclContext } from "./forge-antlr/ForgeParser";
export type Predicate = {
    name: string;
    args?: string[];
    body: string;
    predicateString: string;
    predTree?: PredDeclContext;
};
export interface DatumParsed {
    parsed: ParsedValue;
    data: string;
    [key: string]: any;
}
export interface ParsedValue {
    instances: InstanceData[];
    bitwidth: number;
    [key: string]: any;
}
export interface InstanceData {
    types: {
        "seq/Int": BuiltinType;
        Int: BuiltinType;
        univ: BuiltinType;
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
    };
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
