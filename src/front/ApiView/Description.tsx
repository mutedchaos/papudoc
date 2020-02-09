import { ReactNode } from "react";
import React from "react";
import styled from "styled-components";

interface Props {
  children: ReactNode;
}

const Container = styled.div`
  display: flex;
`;

const Prefix = styled.div`
  font-size: 10px;
  background: #BBF;
  padding-top: 3px;
  margin-right: 4px;
`

export default function Description({ children }: Props) {
  return <Container><Prefix>Description</Prefix><span>{children}</span></Container>;
}
