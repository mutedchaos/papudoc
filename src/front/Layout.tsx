import { ReactNode } from "react";
import styled from "styled-components";
import React from "react";

interface Props {
  navbar: ReactNode;
  content: ReactNode;
}

const MainContainer = styled.div`
  background: #eee;
`;

const NavBarContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 200px;
  overflow-y: auto;
  background: #eee;
`;

const ContentContainer = styled.div`
  background: white;
  padding: 20px 30px 30px 230px;
  max-width: 800px;
`;
export default function Layout({ navbar, content }: Props) {
  return (
    <MainContainer>
      <NavBarContainer>{navbar}</NavBarContainer>
      <ContentContainer>{content}</ContentContainer>
    </MainContainer>
  );
}
