import { Analysis } from '../analyzer'
import React from 'react'
import APIView from './ApiView/APIView'
import styled from 'styled-components'
import { TypeRendererContextProvider } from './TypeRendererContext'
import NamedTypes from './ApiView/NamedTypes'

interface Props {
  analysis: Analysis
}

const Container = styled.div`
  margin-bottom: 300px;
`

export default function SinglePageApiList({ analysis }: Props) {
  return (
    <Container>
      <TypeRendererContextProvider analysis={analysis}>
        {analysis.map((entry) => (
          <React.Fragment key={entry.api.path.join('/')}>
            <APIView api={entry} />
          </React.Fragment>
        ))}
        <NamedTypes />
      </TypeRendererContextProvider>
    </Container>
  )
}
