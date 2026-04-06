const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const AUTH_TOKEN_KEY = 'ticketly_auth_token'

function getUrl(path, query = {}) {
  const url = new URL(`${API_BASE_URL}${path}`)
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })
  return url.toString()
}

export function setAuthToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

async function request(path, options = {}) {
  const { query, auth = false, ...fetchOptions } = options

  const headers = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers || {}),
  }

  if (auth) {
    const token = getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(getUrl(path, query), {
    ...fetchOptions,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`)
  }

  return data
}

export function signup(payload) {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function login(payload) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (data.token) {
    setAuthToken(data.token)
  }

  return data
}

export function fetchEvents(filters = {}) {
  return request('/events', {
    method: 'GET',
    query: filters,
  })
}

export function fetchEvent(id) {
  return request(`/events/${id}`, { method: 'GET' })
}

export function createEvent(payload) {
  return request('/events', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  })
}

export function updateEvent(id, payload) {
  return request(`/events/${id}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload),
  })
}

export function deleteEvent(id) {
  return request(`/events/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}

export function createBooking(payload) {
  return request('/bookings', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  })
}

export function createReservation(payload) {
  return request('/reservations', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  })
}

export function generateTicket(payload) {
  return request('/tickets', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  })
}

export function fetchTicket(ticketId) {
  return request(`/tickets/${ticketId}`, {
    method: 'GET',
    auth: true,
  })
}
