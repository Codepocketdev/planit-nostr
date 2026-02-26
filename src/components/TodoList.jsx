import { ListTodo, Check, Circle } from 'lucide-react'
import TodoItem from './TodoItem'

export default function TodoList({ todos, theme, filter, onFilterChange, onToggle, onDelete }) {
  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.done
    if (filter === 'done') return t.done
    return true
  })

  const filters = [
    { key: 'all', label: 'All', icon: <ListTodo size={14} /> },
    { key: 'active', label: 'Active', icon: <Circle size={14} /> },
    { key: 'done', label: 'Done', icon: <Check size={14} /> },
  ]

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f.key} onClick={() => onFilterChange(f.key)} style={{
            padding: '7px 16px', borderRadius: 20, border: 'none',
            background: filter === f.key ? theme.primary : theme.surface,
            color: filter === f.key ? '#fff' : theme.subtext,
            cursor: 'pointer', fontSize: '0.85rem',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {f.icon} {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: theme.subtext, padding: 40 }}>
          <ListTodo size={40} color={theme.subtext} style={{ margin: '0 auto 12px', display: 'block' }} />
          <div>No tasks here.</div>
        </div>
      ) : filtered.map(todo => (
        <TodoItem key={todo.id} todo={todo} theme={theme} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  )
}
