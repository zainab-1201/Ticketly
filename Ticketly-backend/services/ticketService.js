import Event from '../models/Event.js'
import Booking from '../models/Booking.js'
import Ticket from '../models/Ticket.js'
import { ApiError } from '../utils/apiError.js'
import { generateBookingRef, generateTicketId } from '../utils/ids.js'

function formatTicket(doc) {
  const t = doc.toObject()
  return { ...t, id: t._id.toString() }
}

export async function createTicketFromPayload({
  bookingId,
  eventId,
  seats,
  holderName,
  holderEmail,
  status,
  bookingRef,
}) {
  let finalBookingRef = bookingRef
  let finalEventId = eventId
  let finalSeats = Number(seats)
  let finalStatus = status === 'Reserved' ? 'Reserved' : 'Booked'
  let finalHolderName = holderName?.trim() || 'Guest'
  let finalHolderEmail = holderEmail?.trim() || ''

  if (bookingId) {
    const booking = await Booking.findById(bookingId)
    if (!booking) throw new ApiError(404, 'Booking not found.')
    finalBookingRef = booking.bookingRef
    finalEventId = booking.eventId
    finalSeats = booking.seats
    finalStatus = booking.status
    finalHolderName = booking.holderName
    finalHolderEmail = booking.holderEmail
  }

  if (!finalEventId || !finalSeats) {
    throw new ApiError(400, 'eventId and seats are required.')
  }

  const event = await Event.findById(finalEventId)
  if (!event) {
    throw new ApiError(404, 'Event not found.')
  }

  const ticket = await Ticket.create({
    ticketId: generateTicketId(),
    bookingRef: finalBookingRef || generateBookingRef(),
    bookingId: bookingId || null,
    eventId: event._id,
    eventName: event.name,
    eventDate: event.date,
    eventTime: event.time,
    venue: event.venue,
    seats: finalSeats,
    pricePerSeat: event.price,
    totalPrice: finalSeats * event.price,
    status: finalStatus,
    holderName: finalHolderName,
    holderEmail: finalHolderEmail,
  })

  return formatTicket(ticket)
}

export async function listTickets() {
  const tickets = await Ticket.find().sort({ createdAt: -1 })
  return tickets.map(formatTicket)
}

export async function getTicketByTicketId(ticketId) {
  const ticket = await Ticket.findOne({ ticketId })
  if (!ticket) throw new ApiError(404, 'Ticket not found.')
  return formatTicket(ticket)
}
