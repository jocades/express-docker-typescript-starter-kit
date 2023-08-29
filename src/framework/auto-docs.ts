import { Router } from 'express'
import { AppRouteOptions, HTTPMethod } from './types'
import { extendApi, generateSchema } from '@anatine/zod-openapi'

interface Layer {
  __handle: Function
  name: string
  params: any
  path: string
  keys: any[]
  regexp: RegExp
  route?: {
    path: string
    stack: Layer[]
    methods: Record<HTTPMethod, boolean>
  }
}

export const docs: Record<string, any> = {
  openapi: '3.0.0',
  info: {
    title: 'REST API',
    description: 'REST API Documentation',
    version: '1.0.0',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  servers: [{ url: 'http://127.0.0.1:8000/api' }],
  tags: [],
  paths: {} as Record<string, any>,
}

export function addDocs(
  router: Router,
  options: AppRouteOptions = {},
  endpoint = ''
) {
  const { description = '', tags = [], body } = options.docs ?? {}

  tags.forEach((tag) => {
    if (!docs.tags.includes(tag)) {
      docs.tags.push(tag)
    }
  })

  for (const layer of router.stack as Layer[]) {
    if (!layer.route) continue

    /* console.log('LAYER', layer)
    console.log('STACK', layer.route?.stack) */

    let path = endpoint + layer.route.path

    const pathParams = path.match(/\/:[a-zA-Z0-9]+/g) || []
    if (pathParams.length) {
      for (const param of pathParams) {
        path = path.replace(param, param.replace(':', '{') + '}')
      }
    }

    if (!docs.paths[path]) {
      docs.paths[path] = {}
    }

    const parameters = pathParams.map((param) => ({
      name: param.replace('/:', ''),
      in: 'path',
      required: true,
      schema: { type: 'string' },
    }))

    const methods = Object.keys(layer.route.methods).filter(
      (method) => method !== '_all'
    )

    for (const method of methods) {
      let requestBody: Record<string, any> = {}

      if (['post', 'put', 'patch'].includes(method)) {
        requestBody.content = {
          'application/json': {
            schema: {
              type: 'object',
              properties: {},
              required: [],
            },
          },
        }

        if (body)
          requestBody.content['application/json'].schema = generateSchema(body)
        else if (options.validator) {
          requestBody.content['application/json'].schema = generateSchema(
            options.validator
          )
        }
      }

      docs.paths[path][method] = {
        tags,
        description,
        parameters,
        requestBody,
        responses: {
          200: {
            description: 'OK',
          },
          400: {
            description: 'Bad Request',
          },
          401: {
            description: 'Unauthorized',
          },
          403: {
            description: 'Forbidden',
          },
          404: {
            description: 'Not Found',
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      }
    }
  }
}
