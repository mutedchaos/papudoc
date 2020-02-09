import { ReactNode } from "react";
import React from "react";

interface Props {
  children: ReactNode;
  heading: ReactNode;
}

export default function SubSection({ heading, children }: Props) {
  return (
    <div>
      <h4>{heading}</h4>
      <div>{children}</div>
    </div>
  );
}
