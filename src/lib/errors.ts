export class ServerError extends Error {
  message = 'Internal server error'
  code = 500

  constructor(message?: string, code?: number) {
    super()
    if (message) this.message = message
    if (code) this.code = code
    this.name = 'ServerError'
  }
}

export class NotFoundError extends Error {
  message = 'Not found'
  code = 404

  constructor(message?: string, code?: number) {
    super()
    if (message) this.message = message
    if (code) this.code = code
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends Error {
  message = 'Unauthorized'
  code = 401

  constructor(message?: string, code?: number) {
    super()
    if (message) this.message = message
    if (code) this.code = code
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  message = 'Forbidden'
  code = 403

  constructor(message?: string, code?: number) {
    super()
    if (message) this.message = message
    if (code) this.code = code
    this.name = 'ForbiddenError'
  }
}
