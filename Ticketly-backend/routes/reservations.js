import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validateBody, requiredPositiveNumber, requiredString } from '../middleware/validate.js'
import { deleteReservation, getReservations, postReservation } from '../controllers/reservationController.js'

const router = Router()

router.post('/', validateBody((body) => ({
  eventId: requiredString(body.eventId, 'eventId'),
  seats: requiredPositiveNumber(body.seats, 'seats', 1),
  holderName: body.holderName,
  holderEmail: body.holderEmail,
})), asyncHandler(postReservation))

router.get('/', asyncHandler(getReservations))
router.delete('/:id', asyncHandler(deleteReservation))

export default router
