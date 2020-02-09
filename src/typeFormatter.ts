import ts from 'typescript'
import { format } from 'url'

type TypeFormatter = (type: ts.Type) => string

export default function formatType(checker: ts.TypeChecker, type: ts.Type) {
  const handlers: Map<ts.TypeFlags, TypeFormatter | string> = new Map<ts.TypeFlags, TypeFormatter | string>([
    [ts.TypeFlags.Any, 'any'],
    [ts.TypeFlags.Unknown, 'unknown'],
    [ts.TypeFlags.String, 'string'],
    [ts.TypeFlags.Number, 'number'],
    [ts.TypeFlags.Boolean, 'boolean'],
    [ts.TypeFlags.Void, 'void'],
    [ts.TypeFlags.Undefined, 'undefined'],
    [ts.TypeFlags.Null, 'null'],
    [ts.TypeFlags.Never, 'never'],
    [ts.TypeFlags.BigInt, 'bigint'],
    [ts.TypeFlags.StringLiteral, formatStringLiteral],
    [ts.TypeFlags.NumberLiteral, type => (type as ts.LiteralType).value.toString()],
    [ts.TypeFlags.BooleanLiteral, type => checker.typeToString(type)],
    [ts.TypeFlags.Object, formatObject],
    [ts.TypeFlags.Union, formatUnion],
    [ts.TypeFlags.Intersection, formatIntersection],
  ])

  const types = [...handlers.entries()].filter(([key]) => (type.flags & key) === key)
    .map(([, val]) => typeof val === 'string' ? val : val(type))

  if (types.length === 0) throw new Error('Cannot handle flags ' + type.flags)
  if (types.length > 1) throw new Error('Multiple handlers for ' + type.flags)
  return types[0]
  /*
  Number = 8,
    Boolean = 16,
    Enum = 32,
    BigInt = 64,
    StringLiteral = 128,
    NumberLiteral = 256,
    BooleanLiteral = 512,
    EnumLiteral = 1024,
    BigIntLiteral = 2048,
    ESSymbol = 4096,
    UniqueESSymbol = 8192,
    Void = 16384,
    Undefined = 32768,
    Null = 65536,
    Never = 131072,
    TypeParameter = 262144,
    Object = 524288,
    Union = 1048576,
    Intersection = 2097152,
    Index = 4194304,
    IndexedAccess = 8388608,
    Conditional = 16777216,
    Substitution = 33554432,
    NonPrimitive = 67108864,
    Literal = 2944,
    Unit = 109440,
    StringOrNumberLiteral = 384,
    PossiblyFalsy = 117724,
    StringLike = 132,
    NumberLike = 296,
    BigIntLike = 2112,
    BooleanLike = 528,
    EnumLike = 1056,
    ESSymbolLike = 12288,
    VoidLike = 49152,
    UnionOrIntersection = 3145728,
    StructuredType = 3670016,
    TypeVariable = 8650752,
    InstantiableNonPrimitive = 58982400,
    InstantiablePrimitive = 4194304,
    Instantiable = 63176704,
    StructuredOrInstantiable = 66846720,
    Narrowable = 133970943,
    NotUnionOrUnit = 67637251,*/
  throw new Error('Unknown flags: ' + type.flags)



  function formatUnion(union: ts.Type): string {
    const type = union as ts.UnionOrIntersectionType
    return '(' + type.types.map(type => formatType(checker, type)).join(' | ') + ')'
  }

  function formatIntersection(union: ts.Type): string {
    const type = union as ts.UnionOrIntersectionType
    return '(' + type.types.map(type => formatType(checker, type)).join(' & ') + ')'
  }

  function formatStringLiteral(type: ts.Type) {
    return "'" + (type as ts.LiteralType).value + "'"
  }

  function formatObject(type: ts.Type): string {

    if (type.getSymbol()?.name === 'Array') return formatArray(type)
    const memberEntries: Array<{ key: string, type: string }> = []

    type.getProperties().forEach(member => {
      memberEntries.push({
        key: member.name,
        type: formatType(checker, checker.getTypeAtLocation(member.syntheticOrigin?.valueDeclaration || member.valueDeclaration))
      })
    })
    return `{ ${memberEntries.map(entry => `${entry.key}: ${entry.type}`).join(', ')} }`
  }

  function formatArray(arrayType: any) {
    return 'Array<' + formatType(checker, arrayType.resolvedTypeArguments[0]) + '>'
  }

}