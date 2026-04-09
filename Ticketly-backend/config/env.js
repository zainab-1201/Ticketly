import dotenv from 'dotenv'

dotenv.config()

const unsafeDefaultJwt = 'change-this-super-secret-key'
const configuredJwtSecret = process.env.JWT_SECRET || unsafeDefaultJwt
if (process.env.NODE_ENV === 'production' && configuredJwtSecret === unsafeDefaultJwt) {
  throw new Error('JWT_SECRET must be set in production.')
}
if (process.env.NODE_ENV !== 'production' && configuredJwtSecret === unsafeDefaultJwt) {
  console.warn('⚠️ Using default JWT_SECRET for local development.')
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ticketly',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: configuredJwtSecret,
  reservationHoldMinutes: Number(process.env.RESERVATION_HOLD_MINUTES || 30),
  reservationCleanupIntervalMs: Number(process.env.RESERVATION_CLEANUP_INTERVAL_MS || 60000),
}
