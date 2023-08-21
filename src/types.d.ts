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

interface BaseModel {
  createdAt: Date
  updadetAt: Date
  location: any
}

interface IUser extends BaseModel {
  email: string
  password: string
  firstName: string
  lastName: string
  isAdmin: boolean
  auth: Hash[]
  provider: string
  providerId: string
  friends: string[]
}

interface IUserMethods {
  genAToken: () => Tokens['access']
  genRToken: () => Tokens['refresh']
  login: () => Promise<{ access: string }>
  logout: (rToken: Tokens['refresh']) => Promise<string>
  refresh: (
    rToken: Tokens['refresh'],
    cb: (err?: Error, tokens?: Tokens) => void
  ) => void
}
