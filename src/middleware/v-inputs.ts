import { Request, Response, NextFunction } from 'express'

export default (validate: any) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send({ message: error.details[0].message })

  next()
}
