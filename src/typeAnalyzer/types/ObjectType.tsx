import TsType, { Complexity, RenderContext } from '../TsType'
import ts from 'typescript'
import { AnalyserContext } from '../typeAnalyzer'
import React from 'react'
import compact from 'lodash/compact'
import MemberTable from '../../front/ApiView/MemberTable'

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
        return {
          name: member.name,
          type: ctx.analyse([...contextualName, member.name], valueType),
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
