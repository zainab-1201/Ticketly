// src/pages/TicketPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useBookings } from "../hooks/useBookings";
import { formatDate, formatTime, formatPrice } from "../utils/helpers";

function QRPlaceholder({ value }) {
  // Simple visual QR placeholder (SVG grid pattern)
  return (
    <div
      className="w-24 h-24 bg-white p-1.5 rounded-lg"
      title={`QR ref ${value}`}
    >
      <svg
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Corner squares */}
        <rect x="0" y="0" width="3" height="3" fill="#000" />
        <rect x="0.5" y="0.5" width="2" height="2" fill="#fff" />
        <rect x="1" y="1" width="1" height="1" fill="#000" />

        <rect x="7" y="0" width="3" height="3" fill="#000" />
        <rect x="7.5" y="0.5" width="2" height="2" fill="#fff" />
        <rect x="8" y="1" width="1" height="1" fill="#000" />

        <rect x="0" y="7" width="3" height="3" fill="#000" />
        <rect x="0.5" y="7.5" width="2" height="2" fill="#fff" />
        <rect x="1" y="8" width="1" height="1" fill="#000" />

        {/* Data modules */}
        {[4, 5, 6].map((x) =>
          [0, 2, 4, 6, 8].map((y) =>
            Math.random() > 0.5 ? (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="0.9"
                height="0.9"
                fill="#000"
              />
            ) : null,
          ),
        )}
        {[0, 2, 4].map((x) =>
          [4, 5, 6].map((y) =>
            Math.random() > 0.4 ? (
              <rect
                key={`m${x}-${y}`}
                x={x}
                y={y}
                width="0.9"
                height="0.9"
                fill="#000"
              />
            ) : null,
          ),
        )}
      </svg>
    </div>
  );
}

export default function TicketPage() {
  const { ticketId } = useParams();
  const { getTicket } = useBookings();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    getTicket(ticketId)
      .then((data) => {
        if (isMounted) {
          setTicket(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTicket(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [getTicket, ticketId]);

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div className="pt-32 min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <span className="text-6xl">🎟️</span>
        <p className="text-tk-muted font-body">Loading ticket…</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="pt-32 min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
        <span className="text-7xl">🎟️</span>
        <h2 className="font-display text-5xl text-tk-text tracking-wide">
          Ticket Not Found
        </h2>
        <p className="text-tk-muted font-body">
          This ticket ID doesn't exist. Check your booking confirmation.
        </p>
        <Link to="/events" className="btn-gold">
          ← Browse Events
        </Link>
      </div>
    );
  }

  const isBooked = ticket.status === "Booked";

  return (
    <div className="pt-24 pb-20 min-h-screen max-w-2xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <p className="text-tk-orange font-body font-semibold text-sm uppercase tracking-widest mb-1">
            ✦ Digital Ticket
          </p>
          <h1 className="font-display text-4xl text-tk-text tracking-wide">
            Your Ticket
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="btn-ghost text-sm py-2 px-4"
            title="Print ticket"
          >
            🖨️ Print
          </button>
          <Link to="/events" className="btn-ghost text-sm py-2 px-4">
            ← Events
          </Link>
        </div>
      </div>

      {/* THE TICKET */}
      <div
        id="ticket-printable"
        className="relative rounded-2xl overflow-hidden border border-tk-gold/30 shadow-2xl glow-gold"
        style={{
          background: "linear-gradient(135deg, #13151c 0%, #0e1016 100%)",
        }}
      >
        {/* Top colored strip */}
        <div
          className={`h-2 w-full ${isBooked ? "bg-gradient-to-r from-tk-gold to-tk-orange" : "bg-gradient-to-r from-yellow-600 to-yellow-800"}`}
        />

        {/* Ticket pattern overlay */}
        <div className="absolute inset-0 bg-ticket-pattern pointer-events-none" />

        {/* Main content */}
        <div className="relative p-6 sm:p-8 space-y-0">
          {/* Top row */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎟️</span>
                <span className="font-display text-xl text-tk-gold tracking-widest">
                  TICKETLY
                </span>
              </div>
              <span
                className={`badge border text-xs ${
                  isBooked
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                }`}
              >
                {isBooked ? "✅ CONFIRMED" : "📌 RESERVED"}
              </span>
            </div>
            <QRPlaceholder value={ticket.ticketId} />
          </div>

          {/* Event name */}
          <h2 className="font-display text-4xl sm:text-5xl text-tk-text tracking-wide leading-tight mb-6">
            {ticket.eventName}
          </h2>

          {/* Detail grid */}
          <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-6">
            {[
              {
                label: "Date",
                value: formatDate(ticket.eventDate),
                icon: "📅",
              },
              {
                label: "Time",
                value: formatTime(ticket.eventTime),
                icon: "🕐",
              },
              { label: "Venue", value: ticket.venue, icon: "📍" },
              {
                label: "Seats",
                value: `${ticket.seats} seat${ticket.seats !== 1 ? "s" : ""}`,
                icon: "💺",
              },
            ].map(({ label, value, icon }) => (
              <div key={label}>
                <p className="text-xs text-tk-muted font-body uppercase tracking-widest mb-0.5">
                  {icon} {label}
                </p>
                <p className="text-tk-text font-body font-semibold text-sm leading-tight">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Holder */}
          <div className="mb-6">
            <p className="text-xs text-tk-muted font-body uppercase tracking-widest mb-0.5">
              👤 Ticket Holder
            </p>
            <p className="text-tk-text font-body font-semibold">
              {ticket.holderName}
            </p>
            <p className="text-tk-muted font-body text-sm">
              {ticket.holderEmail}
            </p>
          </div>

          {/* Tear line */}
          <div className="tear-line my-6" />

          {/* Bottom stub */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-tk-muted font-body uppercase tracking-widest mb-0.5">
                Ticket ID
              </p>
              <p className="font-display text-2xl text-tk-gold tracking-widest">
                {ticket.ticketId}
              </p>
              <p className="text-xs text-tk-muted font-body mt-0.5">
                Ref: {ticket.bookingRef}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-tk-muted font-body uppercase tracking-widest mb-0.5">
                Total Paid
              </p>
              <p className="font-display text-3xl text-tk-gold tracking-wide">
                {formatPrice(ticket.totalPrice)}
              </p>
            </div>
          </div>

          {/* Issued date */}
          <p className="text-xs text-tk-muted font-body text-center mt-6 pt-4 border-t border-tk-border">
            Issued: {new Date(ticket.issuedAt).toLocaleString("en-PK")} ·
            Ticketly Digital Ticket
          </p>
        </div>

        {/* Bottom colored strip */}
        <div
          className={`h-2 w-full ${isBooked ? "bg-gradient-to-r from-tk-orange to-tk-gold" : "bg-gradient-to-r from-yellow-800 to-yellow-600"}`}
        />
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={handlePrint} className="btn-gold px-8">
          🖨️ Print Ticket
        </button>
        <Link to="/events" className="btn-ghost px-8 text-center">
          🎫 Book Another Event
        </Link>
      </div>

      {/* All tickets link */}
      <p className="text-center mt-6 text-sm text-tk-muted font-body">
        Ticket stored locally on your device.{" "}
        <Link to="/events" className="text-tk-gold hover:underline">
          Explore more events →
        </Link>
      </p>
    </div>
  );
}
