import React, { ReactNode } from 'react'
import MemberTableTheme from './MemberTableTheme'
import styled from 'styled-components'
import TsType from '../../typeAnalyzer/TsType'

interface Member {
  name: string
  required: boolean
  type: TsType | string
  description?: string
}

interface Props {
  members: Member[]
  renderType?: (type: TsType) => ReactNode
}

const Table = styled.table`
  font-family: sans-serif;
  width: 100%;
  border-collapse: collapse;
`

const Heading = styled.tr`
  text-align: left;
  th {
    padding-right: 15px;
    border-bottom: 1px solid black;
  }
`

const Row = styled.tr<{ even: boolean }>``

const MultiRow = styled.tbody<{ even: boolean }>`
  > tr {
    background: ${(props) => props.theme.background[props.even ? 'even' : 'odd']};
    > td {
      border-right: 1px solid white;
      border-bottom: 1px solid white;
      font-size: 12px;
      padding: 2px;
    }
    &:last-child {
      td {
        border-bottom: 2px solid white;
      }
    }
  }
  &:hover > tr {
    background: ${(props) => props.theme.background.hover[props.even ? 'even' : 'odd']};
  }
`

const Th = styled.th`
  font-size: 12px;
  background: #bbf;
  padding: 2px 2px;
`

export default function MemberTable({ members, renderType }: Props) {
  const useDescriptions = members.some((m) => m.description)
  return (
    <MemberTableTheme>
      <Table>
        <thead>
          <Heading>
            <Th>Name</Th>
            <Th>Required</Th>
            <Th>Type</Th>
            {useDescriptions && <Th>Description</Th>}
          </Heading>
        </thead>
        {members.map((member, i) => (
          <MultiRow key={i} even={i % 2 === 0}>
            <Row even={i % 2 === 0}>
              <td>{member.name}</td>
              <td>{member.required ? 'Yes' : 'No'}</td>
              <td>{typeof member.type === 'string' ? member.type : renderType!(member.type)}</td>
              {useDescriptions && <td>{member.description}</td>}
            </Row>
          </MultiRow>
        ))}
      </Table>
    </MemberTableTheme>
  )
}
