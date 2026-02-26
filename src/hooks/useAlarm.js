import { useEffect, useRef, useCallback } from 'react'
import { nowHHMM, sessionEndHHMM } from '../utils/time'
import { playFallbackAlarm, stopFallbackAlarm } from '../utils/audio'
import { loadSoundFromDB } from '../utils/db'
import { npubToHex } from '../utils/nostr'
import { sendAlarmDM } from '../utils/dm'

export function useAlarm({ todos, onAlarm, onMarkDone, onSnoozeAdd, skRaw, pkRaw, dmNpub }) {
  const firedRef = useRef(new Set())
  const audioRef = useRef(null)

  const stopAudio = useCallback(() => {
    stopFallbackAlarm()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
  }, [])

  const snooze = useCallback((todo, minutes) => {
    stopAudio()
    const now = new Date()
    now.setMinutes(now.getMinutes() + minutes)
    const snoozeTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
    onSnoozeAdd({
      task: todo.task,
      category: todo.category,
      priority: todo.priority,
      dueTime: snoozeTime,
      duration: todo.duration_minutes || '',
      snoozed: true,
    })
  }, [stopAudio, onSnoozeAdd])

  const triggerAlarm = useCallback(async (todo, isSessionEnd) => {
    onAlarm({ todo, isSessionEnd })
    const blob = await loadSoundFromDB()
    if (blob) {
      try {
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audio.loop = true
        audio.volume = 1.0
        audioRef.current = audio
        await audio.play()
      } catch {
        playFallbackAlarm()
      }
    } else {
      playFallbackAlarm()
    }
    if (skRaw && dmNpub) {
      const targetHex = npubToHex(dmNpub)
      if (targetHex) sendAlarmDM(skRaw, targetHex, todo.task, todo.due_time).catch(() => {})
    }
    if (Notification.permission === 'granted') {
      new Notification(
        isSessionEnd ? `Session ended: ${todo.task}` : `Task Due: ${todo.task}`,
        { body: isSessionEnd ? 'Your session has ended.' : `${todo.category} · ${todo.priority} priority` }
      )
    }
  }, [onAlarm, skRaw, dmNpub])

  useEffect(() => {
    const check = () => {
      const hhmm = nowHHMM()
      for (const todo of todos) {
        if (todo.done) continue
        const dueKey = `due_${todo.id}`
        if (todo.due_time && todo.due_time === hhmm && !firedRef.current.has(dueKey)) {
          firedRef.current.add(dueKey)
          if (!todo.duration_minutes) onMarkDone(todo)
          triggerAlarm(todo, false)
          return
        }
        const endKey = `end_${todo.id}`
        const endTime = sessionEndHHMM(todo.due_time, todo.duration_minutes)
        if (endTime && endTime === hhmm && !firedRef.current.has(endKey)) {
          firedRef.current.add(endKey)
          onMarkDone(todo)
          triggerAlarm(todo, true)
          return
        }
      }
    }
    check()
    const id = setInterval(check, 10000)
    return () => clearInterval(id)
  }, [todos, triggerAlarm, onMarkDone])

  return { stopAudio, snooze }
}
