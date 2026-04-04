// src/pages/AdminPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents'
import { formatDate, formatPrice, getAvailableSeats, getSeatFillPercent } from '../utils/helpers'
import { CATEGORY_COLORS } from '../data/initialEvents'
import { v4 as uuidv4 } from 'uuid'

const EMPTY_FORM = {
  name: '', category: 'Music', date: '', time: '19:00',
  venue: '', city: 'Lahore', totalSeats: '', price: '',
  description: '', image: '', tags: '', featured: false,
}

const CATEGORIES = ['Music', 'Technology', 'Comedy', 'Food', 'Art', 'Sports']

function validate(form) {
  const errs = {}
  if (!form.name.trim())        errs.name        = 'Event name required.'
  if (!form.date)                errs.date        = 'Date required.'
  if (!form.venue.trim())       errs.venue       = 'Venue required.'
  if (!form.totalSeats || +form.totalSeats < 1) errs.totalSeats = 'Enter valid seat count.'
  if (!form.price || +form.price < 0)           errs.price      = 'Enter valid price.'
  if (!form.description.trim()) errs.description = 'Description required.'
  return errs
}

export default function AdminPage() {
  const { events, addEvent, editEvent, deleteEvent } = useEvents()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId]  = useState(null)
  const [form, setForm]            = useState(EMPTY_FORM)
  const [errors, setErrors]        = useState({})
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [toast, setToast]          = useState(null)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  function openAdd() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setErrors({})
    setShowForm(true)
  }

  function openEdit(event) {
    setForm({
      name:        event.name,
      category:    event.category || 'Music',
      date:        event.date,
      time:        event.time || '19:00',
      venue:       event.venue,
      city:        event.city || 'Lahore',
      totalSeats:  String(event.totalSeats),
      price:       String(event.price),
      description: event.description || '',
      image:       event.image || '',
      tags:        (event.tags || []).join(', '),
      featured:    !!event.featured,
    })
    setEditingId(event.id)
    setErrors({})
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditingId(null)
    setErrors({})
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) return setErrors(errs)
    setErrors({})

    const eventData = {
      id:            editingId || `evt-${uuidv4().slice(0, 8)}`,
      name:          form.name.trim(),
      category:      form.category,
      date:          form.date,
      time:          form.time,
      venue:         form.venue.trim(),
      city:          form.city.trim() || 'Lahore',
      totalSeats:    +form.totalSeats,
      bookedSeats:   editingId ? (events.find((e) => e.id === editingId)?.bookedSeats || 0) : 0,
      reservedSeats: editingId ? (events.find((e) => e.id === editingId)?.reservedSeats || 0) : 0,
      price:         +form.price,
      description:   form.description.trim(),
      image:         form.image.trim() || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop',
      tags:          form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      featured:      form.featured,
    }

    if (editingId) {
      editEvent(eventData)
      showToast('Event updated successfully!')
    } else {
      addEvent(eventData)
      showToast('Event created successfully!')
    }

    setShowForm(false)
    setEditingId(null)
  }

  function handleDelete(id) {
    deleteEvent(id)
    setDeleteConfirm(null)
    showToast('Event deleted.', 'error')
  }

  // Stats
  const totalEvents   = events.length
  const totalSeats    = events.reduce((s, e) => s + e.totalSeats, 0)
  const totalBooked   = events.reduce((s, e) => s + e.bookedSeats, 0)
  const totalRevenue  = events.reduce((s, e) => s + e.bookedSeats * e.price, 0)

  return (
    <div className="pt-24 pb-20 min-h-screen max-w-7xl mx-auto px-4 sm:px-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl font-body text-sm font-semibold shadow-xl border transition-all duration-300 ${
            toast.type === 'error'
              ? 'bg-red-500/20 border-red-500/30 text-red-300'
              : 'bg-green-500/20 border-green-500/30 text-green-300'
          }`}
        >
          {toast.type === 'error' ? '🗑️' : '✅'} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-10 gap-4">
        <div>
          <p className="text-tk-orange font-body font-semibold text-sm uppercase tracking-widest mb-2">✦ Admin Panel</p>
          <h1 className="section-title">Manage<br />Events</h1>
        </div>
        <button onClick={openAdd} className="btn-gold shrink-0 mt-4">
          ➕ Add Event
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Events',   value: totalEvents,             icon: '🎪', color: 'text-tk-gold' },
          { label: 'Total Seats',    value: totalSeats,              icon: '💺', color: 'text-blue-400' },
          { label: 'Seats Booked',   value: totalBooked,             icon: '✅', color: 'text-green-400' },
          { label: 'Est. Revenue',   value: formatPrice(totalRevenue), icon: '💰', color: 'text-tk-orange' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="ticket-stub p-4 space-y-2">
            <span className="text-2xl">{icon}</span>
            <div className={`font-display text-2xl ${color}`}>{value}</div>
            <div className="text-xs text-tk-muted font-body">{label}</div>
          </div>
        ))}
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-tk-card border border-tk-border rounded-2xl p-6 sm:p-8 my-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-3xl text-tk-text tracking-wide">
                {editingId ? 'Edit Event' : 'New Event'}
              </h2>
              <button onClick={handleCancel} className="text-tk-muted hover:text-tk-text text-xl transition-colors">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm text-tk-muted font-body mb-1">Event Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Concert name…" className="input-dark" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Category + Featured */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-tk-muted font-body mb-1">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="input-dark bg-tk-dark cursor-pointer">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={form.featured}
                      onChange={handleChange}
                      className="w-5 h-5 accent-tk-gold"
                    />
                    <span className="text-sm text-tk-muted font-body">⭐ Featured event</span>
                  </label>
                </div>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-tk-muted font-body mb-1">Date *</label>
                  <input type="date" name="date" value={form.date} onChange={handleChange} className="input-dark" />
                  {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm text-tk-muted font-body mb-1">Time</label>
                  <input type="time" name="time" value={form.time} onChange={handleChange} className="input-dark" />
                </div>
              </div>

              {/* Venue + City */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-tk-muted font-body mb-1">Venue *</label>
                  <input name="venue" value={form.venue} onChange={handleChange} placeholder="Lahore Arena" className="input-dark" />
                  {errors.venue && <p className="text-red-400 text-xs mt-1">{errors.venue}</p>}
                </div>
                <div>
                  <label className="block text-sm text-tk-muted font-body mb-1">City</label>
                  <input name="city" value={form.city} onChange={handleChange} placeholder="Lahore" className="input-dark" />
                </div>
              </div>

              {/* Seats + Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-tk-muted font-body mb-1">Total Seats *</label>
                  <input type="number" name="totalSeats" value={form.totalSeats} onChange={handleChange} placeholder="100" min="1" className="input-dark" />
                  {errors.totalSeats && <p className="text-red-400 text-xs mt-1">{errors.totalSeats}</p>}
                </div>
                <div>
                  <label className="block text-sm text-tk-muted font-body mb-1">Price (PKR) *</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="2000" min="0" className="input-dark" />
                  {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-tk-muted font-body mb-1">Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell attendees what to expect…"
                  className="input-dark resize-none"
                />
                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm text-tk-muted font-body mb-1">Image URL</label>
                <input name="image" value={form.image} onChange={handleChange} placeholder="https://…" className="input-dark" />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm text-tk-muted font-body mb-1">Tags (comma separated)</label>
                <input name="tags" value={form.tags} onChange={handleChange} placeholder="Live Music, Concert, Nightlife" className="input-dark" />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleCancel} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" className="btn-gold flex-1">
                  {editingId ? '💾 Update Event' : '✨ Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-tk-card border border-red-500/30 rounded-2xl p-6 space-y-5 text-center">
            <span className="text-5xl">⚠️</span>
            <h3 className="font-display text-2xl text-tk-text tracking-wide">Delete Event?</h3>
            <p className="text-tk-muted font-body text-sm">
              This will permanently remove <strong className="text-tk-text">{deleteConfirm.name}</strong> and all associated data.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-ghost flex-1">Cancel</button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 bg-red-500/20 text-red-400 border border-red-500/30 font-body font-bold px-6 py-3 rounded-lg hover:bg-red-500/30 transition-all"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events Table */}
      {events.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <span className="text-6xl">🎪</span>
          <h3 className="font-display text-3xl text-tk-text tracking-wide">No Events Yet</h3>
          <p className="text-tk-muted font-body">Create your first event to get started.</p>
          <button onClick={openAdd} className="btn-gold">➕ Add First Event</button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="font-display text-3xl text-tk-text tracking-wide mb-6">All Events ({events.length})</h2>
          {events.map((event) => {
            const available = getAvailableSeats(event)
            const fillPct   = getSeatFillPercent(event)
            const catColor  = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Music

            return (
              <div key={event.id} className="ticket-stub p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Image thumb */}
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-tk-dark">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&auto=format&fit=crop' }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-xl text-tk-text tracking-wide truncate">{event.name}</h3>
                    <span className={`badge border text-xs ${catColor.bg} ${catColor.text} ${catColor.border}`}>
                      {event.category}
                    </span>
                    {event.featured && <span className="badge bg-tk-gold/10 text-tk-gold border border-tk-gold/20 text-xs">⭐</span>}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-tk-muted font-body">
                    <span>📅 {formatDate(event.date)}</span>
                    <span>📍 {event.venue}</span>
                    <span>💰 {formatPrice(event.price)}</span>
                  </div>
                  {/* Seat bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-tk-border rounded-full overflow-hidden max-w-32">
                      <div
                        className={`h-full rounded-full ${fillPct >= 80 ? 'bg-red-400' : fillPct >= 50 ? 'bg-yellow-400' : 'bg-green-400'}`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                    <span className="text-xs text-tk-muted font-body">
                      {available}/{event.totalSeats} available
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/events/${event.id}`}
                    className="p-2 rounded-lg text-tk-muted hover:text-tk-gold hover:bg-tk-gold/10 transition-all"
                    title="View event"
                  >
                    👁️
                  </Link>
                  <button
                    onClick={() => openEdit(event)}
                    className="p-2 rounded-lg text-tk-muted hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                    title="Edit event"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(event)}
                    className="p-2 rounded-lg text-tk-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
                    title="Delete event"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
