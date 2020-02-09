import React, { ReactNode, useState, useCallback } from "react";
import ts from "typescript";
import { AnalyzedAPI } from "../analyzer";
import pathToAnchor from "./utils/pathToAnchor";

interface Props {
  api: AnalyzedAPI;
  children: ReactNode;
}

interface Ctx {
  addType(
    type: ts.Type,
    displayName: string | null,
    contextName: string[],
    parent: ts.Type | null
  ): { hash: string; label: string };
  types: Array<{
    type: ts.Type;
    displayName: string | null;
    contextName: string[];
    parent: ts.Type | null;
    hash: string;
  }>;
}

export const NamedTypesContext = React.createContext<Ctx>(null as any);

export function NamedTypesProvider({ api, children }: Props) {
  const [types, setTypes] = useState<Ctx["types"]>([]);

  const addType = useCallback(
    (
      type: ts.Type,
      displayName: string | null,
      contextName: string[],
      parent: ts.Type | null
    ) => {
      const hash = pathToAnchor([
        ...api.api.path,
        "__namedtype__",
        ...contextName
      ]);
      setTypes(types => [
        ...types,
        {
          type,
          displayName,
          contextName,
          parent,
          hash
        }
      ]);
      return { hash, label: displayName || contextName.join(":") };
    },
    []
  );

  return (
    <NamedTypesContext.Provider
      value={{
        types,
        addType
      }}
    >
      {children}
    </NamedTypesContext.Provider>
  );
}
