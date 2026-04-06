// routes/events.js
import { Router } from 'express'
import { db, generateId } from '../Backend/db.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// ── GET /api/events ───────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    const { category, search, featured } = req.query
    let events = [...db.events]

    // Filter by category
    if (category && category !== 'All') {
      events = events.filter((e) => e.category === category)
    }

    // Filter by search query (name, venue, city)
    if (search) {
      const q = search.toLowerCase()
      events = events.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.city?.toLowerCase().includes(q)
      )
    }

    // Filter featured only
    if (featured === 'true') {
      events = events.filter((e) => e.featured)
    }

    res.status(200).json(events)
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching events.', error: err.message })
  }
})

// ── GET /api/events/:id ───────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  try {
    const event = db.events.find((e) => e.id === req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found.' })
    res.status(200).json(event)
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message })
  }
})

// ── POST /api/events ──────────────────────────────────────────────────────────
router.post('/', authenticate, (req, res) => {
  try {
    const { name, date, time, venue, city, totalSeats, price, category, description, image, tags, featured } = req.body

    // Validation
    if (!name || !date || !venue || !totalSeats || !price) {
      return res.status(400).json({ message: 'name, date, venue, totalSeats and price are required.' })
    }
    if (totalSeats < 1) {
      return res.status(400).json({ message: 'totalSeats must be at least 1.' })
    }
    if (price < 0) {
      return res.status(400).json({ message: 'price cannot be negative.' })
    }

    const newEvent = {
      id:            `evt-${generateId()}`,
      name:          name.trim(),
      category:      category || 'Music',
      date,
      time:          time || '19:00',
      venue:         venue.trim(),
      city:          city?.trim() || 'Lahore',
      totalSeats:    Number(totalSeats),
      bookedSeats:   0,
      reservedSeats: 0,
      price:         Number(price),
      description:   description?.trim() || '',
      image:         image?.trim() || '',
      tags:          Array.isArray(tags) ? tags : [],
      featured:      !!featured,
    }

    db.events.push(newEvent)
    res.status(201).json(newEvent)
  } catch (err) {
    res.status(500).json({ message: 'Server error creating event.', error: err.message })
  }
})

// ── PUT /api/events/:id ───────────────────────────────────────────────────────
router.put('/:id', authenticate, (req, res) => {
  try {
    const idx = db.events.findIndex((e) => e.id === req.params.id)
    if (idx < 0) return res.status(404).json({ message: 'Event not found.' })

    const existing = db.events[idx]
    const updated  = {
      ...existing,
      ...req.body,
      id:            existing.id,
      bookedSeats:   existing.bookedSeats,   // never overwrite via PUT
      reservedSeats: existing.reservedSeats,
      totalSeats:    Number(req.body.totalSeats ?? existing.totalSeats),
      price:         Number(req.body.price ?? existing.price),
    }

    // Safety check: totalSeats can't drop below already booked
    if (updated.totalSeats < updated.bookedSeats + updated.reservedSeats) {
      return res.status(400).json({
        message: `Cannot reduce totalSeats below already booked+reserved (${updated.bookedSeats + updated.reservedSeats}).`,
      })
    }

    db.events[idx] = updated
    res.status(200).json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Server error updating event.', error: err.message })
  }
})

// ── DELETE /api/events/:id ────────────────────────────────────────────────────
router.delete('/:id', authenticate, (req, res) => {
  try {
    const idx = db.events.findIndex((e) => e.id === req.params.id)
    if (idx < 0) return res.status(404).json({ message: 'Event not found.' })

    db.events.splice(idx, 1)
    res.status(200).json({ message: 'Event deleted successfully.' })
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting event.', error: err.message })
  }
})

export default router
