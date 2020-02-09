import { Analysis } from "../analyzer";
import React from "react";
import APIView from "./ApiView/APIView";

interface Props {
  analysis: Analysis
}

export default function SinglePageApiList({ analysis }: Props) {
  return <>
    {analysis.map(entry => <APIView key={entry.api.path.join('/')} api={entry} />)}
  </>
}