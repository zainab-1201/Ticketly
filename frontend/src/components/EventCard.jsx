import { Link } from "react-router-dom";
import { CATEGORY_COLORS } from "../data/initialEvents";
import {
  formatDate,
  formatPrice,
  formatTime,
  getAvailabilityBadge,
  getAvailableSeats,
  getSeatFillPercent,
  isEventPast,
} from "../utils/helpers";

export default function EventCard({ event, featured = false }) {
  const catColor = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Music;
  const availability = getAvailabilityBadge(event);
  const availableSeats = getAvailableSeats(event);
  const fillPct = getSeatFillPercent(event);
  const isPast = isEventPast(event.date);

  return (
    <article
      className={`ticket-stub overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:border-tk-gold/40 ${
        featured ? "shadow-[0_10px_30px_rgba(255,197,97,0.18)]" : ""
      }`}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span
            className={`badge border ${catColor.bg} ${catColor.text} ${catColor.border}`}
          >
            {event.category}
          </span>
          {event.featured && (
            <span className="badge border border-tk-gold/30 bg-tk-gold/20 text-tk-gold">
              ⭐ Featured
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="mb-1 line-clamp-2 font-display text-2xl tracking-wide text-tk-text">
            {event.name}
          </h3>
          <p className="text-sm text-tk-muted">
            {formatDate(event.date)} • {formatTime(event.time)}
          </p>
          <p className="text-sm text-tk-muted">{event.venue}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-tk-muted">{availableSeats} seats left</span>
            <span
              className={`badge border px-2.5 py-0.5 text-[11px] ${availability.color}`}
            >
              {availability.label}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-tk-border">
            <div
              className={`h-full rounded-full ${
                fillPct >= 80
                  ? "bg-red-500"
                  : fillPct >= 50
                    ? "bg-yellow-400"
                    : "bg-green-400"
              }`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="font-display text-3xl tracking-wide text-tk-gold">
            {formatPrice(event.price)}
          </span>
          <Link
            to={`/events/${event.id}`}
            className={`btn-gold px-4 py-2 text-sm ${isPast ? "pointer-events-none opacity-60" : ""}`}
          >
            {isPast ? "Ended" : "View"}
          </Link>
        </div>
      </div>
    </article>
  );
}
