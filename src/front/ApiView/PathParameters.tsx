import React from "react";
import { AnalyzedAPI } from "../../analyzer";
import Section from "./Section";
import MemberTable from "./MemberTable";

interface Props {
  api: AnalyzedAPI;
}

export default function PathParameters({ api }: Props) {
  if (!api.params.length) return null;
  return (
    <Section heading={"Path parameters"}>
      <MemberTable
        members={api.params.map(param => ({
          name: param,
          required: true,
          type: "string",
          description: api.parameterDescriptions.get(param)
        }))}
      />
    </Section>
  );
}
