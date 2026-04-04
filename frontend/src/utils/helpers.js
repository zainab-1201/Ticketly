export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-PK", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(timeStr) {
  const [h = "00", m = "00"] = String(timeStr || "00:00").split(":");
  const date = new Date();
  date.setHours(Number(h), Number(m), 0);
  return date.toLocaleTimeString("en-PK", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatPrice(value) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function getAvailableSeats(event) {
  return Math.max(
    0,
    (event.totalSeats || 0) -
      (event.bookedSeats || 0) -
      (event.reservedSeats || 0),
  );
}

export function getSeatFillPercent(event) {
  const total = Number(event.totalSeats || 0);
  if (total === 0) {
    return 0;
  }

  const filled =
    Number(event.bookedSeats || 0) + Number(event.reservedSeats || 0);
  return Math.min(100, Math.round((filled / total) * 100));
}

export function getAvailabilityBadge(event) {
  const available = getAvailableSeats(event);
  if (available === 0) {
    return {
      label: "Sold Out",
      color: "bg-red-500/20 text-red-300 border-red-500/30",
    };
  }

  if (available <= 20) {
    return {
      label: "Limited",
      color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    };
  }

  return {
    label: "Available",
    color: "bg-green-500/20 text-green-300 border-green-500/30",
  };
}

export function isEventPast(dateStr) {
  const eventDay = new Date(dateStr);
  const today = new Date();
  eventDay.setHours(23, 59, 59, 999);
  return eventDay < today;
}
