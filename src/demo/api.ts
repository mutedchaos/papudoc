import { APIDeclaration } from 'papupata'
import { papudoc } from '../papudoc'

const decl = new APIDeclaration()

interface InterfaceHere {
  key: string
}

const api = {
  testGet: decl.declareGetAPI('/test-get').response<InterfaceHere>(),

}

papudoc(api)

const extra = {
  deep: {
    testPost: decl.declareGetAPI('/test-get').body<InterfaceHere>().response<string>()
  }
}