import express, { Application, RequestHandler, Router } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { z, AnyZodObject } from 'zod'
import { Model } from 'mongoose'

import handler from '../lib/controller-factory'
import Contact from '../models/contact.model'
import { error, validate, validateId } from '../middleware'
import { ServerError } from '../lib/errors'

interface Handlers<T> {
  list: RequestHandler | RequestHandler[]
  createOne: RequestHandler<{}, {}, T> | RequestHandler<{}, {}, T>[]
  getOne: RequestHandler<{ id: string }> | RequestHandler<{ id: string }>[]
  updateOne:
    | RequestHandler<{ id: string }, {}, T>
    | RequestHandler<{ id: string }>[]
  deleteOne: RequestHandler<{ id: string }> | RequestHandler<{ id: string }>[]
}

type CustomMethod = 'list' | 'createOne' | 'getOne' | 'updateOne' | 'deleteOne'
type HTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'
type Method = HTTPMethod | CustomMethod

type CustomHandlers = {
  [key: string]: {
    get?: RequestHandler | RequestHandler[]
    post?: RequestHandler | RequestHandler[]
    put?: RequestHandler | RequestHandler[]
    patch?: RequestHandler | RequestHandler[]
    delete?: RequestHandler | RequestHandler[]
    middleware?: RequestHandler | RequestHandler[]
  }
}

type RouteHandler<T> = Partial<Handlers<T>>

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

  addRouter(endpoint: string, router: Router) {
    this._routers.push(Router().use(endpoint, router))
  }

  useRouter(endpoint: string, cb: (router: Router) => Router) {
    this._routers.push(Router().use(endpoint, cb(Router())))
  }

  route<T = unknown>(
    endpoint: string,
    options: HandlerOptions = {},
    commonHandlers: RouteHandler<T> = {},
    customHandlers: CustomHandlers = {}
  ) {
    const router = Router()

    // Custom
    for (const [path, handlers] of Object.entries(customHandlers)) {
      let middleware: RequestHandler[] | RequestHandler = []

      for (const [method, handler] of Object.entries(handlers)) {
        if (method === 'middleware') {
          middleware = handler
          continue
        }
        router[method as HTTPMethod](`${endpoint}${path}`, middleware, handler)
      }
    }

    // Common
    if (!options.middleware) {
      options.middleware = (req, res, next) => next()
    }

    router.use(endpoint, options.middleware)

    if (commonHandlers.list) {
      router.get(endpoint, commonHandlers.list)
    } else {
      if (!options.model) {
        router.get(endpoint, (req, res) => {
          res.json({
            method: req.method,
            path: req.path,
          })
        })
      } else {
        router.get(endpoint, handler.list(options.model))
      }
    }

    if (commonHandlers.createOne) {
      if (!options.validator) {
        router.post(endpoint, commonHandlers.createOne)
      } else {
        router.post(
          endpoint,
          validate(options.validator),
          commonHandlers.createOne
        )
      }
    } else {
      if (!options.model) {
        router.post(endpoint, (req, res) => {
          res.json({
            method: req.method,
            path: req.path,
            body: req.body,
          })
        })
      } else {
        if (!options.validator) {
          router.post(endpoint, handler.createOne(options.model))
        } else {
          router.post(
            endpoint,
            validate(options.validator),
            handler.createOne(options.model)
          )
        }
      }
    }

    if (commonHandlers.getOne) {
      router.get(`${endpoint}/:id`, validateId, commonHandlers.getOne)
    } else {
      if (!options.model) {
        router.get(`${endpoint}/:id`, (req, res) => {
          res.json({
            method: req.method,
            path: req.path,
            params: req.params,
          })
        })
      } else {
        router.get(`${endpoint}/:id`, validateId, handler.getOne(options.model))
      }
    }

    if (commonHandlers.updateOne) {
      if (!options.validator) {
        router.put(`${endpoint}/:id`, validateId, commonHandlers.updateOne)
      } else {
        router.put(
          `${endpoint}/:id`,
          validateId,
          validate(options.validator.partial()),
          commonHandlers.updateOne
        )
      }
    } else {
      if (!options.model) {
        router.put(`${endpoint}/:id`, (req, res) => {
          res.json({
            method: req.method,
            path: req.path,
            params: req.params,
            body: req.body,
          })
        })
      } else {
        if (!options.validator) {
          router.put(
            `${endpoint}/:id`,
            validateId,
            handler.updateOne(options.model)
          )
        } else {
          router.put(
            `${endpoint}/:id`,
            validateId,
            validate(options.validator.partial()),
            handler.updateOne(options.model)
          )
        }
      }
    }

    if (commonHandlers.deleteOne) {
      router.delete(`${endpoint}/:id`, validateId, commonHandlers.deleteOne)
    } else {
      if (!options.model) {
        router.delete(`${endpoint}/:id`, (req, res) => {
          res.json({
            method: req.method,
            path: req.path,
            params: req.params,
          })
        })
      } else {
        router.delete(
          `${endpoint}/:id`,
          validateId,
          handler.deleteOne(options.model)
        )
      }
    }

    this._routers.push(router)

    return router
  }
}

export const app = new App()

const contactSchema = z.object({ name: z.string().min(3).max(255) })

app.route(
  '/ping',
  {
    validator: contactSchema,
  },
  {
    list: (req, res) => res.send('list'),
  },
  {
    '/test/1': {
      get: (req, res) => res.send('test 1'),
    },
    '/error/1': {
      get: (req, res) => {
        throw new ServerError('Fuuuuuuuuuuu!', 418) // 418 -> I'm a teapot
      },
    },
  }
)
