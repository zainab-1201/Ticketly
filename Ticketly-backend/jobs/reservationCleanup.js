import { env } from '../config/env.js'
import { expireReservations } from '../services/reservationService.js'

let timer = null

export function startReservationCleanupJob() {
  if (timer) return

  timer = setInterval(async () => {
    try {
      const result = await expireReservations()
      if (result.expiredCount > 0) {
        console.log(`🧹 Expired ${result.expiredCount} reservation(s).`)
      }
    } catch (err) {
      console.error('Reservation cleanup failed:', err.message)
    }
  }, env.reservationCleanupIntervalMs)
}
