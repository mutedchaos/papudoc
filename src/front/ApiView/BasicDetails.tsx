import React from "react";
import { AnalyzedAPI } from "../../analyzer";

interface Props {
  api: AnalyzedAPI;
}

export default function BasicDetails({ api }: Props) {
  if (!api.description) return null
  return <p>{api.description}</p>
}
