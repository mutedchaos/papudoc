import { ReactNode } from "react";
import React from "react";

interface Props {
  children: ReactNode
}

export default function Description({ children}: Props) {
return <div>{children}</div>
}