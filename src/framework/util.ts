import { Router, type RequestHandler } from 'express'
import handler from '../lib/controller-factory'
import { validate, validateId } from '../middleware'
import {
  AppRouteOptions,
  CustomHandlers,
  HTTPMethod,
  CommonMethod,
  CommonHandlers,
} from './types'

const map = {
  list: setupListHandler,
  create: setupCreateHandler,
  read: setupReadHandler,
  update: setupUpdateHandler,
  delete: setupDeleteHandler,
}

export function setupCommonHandlers(
  endpoint: string,
  router: Router,
  handlers: CommonHandlers<any>,
  options: AppRouteOptions
) {
  if (!options.middleware) {
    options.middleware = (req, res, next) => next()
  }

  router.use(endpoint, options.middleware)

  if (
    !options.methods ||
    options.methods.includes('all') ||
    options.methods.includes('*')
  ) {
    options.methods = ['list', 'create', 'read', 'update', 'delete']
  }

  for (const method of options.methods) {
    const handler = handlers[method as CommonMethod] as RequestHandler
    map[method as CommonMethod](endpoint, router, handler, options)
  }
}

export function setupCustomHandlers(
  ep: string,
  router: Router,
  customHandlers: CustomHandlers
) {
  for (const [path, handlers] of Object.entries(customHandlers)) {
    let middleware: RequestHandler | RequestHandler[] = []

    for (const [method, handler] of Object.entries(handlers)) {
      if (method === 'middleware') {
        middleware = handler
        continue
      }
      router[method as HTTPMethod](ep + path, middleware, handler)
    }
  }
}

const exampleRoute: RequestHandler = (req, res) => {
  res.json({
    method: req.method,
    path: req.path,
    params: req.params,
    query: req.query,
    body: req.body,
  })
}

const next: RequestHandler = (req, res, next) => next()

function setupListHandler(
  ep: string,
  router: Router,
  listHandler?: RequestHandler,
  options: AppRouteOptions = {}
) {
  listHandler
    ? router.get(ep, listHandler)
    : router.get(ep, options.model ? handler.list(options.model) : exampleRoute)
}

function setupCreateHandler(
  ep: string,
  router: Router,
  createHandler?: RequestHandler,
  options: AppRouteOptions = {}
) {
  createHandler
    ? router.post(
        ep,
        options.validator ? validate(options.validator) : next,
        createHandler
      )
    : router.post(
        ep,
        options.validator ? validate(options.validator) : next,
        options.model ? handler.createOne(options.model) : exampleRoute
      )
}

function setupReadHandler(
  ep: string,
  router: Router,
  readHandler?: RequestHandler,
  options: AppRouteOptions = {}
) {
  readHandler
    ? router.get(`${ep}/:id`, validateId, readHandler)
    : router.get(
        `${ep}/:id`,
        options.model
          ? [validateId, handler.getOne(options.model)]
          : exampleRoute
      )
}

function setupUpdateHandler(
  ep: string,
  router: Router,
  updateHandler?: RequestHandler,
  options: AppRouteOptions = {}
) {
  updateHandler
    ? router.put(
        `${ep}/:id`,
        validateId,
        options.validator ? validate(options.validator.partial()) : next,
        updateHandler
      )
    : router.put(
        `${ep}/:id`,
        options.model ? validateId : next,
        options.validator ? validate(options.validator.partial()) : next,
        options.model ? handler.updateOne(options.model) : exampleRoute
      )
}

function setupDeleteHandler(
  ep: string,
  router: Router,
  deleteHandler?: RequestHandler,
  options: AppRouteOptions = {}
) {
  deleteHandler
    ? router.delete(`${ep}/:id`, validateId, deleteHandler)
    : router.delete(
        `${ep}/:id`,
        options.model
          ? [validateId, handler.deleteOne(options.model)]
          : exampleRoute
      )
}
