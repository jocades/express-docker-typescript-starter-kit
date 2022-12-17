import { createLogger, transports, format } from 'winston'
import ConsoleTransport from './lib/winston-console'

const devEnv = process.env.NODE_ENV?.includes('dev')
const exceptionTransport = new transports.File({ filename: './logs/exceptions.log' })

const logger = createLogger({
  level: devEnv ? 'silly' : 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.json(),
    format.prettyPrint()
  ),

  transports: [
    new transports.File({ filename: './logs/errors.log', level: 'error' }),
    new ConsoleTransport({ handleExceptions: true, handleRejections: true }),
  ],

  exceptionHandlers: [exceptionTransport],
  rejectionHandlers: [exceptionTransport],
  exitOnError: true,
})

if (process.env.NODE_ENV === 'test') {
  logger.silent = true
}

export default logger
