import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { error } from '../middleware'
import { authRouter, usersRouter, groupsRouter, contactsRouter } from '../routes'

const app = express()

// Middleware
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(express.static('src/public'))
app.use(express.urlencoded({ extended: true }))
app.get('env').includes('dev') && app.use(morgan('dev'))

// Routes
app.get('/api/ping', (_, res) => res.send('pong'))
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/groups', groupsRouter)
app.use('/api/contacts', contactsRouter)

app.use(error)

export default app
