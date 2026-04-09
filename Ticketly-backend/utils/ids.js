function randomPart() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
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
