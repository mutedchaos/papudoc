import { setPapudocHandler } from "./papudoc";
import * as ts from 'typescript'
import formatType from "./typeFormatter";

const tsConfigFilename = __dirname + '/../tsconfig.json' // TODO: find out based on source file


export function analyze(filename: string) {
  let papudocIndex = -1
  setPapudocHandler(handleAPI)
  const compilerOptions: ts.CompilerOptions = ts.convertCompilerOptionsFromJson(require(tsConfigFilename), __dirname + '/..').options
  const program = ts.createProgram([filename], compilerOptions);

  const file = program.getSourceFile(filename)
  if (!file) throw new Error('Could not get file')

  require(filename)

  function handleAPI(api: any) {
    const index = ++papudocIndex
    const call = findCall(index)
    if (!call) throw new Error('Failed to find papudoc call')

    const checker = program.getTypeChecker()
    //console.log(call)
    console.log('xx')
    for (const singleAPI of findAPIs(api)) {
      const v = findValueAtPath(call.arguments[0], singleAPI.path)
      if (!v) throw new Error('Failed to find value')
      console.log({
        url: getURL(singleAPI.route),
        ...singleAPI.route.apiUrlParameters,
        response: formatType(checker, getTypeParameterFor(v, 'response')!),
        body: formatType(checker, getTypeParameterFor(v, 'body')!)
      })

      break // TODO: do all

    }




    function getURL(route: any) {
      // TODO: __parent is not at all available
      route.__parent.configure({ baseURL: '' })
      const params: string[] = route.apiUrlParameters.params
      const paramObj: any = {}
      for (const param of params) {
        paramObj[param] = ':' + param
      }
      return route.getURL(paramObj)
    }

    function findCall(targetIndex: number) {
      let atIndex = -1
      return ts.forEachChild(file!, node => checkNode(node))

      function checkNode(node: ts.Node): ts.CallExpression | undefined {

        if (ts.isCallExpression(node)) {

          const identifier = node.forEachChild(child => ts.isIdentifier(child) && child)
          if (identifier && identifier?.escapedText === 'papudoc') {
            ++atIndex
            if (atIndex === targetIndex) return node
          }
        }

        return node.forEachChild(node => checkNode(node))

      }
    }

    function findValueAtPath(node: ts.Node, path: string[]): ts.Symbol | null {
      const members = checker.getTypeAtLocation(node).getSymbol()?.members
      if (!members) return null
      const member = members.get(path[0] as any)
      if (!member) return null
      if (path.length === 1) return member
      return findValueAtPath(member.valueDeclaration, path.slice(1))
    }

    function getTypeParameterFor(symbol: ts.Symbol, forType: string) {
      function ln(x: ts.Node, d = 0) {
        for (const c of x.getChildren()) {
          console.log(Array(d).fill(' ').join('') + c.kind + ' ' + c.pos)
          ln(c, d + 1)
        }
      }
      ln(symbol.valueDeclaration)

      const call = findCall(symbol.valueDeclaration)
      if (call) {
        return checker.getTypeAtLocation((call.parent.parent as ts.NodeWithTypeArguments).typeArguments?.[0]!)

      }
      return null

      function findCall(node: ts.Node): ts.Identifier | undefined {
        return node.forEachChild(child => {
          if (ts.isIdentifier(child)) {
            if (child.escapedText === forType) return child
          } else {
            return child.forEachChild(findCall)
          }
        })

      }
    }
  }
}

interface API {
  path: string[]
  route: any
}

function* findAPIs(api: any, currentPath: string[] = []): IterableIterator<API> {
  for (const [key, value] of Object.entries(api) as any[]) {
    if (value?.apiUrlParameters) {
      yield {
        path: [...currentPath, key],
        route: value
      }
    } else if (typeof value === 'object') {
      yield* findAPIs(value, [...currentPath, key])
    }
  }
}

