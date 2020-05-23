interface TT<T>
{
  fv: T
   }

export interface TestType<T> {
  field: {
    value: TT<T>
  }
}

export type Named = TestType<string>
