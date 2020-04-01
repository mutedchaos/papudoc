import TsType, { Complexity, RenderContext } from '../TsType'
import ts from 'typescript'
import { AnalyserContext } from '../typeAnalyzer'
import React from 'react'
import styled from "styled-components";

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
    this.elementType = ctx.analyse([...contextualName, 'Elem'], (type as any).resolvedTypeArguments[0])
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
