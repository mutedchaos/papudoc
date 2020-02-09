import { APIDeclaration } from 'papupata'
import { papudoc } from '../papudoc'

const decl = new APIDeclaration()

interface InterfaceHere {
  key: string
}
const api = {
  //testGet: decl.declareGetAPI('/test-get').response<string[]>(),
  //testGet: decl.declareGetAPI('/test-get').response<{ key: string, value: number }>(),
  testGet: decl.declareGetAPI('/test-get')
    .body<string>()
    .response<Array<Omit<{ key: string, value: number }, 'key'>>[]>(),

}

papudoc(api)

const extra = {
  deep: {
    testPost: decl.declareGetAPI('/test-get').body<InterfaceHere>().response<string>()
  }
}