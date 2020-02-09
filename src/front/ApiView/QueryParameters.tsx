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
      type: "string"
    })),
    ...api.optionalQuery.map(q => ({
      name: q,
      required: false,
      type: "string"
    })),
    ...api.boolQuery.map(q => ({
      name: q,
      required: true,
      type: '"true" or "false"'
    }))
  ].sort((a, b) => a.name.localeCompare(b.name));

  if (!members.length) return null;
  return (
    <Section heading={"Query parameters"}>
      <MemberTable members={members} />
    </Section>
  );
}
