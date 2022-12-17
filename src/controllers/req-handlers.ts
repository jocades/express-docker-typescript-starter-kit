import { Response, RequestHandler } from 'express'
import { Model } from 'mongoose'

type IResponse = (res: Response, query: object | object[] | null, props?: object) => Response

type IReqHandler = (Model: Model<any, {}, any>) => RequestHandler

export const notFound = (res: Response, doc?: string) => {
  return res.status(404).send({ message: `No ${doc ?? 'object'} found with the given ID.` })
}

export const response: IResponse = (res, query, props) => {
  if (!query) return notFound(res)
  return res.send(props ?? query)
}

const list: IReqHandler = (Model) => async (_, res) => {
  const query = await Model.find()
  res.send(query)
}

const createOne: IReqHandler = (Model) => async (req, res) => {
  const query = new Model(req.body)
  await query.save()
  res.status(201).send(query)
}

const getOne: IReqHandler = (Model) => async (req, res) => {
  const query = await Model.findById(req.params.id)
  response(res, query)
}

const updateOne: IReqHandler = (Model) => async (req, res) => {
  const { id } = req.params
  const query = await Model.findByIdAndUpdate(id, req.body, { new: true })

  response(res, query, { ...req.body, _id: query._id })
}

const deleteOne: IReqHandler = (Model) => async (req, res) => {
  const query = await Model.findByIdAndDelete(req.params.id)
  if (!query) return notFound(res)

  res.sendStatus(204)
}

export default {
  list,
  createOne,
  getOne,
  updateOne,
  deleteOne,
}
