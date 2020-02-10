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
import Heading from "./Heading";

interface Props {
  api: AnalyzedAPI;
}


export default function APIView({ api }: Props) {
  return (
    <div id={pathToAnchor(api.api.path)}>
      <CheckerContext.Provider value={api.checker}>
        <NamedTypesProvider api={api}>
          <Heading api={api} />
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
