import { APIDeclaration } from 'papupata'
import { papudoc } from '../papudoc'
import { TestType, Named } from './ext'

const decl = new APIDeclaration()

interface TestType2<A, B> {
  field: {
    fieldA: A
    fieldB: B
  }
}

type Named2 = TestType2<string, number>

const api = {
  //api1: decl.declareGetAPI('api1').response<Named>(),
  //api2: decl.declareGetAPI('api2').response<TestType<number>>(),
  // api3: decl.declareGetAPI('api3').response<TestType<number>['field']>(),
  //api4: decl.declareGetAPI('api3').response<TestType2<number, string>['field']>(),
  api5: decl.declareGetAPI('api3').response<Named['field']>(),
}

papudoc(api)
