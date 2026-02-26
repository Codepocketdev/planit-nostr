export const PRIORITIES = [
  { value: 'low', label: 'Low', color: '#2ecc71' },
  { value: 'medium', label: 'Medium', color: '#f7931a' },
  { value: 'high', label: 'High', color: '#e94560' },
]

export function getPriorityColor(value) {
  return (PRIORITIES.find(p => p.value === value) || PRIORITIES[1]).color
}

