import Enzyme, { mount } from 'enzyme'

import React from 'react'
import fs from 'fs'
import { Analysis } from './analyzer'
import SinglePageFront from './front/SinglePageFront'
import path from 'path'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
// @ts-ignore
import Adapter from 'enzyme-adapter-react-16'

import { JSDOM } from 'jsdom'
import mkdirp from 'mkdirp'

const sheet = new ServerStyleSheet()
export default function generateFront(outDir: string, analysis: Analysis) {
  prepareEnzyme()
  //const reactCode = ReactDOMServer.renderToStaticMarkup(<StyleSheetManager sheet={sheet.instance}><SinglePageFront analysis={analysis} /></StyleSheetManager>)
  const wrapper = mount(
    <StyleSheetManager sheet={sheet.instance}>
      <SinglePageFront analysis={analysis} />
    </StyleSheetManager>
  )
  //const wrapper = mount(<SinglePageFront analysis={analysis} />)

  let numUpdates = 100
  while (--numUpdates) wrapper.update()

  const reactCode = wrapper.html()

  const styles = sheet.getStyleTags()
  const html = reactCode.replace('</head>', styles + '</head>')
  mkdirp.sync(outDir)
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8')
  fs.copyFileSync(__dirname + '/../src/front/assets/scripts.js', outDir + '/scripts.js')

  sheet.seal()
}

function prepareEnzyme() {
  Enzyme.configure({ adapter: new Adapter() })
  const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
  const { window } = jsdom

  function copyProps(src: any, target: any) {
    Object.defineProperties(target, {
      ...Object.getOwnPropertyDescriptors(src),
      ...Object.getOwnPropertyDescriptors(target),
    })
  }

  // @ts-ignore
  global.window = window
  // @ts-ignore
  global.document = window.document
  // @ts-ignore
  global.navigator = {
    userAgent: 'node.js',
  }
  // @ts-ignore
  global.requestAnimationFrame = function (callback) {
    return setTimeout(callback, 0)
  }
  // @ts-ignore
  global.cancelAnimationFrame = function (id) {
    clearTimeout(id)
  }
  copyProps(window, global)
}
