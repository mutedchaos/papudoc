import { loadConfig, PapudocConfig } from './config'
import generateFront from './generateFront'
import { Analysis, analyze } from './analyzer'
import getRequireableFilename from './util/getRequirableFilename'
import { papudoc as handlePapudoc } from './papudoc'

export function generatePapudoc(configOrConfigFile?: string | PapudocConfig) {
  const config: PapudocConfig =
    !configOrConfigFile || typeof configOrConfigFile === 'string' ? loadConfig(configOrConfigFile) : configOrConfigFile

  const analysisSet = config.sourceFiles.map((filename) =>
    analyze(config, getRequireableFilename(config.baseDir || process.cwd(), filename))
  )

  const analysis = combineAnalysis(analysisSet)
  generateFront(config.outDir || './papudoc', analysis)
}

function combineAnalysis(analysisSet: Analysis[]) {
  return ([] as Analysis).concat(...analysisSet)
}

export const papudoc = handlePapudoc
