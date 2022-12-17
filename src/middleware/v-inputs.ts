import { RequestHandler } from 'express'
import { ValidationResult } from 'joi'
import logger from '../logger'

type Validator = (body: any) => ValidationResult
type VInputs = (validator: Validator) => RequestHandler

const validateInputs: VInputs = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body)

    if (error) {
      const message = error?.details[0].message as string

      process.env.NODE_ENV?.includes('dev') &&
        logger.debug(`${message} - ${error}`, { mw: 'v-inputs' })

      return res.status(400).send({ message })
    }

    next()
  }
}

export default validateInputs
