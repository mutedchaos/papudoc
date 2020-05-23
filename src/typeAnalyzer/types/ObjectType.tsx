import TsType, { Complexity, RenderContext } from '../TsType'
import ts from 'typescript'
import { AnalyserContext } from '../typeAnalyzer'
import React from 'react'
import compact from 'lodash/compact'
import MemberTable from '../../front/ApiView/MemberTable'
import last from 'lodash/last'

interface Property {
  name: string
  type: TsType
  required: boolean
  description?: string
}

export default class ObjectType extends TsType {
  private properties: Property[] = []

  constructor(type: ts.Type, contextualName: string[], ctx: AnalyserContext) {
    super(contextualName, type)

    this.properties = compact(
      type.getProperties().map((member) => {
        const valueType = ctx.checker.getTypeAtLocation(
          (member as any).syntheticOrigin?.valueDeclaration || member.valueDeclaration
        )
        const description = member.getJsDocTags().find((tag) => tag.name === 'description')?.text
        if (member.flags & ts.SymbolFlags.Method) return null
        let memberType = valueType

        if (valueType.flags & ts.SymbolFlags.TypeParameter) {
          const foundResolvedType = findResolvedType(ctx, valueType)

          if (!foundResolvedType) {
            findResolvedType(ctx, valueType, true)
            throw new Error('stopping at ' + contextualName.join('.') + type.getSymbol()?.name)
          }
          memberType = foundResolvedType
        }

        return {
          name: member.name,
          type: ctx.analyse([...contextualName, member.name], memberType),
          required: !(member.flags & ts.SymbolFlags.Optional),
          description,
        }
      })
    )
  }

  get complexity(): Complexity {
    return Complexity.Complex
  }

  toReact(ctx: RenderContext) {
    return (
      <div>
        <p>An object with the following fields:</p>
        <MemberTable members={this.properties} renderType={(type) => ctx.renderNestedTypeReact(type)} />
      </div>
    )
  }

  toTypeString(ctx: RenderContext): string {
    return `{ ${this.properties
      .map((property) => {
        const desc = property.description ? `/* @description ${property.description} */` : ''
        const opt = property.required ? '' : '?'
        return `${desc}${propName(property.name)}: ${ctx.renderNestedTypeString(property.type)}${opt}`
      })
      .join(', ')} }`

    function propName(plainName: string) {
      if (plainName.match(/^[a-zA-Z0-9_]$/)) return plainName
      return `"${plainName.replace(/"/g, '\\"')}"`
    }
  }
}

function getTypeParameterIndex(type: ts.Type, name: string) {
  const memberIterrator = type.getSymbol()?.members!.values()
  for (let i = 0; ; ++i) {
    const val = memberIterrator.next()
    if (val.done) return -1
    if (val.value.name === name) return i
  }
}

function findResolvedType(ctx: AnalyserContext, referenceType: ts.Type, debug = false): ts.Type | null {
  const containingType = last(ctx.typeStack)
  if (!containingType) return null
  const refSymbol = referenceType.getSymbol()
  if (!refSymbol) return null
  if (debug)
    console.log(
      'frt',
      containingType.getSymbol()?.name,
      refSymbol.name,
      containingType.getSymbol()?.members?.keys()
    )

  const containingSymbol = containingType.getSymbol()!
  const member = containingSymbol?.members!.get(refSymbol.name as any)
  if (member === refSymbol) {
    const typeParameterIndex = getTypeParameterIndex(containingType, refSymbol.name)
    if (debug) console.log('Found match')
    return (containingType as any).resolvedTypeArguments[typeParameterIndex]
  } else {
    if (ctx.typeStack.length === 1) {
      if (debug) {
          console.log('Empty stack')
          console.log(containingType)
      }
      return null
    }
    if (debug) console.log('Going in deeper')
    return findResolvedType(
      {
        ...ctx,
        typeStack: ctx.typeStack.slice(0, ctx.typeStack.length - 1),
      },
      referenceType,
      debug
    )
  }
}
/*
const typeParameterIndex = getTypeParameterIndex(type, valueType)
//(type as any).resolvedTypeArguments[typeParameterIndex]*/
