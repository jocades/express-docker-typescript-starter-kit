import express, { Application, RequestHandler, Router } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { z, AnyZodObject } from 'zod'

import { auth, error, validate, validateId } from '../middleware'

interface Handler<T> {
  list?: RequestHandler | RequestHandler[]
  post?: RequestHandler<{}, {}, T> | RequestHandler<{}, {}, T>[]
  get?: RequestHandler<{ id: string }> | RequestHandler<{ id: string }>[]
  put?: RequestHandler<{ id: string }, {}, T> | RequestHandler<{ id: string }>[]
  patch?:
    | RequestHandler<{ id: string }, {}, T>
    | RequestHandler<{ id: string }>[]
  delete?: RequestHandler<{ id: string }> | RequestHandler<{ id: string }>[]
}

interface HandlerOptions {
  middleware?: RequestHandler | RequestHandler[]
  validator?: AnyZodObject
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
    handler: Handler<T>,
    options: HandlerOptions = {}
  ) {
    const router = Router()

    if (!options.middleware) {
      options.middleware = (req, res, next) => next()
    }

    router.use(endpoint, options.middleware)

    if (handler.list) {
      router.get(endpoint, handler.list)
    }

    if (handler.post) {
      if (!options.validator) {
        router.post(endpoint, handler.post)
      } else {
        router.post(
          `${endpoint}/:id`,
          validate(options.validator),
          handler.post
        )
      }
    }

    if (handler.get) {
      router.get(`${endpoint}/:id`, validateId, handler.get)
    }

    if (handler.put) {
      if (!options.validator) {
        router.put(`${endpoint}/:id`, handler.put)
      } else {
        router.put(
          `${endpoint}/:id`,
          validateId,
          validate(options.validator),
          handler.put
        )
      }
    }

    if (handler.patch) {
      if (!options.validator) {
        router.patch(`${endpoint}/:id`, handler.patch)
      } else {
        router.patch(
          `${endpoint}/:id`,
          validateId,
          validate(options.validator),
          handler.patch
        )
      }
    }

    if (handler.delete) {
      router.delete(`${endpoint}/:id`, validateId, handler.delete)
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
