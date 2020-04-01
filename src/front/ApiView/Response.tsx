import React from 'react'
import { AnalyzedAPI } from '../../analyzer'
import Section from './Section'
import TypeRenderer from '../TypeRenderer/TypeRenderer'

interface Props {
  api: AnalyzedAPI
}

export default function Response({ api }: Props) {
  if (!api.responseTsType) return null
  return (
    <Section heading={'Response'}>
      <TypeRenderer type={api.responseTsType} />
    </Section>
  )
}
