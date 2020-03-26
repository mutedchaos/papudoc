import ts = require('typescript')
import { ReactNode } from 'react'

export type RenderLink = (toType: TSType, context: string[]) => ReactNode
export type CreateReference = (toType: TSType, context: string[]) => void

export enum Complexity {
  Trivial,
  Expression,
  Complex
}

export enum ReferencePreference {
  Never,
  Nested,
  Complex,
}

export default abstract class TSType {
  protected type: ts.Type

  constructor(type: ts.Type) {
    this.type = type
  }

  public get name(): string | undefined {
    return this.type.getSymbol()?.name
  }

  public abstract get complexity(): Complexity

  public abstract toTypeString(referencePreference: ReferencePreference, createReference: CreateReference, context: string[]): string
  public abstract toReact(referencePreference: ReferencePreference, renderLink: RenderLink, context: string[]): ReactNode

  protected getNestedReferencePreference(preference: ReferencePreference) {
    if (preference === ReferencePreference.Complex) return preference
    return ReferencePreference.Never
  }
}
