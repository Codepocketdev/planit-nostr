import { useState, useEffect } from 'react'
import { themes } from './constants/themes'
import { useNostr } from './hooks/useNostr'
import { useAlarm } from './hooks/useAlarm'
import { nowHHMM } from './utils/time'
import { decodeNsec, getPubkeyFromNsec, fetchProfile, hexToNpub, publishDismiss } from './utils/nostr'
import SplashScreen from './components/SplashScreen'
import LoginScreen from './components/LoginScreen'
import Header from './components/Header'
import AddTodoCard from './components/AddTodoCard'
import TodoList from './components/TodoList'
import ThemePanel from './components/ThemePanel'
import SettingsPanel from './components/SettingsPanel'
import AlarmModal from './components/AlarmModal'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [keypair, setKeypair] = useState(() => {
    const nsec = localStorage.getItem('nsec')
    if (!nsec) return null
    const skRaw = decodeNsec(nsec)
    const pkRaw = skRaw ? getPubkeyFromNsec(nsec) : null
    return skRaw && pkRaw ? { nsec, skRaw, pkRaw, npub: hexToNpub(pkRaw) } : null
  })
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('profile') || 'null') } catch { return null }
  })
  const [themeName, setThemeName] = useState(() => localStorage.getItem('theme') || 'midnight')
  const [filter, setFilter] = useState('all')
  const [showThemes, setShowThemes] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [alarmModal, setAlarmModal] = useState(null)
  const [cycleSpeed, setCycleSpeed] = useState(() => parseInt(localStorage.getItem('cycleSpeed') || '1000'))
  const [customSoundName, setCustomSoundName] = useState(() => localStorage.getItem('customSoundName') || '')
  const [dmNpub, setDmNpub] = useState(() => localStorage.getItem('dmNpub') || '')

  const theme = themes[themeName]
  const { todos, addTodo, toggleDone, markDone, deleteTodo } = useNostr(keypair?.skRaw, keypair?.pkRaw)
  const { stopAudio, snooze } = useAlarm({
    todos,
    onAlarm: (alarm) => setAlarmModal(alarm),
    onMarkDone: markDone,
    onSnoozeAdd: addTodo,
    skRaw: keypair?.skRaw,
    pkRaw: keypair?.pkRaw,
    dmNpub,
  })

  useEffect(() => { document.body.style.background = theme.bg; document.body.style.margin = '0'; document.body.style.padding = '0' }, [theme])
  useEffect(() => { Notification.requestPermission() }, [])
  useEffect(() => {
    if (!keypair?.pkRaw) return
    fetchProfile(keypair.pkRaw, (p) => { setProfile(p); localStorage.setItem('profile', JSON.stringify(p)) })
  }, [keypair?.pkRaw])

  const handleLogin = ({ nsec, skRaw, pkRaw }) => { localStorage.setItem('nsec', nsec); setKeypair({ nsec, skRaw, pkRaw, npub: hexToNpub(pkRaw) }) }
  const handleLogout = () => { localStorage.removeItem('nsec'); localStorage.removeItem('profile'); setKeypair(null); setProfile(null) }
  const changeTheme = (name) => { setThemeName(name); localStorage.setItem('theme', name); document.body.style.background = themes[name].bg; setShowThemes(false) }

  const dismissAlarm = () => {
    stopAudio()
    if (alarmModal?.todo && keypair?.skRaw) publishDismiss(keypair.skRaw, keypair.pkRaw, alarmModal.todo.id).catch(() => {})
    setAlarmModal(null)
  }

  const snoozeAlarm = (minutes) => {
    if (alarmModal?.todo) snooze(alarmModal.todo, minutes)
    setAlarmModal(null)
  }

  const handleTestAlarm = () => setAlarmModal({ todo: { task: 'Test Task', due_time: nowHHMM(), category: 'general', priority: 'high', duration_minutes: null }, isSessionEnd: false })
  const handleTestSession = () => setAlarmModal({ todo: { task: 'Deep Work Session', due_time: '09:00', category: 'work', priority: 'high', duration_minutes: 60 }, isSessionEnd: true })

  const doneCount = todos.filter(t => t.done).length

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      {!showSplash && !keypair && <LoginScreen onLogin={handleLogin} />}
      {alarmModal && <AlarmModal alarm={alarmModal} onDismiss={dismissAlarm} onSnooze={snoozeAlarm} cycleSpeed={cycleSpeed} />}
      {showSettings && <SettingsPanel theme={theme} cycleSpeed={cycleSpeed} customSoundName={customSoundName} onCycleSpeedChange={(val) => { setCycleSpeed(val); localStorage.setItem('cycleSpeed', String(val)) }} onSoundUpload={(name) => { setCustomSoundName(name); localStorage.setItem('customSoundName', name) }} onTestAlarm={handleTestAlarm} onTestSession={handleTestSession} onClose={() => setShowSettings(false)} onLogout={handleLogout} keypair={keypair} profile={profile} onProfileSave={(p) => { setProfile(p); localStorage.setItem('profile', JSON.stringify(p)) }} dmNpub={dmNpub} onDmNpubChange={(val) => { setDmNpub(val); localStorage.setItem('dmNpub', val) }} />}
      {keypair && (
        <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, fontFamily: 'Arial, sans-serif', transition: 'all 0.3s' }}>
          <div style={{ maxWidth: 540, margin: '0 auto', padding: '24px 16px' }}>
            <Header theme={theme} doneCount={doneCount} totalCount={todos.length} onSettingsClick={() => { setShowSettings(!showSettings); setShowThemes(false) }} onThemeClick={() => { setShowThemes(!showThemes); setShowSettings(false) }} profile={profile} />
            {showThemes && <ThemePanel currentTheme={themeName} onChangeTheme={changeTheme} />}
            <AddTodoCard theme={theme} onAdd={addTodo} />
            <TodoList todos={todos} theme={theme} filter={filter} onFilterChange={setFilter} onToggle={toggleDone} onDelete={deleteTodo} />
          </div>
        </div>
      )}
    </>
  )
}
