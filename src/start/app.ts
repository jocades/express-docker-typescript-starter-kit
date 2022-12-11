import './env'
import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { authR, userR, groupR } from '../routes'

const app: Application = express()

// Middleware
app.use(cors())
app.use(helmet())
app.use(express.json())
app.set('view engine', 'pug')
app.set('views', './src/views')
app.use('/uploads', express.static('uploads'))
app.get('env').includes('dev') && app.use(morgan('dev'))

// Routes
app.get('/', (_, res) => res.render('index', { title: 'Home', message: 'Hello there!' }))
app.use('/api/auth', authR)
app.use('/api/users', userR)
app.use('/api/groups', groupR)

// Database
import './db'

export default app
