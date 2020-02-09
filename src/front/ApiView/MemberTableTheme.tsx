import { ReactNode } from "react";
import React from "react";
import { ThemeProvider } from "styled-components";

export default function MemberTableTheme({
  children
}: {
  children: ReactNode;
}) {
  const theme = {
    background: {
      even: "#EEF",
      odd: "#DDF",
      hover: {
        even: "#CCF",
        odd: "#CCF"
      }
    }
  };

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
