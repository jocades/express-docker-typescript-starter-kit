import { Response, Request } from 'express'
import { Model } from 'mongoose'

type IModel = Model<any, {}, any>

interface IRequest extends Request {
  params: { id: string }
}

export const notFound = (res: Response, doc?: string) => {
  return res.status(404).send({ message: `No ${doc ?? 'object'} found with the given ID.` })
}

export const response = (res: Response, query: object | object[], props?: object) => {
  if (!query) return notFound(res)
  return res.send(props ?? query)
}

export const list = (Model: IModel) => async (_: Request, res: Response) => {
  const query = await Model.find()
  res.send(query)
}

export const createOne = (Model: IModel) => async (req: Request, res: Response) => {
  const query = new Model(req.body)
  await query.save()

  res.status(201).send(query)
}

export const getOne = (Model: IModel) => async (req: IRequest, res: Response) => {
  const query = await Model.findById(req.params.id)
  return response(res, query)
}

export const updateOne = (Model: IModel) => async (req: IRequest, res: Response) => {
  const { id } = req.params
  const query = await Model.findByIdAndUpdate(id, req.body, { new: true })

  return response(res, query, { ...req.body, _id: query._id })
}

export const deleteOne = (Model: IModel) => async (req: IRequest, res: Response) => {
  const query = await Model.findByIdAndDelete(req.params.id)
  if (!query) return notFound(res)

  res.sendStatus(204)
}
