import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    category: { type: String, default: 'Music', trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, default: '19:00', trim: true },
    venue: { type: String, required: true, trim: true, index: true },
    city: { type: String, default: 'Lahore', trim: true, index: true },
    totalSeats: { type: Number, required: true, min: 1 },
    bookedSeats: { type: Number, default: 0, min: 0 },
    reservedSeats: { type: Number, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
)

eventSchema.index({ name: 'text', venue: 'text', city: 'text' })

export default mongoose.model('Event', eventSchema)
