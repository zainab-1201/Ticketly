import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    bookingRef: { type: String, required: true, unique: true, index: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', default: null, index: true },
    seats: { type: Number, required: true, min: 1, max: 10 },
    status: { type: String, enum: ['Booked'], default: 'Booked' },
    holderName: { type: String, default: 'Guest', trim: true },
    holderEmail: { type: String, default: '', trim: true, lowercase: true },
  },
  { timestamps: true }
)

export default mongoose.model('Booking', bookingSchema)
