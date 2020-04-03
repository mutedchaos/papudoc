import { generatePapudoc } from './api'
import 'ts-node/register/transpile-only'

async function run() {
  const configFile = process.argv[2]
  generatePapudoc(configFile)
}

run().catch((err: any) => {
  console.error(err.stack || err)
  process.exit(1)
})
