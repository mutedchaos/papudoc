import React from 'react'
import Section from './Section'
import SubSection from './SubSection'
import TypeRenderer from '../TypeRenderer/TypeRenderer'
import { useTypeRenderer } from '../TypeRendererContext'

export default function NamedTypes() {
  const { namedTypes } = useTypeRenderer()
  if (!namedTypes.length) return null
  return (
    <Section heading={'Named types'}>
      {namedTypes.map((namedType) => (
        <div key={namedType.hash} id={namedType.hash}>
          <SubSection heading={namedType.name}>
            <TypeRenderer type={namedType} />
          </SubSection>
        </div>
      ))}
    </Section>
  )
}
