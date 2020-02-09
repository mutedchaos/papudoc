import ts from 'typescript'
import React, { ReactElement } from 'react'
import MemberTable from '../ApiView/MemberTable'
import { useChecker, CheckerContext } from '../CheckerContext'

interface Props {

  type: ts.Type
}

type Renderer = (props: { type: ts.Type }) => ReactElement

export default function TypeRenderer({ type }: Props) {
  const handlers: Map<ts.TypeFlags, Renderer | string> = new Map<ts.TypeFlags, Renderer | string>([
    [ts.TypeFlags.Any, 'any'],
    [ts.TypeFlags.Unknown, 'unknown'],
    [ts.TypeFlags.String, 'string'],
    [ts.TypeFlags.Number, 'number'],
    [ts.TypeFlags.Boolean, 'boolean'],
    [(ts.TypeFlags.Boolean | ts.TypeFlags.Union), 'boolean'],
    [(ts.TypeFlags.Enum | ts.TypeFlags.Union), 'enum'],
    [(ts.TypeFlags.EnumLiteral | ts.TypeFlags.Union), 'enumliteral'],
    [ts.TypeFlags.Void, 'void'],
    [ts.TypeFlags.Undefined, 'undefined'],
    [ts.TypeFlags.Null, 'null'],
    [ts.TypeFlags.Never, 'never'],
    [ts.TypeFlags.BigInt, 'bigint'],
    [ts.TypeFlags.StringLiteral, StringLiteral],
    [ts.TypeFlags.NumberLiteral, (type as ts.LiteralType).value?.toString()],
    [ts.TypeFlags.BooleanLiteral, BooleanLiteral],
    [ts.TypeFlags.Object, TypeObject],

    [ts.TypeFlags.Union, Union],
    [ts.TypeFlags.Intersection, Intersection],
  ])

  const Handler = handlers.get(type.flags)
  if (Handler) {
    if (typeof Handler === 'string') return <span>{Handler}</span>
    return <Handler type={type} />
  }


  return <span>
    Cannot handle {type.flags}
  </span>



}

function TypeObject({ type }: Props) {

  if (type.getSymbol()?.name === 'Array') return <TypeArray type={type} />
  const checker = useChecker()
  return <div>
    Name: {type.symbol?.name}
    <MemberTable members={
      type.getProperties().map(member => {
        const valueType = checker.getTypeAtLocation((member as any).syntheticOrigin?.valueDeclaration || member.valueDeclaration)
        if (member.name === 'optionalstring' || member.name === 'string') console.log(member.flags)
        return {
          name: member.name,
          type: <TypeRenderer type={valueType} />,
          required: !(member.flags & ts.SymbolFlags.Optional)
        }
      })
    } />
  </div>
}

function Union({ type }: Props) {
  const union = type as ts.UnionOrIntersectionType
  return <div>
    <div>One of the following:</div>
    <ul>
      {union.types.map((type, i) => <li key={i}>
        <TypeRenderer type={type} />
      </li>)}
    </ul>
  </div>
}

function Intersection({ type }: Props) {
  const intersection = type as ts.UnionOrIntersectionType
  return <TypeObject type={intersection} />
}

function StringLiteral({ type }: Props) {
  return <span>"{(type as ts.LiteralType).value}"</span>
}

function BooleanLiteral({ type }: Props) {
  //type => checker.typeToString(type)
  const checker = useChecker()
  return <span>{checker.typeToString(type)}</span>
}

function TypeArray({ type }: Props) {

  return <div>
    Array of the following items:
    <TypeRenderer type={(type as any).resolvedTypeArguments[0]} />
  </div>
}
