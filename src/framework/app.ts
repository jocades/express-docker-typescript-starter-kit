import express, { Router, type Application, type RequestHandler } from 'express'
import { z, type AnyZodObject } from 'zod'
import _ from 'lodash'

import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { error } from '../middleware'
import { ServerError } from '../lib/errors'
import { AppRouteOptions, CommonHandlers, CustomHandlers } from './types'
import { setupCommonHandlers, setupCustomHandlers } from './util'

interface AppParams {
  prefix?: string
  middleware?: RequestHandler[]
  routers?: Router[]
}

class App {
  private _app: Application
  public prefix: string
  public middleware: RequestHandler[]
  private _routers: Router[]

  constructor({ prefix = '', middleware = [], routers = [] }: AppParams = {}) {
    this._app = express()
    this.prefix = prefix
    this._routers = routers
    this.middleware = [
      cors(),
      helmet(),
      express.json(),
      express.static('src/public'),
      express.urlencoded({ extended: true }),
      this._app.get('env').includes('dev') && morgan('dev'),
      ...middleware,
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

  /**
   * Create a route with auto generated CRUD handlers following RESTful conventions
   * @param endpoint - Route endpoint
   * @param options - Route options
   * @param commonRoutes - Common CRUD handlers (list, create, read, update, delete)
   * @param customRoutes - Custom handlers (get, post, put, patch, delete). Middleware, if used, must be set before the handlers
   */
  route<T = any>(
    endpoint: string,
    options: AppRouteOptions = {},
    commonRoutes: CommonHandlers<T> = {},
    customRoutes: CustomHandlers = {}
  ) {
    const router = Router()
    setupCustomHandlers(endpoint, router, customRoutes)
    setupCommonHandlers(endpoint, router, commonRoutes, options)
    this._routers.push(router)
  }
}

export const app = new App({ prefix: '/api' })

const exampleBody = z.object({ name: z.string().min(3).max(255) })
type Body = z.infer<typeof exampleBody>

app.route<Body>(
  '/example',
  {
    validator: exampleBody,
    methods: ['*'],
  },
  {
    list: (req, res) => res.json([{ _id: '1', name: 'John Doe' }]),
    update: (req, res) => {
      req.body.name
    },
  },
  {
    '/me': {
      get: (req, res) => res.send('No conflict with /:id'),
    },
    '/error': {
      get: (req, res) => {
        throw new ServerError('Fuuuuuuuuuuu!', 418) // 418 -> I'm a teapot
      },
    },
  }
)

app.route(
  '/works',
  { methods: ['*'] },
  {
    update: (req, res) => {
      req.body.name
    },
  },
  {
    '/test': {
      middleware: (req, res, next) => {
        console.log('mw')
        next()
      },
      get: (req, res) => res.send('test'),
      put: (req, res) => res.send('test'),
    },
  }
)
