import fs from 'fs/promises'
import path from 'path'

export async function ensureDir(dir: string) {
  await fs.mkdir(path.resolve(dir), { recursive: true })
}
