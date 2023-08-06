import express, { Application, RequestHandler, Router } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { z, AnyZodObject } from 'zod'
import { Model } from 'mongoose'
import handler from '../lib/controller-factory'

import { auth, error, validate, validateId } from '../middleware'

interface Handlers<T> {
  list?: RequestHandler | RequestHandler[]
  post?: RequestHandler<{}, {}, T> | RequestHandler<{}, {}, T>[]
  get?: RequestHandler<{ id: string }> | RequestHandler<{ id: string }>[]
  put?: RequestHandler<{ id: string }, {}, T> | RequestHandler<{ id: string }>[]
  patch?:
    | RequestHandler<{ id: string }, {}, T>
    | RequestHandler<{ id: string }>[]
  delete?: RequestHandler<{ id: string }> | RequestHandler<{ id: string }>[]
}

type RouteHandler = Handlers<any>
// & Partial<Record<string, RequestHandler | RequestHandler[]>>

type CustomMethod = 'list' | 'post' | 'get' | 'put' | 'patch' | 'delete'

interface HandlerOptions {
  middleware?: RequestHandler | RequestHandler[]
  validator?: AnyZodObject
  model?: Model<any>
}

class App {
  private _app: Application
  public middleware: RequestHandler[]
  private _routers: Router[] = []

  constructor(public prefix = '/api') {
    this._app = express()
    this.middleware = [
      cors(),
      helmet(),
      express.json(),
      express.static('src/public'),
      express.urlencoded({ extended: true }),
      this._app.get('env').includes('dev') && morgan('dev'),
    ]
  }

  init() {
    this._setupMiddleware()
    this._setupRoutes()
    return this._app
  }

  private _setupMiddleware() {
    for (const mw of this.middleware) {
      this._app.use(mw)
    }
  }

  private _setupRoutes() {
    for (const router of this._routers) {
      this._app.use(this.prefix, router)
    }
    this._app.use(error)
  }

  route<T = any>(
    endpoint: string,
    routeHandler: RouteHandler,
    options: HandlerOptions = {}
  ) {
    const router = Router()

    if (!options.middleware) {
      options.middleware = (req, res, next) => next()
    }

    router.use(endpoint, options.middleware)

    if (routeHandler.list) {
      router.get(endpoint, routeHandler.list)
    } else {
      if (!options.model) {
        throw new Error('Model is required for list route')
      }
      router.get(endpoint, handler.list(options.model))
    }

    if (routeHandler.post) {
      if (!options.validator) {
        router.post(endpoint, routeHandler.post)
      } else {
        router.post(
          `${endpoint}/:id`,
          validate(options.validator),
          routeHandler.post
        )
      }
    } else {
      if (!options.model) {
        throw new Error('Model is required for post route')
      }
      if (!options.validator) {
        router.post(endpoint, handler.createOne(options.model))
      } else {
        router.post(
          `${endpoint}/:id`,
          validate(options.validator),
          handler.createOne(options.model)
        )
      }
    }

    if (routeHandler.get) {
      router.get(`${endpoint}/:id`, validateId, routeHandler.get)
    }

    if (routeHandler.put) {
      if (!options.validator) {
        router.put(`${endpoint}/:id`, routeHandler.put)
      } else {
        router.put(
          `${endpoint}/:id`,
          validateId,
          validate(options.validator),
          routeHandler.put
        )
      }
    }

    if (routeHandler.patch) {
      if (!options.validator) {
        router.patch(`${endpoint}/:id`, routeHandler.patch)
      } else {
        router.patch(
          `${endpoint}/:id`,
          validateId,
          validate(options.validator),
          routeHandler.patch
        )
      }
    }

    if (routeHandler.delete) {
      router.delete(`${endpoint}/:id`, validateId, routeHandler.delete)
    }

    this._routers.push(router)
  }
}

export const app = new App()

const validator = z.object({ name: z.string().min(3).max(255) })

app.route<z.infer<typeof validator>>(
  '/contacts',
  {
    list: (req, res) => {
      res.json({
        method: req.method,
        path: req.path,
      })
    },
    post: (req, res) => {
      res.json({
        method: req.method,
        path: req.path,
        body: req.body,
      })
    },
    get: (req, res) => {
      res.json({
        method: req.method,
        path: req.path,
        params: req.params,
      })
    },
    put: (req, res) => {
      res.json({
        method: req.method,
        path: req.path,
        params: req.params,
        body: req.body,
      })
    },
    delete: (req, res) => {
      res.json({
        method: req.method,
        path: req.path,
        params: req.params,
      })
    },
  },
  {
    validator,
  }
)

export default App
