#!/usr/bin/env node
import { program } from 'commander'
import fg from 'fast-glob'
import fs from 'fs/promises'
import path from 'path'
import { transformFileContent } from './transform'

program
  .name('prewind')
  .alias('pw')
  .version('v1.0.0')
  .description(
    'Expand Tailwind shorthand like hover(bg-blue-500 text-blue-50) into hover:bg-blue-500 hover:text-blue-50.',
  )
  .argument('<patterns...>', 'File paths or glob patterns to process')
  .option('-w, --write', 'Overwrite files in place')
  .option('-o, --out <dir>', 'Output directory for transformed files')
  .option('--debug', 'Show detailed transformation tree')
  .configureHelp({sortOptions: true})
  .action(async (patterns, options) => {
    const files = await fg(patterns, { absolute: true })

    if (!files.length) {
      console.error('No files matched the given pattern(s).')
      process.exit(1)
    }

    for (const file of files) {
      const raw = await fs.readFile(file, 'utf8')
      const transformed = transformFileContent(raw, options.debug)
      if (options.debug) {
        console.log(`\n--- DEBUG: ${path.relative(process.cwd(), file)} ---`)
      }
      if (options.write) {
        await fs.writeFile(file, transformed, 'utf8')
        console.log(`Updated ${path.relative(process.cwd(), file)}`)
        continue
      }
      if (options.out) {
        const relPath = path.relative(process.cwd(), file)
        const outPath = path.join(options.out, relPath)
        await fs.mkdir(path.dirname(outPath), { recursive: true })
        await fs.writeFile(outPath, transformed, 'utf8')
        console.log(`Wrote ${path.relative(process.cwd(), outPath)}`)
        continue
      }
      console.log(`\n--- ${path.relative(process.cwd(), file)} ---\n`)
      console.log(transformed)
    }
  })

program.parseAsync(process.argv)
