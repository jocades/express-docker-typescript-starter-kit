import express, { Router, type Application, type RequestHandler } from 'express'
import swagger from 'swagger-ui-express'
import { z } from 'zod'
import fs from 'fs'

import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { error } from '../middleware'
import { ServerError } from '../lib/errors'
import { AppRouteOptions, CommonHandlers, CustomHandlers, Docs } from './types'
import { setupCommonHandlers, setupCustomHandlers } from './functions'
import { addDocs, docs } from './auto-docs'

interface AppOptions {
  prefix?: string
  middleware?: RequestHandler[]
  routers?: Router[]
}

class App {
  private _app: Application
  private _prefix: string
  public middleware: RequestHandler[]
  private _routers: Router[]

  constructor({ prefix = '', middleware = [], routers = [] }: AppOptions = {}) {
    this._app = express()
    this._prefix = prefix
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
    return this._app
  }

  private _setupMiddleware() {
    for (const mw of this.middleware) {
      this._app.use(mw)
    }
  }

  private _setupRoutes() {
    for (const router of this._routers) {
      this._app.use(this._prefix, router)
    }
    this._app.use(error)
  }

  private _setupDocs() {
    console.log(Object.keys(docs.paths))
    this._app.use(
      this._prefix + '/docs',
      swagger.serve,
      swagger.setup(docs, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'API Docs',
        customfavIcon: 'src/public/favicon.ico',
      })
    )
  }

  useRouter(
    endpoint: string,
    cb: (router: Router) => Router,
    docOptions?: Pick<AppRouteOptions, 'docs'>
  ) {
    const router = cb(Router())
    addDocs(router, docOptions, endpoint)
    this._routers.push(Router().use(endpoint, router))
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
    addDocs(router, options)
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
    docs: {
      title: 'Example',
      description: 'Example route',
      tags: ['Ex'],
    },
  },
  {},
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
