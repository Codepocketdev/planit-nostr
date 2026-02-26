import { useState, useCallback, useEffect, useRef } from 'react'
import { subscribeRelays, publishAddTodo, publishDeleteTodo, publishUpdateTodo } from '../utils/nostr'

export function useNostr(skRaw, pkRaw) {
  const [todos, setTodos] = useState([])
  const seenIds = useRef(new Set())
  const timestamps = useRef({})

  useEffect(() => {
    if (!pkRaw) return
    setTodos([])
    seenIds.current.clear()
    timestamps.current = {}

    const unsub = subscribeRelays(
      [{ kinds: [1], authors: [pkRaw], '#t': ['planit'], limit: 200 }],
      (event) => {
        if (seenIds.current.has(event.id)) return
        seenIds.current.add(event.id)
        try {
          const data = JSON.parse(event.content)
          const action = event.tags.find(t => t[0] === 't' && t[1].startsWith('planit-'))?.[1]
          if (action === 'planit-delete') {
            setTodos(prev => prev.filter(t => t.id !== data.id))
            timestamps.current[data.id] = Infinity
            return
          }
          if (action === 'planit-add' || action === 'planit-update') {
            if (event.created_at <= (timestamps.current[data.id] || 0)) return
            timestamps.current[data.id] = event.created_at
            setTodos(prev => {
              const exists = prev.find(t => t.id === data.id)
              if (exists) return prev.map(t => t.id === data.id ? { ...data, eventCreatedAt: event.created_at } : t)
              return [{ ...data, eventCreatedAt: event.created_at }, ...prev].sort((a, b) => (b.eventCreatedAt || 0) - (a.eventCreatedAt || 0))
            })
          }
        } catch {}
      }
    )
    return () => unsub && unsub()
  }, [pkRaw])

  const addTodo = useCallback(async ({ task, category, priority, dueTime, duration }) => {
    if (!task.trim() || !skRaw || !pkRaw) return
    const now = Math.floor(Date.now() / 1000)
    const todo = { id: `todo-${Date.now()}-${Math.random().toString(36).slice(2)}`, task, category, priority, due_time: dueTime || null, duration_minutes: duration ? parseInt(duration) : null, done: false, created_at: now }
    timestamps.current[todo.id] = now
    setTodos(prev => [{ ...todo, eventCreatedAt: now }, ...prev])
    await publishAddTodo(skRaw, pkRaw, todo)
  }, [skRaw, pkRaw])

  const toggleDone = useCallback(async (todo) => {
    const now = Math.floor(Date.now() / 1000)
    const updated = { ...todo, done: !todo.done }
    timestamps.current[todo.id] = now
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...updated, eventCreatedAt: now } : t))
    await publishUpdateTodo(skRaw, pkRaw, updated)
  }, [skRaw, pkRaw])

  const markDone = useCallback(async (todo) => {
    const now = Math.floor(Date.now() / 1000)
    const updated = { ...todo, done: true }
    timestamps.current[todo.id] = now
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...updated, eventCreatedAt: now } : t))
    await publishUpdateTodo(skRaw, pkRaw, updated)
  }, [skRaw, pkRaw])

  const deleteTodo = useCallback(async (todo) => {
    timestamps.current[todo.id] = Infinity
    setTodos(prev => prev.filter(t => t.id !== todo.id))
    await publishDeleteTodo(skRaw, pkRaw, todo.id)
  }, [skRaw, pkRaw])

  return { todos, addTodo, toggleDone, markDone, deleteTodo }
}
