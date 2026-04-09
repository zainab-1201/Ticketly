import { createTicketFromPayload, getTicketByTicketId, listTickets } from '../services/ticketService.js'

export async function postTicket(req, res) {
  const ticket = await createTicketFromPayload(req.validatedBody)
  res.status(201).json(ticket)
}

export async function getTickets(req, res) {
  const tickets = await listTickets()
  res.status(200).json(tickets)
}

export async function getTicket(req, res) {
  const ticket = await getTicketByTicketId(req.params.ticketId)
  res.status(200).json(ticket)
}
