import { ReactNode } from "react";
import React from "react";
import styled from "styled-components";

interface Props {
  children: ReactNode;
}

const Container = styled.div`
  margin-left: 30px;
`

export default function Description({ children }: Props) {
  return <Container>{children}</Container>;
}
