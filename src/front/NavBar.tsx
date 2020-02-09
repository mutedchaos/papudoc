import { Analysis } from "../analyzer";
import React from "react";
import pathToAnchor from "./utils/pathToAnchor";

interface Props {
  analysis: Analysis;
}

export default function NavBar({ analysis }: Props) {
  return (
    <ul id="navbar">
      {analysis.map(entry => (<div key={entry.api.path.join(".")}>
        <a

          href={`#${pathToAnchor(entry.api.path)}`}
        >
          {entry.api.path.join("/")}
        </a>
      </div>
      ))}
    </ul>
  );
}
