import { createBooking, getBookingById, listBookings } from '../services/bookingService.js'

export async function postBooking(req, res) {
  const payload = req.validatedBody
  const result = await createBooking(payload)
  res.status(201).json(result)
}

export async function getBookings(req, res) {
  const bookings = await listBookings(req.query)
  res.status(200).json(bookings)
}

export async function getBooking(req, res) {
  const booking = await getBookingById(req.params.id)
  res.status(200).json(booking)
}
