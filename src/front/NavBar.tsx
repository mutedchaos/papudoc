import { Analysis } from "../analyzer";
import React from "react";

interface Props {
  analysis: Analysis
}

export default function NavBar({ analysis }: Props) {
  return <ul>
    {analysis.map(() => <span>ntryu</span>)}
  </ul>
}