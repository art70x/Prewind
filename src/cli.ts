#!/usr/bin/env node
import { program } from 'commander'
import { processFiles } from './core/processor.js'
import { createLogger } from './utils/logger.js'

const log = createLogger()

program
  .name('prewind')
  .alias('pw')
  .version('v1.0.0')
  .description(
    'Expand Tailwind shorthand like hover(bg-blue-500 text-blue-50) → hover:bg-blue-500 hover:text-blue-50.',
  )
  .argument('<patterns...>', 'File paths or glob patterns to process')
  .option('-w, --write', 'Overwrite files in place')
  .option('-o, --out <dir>', 'Output directory for transformed files')
  .configureHelp({ sortOptions: true })
  .action(async (patterns, options) => {
    try {
      await log.withSpinner('Processing files...', async () => {
        await processFiles(patterns, options)
      })
      log.success('All files processed successfully!')
    } catch (err) {
      log.error(err as Error)
      process.exit(1)
    }
  })

program.parseAsync(process.argv)
