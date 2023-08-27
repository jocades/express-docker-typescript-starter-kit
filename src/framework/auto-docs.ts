import { Router } from 'express'
import { AppRouteOptions } from './types'

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
  servers: [
    {
      url: 'http://127.0.0.1:8000/api',
    },
  ],
  tags: [],
  paths: {} as Record<string, any>,
}

export function addDocs(router: Router, options: AppRouteOptions = {}) {
  const { description = '', tags = [], body } = options.docs ?? {}

  tags.forEach((tag) => {
    if (!docs.tags.includes(tag)) {
      docs.tags.push(tag)
    }
  })

  for (const layer of router.stack) {
    if (!layer.route) continue

    const path = layer.route.path
    const methods = Object.keys(layer.route.methods).filter(
      (method) => method !== '_all'
    )

    if (!docs.paths[path]) {
      docs.paths[path] = {}
    }

    for (const method of methods) {
      let requestBody: Record<string, any> = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {},
            },
          },
        },
      }

      if (body) requestBody.content['application/json'].schema.properties = body
      else if (options.validator) {
        if (['post', 'put', 'patch'].includes(method)) {
          const zodBody = Object.entries(options.validator.shape).reduce(
            (acc, [key, value]) => {
              // @ts-ignore
              acc[key] = { type: value?._def?.typeName }
              return acc
            },
            {} as Record<string, any>
          )
          requestBody.content['application/json'].schema.properties = zodBody
        }
      }

      docs.paths[path][method] = {
        description,
        tags,
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
