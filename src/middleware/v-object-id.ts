import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'

export default (req: Request, res: Response, next: NextFunction) => {
  if (!Types.ObjectId.isValid(req.params.id))
    return res.status(404).send('Invalid object ID.')

  next()
}
