// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-tk-border bg-tk-dark mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎟️</span>
              <span className="font-display text-3xl tracking-widest text-tk-gold">
                TICKETLY
              </span>
            </div>
            <p className="text-tk-muted text-sm font-body leading-relaxed">
              Your go-to platform for discovering events, booking seats, and
              generating digital tickets — all in one place.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="font-display text-lg text-tk-text tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm font-body text-tk-muted">
              {[
                { to: "/", label: "Home" },
                { to: "/events", label: "Browse Events" },
                { to: "/admin", label: "Admin Panel" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="hover:text-tk-gold transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <h4 className="font-display text-lg text-tk-text tracking-wide">
              Info
            </h4>
            <ul className="space-y-2 text-sm font-body text-tk-muted">
              <li>📍 Lahore, Pakistan</li>
              <li>📧 hello@ticketly.pk</li>
              <li>🕐 Data stored locally on your device</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-tk-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-tk-muted font-body">
          <p>
            © {new Date().getFullYear()} Ticketly. Built with React + Tailwind.
          </p>
          <p className="text-gradient-gold font-semibold">
            🎟️ Every seat tells a story.
          </p>
        </div>
      </div>
    </footer>
  );
}
