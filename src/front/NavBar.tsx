import { Analysis } from "../analyzer";
import React from "react";
import pathToAnchor from "./utils/pathToAnchor";

interface Props {
  analysis: Analysis
}

export default function NavBar({ analysis }: Props) {
  return <ul>
    {analysis.map((entry) => <a key={entry.api.path.join('.')} href={`#${pathToAnchor(entry.api.path)}`}>{entry.api.path.join('/')}</a>)}
  </ul>
}