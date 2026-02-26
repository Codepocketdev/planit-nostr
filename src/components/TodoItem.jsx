import { Circle, CheckCircle2, Flag, Clock, Timer, Trash2 } from 'lucide-react'
import { getCategoryIcon } from '../constants/categories'
import { getPriorityColor } from '../constants/priorities'

export default function TodoItem({ todo, theme, onToggle, onDelete }) {
  const CatIcon = getCategoryIcon(todo.category)

  return (
    <div style={{
      background: theme.card, borderRadius: 10, padding: '14px 16px',
      marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12,
      border: `1px solid ${theme.border}`,
      borderLeft: `4px solid ${getPriorityColor(todo.priority)}`,
    }}>
      <button onClick={() => onToggle(todo)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        {todo.done ? <CheckCircle2 size={22} color={theme.primary} /> : <Circle size={22} color={theme.subtext} />}
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ textDecoration: todo.done ? 'line-through' : 'none', opacity: todo.done ? 0.5 : 1, fontSize: '1rem', marginBottom: 4, color: theme.text }}>
          {todo.task}
        </div>
        <div style={{ fontSize: '0.75rem', color: theme.subtext, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CatIcon size={12} /> {todo.category}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: getPriorityColor(todo.priority) }}><Flag size={12} /> {todo.priority}</span>
          {todo.due_time && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {todo.due_time}</span>}
          {todo.duration_minutes && <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#00b4d8' }}><Timer size={12} /> {todo.duration_minutes}m</span>}
        </div>
      </div>
      <button onClick={() => onDelete(todo)} style={{ background: 'none', border: 'none', color: theme.subtext, cursor: 'pointer', padding: 4 }}>
        <Trash2 size={17} />
      </button>
    </div>
  )
}
