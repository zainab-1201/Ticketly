export function health(_req, res) {
  res.status(200).json({ status: 'ok', message: 'Ticketly API is running 🎟️' })
}
