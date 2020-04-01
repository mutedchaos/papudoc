import React from 'react'
import TsType from '../../typeAnalyzer/TsType'
import { useTypeRenderer } from '../TypeRendererContext'

interface Props {
  type: TsType
}

export default function TypeRenderer(props: Props) {
  const trc = useTypeRenderer()
  return <div>{trc.renderType( props.type)}</div>
}
