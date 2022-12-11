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

type ILocation = {
  lat: number
  long: number
}

type Tokens = {
  access: string
  refresh: string
}

type Credentials = {
  email: string
  password: string
}

// --- Models --- //

interface BaseModel {
  readonly _id: string
  createdAt: Date
  updadetAt: Date
  location: ILocation
}

interface IUser extends BaseModel {
  email: string
  password: string
  firstName: string
  lastName: string
  isAdmin: boolean
  auth: Tokens['refresh'][]
}

interface IUserMethods {
  genAToken: () => Tokens['access']
  genRToken: () => Tokens['refresh']
  login: () => Promise<Tokens>
  logout: (rToken: Tokens['refresh']) => Promise<string>
  refresh: (
    rToken: Tokens['refresh'],
    cb: (err: Error | undefined, tokens?: Tokens) => void
  ) => void
}
