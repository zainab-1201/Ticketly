import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { authRateLimit } from '../middleware/rateLimit.js'
import { requireAuth } from '../middleware/auth.js'
import { validateBody, requiredString } from '../middleware/validate.js'
import { login, me, register } from '../controllers/authController.js'

const router = Router()

const authPayload = (body) => ({
  name: body.name?.trim(),
  email: requiredString(body.email, 'email').toLowerCase(),
  password: requiredString(body.password, 'password'),
})

router.post('/register', authRateLimit, validateBody(authPayload), asyncHandler(register))
router.post('/login', authRateLimit, validateBody((body) => ({
  email: requiredString(body.email, 'email').toLowerCase(),
  password: requiredString(body.password, 'password'),
})), asyncHandler(login))
router.get('/me', requireAuth, asyncHandler(me))

export default router
