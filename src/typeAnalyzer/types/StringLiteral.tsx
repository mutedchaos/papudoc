import TsType, {Complexity} from '../TsType'
import ts from 'typescript'
import React from 'react'

export default class StringLiteral extends TsType {
  constructor(type: ts.Type) {
    super([], type);

  }


  private get literalValue() {
    return (this.type as ts.LiteralType).value
  }

  toReact() {
    return <span>"{this.literalValue}"</span>
  }

  toTypeString(): string {
    return `"${this.literalValue}"`
  }

  get complexity(): Complexity {
    return Complexity.Trivial;
  }
}
