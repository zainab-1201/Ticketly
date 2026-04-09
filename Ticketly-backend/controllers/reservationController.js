import { cancelReservation, createReservation, listReservations } from '../services/reservationService.js'

export async function postReservation(req, res) {
  const reservation = await createReservation(req.validatedBody)
  res.status(201).json(reservation)
}

export async function getReservations(req, res) {
  const reservations = await listReservations(req.query)
  res.status(200).json(reservations)
}

export async function deleteReservation(req, res) {
  const reservation = await cancelReservation(req.params.id)
  res.status(200).json(reservation)
}
