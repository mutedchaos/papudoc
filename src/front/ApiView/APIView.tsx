import React from "react";
import { AnalyzedAPI } from "../../analyzer";
import BasicDetails from "./BasicDetails";
import PathParameters from "./PathParameters";
import QueryParameters from "./QueryParameters";
import Body from "./Body";
import Response from "./Response";
import { CheckerContext } from "../CheckerContext";
import pathToAnchor from "../utils/pathToAnchor";
import { NamedTypesProvider } from "../NamedTypesContext";
import NamedTypes from "./NamedTypes";
import styled from "styled-components";

interface Props {
  api: AnalyzedAPI;
}

const Heading = styled.h2`
  padding: 20px;
  background: #cce;
  margin: 30px 0;
  font-family: sans-serif;
  position: relative;
  overflow: hidden;
  &::after {
    position: absolute;
    content: '';
    background: #7610c3;    
    height: 200px;
    width: 100%;
    top: -100px;
    margin-left: 150px;    
    transform: skewX(-28deg);

  }

`

export default function APIView({ api }: Props) {
  return (
    <div id={pathToAnchor(api.api.path)}>
      <CheckerContext.Provider value={api.checker}>
        <NamedTypesProvider api={api}>
          <Heading data-anchor={pathToAnchor(api.api.path)}>{api.api.path.join(" / ")}</Heading>
          <BasicDetails api={api} />
          <PathParameters api={api} />
          <QueryParameters api={api} />
          <Body api={api} />
          <Response api={api} />
          <NamedTypes />
        </NamedTypesProvider>
      </CheckerContext.Provider>
    </div>
  );
}
