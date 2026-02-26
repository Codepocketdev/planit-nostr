import { useEffect, useState } from 'react'

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('enter')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 100)
    const t2 = setTimeout(() => setPhase('exit'), 2800)
    const t3 = setTimeout(() => onDone(), 3400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  const opacity = phase === 'enter' ? 0 : 1
  const scale = phase === 'enter' ? 0.85 : 1

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#000000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: phase === 'exit' ? 0 : 1,
      transition: 'opacity 0.6s ease',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 45%, #e9456012 0%, transparent 65%)',
      }} />

      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 20,
        opacity, transform: `scale(${scale})`,
        transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {/* Icon */}
        <svg width="100" height="100" viewBox="0 0 512 512" fill="none">
          <defs>
            <linearGradient id="si" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e94560"/>
              <stop offset="50%" stopColor="#f7931a"/>
              <stop offset="100%" stopColor="#9b59b6"/>
            </linearGradient>
          </defs>
          <rect width="512" height="512" rx="120" fill="url(#si)"/>
          <polyline points="128,256 224,368 384,176" stroke="white" strokeWidth="52" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>

        {/* PlanIt text BELOW icon */}
        <div style={{
          fontSize: '42px',
          fontWeight: '800',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          letterSpacing: '-1px',
          lineHeight: 1,
        }}>
          <span style={{ color: '#ffffff' }}>Plan</span>
          <span style={{ background: 'linear-gradient(90deg, #f7931a, #9b59b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>It</span>
        </div>

        {/* Tagline */}
        <div style={{ color: '#444', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginTop: 4 }}>
          Plan your day. Own it.
        </div>
      </div>

      {/* Loading dots */}
      <div style={{ display: 'flex', gap: 8, marginTop: 80, opacity, transition: 'opacity 0.6s ease 0.3s' }}>
        {['#e94560', '#f7931a', '#9b59b6'].map((color, i) => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: color,
            animation: `splash-dot 1.2s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes splash-dot {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
