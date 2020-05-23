import { APIDeclaration } from 'papupata'
import { papudoc } from '../papudoc'
import { Named, TestType } from './ext'

const decl = new APIDeclaration()

const api = {
  api1: decl.declareGetAPI('api1').response<Named>(),
  api2: decl.declareGetAPI('api1').response<TestType<number>>(),
}

papudoc(api)
