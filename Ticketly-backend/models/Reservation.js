import mongoose from 'mongoose'

const reservationSchema = new mongoose.Schema(
  {
    reservationRef: { type: String, required: true, unique: true, index: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    seats: { type: Number, required: true, min: 1, max: 10 },
    status: { type: String, enum: ['Active', 'Cancelled', 'Expired', 'Confirmed'], default: 'Active', index: true },
    holderName: { type: String, default: 'Guest', trim: true },
    holderEmail: { type: String, default: '', trim: true, lowercase: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
)

reservationSchema.index({ eventId: 1, status: 1, expiresAt: 1 })

export default mongoose.model('Reservation', reservationSchema)
