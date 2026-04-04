// src/pages/EventDetailPage.jsx
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents'
import {
  formatDate, formatTime, formatPrice,
  getAvailableSeats, getAvailabilityBadge, getSeatFillPercent, isEventPast
} from '../utils/helpers'
import { CATEGORY_COLORS } from '../data/initialEvents'

export default function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { events } = useEvents()
  const event = events.find((e) => e.id === id)

  if (!event) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
        <span className="text-7xl">🎭</span>
        <h2 className="font-display text-5xl text-tk-text tracking-wide">Event Not Found</h2>
        <p className="text-tk-muted font-body">This event doesn't exist or may have been removed.</p>
        <Link to="/events" className="btn-gold">← Back to Events</Link>
      </div>
    )
  }

  const available = getAvailableSeats(event)
  const badge     = getAvailabilityBadge(event)
  const fillPct   = getSeatFillPercent(event)
  const past      = isEventPast(event.date)
  const soldOut   = available === 0
  const catColor  = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Music

  return (
    <div className="pt-20 pb-20 min-h-screen">
      {/* Hero Image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tk-black via-tk-black/40 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 text-sm font-body text-white bg-black/50 backdrop-blur-sm hover:bg-black/70 px-4 py-2 rounded-lg transition-all"
        >
          ← Back
        </button>

        {/* Badges over image */}
        <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
          <span className={`badge border ${catColor.bg} ${catColor.text} ${catColor.border}`}>
            {event.category}
          </span>
          {past && (
            <span className="badge bg-tk-muted/20 text-tk-muted border border-tk-muted/30">Past Event</span>
          )}
          {event.featured && (
            <span className="badge bg-tk-gold/20 text-tk-gold border border-tk-gold/30">⭐ Featured</span>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="font-display text-5xl md:text-6xl text-tk-text tracking-wide leading-tight mt-4">
                {event.name}
              </h1>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: '📅', label: 'Date', value: formatDate(event.date) },
                { icon: '🕐', label: 'Time', value: formatTime(event.time) },
                { icon: '📍', label: 'Venue', value: event.venue },
                { icon: '🏙️', label: 'City', value: event.city || 'Lahore' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="ticket-stub p-4 flex items-center gap-4">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="text-xs text-tk-muted font-body uppercase tracking-wider">{label}</p>
                    <p className="text-tk-text font-body font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="font-display text-3xl text-tk-text tracking-wide">About This Event</h2>
              <p className="text-tk-muted font-body leading-relaxed text-base">{event.description}</p>
            </div>

            {/* Tags */}
            {event.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span key={tag} className="badge bg-tk-dark border border-tk-border text-tk-muted text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right: Booking Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 ticket-stub p-6 space-y-5">
              <div>
                <p className="text-xs text-tk-muted font-body uppercase tracking-widest">Ticket Price</p>
                <p className="font-display text-4xl text-tk-gold tracking-wide">{formatPrice(event.price)}</p>
                <p className="text-xs text-tk-muted font-body">per seat</p>
              </div>

              <div className="tear-line" />

              {/* Seat stats */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-tk-muted">Total Seats</span>
                  <span className="text-tk-text font-medium">{event.totalSeats}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-tk-muted">Booked</span>
                  <span className="text-red-400 font-medium">{event.bookedSeats}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-tk-muted">Reserved</span>
                  <span className="text-yellow-400 font-medium">{event.reservedSeats}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-tk-muted">Available</span>
                  <span className="text-green-400 font-semibold">{available}</span>
                </div>
              </div>

              {/* Fill bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-body text-tk-muted">
                  <span>{fillPct}% filled</span>
                  <span className={`badge border text-xs py-0.5 px-2 ${badge.color}`}>{badge.label}</span>
                </div>
                <div className="h-2 bg-tk-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      fillPct >= 80 ? 'bg-red-500' : fillPct >= 50 ? 'bg-yellow-400' : 'bg-green-400'
                    }`}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
              </div>

              <div className="tear-line" />

              {/* CTA */}
              {past ? (
                <div className="text-center py-3 text-tk-muted font-body text-sm">
                  This event has already passed.
                </div>
              ) : soldOut ? (
                <div className="text-center py-3 text-red-400 font-body text-sm font-semibold">
                  🚫 Sold Out
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to={`/booking/${event.id}`}
                    className="btn-gold w-full text-center block"
                  >
                    🎫 Book Tickets
                  </Link>
                  <Link
                    to={`/booking/${event.id}?type=reserve`}
                    className="btn-ghost w-full text-center block text-sm py-2.5"
                  >
                    📌 Reserve Seats
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
