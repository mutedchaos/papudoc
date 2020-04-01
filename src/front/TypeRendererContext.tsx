import React, { ReactNode, useCallback, useContext, useMemo } from 'react'
import TsType, { Complexity, RenderContext } from '../typeAnalyzer/TsType'
import { Analysis } from '../analyzer'
import compact from 'lodash/compact'
import flatten from 'lodash/flatten'

interface Ctx {
  renderType(type: TsType): ReactNode
  namedTypes: TsType[]
}

export const TypeRendererContext = React.createContext<Ctx>(null as any)

export const useTypeRenderer = () => useContext(TypeRendererContext)

interface ProviderProps {
  analysis: Analysis
  children: ReactNode
}

export function TypeRendererContextProvider({ children, analysis }: ProviderProps) {
  const rootTypes = useMemo(() => getRootTypes(analysis), [analysis])
  const rendererCtx = useMemo(() => {
    const ctx = createReactRendererContext(rootTypes)

    // Prepare all types to the context
    for (let i = 0; i < ctx.types.length; ++i) {
      ctx.renderNestedTypeString(ctx.types[i])
    }

    return ctx
  }, [rootTypes])

  const renderType = useCallback((type: TsType) => rendererCtx.renderNestedTypeReact(type), [rendererCtx])

  return (
    <TypeRendererContext.Provider value={{ renderType, namedTypes: rendererCtx.linkedTypes }}>
      {children}
    </TypeRendererContext.Provider>
  )
}

function createReactRendererContext(rootTypes: TsType[]): RenderContext {
  return {
    useCanonicalNames: true,
    inlineInterfaces: false,
    linkedTypes: [],
    types: [...rootTypes],
    renderNestedTypeString(this: RenderContext, type) {
      if (type.complexity === Complexity.Complex) {
        if (this.withinComplex) {
          if (!this.types.includes(type)) {
            this.types.push(type)
          }
          if (!this.linkedTypes.includes(type)) {
            this.linkedTypes.push(type)
          }
          return ''
        } else {
          return type.toTypeString({ ...this, withinComplex: true })
        }
      }
      return type.toTypeString(this)
    },
    renderNestedTypeReact(this: RenderContext, type) {
      if (type.complexity === Complexity.Complex) {
        if (this.withinComplex) {
          return <a href={`#${type.hash}`}>{type.name}</a>
        } else {
          return type.toReact({ ...this, withinComplex: true })
        }
      }
      return type.toReact(this)
    },
  }
}

function getRootTypes(analysis: Analysis) {
  return compact(flatten(analysis.map((api) => [api.bodyTsType, api.responseTsType])))
}
