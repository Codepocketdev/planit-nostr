export async function sendTelegramAlarm(botToken, chatId, todo, isSessionEnd) {
  if (!botToken || !chatId) return
  const title = isSessionEnd ? '[SESSION ENDED]' : '[TASK DUE NOW]'
  const text = `${title}\n\nTask: *${todo.task}*\nTime: ${todo.due_time}\nCategory: ${todo.category}\nPriority: ${todo.priority}`
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: 'Dismiss', callback_data: `dismiss_${todo.id}` },
            { text: 'Snooze 5m', callback_data: `snooze_5_${todo.id}` },
            { text: 'Snooze 10m', callback_data: `snooze_10_${todo.id}` },
          ]]
        }
      })
    })
  } catch (e) { console.warn('Telegram failed', e) }
}

export async function testTelegramConnection(botToken, chatId) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: '[PlanIt] Connected! You will receive alarm notifications here.' })
    })
    return res.ok
  } catch { return false }
}
