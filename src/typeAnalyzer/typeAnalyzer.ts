import ts from "typescript";
import React from "react";
import TsType from "./TsType";
import NamedBuiltinType from "./types/NamedBuiltinType";
import StringLiteral from "./types/StringLiteral";
import BooleanLiteral from "./types/BooleanLiteral";
import Union from "./types/Union";
import Intersection from "./types/Intersection";
import ObjectType from "./types/ObjectType";
import ArrayType from "./types/ArrayType";

export type AnalyzeTypeFn  = (type: ts.Type, checked: ts.TypeChecker) => TsType

export default function analyzeType(type: ts.Type,checker: ts.TypeChecker) {
    return analyzeTypeInternal(type, checker, null as any, [], true)
}

type CreateTypeObject = (type: ts.Type) => TsType
export function analyzeTypeInternal(type: ts.Type, checker: ts.TypeChecker, containingType: ts.Type,contextName: string[], isTopLevel: boolean) {
    const handlers: Map<ts.TypeFlags, CreateTypeObject | string> = new Map<
        ts.TypeFlags,
        CreateTypeObject | string
        >([
        [ts.TypeFlags.Any, "any"],
        [ts.TypeFlags.Unknown, "unknown"],
        [ts.TypeFlags.String, "string"],
        [ts.TypeFlags.Number, "number"],
        [ts.TypeFlags.Boolean, "boolean"],
        [ts.TypeFlags.Boolean | ts.TypeFlags.Union, "boolean"],
        [ts.TypeFlags.Enum | ts.TypeFlags.Union, "enum"],
        [ts.TypeFlags.EnumLiteral | ts.TypeFlags.Union, "enumliteral"],
        [ts.TypeFlags.Void, "void"],
        [ts.TypeFlags.Undefined, "undefined"],
        [ts.TypeFlags.Null, "null"],
        [ts.TypeFlags.Never, "never"],
        [ts.TypeFlags.BigInt, "bigint"],
        [ts.TypeFlags.StringLiteral, () => new StringLiteral(type)],
        [ts.TypeFlags.NumberLiteral, (type as ts.LiteralType).value?.toString()],
        [ts.TypeFlags.BooleanLiteral, () => new BooleanLiteral(type, checker)],
        [ts.TypeFlags.Object, () => {
            if (type.getSymbol()?.name === "Array") return new ArrayType(type)
            return new ObjectType(type);
        }],

        [ts.TypeFlags.Union, () => new Union(type, checker, analyzeType)],
        [ts.TypeFlags.Intersection, () => new ObjectType(type)]
    ]);

    const handler = handlers.get(type.flags);
    if (handler) {
        if (typeof handler === "string") return new NamedBuiltinType(type, handler)
        return handler(type)
    } else {
        return new NamedBuiltinType(type, "unsupported-by-papudoc")
    }
}