import TsType, { Complexity, ReferencePreference } from '../TsType'
import ts from 'typescript'
import { AnalyzeTypeFn } from '../typeAnalyzer'
import React from 'react'
import compact from 'lodash/compact'

interface Property {
  name: string
  type: TsType
  required: boolean
  description?: string
}

export default class ObjectType extends TsType {
  private properties: Property[] = []

  constructor(type: ts.Type, checker: ts.TypeChecker, analyzeType: AnalyzeTypeFn) {
    super(type)
    this.properties = compact(
      type.getProperties().map((member) => {
        const valueType = checker.getTypeAtLocation(
          (member as any).syntheticOrigin?.valueDeclaration || member.valueDeclaration
        )
        const description = member.getJsDocTags().find((tag) => tag.name === 'description')?.text
        if (member.flags & ts.SymbolFlags.Method) return null
        return {
          name: member.name,
          type: analyzeType(valueType, checker),
          required: !(member.flags & ts.SymbolFlags.Optional),
          description,
        }
      })
    )
  }

  get complexity(): Complexity {
    return Complexity.Complex
  }

  toReact(
    referencePreference: ReferencePreference,
    renderLink: (toType: TsType, context: string[]) => React.ReactNode,
    context: string[]
  ) {}

  toTypeString(
    referencePreference: ReferencePreference,
    createReference: (toType: TsType, context: string[]) => void,
    context: string[]
  ): string {}
}

/*const { type, isTopLevel, containingType, contextName } = props;
  const [hash, setHash] = useState<null | { label: string; hash: string }>(
    null
  );
  const namedTypes = useContext(NamedTypesContext);

  if (type.getSymbol()?.name === "Array") return <TypeArray {...props} />;
  const checker = useChecker();
  const name = type.symbol?.name;
  const hasName = name && name !== "__type";

  useEffect(() => {
    if (!isTopLevel) {
      setHash(
        namedTypes.addType(
          type,
          hasName ? name : null,
          contextName,
          containingType
        )
      );
    }
  }, [isTopLevel]);

  if (!isTopLevel) {
    return (
      <div>
        <div>Object</div>
        <div>See: <a href={"#" + hash?.hash}>{hash?.label}</a></div>
      </div>
    );
  }

  const members = compact(
    type.getProperties().map(member => {
      const valueType = checker.getTypeAtLocation(
        (member as any).syntheticOrigin?.valueDeclaration ||
        member.valueDeclaration
      );
      const description = member
        .getJsDocTags()
        .find(tag => tag.name === "description")?.text;
      if (member.flags & ts.SymbolFlags.Method) return null;
      return {
        name: member.name,
        type: (
          <TypeRenderer
            type={valueType}
            isTopLevel={false}
            containingType={type}
            contextName={[...props.contextName, member.name]}
          />
        ),
        required: !(member.flags & ts.SymbolFlags.Optional),
        description
      };
    })
  );

  return (
    <div>
      <p>An object with the following fields:</p>
      <MemberTable members={members} />
    </div>
  );*/
