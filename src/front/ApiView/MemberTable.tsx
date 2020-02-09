import React, { ReactNode } from "react";
import Description from "./Description";
import MemberTableTheme from "./MemberTableTheme";
import styled from "styled-components";

interface Member {
  name: string;
  required: boolean;
  type: ReactNode;
  description?: string;
}

interface Props {
  members: Member[];
}

const Table = styled.table`
  font-family: sans-serif;
  width: 100%;
`;

const Heading = styled.tr`
  text-align: left;
  th {
    padding-right: 15px;
    border-bottom: 1px solid black;
  }
`;

const Row = styled.tr<{ even: boolean }>`
  background: ${props => props.theme.background[props.even ? "even" : "odd"]};
  &:hover {
    background: ${props =>
    props.theme.background.hover[props.even ? "even" : "odd"]};
  }
  > td {
    border-right: 1px dotted #ccc;
    border-bottom: 1px dotted #ccc;
  }
`;

export default function MemberTable({ members }: Props) {
  return (
    <MemberTableTheme>
      <Table>
        <thead>
          <Heading>
            <th>Name</th>
            <th>Required</th>
            <th>Type</th>
          </Heading>
        </thead>
        <tbody>
          {members.map((member, i) => (
            <React.Fragment key={i}>
              <Row even={i % 2 === 0}>
                <td>{member.name}</td>
                <td>{member.required ? "Yes" : "No"}</td>
                <td>{member.type}</td>
              </Row>
              {member.description && (
                <Row even={i % 2 === 0}>
                  <td colSpan={3}>
                    <Description>{member.description}</Description>
                  </td>
                </Row>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </MemberTableTheme>
  );
}
