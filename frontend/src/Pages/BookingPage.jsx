import { useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useBookings } from "../hooks/useBookings";
import { useEvents } from "../hooks/useEvents";
import {
  formatDate,
  formatPrice,
  formatTime,
  getAvailableSeats,
} from "../utils/helpers";

const INITIAL_FORM = {
  holderName: "",
  holderEmail: "",
  seats: 1,
};

export default function BookingPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = searchParams.get("type") === "reserve" ? "reserve" : "book";

  const { events, editEvent } = useEvents();
  const { issueTicket } = useBookings();

  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const event = events.find((item) => item.id === id);

  const availableSeats = useMemo(() => {
    if (!event) {
      return 0;
    }
    return getAvailableSeats(event);
  }, [event]);

  if (!event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 text-center">
        <span className="text-6xl">🎟️</span>
        <h1 className="font-display text-5xl tracking-wide text-tk-text">
          Event Not Found
        </h1>
        <p className="max-w-md text-tk-muted">
          The event you are trying to book does not exist anymore.
        </p>
        <Link to="/events" className="btn-gold">
          Browse Events
        </Link>
      </div>
    );
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "seats") {
      const next = Number(value);
      setForm((curr) => ({ ...curr, seats: Number.isNaN(next) ? 1 : next }));
      return;
    }

    setForm((curr) => ({ ...curr, [name]: value }));
  }

  function validate() {
    if (!form.holderName.trim()) {
      return "Please enter your name.";
    }

    const email = form.holderEmail.trim();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return "Please enter a valid email address.";
    }

    if (form.seats < 1) {
      return "At least 1 seat is required.";
    }

    if (form.seats > availableSeats) {
      return "Requested seats exceed available seats.";
    }

    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");

    const seatKey = type === "reserve" ? "reservedSeats" : "bookedSeats";

    try {
      const ticket = await issueTicket({
        eventId: event.id,
        eventName: event.name,
        eventDate: event.date,
        eventTime: event.time,
        venue: event.venue,
        seats: Number(form.seats),
        pricePerSeat: Number(event.price),
        status: type === "reserve" ? "Reserved" : "Booked",
        holderName: form.holderName.trim(),
        holderEmail: form.holderEmail.trim(),
      });

      await editEvent(event.id, {
        ...event,
        [seatKey]: Number(event[seatKey] || 0) + Number(form.seats),
      });

      navigate(`/ticket/${ticket.ticketId}`);
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const totalPrice = Number(form.seats || 0) * Number(event.price || 0);

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-20 pt-24 sm:px-6">
      <div className="mb-8">
        <Link
          to={`/events/${event.id}`}
          className="text-sm font-semibold text-tk-muted hover:text-tk-gold"
        >
          ← Back to Event
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className="ticket-stub p-6 lg:col-span-2">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-tk-orange">
            ✦ Confirm Details
          </p>
          <h1 className="mb-6 font-display text-5xl tracking-wide text-tk-text">
            {type === "reserve" ? "Reserve Seats" : "Book Tickets"}
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm text-tk-muted">
                Full Name
              </label>
              <input
                name="holderName"
                value={form.holderName}
                onChange={handleChange}
                className="input-dark"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-tk-muted">Email</label>
              <input
                name="holderEmail"
                type="email"
                value={form.holderEmail}
                onChange={handleChange}
                className="input-dark"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-tk-muted">Seats</label>
              <input
                name="seats"
                type="number"
                min="1"
                max={availableSeats}
                value={form.seats}
                onChange={handleChange}
                className="input-dark"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-gold mt-2 w-full"
              disabled={submitting}
            >
              {submitting
                ? "Processing..."
                : type === "reserve"
                  ? `Reserve for ${formatPrice(totalPrice)}`
                  : `Pay ${formatPrice(totalPrice)}`}
            </button>
          </form>
        </section>

        <aside className="ticket-stub h-fit space-y-4 p-6">
          <h2 className="font-display text-3xl tracking-wide text-tk-text">
            {event.name}
          </h2>
          <p className="text-sm text-tk-muted">
            {formatDate(event.date)} • {formatTime(event.time)}
          </p>
          <p className="text-sm text-tk-muted">{event.venue}</p>

          <div className="tear-line my-1" />

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-tk-muted">Price per seat</span>
              <span className="font-semibold text-tk-text">
                {formatPrice(event.price)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-tk-muted">Available seats</span>
              <span className="font-semibold text-green-400">
                {availableSeats}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-tk-muted">Total</span>
              <span className="font-display text-2xl tracking-wide text-tk-gold">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
