import { APIDeclaration } from "papupata";
import { papudoc } from "../papudoc";

const decl = new APIDeclaration();

interface InterfaceHere {
  key: string;
}

enum MyEnum {
  alpha,
  beta,
  gamma
}
const api = {
  //testGet: decl.declareGetAPI('/test-get').response<string[]>(),
  //testGet: decl.declareGetAPI('/test-get').response<{ key: string, value: number }>(),

  /** 
   * @param id This is the id for the thing 
  * @param gamma is also kinda cool  
  * */
  testGet: decl
    .declareGetAPI("/test-get/:id")
    .params([
      "id",
      "alsodesc",
      "nodesc"
    ] as const)
    .query(["alpha"] as const)
    .optionalQuery(["gamma"] as const)
    .queryBool(["beta"] as const)
    .body<{
      /** @description This is a number. */
      number: number;
      string: string;
      boolean: boolean;
      undefined: undefined;
      unknown: unknown;
      null: null;
      never: never;
      conststring: "conststring";
      constnumber: 999;
      union: string | number;
      inlineinterface: { key: string };
      stringarray: string[];
      enumref: MyEnum;
      namedinterface: InterfaceHere;
      optionalstring?: string;
      constboolean: false;
      intersection: { key: string } & { another: number };
      tuple: [string, number, boolean];
      method(): void;
      function: () => void;
      deeper: {
        has: {
          a: {
            field: string
          }
        }
      }
    }>()
    .response<Array<Omit<{ key: string; value: number }, "key">>[]>()
  ,
  deep: {
    testPost: decl
      .declareGetAPI("/test-get")
      .body<InterfaceHere>()
      .response<string>()
  }
};

papudoc(api);

export const extra = {
  deep: {
    testPost: decl
      .declareGetAPI("/test-get")
      .body<InterfaceHere>()
      .response<string>()
  }
};
