const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const TOKEN_STORAGE_KEY = 'ticketly_auth_token'

export function getAuthToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setAuthToken(token) {
  if (!token) {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    return
  }
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

async function request(path, options = {}) {
  const token = getAuthToken()
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  const contentType = res.headers.get('content-type') || ''
  const body = contentType.includes('application/json') ? await res.json() : null

  if (!res.ok) {
    throw new Error(body?.message || 'Request failed.')
  }

  return body
}

function toEventId(event) {
  return event?.id || event?._id
}

export function fetchEvents(filters = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== '') params.set(k, v)
  })
  const query = params.toString() ? `?${params.toString()}` : ''
  return request(`/events${query}`)
}

export function fetchEvent(id) {
  return request(`/events/${id}`)
}

export function createEvent(payload) {
  return request('/events', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateEvent(idOrPayload, maybePayload) {
  const id = typeof idOrPayload === 'string' ? idOrPayload : toEventId(idOrPayload)
  const payload = typeof idOrPayload === 'string' ? maybePayload : idOrPayload
  return request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export function deleteEvent(id) {
  return request(`/events/${id}`, { method: 'DELETE' })
}

export async function createBooking(payload) {
  return request('/bookings', { method: 'POST', body: JSON.stringify(payload) })
}

export function fetchBookings(eventId) {
  const query = eventId ? `?eventId=${encodeURIComponent(eventId)}` : ''
  return request(`/bookings${query}`)
}

export function fetchBooking(id) {
  return request(`/bookings/${id}`)
}

export function createReservation(payload) {
  return request('/reservations', { method: 'POST', body: JSON.stringify(payload) })
}

export function cancelReservation(id) {
  return request(`/reservations/${id}`, { method: 'DELETE' })
}

export function generateTicket(payload) {
  return request('/tickets', { method: 'POST', body: JSON.stringify(payload) })
}

export function fetchTickets() {
  return request('/tickets')
}

export function fetchTicket(ticketId) {
  return request(`/tickets/${ticketId}`)
}

export async function register(payload) {
  const result = await request('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
  if (result?.token) setAuthToken(result.token)
  return result
}

export async function login(payload) {
  const result = await request('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
  if (result?.token) setAuthToken(result.token)
  return result
}

export function fetchMe() {
  return request('/auth/me')
}

export function logout() {
  setAuthToken(null)
}

export { API_BASE_URL, TOKEN_STORAGE_KEY }
