declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    PORT: string
    JWT_A_SECRET: string
    DB_URL: string
    DB_NAME: string
  }
}

declare namespace Express {
  export interface Request {
    user: UserPayload
  }
}

type UserPayload = {
  _id: string
  isAdmin: boolean
  exp: number
}

type Tokens = {
  access: string
  refresh: string
}

type Hash = {
  iv: string
  content: string
}

type Credentials = {
  email: string
  password: string
}

type ILocation = {
  lat: number
  long: number
}

// --- Models --- //

interface MongoDocument {
  createdAt: Date
  updadetAt: Date
  location: any
}
