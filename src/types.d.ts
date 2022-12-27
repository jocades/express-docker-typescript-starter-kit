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
}

interface IUserMethods {
  genAToken: () => Tokens['access']
  genRToken: () => Tokens['refresh']
  login: () => Promise<Tokens>
  logout: (rToken: Tokens['refresh']) => Promise<string>
  refresh: (rToken: Tokens['refresh'], cb: (err?: Error, tokens?: Tokens) => void) => void
}
