import TsType, { Complexity, ReferencePreference } from '../TsType'
import React from 'react'
import ts from 'typescript'
import { AnalyzeTypeFn } from '../typeAnalyzer'

export default class Union extends TsType {
  private innerTypes: TsType[]

  constructor(type: ts.Type, checker: ts.TypeChecker, analyzeType: AnalyzeTypeFn) {
    super(type)
    this.innerTypes = (type as ts.UnionOrIntersectionType).types.map((type) => analyzeType(type, checker))
  }

  get complexity(): Complexity {
    return Complexity.Expression
  }

  toReact(
    referencePreference: ReferencePreference,
    renderLink: (toType: TsType, context: string[]) => React.ReactNode,
    context: string[]
  ) {
    return (
      <div>
        <div>One of the following</div>
        <ul>
          {this.innerTypes.map((type, i) => {
            const inner = type.toReact(this.getNestedReferencePreference(referencePreference), renderLink, [
              ...context,
              i.toString(),
            ])
            return <li key={i}>{inner}</li>
          })}
        </ul>
      </div>
    )
  }

  toTypeString(
    referencePreference: ReferencePreference,
    createReference: (toType: TsType, context: string[]) => void,
    context: string[]
  ): string {
    const nestedPreference = this.getNestedReferencePreference(referencePreference)
    const renderInner = (inner: TsType, i: number) => {
      return inner.toTypeString(nestedPreference, createReference, [...context, i.toString()])
    }
    const needsParens = (inner: TsType) =>
      inner.complexity === Complexity.Expression ||
      (inner.complexity === Complexity.Complex && nestedPreference < ReferencePreference.Complex)

    return this.innerTypes
      .map((innerType, i) => {
        const inner = renderInner(innerType, i)
        return needsParens(innerType) ? `(${inner})` : inner
      })
      .join(' | ')
  }
}
