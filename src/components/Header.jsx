import { Settings, Palette } from 'lucide-react'

export default function Header({ theme, doneCount, totalCount, onSettingsClick, onThemeClick, profile }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: theme.primary, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="28" height="28" viewBox="0 0 512 512" fill="none">
            <defs>
              <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e94560"/>
                <stop offset="50%" stopColor="#f7931a"/>
                <stop offset="100%" stopColor="#9b59b6"/>
              </linearGradient>
            </defs>
            <rect width="512" height="512" rx="120" fill="url(#hg)"/>
            <polyline points="128,256 224,368 384,176" stroke="white" strokeWidth="52" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          PlanIt
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={onThemeClick} style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text, padding: '8px 12px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Palette size={15} />
          </button>
          <button onClick={onSettingsClick} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            {profile?.picture
              ? <img src={profile.picture} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${theme.primary}`, objectFit: 'cover', display: 'block' }} />
              : <div style={{ width: 36, height: 36, borderRadius: '50%', background: theme.surface, border: `2px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Settings size={16} color={theme.text} />
                </div>
            }
          </button>
        </div>
      </div>
      <div style={{ color: theme.subtext, fontSize: '0.82rem', marginBottom: 22 }}>
        {profile?.name && <span style={{ color: theme.text, fontWeight: 600 }}>{profile.name} · </span>}
        {doneCount}/{totalCount} tasks completed
      </div>
    </div>
  )
}
