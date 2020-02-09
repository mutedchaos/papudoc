import React from 'react'
import { AnalyzedAPI } from "../../analyzer";

interface Props {
  api: AnalyzedAPI
}

export default function BasicDetails({ api }: Props) {
  return (<table>
    <tr>
      <td>URL</td>
      <td>{api.url}</td>
    </tr>
    <tr>
      <td>Method</td>
      <td>{api.method}</td>
    </tr>
  </table>
  )
}