import Transport from 'winston-transport'

// Winston console transport with colorized output matching the log level
const levelStyleMap: { [key: string]: string } = {
  error: '\x1b[41m%s\x1b[0m',
  warn: '\x1b[33m%s\x1b[0m',
  info: '\x1b[94m%s\x1b[0m',
  verbose: '\x1b[35m%s\x1b[0m',
  debug: '\x1b[32m%s\x1b[0m',
  silly: '\x1b[36m%s\x1b[0m',
}

export default class ConsoleTransport extends Transport {
  log(info: any, callback: { (): void }) {
    const label = info.consoleLoggerOptions?.label! || (info.level as string)
    const finalMessage = `[${label}] ${info.message}`

    console.log(levelStyleMap[info.level], finalMessage)
    callback()
  }
}
