import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env.js'
import { globalRateLimit } from './middleware/rateLimit.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import authRouter from './routes/auth.js'
import eventsRouter from './routes/events.js'
import bookingsRouter from './routes/bookings.js'
import reservationsRouter from './routes/reservations.js'
import ticketsRouter from './routes/tickets.js'
import healthRouter from './routes/health.js'

const app = express()

app.use(helmet())
app.use(cors({
  origin: env.clientUrl,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json({ limit: '1mb' }))
app.use(globalRateLimit)

app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/events', eventsRouter)
app.use('/api/bookings', bookingsRouter)
app.use('/api/reservations', reservationsRouter)
app.use('/api/tickets', ticketsRouter)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
