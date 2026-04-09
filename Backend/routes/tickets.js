// routes/tickets.js
import { Router } from 'express'
import { db, generateTicketId, generateId } from '../db.js'

const router = Router()

// ── POST /api/tickets ─────────────────────────────────────────────────────────
// Generate a digital ticket after payment confirmation
router.post('/', (req, res) => {
  try {
    const { eventId, seats, holderName, holderEmail, status } = req.body

    if (!eventId || !seats) {
      return res.status(400).json({ message: 'eventId and seats are required.' })
    }

    // Verify event exists
    const event = db.events.find((e) => e.id === eventId)
    if (!event) return res.status(404).json({ message: 'Event not found.' })

    const ticketStatus = status === 'Reserved' ? 'Reserved' : 'Booked'

    const ticket = {
      ticketId:     generateTicketId(),
      bookingRef:   `BK-${generateId().toUpperCase()}`,
      eventId,
      eventName:    event.name,
      eventDate:    event.date,
      eventTime:    event.time,
      venue:        event.venue,
      seats:        Number(seats),
      pricePerSeat: event.price,
      totalPrice:   Number(seats) * event.price,
      status:       ticketStatus,
      holderName:   holderName?.trim() || 'Guest',
      holderEmail:  holderEmail?.trim() || '',
      issuedAt:     new Date().toISOString(),
    }

    db.tickets.push(ticket)
    res.status(201).json(ticket)
  } catch (err) {
    res.status(500).json({ message: 'Server error generating ticket.', error: err.message })
  }
})

// ── GET /api/tickets ──────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    res.status(200).json(db.tickets)
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message })
  }
})

// ── GET /api/tickets/:ticketId ────────────────────────────────────────────────
router.get('/:ticketId', (req, res) => {
  try {
    const ticket = db.tickets.find((t) => t.ticketId === req.params.ticketId)
    if (!ticket) return res.status(404).json({ message: 'Ticket not found.' })
    res.status(200).json(ticket)
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message })
  }
})

export default router