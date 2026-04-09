import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    bookingRef: { type: String, required: true, index: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null, index: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    eventName: { type: String, required: true },
    eventDate: { type: String, required: true },
    eventTime: { type: String, required: true },
    venue: { type: String, required: true },
    seats: { type: Number, required: true, min: 1 },
    pricePerSeat: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['Booked', 'Reserved'], required: true },
    holderName: { type: String, default: 'Guest' },
    holderEmail: { type: String, default: '' },
    issuedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
)

export default mongoose.model('Ticket', ticketSchema)
