import React from "react";
import { AnalyzedAPI } from "../../analyzer";
import Section from "./Section";
import TypeRenderer from "../TypeRenderer/TypeRenderer";

interface Props {
  api: AnalyzedAPI;
}

export default function Response({ api }: Props) {
  if (!api.responseType) return null;
  return (
    <Section heading={"Response"}>
      <TypeRenderer
        type={api.responseType}
        isTopLevel={true}
        contextName={["response"]}
        containingType={null}
      />
    </Section>
  );
}
