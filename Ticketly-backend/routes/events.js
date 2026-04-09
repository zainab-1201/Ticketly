import { Router } from 'express'
import { createEventSchema, updateEventSchema } from '../validators/eventValidators.js'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getEvent, getEvents, postEvent, putEvent, removeEvent } from '../controllers/eventController.js'

const router = Router()

router.get('/', asyncHandler(getEvents))
router.get('/:id', asyncHandler(getEvent))
router.post('/', requireAuth, validateBody(createEventSchema), asyncHandler(postEvent))
router.put('/:id', requireAuth, validateBody(updateEventSchema), asyncHandler(putEvent))
router.delete('/:id', requireAuth, asyncHandler(removeEvent))

export default router
