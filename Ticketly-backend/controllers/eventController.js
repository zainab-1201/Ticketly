import { createEvent, deleteEvent, getEventById, listEvents, updateEvent } from '../services/eventService.js'

export async function getEvents(req, res) {
  const events = await listEvents(req.query)
  res.status(200).json(events)
}

export async function getEvent(req, res) {
  const event = await getEventById(req.params.id)
  res.status(200).json(event)
}

export async function postEvent(req, res) {
  const event = await createEvent(req.validatedBody)
  res.status(201).json(event)
}

export async function putEvent(req, res) {
  const event = await updateEvent(req.params.id, req.validatedBody)
  res.status(200).json(event)
}

export async function removeEvent(req, res) {
  await deleteEvent(req.params.id)
  res.status(200).json({ message: 'Event deleted successfully.' })
}
