// Backend/db.js

export const db = {
  events: [],
  bookings: [],
  tickets: [],
  users: [],
}

export function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

export function generateTicketId() {
  return `TKT-${new Date().getFullYear()}-${generateId().toUpperCase()}`
}
