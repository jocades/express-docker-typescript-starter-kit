import logger from '../logger'
import db from './database'

// https://www.npmjs.com/package/express-async-errors
import 'express-async-errors' // no declaration file available

process.on('SIGINT', async () => {
  try {
    await db.close()
    console.log('\n') // this messes up the console output when using yarn
    logger.info('Keyboard interrupt, gracefully shutting down')
    process.exit(0)
  } catch (err) {
    logger.error('Failed shutting down gracefully', err)
    process.exit(1)
  }
})

// !! EXCEPTIONS AND REJECTIONS ARE HANDLED BY WINSTON in logger.ts !!
// if you want to handle them yourself, uncomment the following code:

// process.on('uncaughtException', (err: Error) => {
//   logger.error(err.message, err)
//   process.exit(1)
// })

// process.on('unhandledRejection', (err: Error) => {
//   logger.error(err.message, err)
//   process.exit(1)
// })
