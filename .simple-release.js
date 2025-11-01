import { Releaser } from '@simple-release/core'
import { PnpmProject } from '@simple-release/pnpm'

await new Releaser({
  project: new PnpmProject(),
})
  .bump()
  .commit()
  .tag()
  .push()
  .publish()
  .run()
