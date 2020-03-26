import TsType, { Complexity, ReferencePreference } from '../TsType'
import ts from 'typescript'
import { AnalyzeTypeFn } from '../typeAnalyzer'
import React from 'react'

export default class ArrayType extends TsType {
  private elementType: TsType

  constructor(type: ts.Type, checker: ts.TypeChecker, analyzeType: AnalyzeTypeFn) {
    super(type)
    this.elementType = analyzeType((type as any).resolvedTypeArguments[0], checker)
  }

  get complexity(): Complexity {
    return Complexity.Expression
  }

  toReact(
    referencePreference: ReferencePreference,
    renderLink: (toType: TsType, context: string[]) => React.ReactNode,
    context: string[]
  ) {
    const inner = this.elementType.toReact(this.getNestedReferencePreference(referencePreference), renderLink, [
      ...context,
      'Elem',
    ])
    return (
      <div>
        <div>Array of:</div>
        <div>{inner}</div>
      </div>
    )
  }

  toTypeString(
    referencePreference: ReferencePreference,
    createReference: (toType: TsType, context: string[]) => void,
    context: string[]
  ): string {
    const nestedPreference = this.getNestedReferencePreference(referencePreference)
    const inner = this.elementType.toTypeString(nestedPreference, createReference, [...context, 'Elem'])
    switch (this.elementType.complexity) {
      case Complexity.Complex:
        if (nestedPreference !== ReferencePreference.Complex) {
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
