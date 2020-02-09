import ReactDOMServer from 'react-dom/server';

import React from 'react';
import fs from 'fs'
import { Analysis } from './analyzer';
import SinglePageFront from './front/SinglePageFront';
import path from 'path'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'


const sheet = new ServerStyleSheet()
export default function generateFront(outDir: string, analysis: Analysis) {
  const reactCode = ReactDOMServer.renderToStaticMarkup(<StyleSheetManager sheet={sheet.instance}><SinglePageFront analysis={analysis} /></StyleSheetManager>)


  const styles = sheet.getStyleTags()
  const html = reactCode.replace('</head>', styles + '</head>')
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8')
  fs.copyFileSync(__dirname + '/front/assets/scripts.js', outDir + '/scripts.js')

  sheet.seal()
}