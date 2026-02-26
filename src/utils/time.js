export function nowHHMM() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

export function sessionEndHHMM(due_time, duration_minutes) {
  if (!due_time || !duration_minutes) return null
  const [h, m] = due_time.split(':').map(Number)
  const end = new Date()
  end.setHours(h, m + parseInt(duration_minutes), 0, 0)
  return `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`
}

