import TsType, {Complexity} from '../TsType'
import React from 'react'
import ts from 'typescript'

export default class NamedBuiltinType extends TsType {

  constructor(type: ts.Type, name: string) {
    super([], type)
    this.nameOverride = name
  }

  get complexity(): Complexity {
    return Complexity.Trivial
  }

  toReact() {
    return <span>{this.name}</span>
  }

  toTypeString(): string {
    return this.name
  }
}
