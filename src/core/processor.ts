import fg from 'fast-glob'
import fs from 'fs/promises'
import path from 'path'
import { createLogger } from '../utils/logger.js'
import { ensureDir } from '../utils/fs-utils.js'
import { transform } from './transform.js'

const log = createLogger()

export async function processFiles(
  patterns: string[],
  options: { write?: boolean; out?: string; debug?: boolean },
) {
  const files = await fg(patterns, { absolute: true })

  if (!files.length) {
    log.error('No files matched the given pattern(s).')
    process.exit(1)
  }

  log.info(`Found ${files.length} file(s).`)

  for (const file of files) {
    const rel = path.relative(process.cwd(), file)

    await log.withSpinner(`Processing ${rel}`, async () => {
      const raw = await fs.readFile(file, 'utf8')
      const transformed = transform(raw)

      if (options.write) {
        await fs.writeFile(file, transformed, 'utf8')
        log.success(`Updated ${rel}`)
      } else if (options.out) {
        const outPath = path.join(options.out, rel)
        await ensureDir(path.dirname(outPath))
        await fs.writeFile(outPath, transformed, 'utf8')
        log.success(`Wrote to ${outPath}`)
      } else {
        log.info(`Preview of ${rel}`)
        console.log('\n' + transformed + '\n')
      }
    })
  }

  log.success('All files processed successfully.')
}
