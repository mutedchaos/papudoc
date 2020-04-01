import ts = require('typescript')
import { ReactNode } from 'react'

export type RenderLink = (toType: TSType, context: string[]) => ReactNode
export type CreateReference = (toType: TSType, context: string[]) => void

let unknownCounter = 0

export enum Complexity {
  Trivial,
  Expression,
  Complex,
}

export interface RenderContext {
  linkedTypes: TSType[]
  withinComplex?: boolean
  inlineInterfaces: boolean
  useCanonicalNames: boolean
  renderNestedTypeReact: (type: TSType) => ReactNode
  renderNestedTypeString: (type: TSType) => string
  types: TSType[]
}

export default abstract class TSType {
  protected type: ts.Type
  public contextualNames: string[][]
  public nameOverride: string | null = null

  constructor(contextualName: null | string[], type: ts.Type) {
    this.contextualNames = contextualName && contextualName.length ? [contextualName] : []
    this.type = type
  }
  public refCount = 1

  public get name(): string {
    if (this.nameOverride) return this.nameOverride
    const naiveName = this.type.getSymbol()?.name
    if (naiveName && naiveName !== '__type') return naiveName
    if (this.contextualNames.length) {
      return this.contextualNames.map((n) => n.join('_')).join('_')
    }
    return (this.nameOverride = 'Unknown' + ++unknownCounter)
  }

  public get hash() {
    return this.name.replace(/[^a-zA-Z0-9]/g, '_')
  }

  public abstract get complexity(): Complexity

  public abstract toTypeString(ctx: RenderContext): string
  public abstract toReact(ctx: RenderContext): ReactNode
}
