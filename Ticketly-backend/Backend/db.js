// Backend/db.js
import { randomUUID } from 'node:crypto'

export const db = {
  events: [],
  bookings: [],
  tickets: [],
  users: [],
}

export function generateId() {
  return randomUUID().replace(/-/g, '').slice(0, 12)
}

export function generateTicketId() {
  return `TKT-${new Date().getFullYear()}-${generateId().toUpperCase()}`
}
