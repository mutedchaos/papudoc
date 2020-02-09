import React from "react";
import { AnalyzedAPI } from "../../analyzer";

interface Props {
  api: AnalyzedAPI;
}

export default function BasicDetails({ api }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <td>URL</td>
          <td>{api.url}</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Method</td>
          <td>{api.method}</td>
        </tr>
      </tbody>
    </table>
  );
}
