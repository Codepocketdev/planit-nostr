import { nip04 } from 'nostr-tools'
import { publishToRelays } from './nostr'

export async function sendAlarmDM(skRaw, targetPubkeyHex, task, dueTime) {
  try {
    const message = `⏰ PlanIt Alarm\n\nTask: ${task}\nTime: ${dueTime}\n\nOpen PlanIt to dismiss or snooze.`
    const encrypted = await nip04.encrypt(skRaw, targetPubkeyHex, message)
    return publishToRelays({
      kind: 4,
      created_at: Math.floor(Date.now() / 1000),
      tags: [['p', targetPubkeyHex]],
      content: encrypted,
    }, skRaw)
  } catch(e) {
    console.warn('DM failed', e)
  }
}
