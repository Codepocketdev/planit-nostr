import { useState } from 'react'
import { Settings, X, Upload, AlarmClock, Timer, Key, LogOut, Copy, Check, Bell, Save } from 'lucide-react'
import { saveSoundToDB } from '../utils/db'
import { hexToNpub, publishProfile } from '../utils/nostr'

export default function SettingsPanel({
  theme, cycleSpeed, customSoundName,
  onCycleSpeedChange, onSoundUpload,
  onTestAlarm, onTestSession, onClose,
  onLogout, keypair, profile, onProfileSave, dmNpub, onDmNpubChange,
}) {
  const [tab, setTab] = useState('general')
  const [copied, setCopied] = useState('')
  const [editProfile, setEditProfile] = useState({ name: profile?.name || '', about: profile?.about || '', picture: profile?.picture || '', website: profile?.website || '', nip05: profile?.nip05 || '' })
  const [dmInput, setDmInput] = useState(dmNpub || '')
  const [dmSaveState, setDmSaveState] = useState('idle')
  const [profileSaveState, setProfileSaveState] = useState('idle')

  const npub = keypair?.pkRaw ? hexToNpub(keypair.pkRaw) : ''

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(''), 2000) })
  }

  const handleSoundUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    await saveSoundToDB(file)
    onSoundUpload(file.name)
  }

  const handleSaveDm = () => {
    setDmSaveState('saving')
    setTimeout(() => {
      onDmNpubChange(dmInput)
      setDmSaveState('saved')
      setTimeout(() => setDmSaveState('idle'), 2000)
    }, 800)
  }

  const handleSaveProfile = async () => {
    setProfileSaveState('saving')
    await publishProfile(keypair.skRaw, keypair.pkRaw, editProfile)
    onProfileSave(editProfile)
    setProfileSaveState('saved')
    setTimeout(() => setProfileSaveState('idle'), 2000)
  }

  const dmBtnStyle = {
    width: '100%', padding: '12px', borderRadius: 10, border: 'none',
    background: dmSaveState === 'saved' ? '#2ecc71' : dmSaveState === 'saving' ? '#f7931a' : theme.primary,
    color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginBottom: 8, transition: 'background 0.3s',
  }

  const profileBtnStyle = {
    width: '100%', padding: '12px', borderRadius: 10, border: 'none',
    background: profileSaveState === 'saved' ? '#2ecc71' : profileSaveState === 'saving' ? '#f7931a' : theme.primary,
    color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginBottom: 8, transition: 'background 0.3s',
  }

  const s = {
    panel: { position: 'fixed', top: 0, right: 0, bottom: 0, width: '90%', maxWidth: 360, background: theme.surface, borderLeft: `1px solid ${theme.border}`, zIndex: 200, display: 'flex', flexDirection: 'column', overflowY: 'auto' },
    header: { padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    title: { fontSize: '1.1rem', fontWeight: 'bold', color: theme.primary, display: 'flex', alignItems: 'center', gap: 8 },
    tabs: { display: 'flex', borderBottom: `1px solid ${theme.border}`, marginBottom: 20, padding: '0 20px' },
    tab: (active) => ({ padding: '10px 14px', fontSize: '0.82rem', border: 'none', background: 'none', color: active ? theme.primary : theme.subtext, borderBottom: active ? `2px solid ${theme.primary}` : '2px solid transparent', cursor: 'pointer', fontWeight: active ? 700 : 400 }),
    body: { padding: '0 20px', flex: 1 },
    label: { color: theme.subtext, fontSize: '0.72rem', marginBottom: 6, marginTop: 16, letterSpacing: 1.5, textTransform: 'uppercase' },
    row: { background: theme.card, borderRadius: 10, padding: '12px 14px', border: `1px solid ${theme.border}`, marginBottom: 8 },
    input: { width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: 8 },
    textarea: { width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', minHeight: 80, resize: 'vertical', marginBottom: 8 },
    outlineBtn: { width: '100%', padding: '10px', borderRadius: 10, border: `1px solid ${theme.border}`, background: 'none', color: theme.text, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8, boxSizing: 'border-box' },
    keyBox: { background: theme.bg, borderRadius: 8, padding: '10px 12px', border: `1px solid ${theme.border}`, fontFamily: 'monospace', fontSize: '0.72rem', wordBreak: 'break-all', color: theme.subtext, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
    speedBtns: { display: 'flex', gap: 6, flexWrap: 'wrap' },
    speedBtn: (val) => ({ padding: '7px 12px', borderRadius: 8, border: 'none', background: cycleSpeed === val ? theme.primary : theme.card, color: cycleSpeed === val ? '#fff' : theme.text, cursor: 'pointer', fontSize: '0.8rem' }),
    logout: { padding: '20px', borderTop: `1px solid ${theme.border}`, marginTop: 8 },
  }

  const Spinner = () => (
    <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
  )

  return (
    <div style={s.panel}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      <div style={s.header}>
        <div style={s.title}><Settings size={18} /> Settings</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: theme.text, cursor: 'pointer' }}><X size={20} /></button>
      </div>

      <div style={s.tabs}>
        {[{ key: 'general', label: 'General' }, { key: 'profile', label: 'Profile' }, { key: 'keys', label: 'Keys' }, { key: 'notifications', label: 'Alerts' }].map(t => (
          <button key={t.key} style={s.tab(tab === t.key)} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      <div style={s.body}>

        {tab === 'general' && (
          <>
            <div style={s.label}>Alarm Sound</div>
            <div style={s.row}>
              <label style={{ cursor: 'pointer', display: 'block' }}>
                <div style={s.outlineBtn}><Upload size={15} /> {customSoundName || 'Upload alarm sound'}</div>
                <input type="file" accept="audio/*" onChange={handleSoundUpload} style={{ display: 'none' }} />
              </label>
              {customSoundName && <div style={{ fontSize: '0.72rem', color: theme.subtext }}>{customSoundName}</div>}
            </div>

            <div style={s.label}>Color Cycle Speed</div>
            <div style={s.row}>
              <div style={s.speedBtns}>
                {[{ label: 'Fast', val: 300 }, { label: 'Medium', val: 700 }, { label: 'Normal', val: 1000 }, { label: 'Slow', val: 2000 }, { label: 'Very Slow', val: 3000 }].map(opt => (
                  <button key={opt.val} style={s.speedBtn(opt.val)} onClick={() => onCycleSpeedChange(opt.val)}>{opt.label}</button>
                ))}
              </div>
            </div>

            <div style={s.label}>Test Alarms</div>
            <div style={s.row}>
              <button style={s.outlineBtn} onClick={() => { onTestAlarm(); onClose() }}><AlarmClock size={15} color={theme.primary} /> Test Due Alarm</button>
              <button style={s.outlineBtn} onClick={() => { onTestSession(); onClose() }}><Timer size={15} color="#f7931a" /> Test Session End</button>
            </div>
          </>
        )}

        {tab === 'profile' && (
          <>
            {editProfile.picture && (
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <img src={editProfile.picture} alt="avatar" style={{ width: 80, height: 80, borderRadius: '50%', border: `3px solid ${theme.primary}`, objectFit: 'cover' }} />
              </div>
            )}
            <div style={s.label}>Display Name</div>
            <input style={s.input} value={editProfile.name} onChange={e => setEditProfile(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
            <div style={s.label}>About</div>
            <textarea style={s.textarea} value={editProfile.about} onChange={e => setEditProfile(p => ({ ...p, about: e.target.value }))} placeholder="About you..." />
            <div style={s.label}>Picture URL</div>
            <input style={s.input} value={editProfile.picture} onChange={e => setEditProfile(p => ({ ...p, picture: e.target.value }))} placeholder="https://..." />
            <div style={s.label}>Website</div>
            <input style={s.input} value={editProfile.website} onChange={e => setEditProfile(p => ({ ...p, website: e.target.value }))} placeholder="https://..." />
            <div style={s.label}>NIP-05</div>
            <input style={s.input} value={editProfile.nip05} onChange={e => setEditProfile(p => ({ ...p, nip05: e.target.value }))} placeholder="you@domain.com" />
            <button style={profileBtnStyle} onClick={handleSaveProfile} disabled={profileSaveState === 'saving'}>
              {profileSaveState === 'saving' ? <><Spinner /> Publishing...</> : profileSaveState === 'saved' ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Profile</>}
            </button>
          </>
        )}

        {tab === 'keys' && (
          <>
            <div style={s.label}>Your npub (Public Key)</div>
            <div style={s.keyBox}>
              <span style={{ color: '#9b59b6', flex: 1 }}>{npub}</span>
              <button onClick={() => copyText(npub, 'npub')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.subtext, flexShrink: 0 }}>
                {copied === 'npub' ? <Check size={14} color="#2ecc71" /> : <Copy size={14} />}
              </button>
            </div>
            <div style={s.label}>Your nsec (Private Key)</div>
            <div style={s.keyBox}>
              <span style={{ flex: 1, filter: 'blur(4px)', userSelect: 'none' }}>{keypair?.nsec}</span>
              <button onClick={() => copyText(keypair?.nsec, 'nsec')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.subtext, flexShrink: 0 }}>
                {copied === 'nsec' ? <Check size={14} color="#2ecc71" /> : <Copy size={14} />}
              </button>
            </div>
            <div style={{ color: '#e94560', fontSize: '0.72rem', marginBottom: 12 }}>⚠️ Never share your nsec. It gives full access to your account.</div>
          </>
        )}

        {tab === 'notifications' && (
          <>
            <div style={s.label}>DM Notification npub</div>
            <div style={s.row}>
              <div style={{ color: theme.subtext, fontSize: '0.78rem', marginBottom: 10, lineHeight: 1.5 }}>
                Alarm will send a DM to this npub. Set your own npub to get notified via Amethyst, Primal or any Nostr client.
              </div>
              <input style={s.input} value={dmInput} onChange={e => setDmInput(e.target.value)} placeholder="npub1..." />
              <button style={dmBtnStyle} onClick={handleSaveDm} disabled={dmSaveState === 'saving'}>
                {dmSaveState === 'saving' ? <><Spinner /> Saving...</> : dmSaveState === 'saved' ? <><Check size={16} /> Saved!</> : <><Bell size={15} /> Save DM Target</>}
              </button>
              <button style={s.outlineBtn} onClick={() => { setDmInput(npub); }}>
                Use my own npub
              </button>
            </div>
          </>
        )}

      </div>

      <div style={s.logout}>
        <button onClick={onLogout} style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#e94560', color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )
}
