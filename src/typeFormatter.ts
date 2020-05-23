import ts = require('typescript')
import typeAnalyzer from './typeAnalyzer/typeAnalyzer'
import TsType, { RenderContext } from './typeAnalyzer/TsType'

export enum ExposeTypesAs {
  Inline,
  GeneratedNames,
  CanonicalNames,
}

export default function formatType(
  contextualName: string[],
  checker: ts.TypeChecker,
  type: ts.Type,
  exposeTypesAs: ExposeTypesAs
) {
  const tree = typeAnalyzer(contextualName, type, checker)
  const renderContext =
    exposeTypesAs === ExposeTypesAs.Inline
      ? createStringInlineRenderContext(tree)
      : createStringReferencingRenderContext(tree, exposeTypesAs === ExposeTypesAs.CanonicalNames)
  let output = ''
  while (renderContext.types.length) {
    const toRender = renderContext.types.shift()
    output += toRender!.toTypeString(renderContext)
  }
  return output
}

function createStringInlineRenderContext(rootType: TsType): RenderContext {
  return {
    useCanonicalNames: false,
    inlineInterfaces: true,
    types: [rootType],
    linkedTypes: [],
    renderNestedTypeReact: () => {
      throw new Error('React rendering not supported with this context')
    },

    renderNestedTypeString(this: RenderContext, type) {
      return type.toTypeString(this)
    },
  }
}

function createStringReferencingRenderContext(rootType: TsType, useCanonicalNames: boolean): RenderContext {
  return {
    useCanonicalNames,
    inlineInterfaces: true,
    types: [rootType],
    linkedTypes: [],
    renderNestedTypeReact: () => {
      throw new Error('React rendering not supported with this context')
    },
    renderNestedTypeString(this: RenderContext, type) {
      // TODO: add support for references
      return type.toTypeString(this)
    },
  }
}
