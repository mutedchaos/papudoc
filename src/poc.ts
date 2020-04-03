import { analyze } from './analyzer'
import generateFront from './generateFront'
import { PapudocConfig } from './config'

const filename = __dirname + '/demo/api.ts'
const config: PapudocConfig = {
  sourceFiles: [filename],
  baseDir: __dirname + '/..',
  outDir: 'output',
}
generateFront(__dirname + '/../output', analyze(config, filename))
