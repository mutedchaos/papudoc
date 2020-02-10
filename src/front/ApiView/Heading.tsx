import React from "react";
import styled from "styled-components";
import { AnalyzedAPI } from "../../analyzer";
import pathToAnchor from "../utils/pathToAnchor";

interface Props {
  api: AnalyzedAPI
}


const Container = styled.h2`
  display: flex;
  padding: 20px;
  background: #cce;
  margin: 30px 0;
  font-family: sans-serif;
  align-items: stretch;
  padding: 0;
`

const Name = styled.div`
  flex-grow: 2;
  padding: 25px;
`

const Separator = styled.div`
  position: relative;
  overflow: hidden;
  width: 50px;
  &::after {
    position: absolute;
    content: '';
    background: #7610c3;    
    height: 100px;
    width: 200px;
    margin-left: 24px;
    transform: skewX(-28deg);

  }
`

const Details = styled.div`
  flex-grow: 3;
  background: #7610c3;
  color: white;
  font-size: 16px;
  font-weight: normal;
  text-align: right;
  padding: 30px 15px;
`


export default function Heading({ api }: Props) {
  return <Container data-anchor={pathToAnchor(api.api.path)}>
    <Name>{api.api.path.join(' / ')}</Name>
    <Separator />
    <Details>{api.method?.toUpperCase()} {api.url}</Details>
  </Container>

}