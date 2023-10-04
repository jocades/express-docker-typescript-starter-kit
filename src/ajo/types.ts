import { type RequestHandler } from 'express'
import { type Model } from 'mongoose'
import { z, type AnyZodObject } from 'zod'

export type CommonMethod = keyof CommonHandlers
export type HTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export interface CommonHandlers<T extends AnyZodObject = AnyZodObject> {
  list?: RequestHandler | RequestHandler[]
  create?:
    | RequestHandler<{}, {}, z.infer<T>>
    | RequestHandler<{}, {}, z.infer<T>>[]
  read?: RequestHandler<{ id: string }> | RequestHandler<{ id: string }>[]
  update?:
    | RequestHandler<{ id: string }, {}, Partial<z.infer<T>>>
    | RequestHandler<{ id: string }, {}, Partial<z.infer<T>>>[]
  delete?: RequestHandler<{ id: string }> | RequestHandler<{ id: string }>[]
}

export type CustomHandlers = Record<
  string,
  Partial<Record<HTTPMethod | 'middleware', RequestHandler | RequestHandler[]>>
>

export interface Docs {
  title?: string
  description?: string
  tags?: string[]
  body?: AnyZodObject
}

export interface AppRouteOptions<T extends AnyZodObject = AnyZodObject> {
  model?: Model<any>
  methods?: (CommonMethod | 'all' | '*')[]
  body?: T
  middleware?: RequestHandler | RequestHandler[]
  docs?: Docs
}
