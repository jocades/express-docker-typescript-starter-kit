import express, { Router, type Application, type RequestHandler } from 'express'
import swagger from 'swagger-ui-express'
import { AnyZodObject, z } from 'zod'
import fs from 'fs'

import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { error } from '../middleware'
import { ServerError } from '../lib/errors'
import { AppRouteOptions, CommonHandlers, CustomHandlers, Docs } from './types'
import { setupCommonHandlers, setupCustomHandlers } from './functions'
import { addDocs, docs } from './auto-docs'
import { NodeEnv, NODE_ENV } from '../config/consts'

interface AppOptions {
  prefix?: string
  middleware?: RequestHandler[]
  routers?: Router[]
}

class Ajo {
  #app: Application
  #prefix: string
  #middleware: RequestHandler[]
  #routers: Router[]

  constructor({ prefix = '', middleware = [], routers = [] }: AppOptions = {}) {
    this.#app = express()
    this.#prefix = prefix
    this.#routers = routers
    this.#middleware = [
      cors(),
      helmet(),
      express.json(),
      express.static('src/public'),
      express.urlencoded({ extended: true }),
      ...middleware,
    ]
  }

  async init() {
    for (const dir of fs.readdirSync('src/routes')) {
      if (!dir.includes('.')) {
        for (const file of fs.readdirSync(`src/routes/${dir}`)) {
          if (file.endsWith('.route.ts')) {
            await import(`../routes/${dir}/${file}`)
          }
        }
      }
    }
    this._setupMiddleware()
    this._setupRoutes()
    this._setupDocs()
    return this.#app
  }

  private _setupMiddleware() {
    if (NODE_ENV === NodeEnv.PROD) {
      this.#middleware.push(morgan('combined'))
    }

    if (NODE_ENV === NodeEnv.DEV) {
      this.#middleware.push(morgan('dev'))
    }

    for (const mw of this.#middleware) {
      this.#app.use(mw)
    }
  }

  private _setupRoutes() {
    for (const router of this.#routers) {
      this.#app.use(this.#prefix, router)
    }
    this.#app.use(error)
  }

  private _setupDocs() {
    console.log(Object.keys(docs.paths))
    this.#app.use(
      this.#prefix + '/docs',
      swagger.serve,
      swagger.setup(docs, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'API Docs',
        customfavIcon: 'src/public/favicon.ico',
      })
    )
  }

  /**
   * Add middleware to the express app
   * @param middleware - Middleware to add
   * @example
   * ajo.addMiddleware((req, res, next) => {
   *  console.log('Hello')
   *  next()
   * })
   */
  addMiddleware(middleware: RequestHandler) {
    this.#middleware.push(middleware)
  }

  /**
   * Create a route using the express router
   * @param endpoint - Route endpoint
   * @param cb - Callback to create the router
   * @param docOptions - Route options
   * @example
   * ajo.useRouter('/example', (r) => {
   *  r.get('/', (req, res) => res.send('Hello'))
   * })
   */
  useRouter(
    endpoint: string,
    cb: (router: Router) => void,
    docOptions?: Pick<AppRouteOptions, 'docs'>
  ) {
    const router = Router()
    cb(router)
    addDocs(router, docOptions, endpoint)
    this.#routers.push(Router().use(endpoint, router))
  }

  /**
   * Create a route with auto generated CRUD handlers following RESTful conventions
   * @param endpoint - Route endpoint
   * @param options - Route options
   * @param commonRoutes - Common CRUD handlers (list, create, read, update, delete)
   * @param customRoutes - Custom handlers (get, post, put, patch, delete). Middleware, if used, must be set before the handlers
   */
  route<T extends AnyZodObject>(
    endpoint: string,
    options: AppRouteOptions<T> = {},
    commonRoutes: CommonHandlers<T> = {},
    customRoutes: CustomHandlers = {}
  ) {
    const router = Router()
    setupCustomHandlers(endpoint, router, customRoutes)
    setupCommonHandlers(endpoint, router, commonRoutes, options)
    addDocs(router, options)
    this.#routers.push(router)
  }
}

export const ajo = new Ajo({ prefix: '/api' })

ajo.route(
  '/example',
  {
    body: z.object({ name: z.string().min(3).max(255) }),
    methods: ['*'],
    docs: {
      title: 'Example',
      description: 'Example route',
      tags: ['Ex'],
    },
  },
  {
    create: (req, res) => {
      req.body.name
    },
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
        throw new ServerError('Fuuuuuuuuuuu!', 418)
      },
    },
  }
)
