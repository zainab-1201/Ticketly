import { INITIAL_EVENTS } from "../data/initialEvents";

const EVENTS_KEY = "ticketly-events";
const BOOKINGS_KEY = "ticketly-bookings";
const RESERVATIONS_KEY = "ticketly-reservations";
const TICKETS_KEY = "ticketly-tickets";

function safeParse(value, fallback) {
	if (!value) {
		return fallback;
	}

	try {
		return JSON.parse(value);
	} catch {
		return fallback;
	}
}

function ensureSeeded() {
	if (!localStorage.getItem(EVENTS_KEY)) {
		localStorage.setItem(EVENTS_KEY, JSON.stringify(INITIAL_EVENTS));
	}

	if (!localStorage.getItem(BOOKINGS_KEY)) {
		localStorage.setItem(BOOKINGS_KEY, JSON.stringify([]));
	}

	if (!localStorage.getItem(RESERVATIONS_KEY)) {
		localStorage.setItem(RESERVATIONS_KEY, JSON.stringify([]));
	}

	if (!localStorage.getItem(TICKETS_KEY)) {
		localStorage.setItem(TICKETS_KEY, JSON.stringify([]));
	}
}

function loadEvents() {
	ensureSeeded();
	return safeParse(localStorage.getItem(EVENTS_KEY), INITIAL_EVENTS);
}

function saveEvents(events) {
	localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

function loadList(key) {
	ensureSeeded();
	return safeParse(localStorage.getItem(key), []);
}

function saveList(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

function generateId(prefix) {
	const rand = Math.random().toString(36).slice(2, 8);
	return `${prefix}-${Date.now().toString(36)}-${rand}`;
}

export async function fetchEvents() {
	return loadEvents();
}

export async function fetchEvent(id) {
	const event = loadEvents().find((item) => item.id === id);
	if (!event) {
		throw new Error("Event not found");
	}
	return event;
}

export async function createEvent(eventData) {
	const events = loadEvents();
	events.push(eventData);
	saveEvents(events);
	return eventData;
}

export async function updateEvent(id, eventData) {
	const events = loadEvents();
	const index = events.findIndex((item) => item.id === id);
	if (index === -1) {
		throw new Error("Event not found");
	}

	const updated = { ...events[index], ...eventData, id };
	events[index] = updated;
	saveEvents(events);
	return updated;
}

export async function deleteEvent(id) {
	const events = loadEvents();
	const next = events.filter((item) => item.id !== id);
	saveEvents(next);
}

export async function createBooking(payload) {
	const bookings = loadList(BOOKINGS_KEY);
	const entry = { ...payload, id: generateId("booking"), createdAt: Date.now() };
	bookings.push(entry);
	saveList(BOOKINGS_KEY, bookings);
	return entry;
}

export async function createReservation(payload) {
	const reservations = loadList(RESERVATIONS_KEY);
	const entry = {
		...payload,
		id: generateId("reserve"),
		createdAt: Date.now(),
	};
	reservations.push(entry);
	saveList(RESERVATIONS_KEY, reservations);
	return entry;
}

export async function generateTicket(payload) {
	const tickets = loadList(TICKETS_KEY);
	const pricePerSeat = Number(payload.pricePerSeat ?? payload.price ?? 0);
	const seats = Number(payload.seats ?? 0);
	const ticket = {
		ticketId: generateId("tkt"),
		bookingRef: generateId("ref"),
		status: payload.status,
		seats,
		pricePerSeat,
		totalPrice: pricePerSeat * seats,
		issuedAt: new Date().toISOString(),
		eventId: payload.eventId,
		eventName: payload.eventName,
		eventDate: payload.eventDate,
		eventTime: payload.eventTime,
		venue: payload.venue,
		holderName: payload.holderName,
		holderEmail: payload.holderEmail,
	};

	tickets.push(ticket);
	saveList(TICKETS_KEY, tickets);
	return ticket;
}

export async function fetchTicket(ticketId) {
	const tickets = loadList(TICKETS_KEY);
	return tickets.find((item) => item.ticketId === ticketId) || null;
}
