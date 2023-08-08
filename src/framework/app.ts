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
    options: AppRouteOptions = {},
    commonHandlers: CommonHandlers<T> = {},
    customHandlers: CustomHandlers = {}
  ) {
    const router = Router()
    setupCustomHandlers(endpoint, router, customHandlers)
    setupCommonHandlers(endpoint, router, commonHandlers, options)
    this._routers.push(router)
  }
}

export const app = new App()

const exampleBody = z.object({ name: z.string().min(3).max(255) })
type Body = z.infer<typeof exampleBody>

app.route<Body>(
  '/example',
  {
    // validator: contactSchema,
    methods: ['list', 'create', 'read'],
  },
  {
    list: (req, res) => res.json([{ _id: '1', name: 'John Doe' }]),
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

app.route('/works')
