import TsType, { Complexity } from '../TsType'
import ts from 'typescript'
import React from 'react'
import { AnalyserContext } from '../typeAnalyzer'

export default class BooleanLiteral extends TsType {
  private literalValue: boolean

  constructor(type: ts.Type, { checker }: AnalyserContext) {
    super([], type)
    this.literalValue = checker.typeToString(type) === 'true'
  }

  toReact() {
    return <span>{this.literalValue}</span>
  }

  toTypeString(): string {
    return this.literalValue.toString()
  }

  get complexity(): Complexity {
    return Complexity.Trivial
  }
}
