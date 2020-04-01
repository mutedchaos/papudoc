import TsType, { Complexity, RenderContext } from '../TsType'
import React from 'react'
import ts from 'typescript'
import { AnalyserContext } from '../typeAnalyzer'

export default class Union extends TsType {
  private innerTypes: TsType[]

  constructor(type: ts.Type, contextualName: string[], ctx: AnalyserContext) {
    super(contextualName, type)
    this.innerTypes = (type as ts.UnionOrIntersectionType).types.map((type, i) =>
      ctx.analyse([...contextualName, i.toString()], type)
    )
  }

  get complexity(): Complexity {
    return Complexity.Expression
  }

  toReact(ctx: RenderContext) {
    return (
      <div>
        <div>One of the following</div>
        <ul>
          {this.innerTypes.map((type, i) => {
            const inner = ctx.renderNestedTypeReact(type)
            return <li key={i}>{inner}</li>
          })}
        </ul>
      </div>
    )
  }

  toTypeString(ctx: RenderContext): string {
    const needsParens = (inner: string) => !inner.match(/^[a-zA-Z0-9_]$/)

    return this.innerTypes
      .map((innerType) => {
        const inner = ctx.renderNestedTypeString(innerType)
        return needsParens(inner) ? `(${inner})` : inner
      })
      .join(' | ')
  }
}
