function createError(name: string, defaultMsg: string, defaultCode: number) {
  return class extends Error {
    message = defaultMsg
    code = defaultCode

    constructor(message?: string, code?: number) {
      super()
      if (message) this.message = message
      if (code) this.code = code
      this.name = name
    }
  }
}

// prettier-ignore
export const ServerError = createError('ServerError', 'Internal server error', 500)

export const BadRequest = createError('BadRequest', 'Bad request', 400)

export const NotFound = createError('NotFoundError', 'Not found', 404)

// prettier-ignore
export const Unauthorized = createError('UnauthorizedError', 'Unauthorized', 401)

export const Forbidden = createError('ForbiddenError', 'Forbidden', 403)
