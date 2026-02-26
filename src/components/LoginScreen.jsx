import { useState } from 'react'
import { Key, Zap, Eye, EyeOff, RefreshCw } from 'lucide-react'
import { generateKeypair, decodeNsec, getPubkeyFromNsec } from '../utils/nostr'

export default function LoginScreen({ onLogin }) {
  const [nsec, setNsec] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [error, setError] = useState('')
  const [generated, setGenerated] = useState(null)

  const handleLogin = () => {
    setError('')
    const skRaw = decodeNsec(nsec.trim())
    if (!skRaw) { setError('Invalid nsec key. Must start with nsec1...'); return }
    const pkRaw = getPubkeyFromNsec(nsec.trim())
    onLogin({ nsec: nsec.trim(), skRaw, pkRaw })
  }

  const handleGenerate = () => {
    const kp = generateKeypair()
    setGenerated(kp)
    setNsec(kp.nsec)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      {/* Glow */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, #9b59b612 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 48 }}>
        <svg width="80" height="80" viewBox="0 0 512 512" fill="none">
          <defs>
            <linearGradient id="login-icon" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e94560"/>
              <stop offset="50%" stopColor="#f7931a"/>
              <stop offset="100%" stopColor="#9b59b6"/>
            </linearGradient>
          </defs>
          <rect width="512" height="512" rx="120" fill="url(#login-icon)"/>
          <polyline points="128,256 224,368 384,176" stroke="white" strokeWidth="52" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <div style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px' }}>
          <span style={{ color: '#fff' }}>Plan</span>
          <span style={{ background: 'linear-gradient(90deg, #f7931a, #9b59b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>It</span>
        </div>
        <div style={{ color: '#555', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Powered by Nostr
        </div>
      </div>

      {/* Login card */}
      <div style={{
        width: '100%', maxWidth: 360,
        background: '#111', borderRadius: 20,
        border: '1px solid #222', padding: 28,
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Key size={18} color="#9b59b6" /> Login with Nostr
        </div>

        <div style={{ color: '#555', fontSize: '0.82rem', lineHeight: 1.5 }}>
          Enter your nsec private key or generate a new one. Your key never leaves your device.
        </div>

        {/* nsec input */}
        <div style={{ position: 'relative' }}>
          <input
            type={showKey ? 'text' : 'password'}
            value={nsec}
            onChange={e => setNsec(e.target.value)}
            placeholder="nsec1..."
            style={{
              width: '100%', padding: '12px 44px 12px 14px',
              borderRadius: 10, border: '1px solid #333',
              background: '#0a0a0a', color: '#eee',
              fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
              fontFamily: 'monospace',
            }}
          />
          <button
            onClick={() => setShowKey(!showKey)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {error && <div style={{ color: '#e94560', fontSize: '0.8rem' }}>{error}</div>}

        {/* Login button */}
        <button
          onClick={handleLogin}
          style={{
            padding: '14px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #e94560, #f7931a, #9b59b6)',
            color: '#fff', fontSize: '1rem', fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8,
          }}
        >
          <Zap size={18} /> Login
        </button>

        <div style={{ textAlign: 'center', color: '#444', fontSize: '0.8rem' }}>— or —</div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          style={{
            padding: '12px', borderRadius: 12,
            border: '1px solid #333', background: 'none',
            color: '#aaa', fontSize: '0.9rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <RefreshCw size={16} /> Generate new keypair
        </button>

        {/* Show generated keys */}
        {generated && (
          <div style={{ background: '#0a0a0a', borderRadius: 10, padding: 14, border: '1px solid #2a2a0a' }}>
            <div style={{ color: '#f7931a', fontSize: '0.72rem', marginBottom: 8, letterSpacing: 1 }}>NEW KEYPAIR GENERATED — SAVE YOUR NSEC!</div>
            <div style={{ color: '#666', fontSize: '0.72rem', marginBottom: 4 }}>nsec (private — keep secret):</div>
            <div style={{ color: '#eee', fontSize: '0.72rem', fontFamily: 'monospace', wordBreak: 'break-all', marginBottom: 10 }}>{generated.nsec}</div>
            <div style={{ color: '#666', fontSize: '0.72rem', marginBottom: 4 }}>npub (public — share freely):</div>
            <div style={{ color: '#9b59b6', fontSize: '0.72rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>{generated.npub}</div>
          </div>
        )}
      </div>

      <div style={{ color: '#333', fontSize: '0.75rem', marginTop: 24, textAlign: 'center', maxWidth: 300, lineHeight: 1.6 }}>
        Your todos are stored on Nostr relays encrypted to your key. Sync across any device using the same nsec.
      </div>
    </div>
  )
}

