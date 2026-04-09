import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validateBody } from '../middleware/validate.js'
import { getTicket, getTickets, postTicket } from '../controllers/ticketController.js'

const router = Router()

router.post('/', validateBody((body) => ({
  bookingId: body.bookingId,
  bookingRef: body.bookingRef,
  eventId: body.eventId,
  seats: body.seats,
  status: body.status,
  holderName: body.holderName,
  holderEmail: body.holderEmail,
})), asyncHandler(postTicket))

router.get('/', asyncHandler(getTickets))
router.get('/:ticketId', asyncHandler(getTicket))

export default router
