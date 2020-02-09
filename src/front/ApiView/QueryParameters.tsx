import React from "react";
import { AnalyzedAPI } from "../../analyzer";
import Section from "./Section";
import MemberTable from "./MemberTable";

interface Props {
  api: AnalyzedAPI;
}

export default function QueryParameters({ api }: Props) {
  const members = [
    ...api.query.map(q => ({
      name: q,
      required: true,
      type: "string",
      description: api.parameterDescriptions.get(q)
    })),
    ...api.optionalQuery.map(q => ({
      name: q,
      required: false,
      type: "string",
      description: api.parameterDescriptions.get(q)
    })),
    ...api.boolQuery.map(q => ({
      name: q,
      required: true,
      type: '"true" or "false"',
      description: api.parameterDescriptions.get(q)
    }))
  ].sort((a, b) => a.name.localeCompare(b.name));

  if (!members.length) return null;
  return (
    <Section heading={"Query parameters"}>
      <MemberTable members={members} />
    </Section>
  );
}
