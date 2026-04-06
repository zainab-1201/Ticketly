// routes/bookings.js
import { Router } from 'express'
import { db, generateId } from '../Backend/db.js'

const router = Router()

// ── POST /api/bookings ────────────────────────────────────────────────────────
// Confirmed booking: seats are permanently deducted
router.post('/', (req, res) => {
  try {
    const { eventId, seats, holderName, holderEmail } = req.body

    // Validation
    if (!eventId || !seats) {
      return res.status(400).json({ message: 'eventId and seats are required.' })
    }
    if (seats < 1 || seats > 10) {
      return res.status(400).json({ message: 'seats must be between 1 and 10.' })
    }

    // Find event
    const eventIdx = db.events.findIndex((e) => e.id === eventId)
    if (eventIdx < 0) return res.status(404).json({ message: 'Event not found.' })

    const event     = db.events[eventIdx]
    const available = event.totalSeats - event.bookedSeats - event.reservedSeats

    if (seats > available) {
      return res.status(400).json({ message: `Not enough seats available. Only ${available} left.` })
    }

    // Deduct seats
    db.events[eventIdx].bookedSeats += Number(seats)

    // Create booking record
    const booking = {
      id:          `bk-${generateId()}`,
      eventId,
      seats:       Number(seats),
      status:      'Booked',
      holderName:  holderName?.trim() || 'Guest',
      holderEmail: holderEmail?.trim() || '',
      createdAt:   new Date().toISOString(),
    }

    db.bookings.push(booking)
    res.status(201).json(booking)
  } catch (err) {
    res.status(500).json({ message: 'Server error creating booking.', error: err.message })
  }
})

// ── GET /api/bookings ─────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    const { eventId } = req.query
    const bookings = eventId
      ? db.bookings.filter((b) => b.eventId === eventId)
      : db.bookings
    res.status(200).json(bookings)
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message })
  }
})

// ── GET /api/bookings/:id ─────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  try {
    const booking = db.bookings.find((b) => b.id === req.params.id)
    if (!booking) return res.status(404).json({ message: 'Booking not found.' })
    res.status(200).json(booking)
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message })
  }
})

export default router