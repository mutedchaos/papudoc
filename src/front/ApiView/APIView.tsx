import React from 'react'
import { AnalyzedAPI } from "../../analyzer";
import BasicDetails from './BasicDetails';
import PathParameters from './PathParameters';
import QueryParameters from './QueryParameters';
import Body from './Body'
import Response from './Response'
import { CheckerContext } from '../CheckerContext';

interface Props {
  api: AnalyzedAPI
}

export default function APIView({ api }: Props) {
  return (<div>
    <CheckerContext.Provider value={api.checker}>
      <h2>{api.api.path.join(' / ')}</h2>
      <BasicDetails api={api} />
      <PathParameters api={api} />
      <QueryParameters api={api} />
      <Body api={api} />
      <Response api={api} />
    </CheckerContext.Provider>
  </div>
  )
}