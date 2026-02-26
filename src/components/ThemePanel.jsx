import { themes } from '../constants/themes'

export default function ThemePanel({ currentTheme, onChangeTheme }) {
  return (
    <div style={{
      position: 'fixed', top: 64, right: 16,
      background: themes[currentTheme].surface,
      border: `1px solid ${themes[currentTheme].border}`,
      borderRadius: 12, padding: 12, zIndex: 100,
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: 8, minWidth: 260, maxHeight: '70vh', overflowY: 'auto',
    }}>
      {Object.entries(themes).map(([name, t]) => (
        <button
          key={name}
          onClick={() => onChangeTheme(name)}
          style={{
            padding: '10px 14px', borderRadius: 8,
            border: `2px solid ${currentTheme === name ? t.primary : 'transparent'}`,
            background: t.surface, color: t.text,
            cursor: 'pointer', textAlign: 'left',
            fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: t.primary, flexShrink: 0 }} />
          {t.name}
        </button>
      ))}
    </div>
  )
}

