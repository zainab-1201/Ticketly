// src/pages/HomePage.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EventCard from '../components/EventCard'
import { useEvents } from '../hooks/useEvents'

const STATS = [
  { label: 'Events Listed',    value: '6+',   icon: '🎪' },
  { label: 'Seats Available',  value: '500+', icon: '💺' },
  { label: 'Cities Covered',   value: '1',    icon: '🏙️' },
  { label: 'Happy Attendees',  value: '1K+',  icon: '🎉' },
]

export default function HomePage() {
  const { events } = useEvents()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const featured = events.filter((e) => e.featured).slice(0, 3)

  return (
    <div className="overflow-hidden">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center bg-hero-gradient noise-overlay pt-16">
        {/* Decorative glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-tk-gold/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-tk-orange/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          {/* Eyebrow */}
          <span
            className={`inline-flex items-center gap-2 badge bg-tk-gold/10 text-tk-gold border border-tk-gold/20 transition-all duration-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            🎟️ Pakistan's Event Platform
          </span>

          {/* Headline */}
          <h1
            className={`font-display text-6xl sm:text-8xl md:text-9xl leading-none tracking-wide transition-all duration-700 delay-100 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span className="block text-tk-text">YOUR NEXT</span>
            <span className="block text-gradient-gold">UNFORGETTABLE</span>
            <span className="block text-tk-text">NIGHT AWAITS</span>
          </h1>

          {/* Sub */}
          <p
            className={`max-w-xl mx-auto text-lg text-tk-muted font-body leading-relaxed transition-all duration-700 delay-200 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Discover concerts, tech summits, comedy nights and more. Book your seats in seconds and get a digital ticket instantly.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Link to="/events" className="btn-gold text-base px-8 py-3.5 animate-pulse-glow">
              🎫 Browse Events
            </Link>
            <Link to="/admin" className="btn-ghost text-base px-8 py-3.5">
              ➕ Add Event
            </Link>
          </div>

          {/* Scroll hint */}
          <div className={`pt-8 transition-all duration-700 delay-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-6 h-10 border-2 border-tk-border rounded-full mx-auto flex items-start justify-center pt-1.5">
              <div className="w-1 h-2.5 bg-tk-gold rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────── */}
      <section className="py-16 bg-tk-dark border-y border-tk-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ label, value, icon }) => (
              <div key={label} className="text-center space-y-2">
                <div className="text-3xl">{icon}</div>
                <div className="font-display text-4xl text-tk-gold tracking-wide">{value}</div>
                <div className="text-sm text-tk-muted font-body">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED EVENTS ──────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-tk-orange font-body font-semibold text-sm uppercase tracking-widest mb-2">
              ✦ Don't Miss Out
            </p>
            <h2 className="section-title">Featured<br />Events</h2>
          </div>
          <Link to="/events" className="btn-ghost text-sm py-2 px-5 shrink-0">
            View All →
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((event) => (
              <EventCard key={event.id} event={event} featured />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-tk-muted font-body">
            No featured events yet. <Link to="/admin" className="text-tk-gold hover:underline">Add one →</Link>
          </div>
        )}
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="py-20 bg-tk-dark border-y border-tk-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-tk-orange font-body font-semibold text-sm uppercase tracking-widest mb-2">
              ✦ Simple Process
            </p>
            <h2 className="section-title">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '🔍', title: 'Browse Events', desc: 'Discover concerts, summits, comedy nights and more happening near you.' },
              { step: '02', icon: '💺', title: 'Pick Your Seats', desc: 'Select how many seats you need, choose booking or reservation.' },
              { step: '03', icon: '🎟️', title: 'Get Your Ticket', desc: 'Instant digital ticket generated with your unique booking ID.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="ticket-stub p-6 space-y-4 text-center group hover:border-tk-gold/30 transition-all duration-300">
                <div className="font-display text-6xl text-tk-gold/20 group-hover:text-tk-gold/40 transition-colors">{step}</div>
                <div className="text-4xl">{icon}</div>
                <h3 className="font-display text-2xl text-tk-text tracking-wide">{title}</h3>
                <p className="text-tk-muted font-body text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-tk-gold/10 via-tk-orange/10 to-tk-gold/10 border border-tk-gold/20 p-10 md:p-16 text-center space-y-6">
          <div className="absolute inset-0 bg-ticket-pattern opacity-50" />
          <div className="relative space-y-4">
            <h2 className="font-display text-5xl md:text-6xl text-tk-text tracking-wide">
              Ready to book your <span className="text-gradient-gold">next event?</span>
            </h2>
            <p className="text-tk-muted font-body max-w-lg mx-auto">
              Join thousands of event-goers. No account needed — just pick an event, grab your seats, done.
            </p>
            <Link to="/events" className="btn-gold inline-block text-base px-10 py-4 mt-2">
              🎫 Find My Event
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
