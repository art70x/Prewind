import { red, cyan, yellow, green, gray } from 'yoctocolors'
import cliSpinners from 'cli-spinners'
import yoctoSpinner from 'yocto-spinner'

type LogLevel = 'info' | 'success' | 'warn' | 'error'
type Logger = {
  spinner: ReturnType<typeof yoctoSpinner>
  info: (msg: string) => void
  success: (msg: string) => void
  warn: (msg: string) => void
  error: (msg: string | Error) => void
  log: (msg: string, level?: LogLevel) => void
  withSpinner: <T>(text: string, task: () => Promise<T> | T) => Promise<T>
}

export function createLogger(): Logger {
  const spinner = yoctoSpinner({ spinner: cliSpinners.dots, color: 'blue' })

  function format(level: LogLevel, msg: string) {
    const symbol =
      level === 'success' ? '✔' : level === 'warn' ? '⚠' : level === 'error' ? '✖' : 'ℹ'

    const color =
      level === 'success' ? green : level === 'warn' ? yellow : level === 'error' ? red : cyan

    return `${gray(new Date().toLocaleTimeString())} ${color(symbol)} ${color(msg)}`
  }

  async function withSpinner<T>(text: string, task: () => Promise<T> | T): Promise<T> {
    spinner.start(text)
    try {
      const result = await Promise.resolve(task())
      spinner.success(text)
      return result
    } catch (err: any) {
      spinner.error(text)
      console.error(format('error', err.message || String(err)))
      throw err
    }
  }

  return {
    spinner,

    log(msg, level = 'info') {
      if (spinner.isSpinning) spinner.stop()
      console.log(format(level, msg))
    },

    info(msg) {
      this.log(msg, 'info')
    },

    success(msg) {
      this.log(msg, 'success')
    },

    warn(msg) {
      this.log(msg, 'warn')
    },

    error(msg) {
      if (spinner.isSpinning) spinner.stop()
      const message = msg instanceof Error ? msg.message : msg
      console.error(format('error', message))
    },

    withSpinner,
  }
}
