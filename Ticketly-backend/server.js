import app from './app.js'
import { env } from './config/env.js'
import { connectDatabase } from './config/db.js'
import { startReservationCleanupJob } from './jobs/reservationCleanup.js'

async function bootstrap() {
  await connectDatabase()

  app.listen(env.port, () => {
    console.log(`🎟️ Ticketly API running at http://localhost:${env.port}/api`)
  })

  startReservationCleanupJob()
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
