// src/pages/EventsPage.jsx
import { useState, useMemo } from "react";
import EventCard from "../components/EventCard";
import { useEvents } from "../hooks/useEvents";

const CATEGORIES = [
  "All",
  "Music",
  "Technology",
  "Comedy",
  "Food",
  "Art",
  "Sports",
];
const SORT_OPTIONS = [
  { value: "date", label: "📅 Date" },
  { value: "price", label: "💰 Price" },
  { value: "seats", label: "💺 Availability" },
];

export default function EventsPage() {
  const { events, loading } = useEvents();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("date");

  const filtered = useMemo(() => {
    let list = [...events];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.city?.toLowerCase().includes(q) ||
          e.category?.toLowerCase().includes(q),
      );
    }

    if (category !== "All") {
      list = list.filter((e) => e.category === category);
    }

    if (sort === "date") {
      list = list.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sort === "price") {
      list = list.sort((a, b) => a.price - b.price);
    } else if (sort === "seats") {
      list = list.sort(
        (a, b) =>
          b.totalSeats -
          b.bookedSeats -
          b.reservedSeats -
          (a.totalSeats - a.bookedSeats - a.reservedSeats),
      );
    }

    return list;
  }, [events, search, category, sort]);

  return (
    <div className="pt-24 pb-20 min-h-screen max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-10 space-y-2">
        <p className="text-tk-orange font-body font-semibold text-sm uppercase tracking-widest">
          ✦ All Events
        </p>
        <h1 className="section-title">Browse Events</h1>
        <p className="text-tk-muted font-body">
          {events.length} events available in Lahore
        </p>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-tk-muted">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search events, venues, cities…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-dark pl-10"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-dark sm:w-44 bg-tk-dark cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-body font-medium border transition-all duration-200 ${
              category === cat
                ? "bg-tk-gold text-tk-black border-tk-gold"
                : "bg-transparent text-tk-muted border-tk-border hover:border-tk-gold hover:text-tk-gold"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="ticket-stub h-80 animate-pulse bg-gradient-to-r from-tk-card via-tk-border to-tk-card bg-[length:200%_100%] animate-shimmer"
            />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <>
          <p className="text-sm text-tk-muted font-body mb-4">
            Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                featured={event.featured}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <span className="text-6xl">🎭</span>
          <h3 className="font-display text-3xl text-tk-text tracking-wide">
            No Events Found
          </h3>
          <p className="text-tk-muted font-body max-w-sm">
            Try adjusting your search or filters. Or{" "}
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="text-tk-gold hover:underline"
            >
              reset all filters
            </button>
            .
          </p>
        </div>
      )}
    </div>
  );
}
