import React from 'react'
import { AnalyzedAPI } from "../../analyzer";
import Section from './Section';
import TypeRenderer from '../TypeRenderer/TypeRenderer';

interface Props {
  api: AnalyzedAPI
}

export default function Body({ api }: Props) {
  if (!api.bodyType) return null
  return <Section heading={'Body'}>
    <div>Full signature: {api.body}</div>
    <TypeRenderer type={api.bodyType} />
  </Section>
}