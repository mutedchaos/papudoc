import React from 'react'
import {AnalyzedAPI} from '../../analyzer'
import BasicDetails from './BasicDetails'
import PathParameters from './PathParameters'
import QueryParameters from './QueryParameters'
import Body from './Body'
import Response from './Response'
import pathToAnchor from '../utils/pathToAnchor'
import Heading from './Heading'

interface Props {
  api: AnalyzedAPI
}

export default function APIView({ api }: Props) {
  return (
    <div id={pathToAnchor(api.api.path)}>
      <Heading api={api} />
      <BasicDetails api={api} />
      <PathParameters api={api} />
      <QueryParameters api={api} />
      <Body api={api} />
      <Response api={api} />
    </div>
  )
}
