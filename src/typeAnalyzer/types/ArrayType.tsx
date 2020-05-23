import TsType, { Complexity, RenderContext } from '../TsType'
import ts from 'typescript'
import { AnalyserContext } from '../typeAnalyzer'
import React from 'react'
import styled from 'styled-components'
import { findResolvedTypeAutonest } from './ObjectType'

const ArrayContent = styled.div`
  border-left: 4px solid #cce;
  padding-left: 20px;
  margin-top: 5px;
  padding-top: 5px;
  padding-bottom: 10px;
`

export default class ArrayType extends TsType {
  private elementType: TsType

  constructor(type: ts.Type, contextualName: string[], ctx: AnalyserContext) {
    super(contextualName, type)
    const rawElementType = (type as any).resolvedTypeArguments[0]
    if (rawElementType.flags & ts.SymbolFlags.TypeParameter) {
      const foundResolvedType = findResolvedTypeAutonest(ctx, rawElementType, false)

      if (!foundResolvedType) {
        console.log('CON2', contextualName)
        //console.log(type.aliasTypeArguments[0].target.typeParameters)
        //console.log(ctx.typeStack[ctx.typeStack.length - 3].resolvedProperties)
        //findResolvedTypeAutonest(memberContext, valueType, true)
        //console.log(member.name, ctx.typeStack[ctx.typeStack.length - 1].mapper)
        throw new Error('stopping at ' + contextualName.join('.') + type.getSymbol()?.name)
      }
      this.elementType = ctx.analyse([...contextualName, 'Elem'], foundResolvedType || rawElementType)
    } else {
      this.elementType = ctx.analyse([...contextualName, 'Elem'], rawElementType)
    }
  }

  get complexity(): Complexity {
    return Complexity.Expression
  }

  toReact(ctx: RenderContext) {
    const inner = ctx.renderNestedTypeReact(this.elementType)
    return (
      <div>
        <div>Array of:</div>
        <ArrayContent>{inner}</ArrayContent>
      </div>
    )
  }

  toTypeString(ctx: RenderContext): string {
    const inner = ctx.renderNestedTypeString(this.elementType)
    switch (this.elementType.complexity) {
      case Complexity.Complex:
        if (ctx.inlineInterfaces) {
          return `Array<${inner}>`
        } else {
          return `${inner}[]`
        }
      case Complexity.Trivial:
        return `${inner}[]`
      default:
        return `Array<${inner}>`
    }
  }
}
