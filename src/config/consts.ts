export const { NODE_ENV, PORT, JWT_A_SECRET, DB_URL, DB_NAME } = process.env

export const dbURL = DB_URL ?? 'mongodb://localhost:27017'

export const dbName =
  NODE_ENV === 'test' ? `${DB_NAME}-test` : DB_NAME ?? 'express-ts'
