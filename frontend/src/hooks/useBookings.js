// src/hooks/useBookings.js  (API version)
import { useState, useCallback } from 'react'
import { createBooking, createReservation, generateTicket, fetchTicket } from '../utils/api'

export function useBookings() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  /**
   * Issue a ticket: creates booking/reservation then generates ticket.
   * @param {object} params
   * @returns {object} the generated ticket
   */
  const issueTicket = useCallback(async ({
    eventId, eventName, eventDate, eventTime, venue,
    seats, pricePerSeat, status, holderName, holderEmail,
  }) => {
    setLoading(true)
    setError(null)
    try {
      // Step 1: create booking or reservation
      if (status === 'Booked') {
        await createBooking({ eventId, seats, holderName, holderEmail })
      } else {
        await createReservation({ eventId, seats, holderName, holderEmail })
      }

      // Step 2: generate ticket
      const ticket = await generateTicket({
        eventId, seats, holderName, holderEmail, status,
      })

      return ticket
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getTicket = useCallback(async (ticketId) => {
    return fetchTicket(ticketId)
  }, [])

  return { loading, error, issueTicket, getTicket }
}