import React, { useMemo } from "react";
import { Analysis } from "../analyzer";
import Layout from "./Layout";
import fs from 'fs'
import path from 'path'

interface Props { analysis: Analysis }

export default function SinglePageFront({ analysis }: Props) {
  const pageTitle = useMemo(determinePageTitle, [])

  return <html>
    <head>
      <title>{pageTitle}}</title>
      <script src="scripts.js"></script>
    </head>
    <body>
      <Layout navbar={<span>navbar</span>} content={<h1>{pageTitle}</h1>} />
    </body>
  </html>
}

function determinePageTitle() {
  const packageJSON = findPackageJsonFrom(process.cwd())
  return packageJSON.name + ' APIs'

  function findPackageJsonFrom(dir: string): { name: string } {
    const filename = path.join(dir, 'package.json')
    if (fs.existsSync(filename)) return require(filename)
    return findPackageJsonFrom(path.join(dir, '..'))
  }
}
