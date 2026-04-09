import crypto from 'crypto'

function randomPart() {
  return crypto.randomBytes(4).toString('hex').toUpperCase()
}

export function generateBookingRef() {
  return `BK-${Date.now().toString(36).toUpperCase()}-${randomPart()}`
}

export function generateTicketId() {
  return `TK-${Date.now().toString(36).toUpperCase()}-${randomPart()}`
}

export function generateReservationRef() {
  return `RS-${Date.now().toString(36).toUpperCase()}-${randomPart()}`
}
