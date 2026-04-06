// routes/reservations.js
import { Router } from 'express'
import { db, generateId } from '../Backend/db.js'

const router = Router()

// ── POST /api/reservations ────────────────────────────────────────────────────
// Temporary reservation: seats marked reserved (not permanently booked)
router.post('/', (req, res) => {
  try {
    const { eventId, seats, holderName, holderEmail } = req.body

    if (!eventId || !seats) {
      return res.status(400).json({ message: 'eventId and seats are required.' })
    }
    if (seats < 1 || seats > 10) {
      return res.status(400).json({ message: 'seats must be between 1 and 10.' })
    }

    const eventIdx = db.events.findIndex((e) => e.id === eventId)
    if (eventIdx < 0) return res.status(404).json({ message: 'Event not found.' })

    const event     = db.events[eventIdx]
    const available = event.totalSeats - event.bookedSeats - event.reservedSeats

    if (seats > available) {
      return res.status(400).json({ message: `Not enough seats. Only ${available} available.` })
    }

    // Mark seats reserved
    db.events[eventIdx].reservedSeats += Number(seats)

    const reservation = {
      id:          `res-${generateId()}`,
      eventId,
      seats:       Number(seats),
      status:      'Reserved',
      holderName:  holderName?.trim() || 'Guest',
      holderEmail: holderEmail?.trim() || '',
      createdAt:   new Date().toISOString(),
      expiresAt:   new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min hold
    }

    db.bookings.push(reservation)
    res.status(201).json(reservation)
  } catch (err) {
    res.status(500).json({ message: 'Server error creating reservation.', error: err.message })
  }
})

export default router