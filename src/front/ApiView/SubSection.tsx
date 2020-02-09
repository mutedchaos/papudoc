import { ReactNode } from "react";
import React from "react";
import styled from "styled-components";

interface Props {
  children: ReactNode;
  heading: ReactNode;
}

const Head = styled.h4`
  font-size: 16px;
  background-color: #EEE;
`

export default function SubSection({ heading, children }: Props) {
  return (
    <div>
      <Head>{heading}</Head>
      <div>{children}</div>
    </div>
  );
}
