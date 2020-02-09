import ts from "typescript";
import React, { useContext } from "react";

export const CheckerContext = React.createContext<ts.TypeChecker>(null as any);

export const useChecker = () => useContext(CheckerContext);
