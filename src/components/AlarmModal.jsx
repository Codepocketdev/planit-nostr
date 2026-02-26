import { useEffect, useRef, useState } from 'react'
import { AlarmClock, X, Bell, Clock, Flag, Timer } from 'lucide-react'
import { THEME_COLORS } from '../constants/themes'
import { nowHHMM } from '../utils/time'

export default function AlarmModal({ alarm, onDismiss, onSnooze, cycleSpeed }) {
  const canvasRef = useRef(null)
  const angleRef = useRef(0)
  const colorIdxRef = useRef(0)
  const rafRef = useRef(null)
  const bgIdxRef = useRef(0)
  const [bgColor, setBgColor] = useState(THEME_COLORS[0])
  const [clock, setClock] = useState(nowHHMM())

  useEffect(() => {
    const id = setInterval(() => setClock(nowHHMM()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      bgIdxRef.current = (bgIdxRef.current + 1) % THEME_COLORS.length
      setBgColor(THEME_COLORS[bgIdxRef.current])
    }, cycleSpeed)
    return () => clearInterval(id)
  }, [cycleSpeed])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const SIZE = 240, cx = 120, cy = 120, R = 104, THICK = 14, SEG = 8

    function draw() {
      ctx.clearRect(0, 0, SIZE, SIZE)
      for (let i = 0; i < SEG; i++) {
        const start = angleRef.current + (i / SEG) * Math.PI * 2
        const end = start + (Math.PI * 2 / SEG) * 0.82
        const color = THEME_COLORS[(colorIdxRef.current + i * 2) % THEME_COLORS.length]
        ctx.beginPath()
        ctx.arc(cx, cy, R, start, end)
        ctx.strokeStyle = color
        ctx.lineWidth = THICK
        ctx.lineCap = 'round'
        ctx.shadowColor = color
        ctx.shadowBlur = 20
        ctx.stroke()
      }
      angleRef.current += 0.018
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      colorIdxRef.current = (colorIdxRef.current + 1) % THEME_COLORS.length
    }, Math.max(200, cycleSpeed / 2))
    return () => clearInterval(id)
  }, [cycleSpeed])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: `radial-gradient(ellipse at 50% 40%, ${bgColor}44 0%, #040408 65%)`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 24,
      transition: 'background 0.5s ease',
    }}>
      {/* Bg blobs */}
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: 'absolute', borderRadius: '50%',
          width: [360, 260, 180][i], height: [360, 260, 180][i],
          background: THEME_COLORS[(bgIdxRef.current + i * 5) % THEME_COLORS.length],
          filter: 'blur(90px)', opacity: 0.13, pointerEvents: 'none',
          top: ['-10%', '62%', '30%'][i],
          left: ['-10%', '58%', '38%'][i],
          transition: 'background 0.5s',
        }} />
      ))}

      {/* Ring */}
      <div style={{ position: 'relative', width: 240, height: 240, marginBottom: 28 }}>
        <div style={{
          position: 'absolute', inset: -12, borderRadius: '50%',
          boxShadow: `0 0 60px ${bgColor}66`,
          transition: 'box-shadow 0.5s',
        }} />
        <canvas ref={canvasRef} width={240} height={240}
          style={{ position: 'absolute', inset: 0, borderRadius: '50%' }} />
        {/* Glass circle */}
        <div style={{
          position: 'absolute', inset: 14, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255,255,255,0.16)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 24px 60px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <AlarmClock size={28} color="rgba(255,255,255,0.85)" />
          <div style={{
            fontSize: '2rem', fontWeight: 300, color: '#fff',
            letterSpacing: 2,
            textShadow: `0 0 24px ${bgColor}`,
            transition: 'text-shadow 0.5s',
          }}>
            {clock}
          </div>
        </div>
      </div>

      {/* Task info */}
      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>
        {alarm.isSessionEnd ? 'Session Ended' : 'Task Due Now'}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 10, textShadow: '0 2px 20px rgba(0,0,0,0.5)', maxWidth: 300 }}>
        {alarm.todo.task}
      </div>
      <div style={{ display: 'flex', gap: 14, color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', marginBottom: 36, flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} /> {alarm.todo.due_time}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Flag size={13} /> {alarm.todo.priority}</span>
        {alarm.todo.duration_minutes && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#00b4d8' }}>
            <Timer size={13} /> {alarm.todo.duration_minutes}m session
          </span>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 300 }}>
        <button onClick={onDismiss} style={{
          padding: '16px', borderRadius: 16, border: 'none',
          background: 'rgba(255,255,255,0.92)', color: '#111',
          fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}>
          <X size={18} /> Dismiss
        </button>
        {!alarm.isSessionEnd && (
          <div style={{ display: 'flex', gap: 10 }}>
            {[5, 10].map(m => (
              <button key={m} onClick={() => onSnooze(m)} style={{
                flex: 1, padding: '14px', borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.18)',
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
                color: '#fff', fontSize: '0.9rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <Bell size={15} /> Snooze {m}m
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

