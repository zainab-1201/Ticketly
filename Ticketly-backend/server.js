// server.js  –  Ticketly Express API
import express from 'express'
import cors from 'cors'
import eventsRouter from './routes/events.js'
import bookingsRouter from './routes/bookings.js'
import reservationsRouter from './routes/reservations.js'
import ticketsRouter from './routes/Tickets.js'
import authRouter from './routes/auth.js'
import { authenticate } from './middleware/auth.js'

const app = express()
const PORT = process?.env?.PORT || 5000

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required. Please set it in your environment variables.')
}

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:5173',   // React Vite dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

// ── Request logger (dev only) ─────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`)
  next()
})

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/events',       eventsRouter)
app.use('/api/auth', authRouter)
app.use('/api/bookings', authenticate, bookingsRouter)
app.use('/api/reservations', authenticate, reservationsRouter)
app.use('/api/tickets', authenticate, ticketsRouter)

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Ticketly API is running 🎟️' })
})

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' })
})

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ message: 'Internal server error.', error: err.message })
})

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎟️  Ticketly API running at http://localhost:${PORT}/api`)
  console.log(`📋  Endpoints:`)
  console.log(`     GET    /api/events`)
  console.log(`     GET    /api/events/:id`)
  console.log(`     POST   /api/events`)
  console.log(`     PUT    /api/events/:id`)
  console.log(`     DELETE /api/events/:id`)
  console.log(`     POST   /api/bookings`)
  console.log(`     POST   /api/reservations`)
  console.log(`     POST   /api/tickets`)
  console.log(`     GET    /api/tickets`)
  console.log(`     GET    /api/tickets/:ticketId\n`)
})
