export const { NODE_ENV, PORT, JWT_A_SECRET, DB_URL, DB_NAME } = process.env

export enum NodeEnv {
  DEV = 'development',
  TEST = 'test',
  PROD = 'production',
}

export const config = Object.freeze({
  dbName: NODE_ENV === 'test' ? `${DB_NAME}-test` : DB_NAME,
  dbURL: DB_URL ?? 'mongodb://localhost:27017',
})
