import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CATEGORIES } from '../constants/categories'
import { PRIORITIES } from '../constants/priorities'

export default function AddTodoCard({ theme, onAdd }) {
  const [task, setTask] = useState('')
  const [category, setCategory] = useState('general')
  const [priority, setPriority] = useState('medium')
  const [dueTime, setDueTime] = useState('')
  const [duration, setDuration] = useState('')

  const handleAdd = async () => {
    if (!task.trim()) return
    await onAdd({ task, category, priority, dueTime, duration })
    setTask('')
    setDueTime('')
    setDuration('')
  }

  const s = {
    card: {
      background: theme.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
      border: `1px solid ${theme.border}`,
    },
    input: {
      width: '100%',
      padding: '11px 14px',
      borderRadius: 8,
      border: `1px solid ${theme.border}`,
      background: theme.card,
      color: theme.text,
      fontSize: '1rem',
      marginBottom: 10,
      outline: 'none',
      boxSizing: 'border-box',
    },
    row: {
      display: 'flex',
      gap: 10,
      marginBottom: 10,
    },
    select: {
      flex: 1,
      padding: '10px 12px',
      borderRadius: 8,
      border: `1px solid ${theme.border}`,
      background: theme.card,
      color: theme.text,
      fontSize: '0.9rem',
      outline: 'none',
    },
    addBtn: {
      width: '100%',
      padding: '12px',
      borderRadius: 8,
      border: 'none',
      background: theme.primary,
      color: '#fff',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
  }

  return (
    <div style={s.card}>
      <input
        style={s.input}
        placeholder="What needs to be done?"
        value={task}
        onChange={e => setTask(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
      />
      <div style={s.row}>
        <select style={s.select} value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <select style={s.select} value={priority} onChange={e => setPriority(e.target.value)}>
          {PRIORITIES.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
      <div style={s.row}>
        <input
          style={{ ...s.select, flex: 1 }}
          type="time"
          value={dueTime}
          onChange={e => setDueTime(e.target.value)}
        />
        <input
          style={{ ...s.select, flex: 1 }}
          type="number"
          min="1"
          max="480"
          value={duration}
          onChange={e => setDuration(e.target.value)}
          placeholder="Duration mins"
        />
      </div>
      <button style={s.addBtn} onClick={handleAdd}>
        <Plus size={18} /> Add Task
      </button>
    </div>
  )
}

