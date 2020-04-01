import ts from 'typescript'
import TsType from './TsType'
import NamedBuiltinType from './types/NamedBuiltinType'
import StringLiteral from './types/StringLiteral'
import BooleanLiteral from './types/BooleanLiteral'
import Union from './types/Union'
import ObjectType from './types/ObjectType'
import ArrayType from './types/ArrayType'

export interface AnalyserContext {
  analyse(this: AnalyserContext, contextualName: string[], type: ts.Type): TsType
  checker: ts.TypeChecker
  typeMap: Map<ts.Type, TsType>
}
export type AnalyzeTypeFn = (type: ts.Type, checked: ts.TypeChecker) => TsType

export default function analyzeType(contextualName: string[], type: ts.Type, checker: ts.TypeChecker) {
  const ctx: AnalyserContext = {
    analyse(contextualName: string[], type: ts.Type) {
      return analyzeTypeInternal(ctx, contextualName, type)
    },
    checker,
    typeMap: new Map(),
  }
  return ctx.analyse(contextualName, type)
}

export function prepareTsTypeConverter(checker: ts.TypeChecker) {
  const ctx: AnalyserContext = {
    analyse(contextualName: string[], type: ts.Type) {
      return analyzeTypeInternal(ctx, contextualName, type)
    },
    checker,
    typeMap: new Map(),
  }
  return (contextualName: string[], type: ts.Type) => analyzeTypeInternal(ctx, contextualName, type)
}

type CreateTypeObject = (type: ts.Type) => TsType
export function analyzeTypeInternal(ctx: AnalyserContext, contextualName: string[], type: ts.Type) {
  let cached = ctx.typeMap.get(type)
  if (cached) {
    cached.refCount++
    cached.contextualNames.push(contextualName)
    return cached
  }

  const handlers: Map<ts.TypeFlags, CreateTypeObject | string> = new Map<ts.TypeFlags, CreateTypeObject | string>([
    [ts.TypeFlags.Any, 'any'],
    [ts.TypeFlags.Unknown, 'unknown'],
    [ts.TypeFlags.String, 'string'],
    [ts.TypeFlags.Number, 'number'],
    [ts.TypeFlags.Boolean, 'boolean'],
    [ts.TypeFlags.Boolean | ts.TypeFlags.Union, 'boolean'],
    [ts.TypeFlags.Enum | ts.TypeFlags.Union, 'enum'],
    [ts.TypeFlags.EnumLiteral | ts.TypeFlags.Union, 'enumliteral'],
    [ts.TypeFlags.Void, 'void'],
    [ts.TypeFlags.Undefined, 'undefined'],
    [ts.TypeFlags.Null, 'null'],
    [ts.TypeFlags.Never, 'never'],
    [ts.TypeFlags.BigInt, 'bigint'],
    [ts.TypeFlags.StringLiteral, () => new StringLiteral(type)],
    [ts.TypeFlags.NumberLiteral, (type as ts.LiteralType).value?.toString()],
    [ts.TypeFlags.BooleanLiteral, () => new BooleanLiteral(type, ctx)],
    [
      ts.TypeFlags.Object,
      () => {
        if (type.getSymbol()?.name === 'Array') return new ArrayType(type, contextualName,ctx)
        return new ObjectType(type, contextualName, ctx)
      },
    ],

    [ts.TypeFlags.Union, () => new Union(type, contextualName, ctx)],
    [ts.TypeFlags.Intersection, () => new ObjectType(type, contextualName, ctx)],
  ])

  const handled = handle()
  ctx.typeMap.set(type, handled)
  return handled

  function handle() {
    const handler = handlers.get(type.flags)
    if (handler) {
      if (typeof handler === 'string') return new NamedBuiltinType(type, handler)
      return handler(type)
    } else {
      return new NamedBuiltinType(type, 'unsupported-by-papudoc')
    }
  }
}
