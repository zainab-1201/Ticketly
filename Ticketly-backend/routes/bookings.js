import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validateBody, requiredPositiveNumber } from '../middleware/validate.js'
import { getBooking, getBookings, postBooking } from '../controllers/bookingController.js'
import { ApiError } from '../utils/apiError.js'

const router = Router()

router.post('/', validateBody((body) => {
  const seats = body.seats !== undefined ? requiredPositiveNumber(body.seats, 'seats', 1) : undefined
  if (seats !== undefined && seats > 10) throw new ApiError(400, 'seats must be between 1 and 10.')

  if (!body.reservationId && !body.eventId) {
    throw new ApiError(400, 'eventId is required when reservationId is not provided.')
  }

  return {
    eventId: body.eventId,
    seats,
    reservationId: body.reservationId,
    holderName: body.holderName,
    holderEmail: body.holderEmail,
  }
}), asyncHandler(postBooking))

router.get('/', asyncHandler(getBookings))
router.get('/:id', asyncHandler(getBooking))

export default router
