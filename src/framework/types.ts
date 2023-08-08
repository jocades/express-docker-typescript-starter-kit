import { type RequestHandler } from 'express'
import { type Model } from 'mongoose'
import { type AnyZodObject } from 'zod'

export interface CommonHandlers<T> {
  list?: RequestHandler | RequestHandler[]
  create?: RequestHandler<{}, {}, T> | RequestHandler<{}, {}, T>[]
  read?: RequestHandler<{ id: string }> | RequestHandler<{ id: string }>[]
  update?:
    | RequestHandler<{ id: string }, {}, T>
    | RequestHandler<{ id: string }>[]
  delete?: RequestHandler<{ id: string }> | RequestHandler<{ id: string }>[]
}

export type CommonMethod = 'list' | 'create' | 'read' | 'update' | 'delete'
export type HTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export type CustomHandlers = Record<
  string,
  Partial<Record<HTTPMethod | 'middleware', RequestHandler | RequestHandler[]>>
>

export interface AppRouteOptions {
  middleware?: RequestHandler | RequestHandler[]
  validator?: AnyZodObject
  model?: Model<any>
  methods?: ('list' | 'create' | 'read' | 'update' | 'delete' | 'all' | '*')[]
}
