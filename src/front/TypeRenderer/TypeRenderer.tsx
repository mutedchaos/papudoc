import ts from "typescript";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import MemberTable from "../ApiView/MemberTable";
import { useChecker } from "../CheckerContext";
import { NamedTypesContext } from "../NamedTypesContext";
import compact from "lodash/compact";

interface Props {
  type: ts.Type;
  isTopLevel: boolean;
  contextName: string[];
  containingType: ts.Type | null;
}

type Renderer = (props: Props) => ReactElement;

export default function TypeRenderer(props: Props) {
  const { type } = props;
  const handlers: Map<ts.TypeFlags, Renderer | string> = new Map<
    ts.TypeFlags,
    Renderer | string
  >([
    [ts.TypeFlags.Any, "any"],
    [ts.TypeFlags.Unknown, "unknown"],
    [ts.TypeFlags.String, "string"],
    [ts.TypeFlags.Number, "number"],
    [ts.TypeFlags.Boolean, "boolean"],
    [ts.TypeFlags.Boolean | ts.TypeFlags.Union, "boolean"],
    [ts.TypeFlags.Enum | ts.TypeFlags.Union, "enum"],
    [ts.TypeFlags.EnumLiteral | ts.TypeFlags.Union, "enumliteral"],
    [ts.TypeFlags.Void, "void"],
    [ts.TypeFlags.Undefined, "undefined"],
    [ts.TypeFlags.Null, "null"],
    [ts.TypeFlags.Never, "never"],
    [ts.TypeFlags.BigInt, "bigint"],
    [ts.TypeFlags.StringLiteral, StringLiteral],
    [ts.TypeFlags.NumberLiteral, (type as ts.LiteralType).value?.toString()],
    [ts.TypeFlags.BooleanLiteral, BooleanLiteral],
    [ts.TypeFlags.Object, TypeObject],

    [ts.TypeFlags.Union, Union],
    [ts.TypeFlags.Intersection, Intersection]
  ]);

  const Handler = handlers.get(type.flags);
  if (Handler) {
    if (typeof Handler === "string") return <span>{Handler}</span>;
    return <Handler {...props} />;
  }

  return <span>Cannot handle {type.flags}</span>;
}

function TypeObject(props: Props) {
  const { type, isTopLevel, containingType, contextName } = props;
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
  );
}

function Union({ type, contextName }: Props) {
  const union = type as ts.UnionOrIntersectionType;
  return (
    <div>
      <div>One of the following:</div>
      <ul>
        {union.types.map((type, i) => (
          <li key={i}>
            <TypeRenderer
              type={type}
              isTopLevel={false}
              containingType={type}
              contextName={[...contextName, "variant" + i]}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Intersection(props: Props) {
  const intersection = props.type as ts.UnionOrIntersectionType;
  return <TypeObject {...props} type={intersection} />;
}

function StringLiteral({ type }: Props) {
  return <span>"{(type as ts.LiteralType).value}"</span>;
}

function BooleanLiteral({ type }: Props) {
  //type => checker.typeToString(type)
  const checker = useChecker();
  return <span>{checker.typeToString(type)}</span>;
}

function TypeArray({ type, isTopLevel, contextName }: Props) {
  return (
    <div>
      Array of:{' '}
      <TypeRenderer
        type={(type as any).resolvedTypeArguments[0]}
        isTopLevel={isTopLevel}
        containingType={type}
        contextName={[...contextName, "item"]}
      />
    </div>
  );
}
