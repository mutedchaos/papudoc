import React, { useContext } from "react";
import Section from "./Section";
import { NamedTypesContext } from "../NamedTypesContext";
import SubSection from "./SubSection";
import TypeRenderer from "../TypeRenderer/TypeRenderer";

/*interface Props {
}*/

export default function NamedTypes() {
  const namedTypes = useContext(NamedTypesContext);
  if (!namedTypes.types.length) return null;
  return (
    <Section heading={"Named types"}>
      {namedTypes.types.map((namedType, i) => (
        <div key={i} id={namedType.hash}>
          <SubSection
            heading={namedType.displayName || namedType.contextName.join(":")}
          >
            <TypeRenderer
              type={namedType.type}
              contextName={namedType.contextName}
              containingType={namedType.parent}
              isTopLevel={true}
            />
          </SubSection>
        </div>
      ))}
    </Section>
  );
}
