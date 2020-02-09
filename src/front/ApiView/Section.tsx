import { ReactNode } from "react";
import React from "react";

interface Props {
  children: ReactNode
  heading: ReactNode
}

export default function Section({ heading, children }: Props) {
  return <div>
    <h3>{heading}</h3>
    <div>
      {children}
    </div>
  </div>
}