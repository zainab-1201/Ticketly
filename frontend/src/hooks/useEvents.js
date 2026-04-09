// src/hooks/useEvents.js  (API version)
import { useState, useEffect, useCallback } from 'react'
import { fetchEvents, fetchEvent, createEvent, updateEvent, deleteEvent } from '../utils/api'

export function useEvents(filters = {}) {
  const [events,  setEvents]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchEvents(filters)
      setEvents(data)
    } catch (err) {
      setError(err.message || 'Failed to load events.')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)])

  useEffect(() => { load() }, [load])

  const addEvent = useCallback(async (eventData) => {
    const created = await createEvent(eventData)
    await load()
    return created
  }, [load])

  const editEvent = useCallback(async (idOrData, eventData) => {
    const resolvedId = typeof idOrData === 'string' ? idOrData : idOrData?.id
    const resolvedData = eventData || idOrData
    const updated = await updateEvent(resolvedId, resolvedData)
    await load()
    return updated
  }, [load])

  const removeEvent = useCallback(async (id) => {
    await deleteEvent(id)
    await load()
  }, [load])

  return {
    events, loading, error,
    refresh: load,
    addEvent, editEvent,
    deleteEvent: removeEvent,
  }
}

// Single event hook
export function useEvent(id) {
  const [event,   setEvent]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchEvent(id)
      .then((data) => { setEvent(data); setError(null) })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  return { event, loading, error }
}