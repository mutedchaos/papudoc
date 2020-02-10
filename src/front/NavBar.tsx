import { Analysis } from "../analyzer";
import React from "react";
import pathToAnchor from "./utils/pathToAnchor";
import styled from "styled-components";

interface Props {
  analysis: Analysis;
  title: string
}

const Title = styled.div`
  text-align: center;
  padding: 4px;
  /*background: #7610c3;*/
  background:  #cce;
  position: relative;
  overflow: hidden;
  font-family: sans-serif;

  &::after {
    position: absolute;
    content: '';
    background: #7610c3;    
    height: 40px;
    width: 50px;
    margin-left: 16px;
    margin-top: -10px;
    transform: skewX(-28deg);

  }
  `

export default function NavBar({ analysis, title }: Props) {
  return (
    <>
      <Title>{title}</Title>
      <ul id="navbar">
        {analysis.map(entry => (<div key={entry.api.path.join(".")}>
          <a

            href={`#${pathToAnchor(entry.api.path)}`}
          >
            {entry.api.path.join("/")}
          </a>
        </div>
        ))}
      </ul>
    </>
  );
}
