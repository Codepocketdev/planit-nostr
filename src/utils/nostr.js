import { generateSecretKey, getPublicKey, finalizeEvent, nip19 } from 'nostr-tools'

export const RELAYS = [
  'wss://relay.damus.io',
  'wss://relay.nostr.band',
  'wss://nos.lol',
  'wss://relay.primal.net',
]

export function generateKeypair() {
  const sk = generateSecretKey()
  const pk = getPublicKey(sk)
  return { nsec: nip19.nsecEncode(sk), npub: nip19.npubEncode(pk), skRaw: sk, pkRaw: pk }
}

export function decodeNsec(nsec) {
  try { const { type, data } = nip19.decode(nsec); return type === 'nsec' ? data : null } catch { return null }
}

export function getPubkeyFromNsec(nsec) {
  const sk = decodeNsec(nsec); return sk ? getPublicKey(sk) : null
}

export function npubToHex(npub) {
  try { const { type, data } = nip19.decode(npub); return type === 'npub' ? data : null } catch { return null }
}

export function hexToNpub(hex) {
  try { return nip19.npubEncode(hex) } catch { return hex }
}

export async function publishToRelays(event, skRaw) {
  const signed = finalizeEvent(event, skRaw)
  await Promise.allSettled(RELAYS.map(url => new Promise((resolve, reject) => {
    const ws = new WebSocket(url)
    const t = setTimeout(() => { ws.close(); reject() }, 5000)
    ws.onopen = () => ws.send(JSON.stringify(['EVENT', signed]))
    ws.onmessage = (e) => { const msg = JSON.parse(e.data); if (msg[0] === 'OK') { clearTimeout(t); ws.close(); resolve() } }
    ws.onerror = () => { clearTimeout(t); reject() }
  })))
  return signed
}

export function subscribeRelays(filters, onEvent, onEose) {
  const subs = RELAYS.map(url => {
    const ws = new WebSocket(url)
    const subId = Math.random().toString(36).slice(2)
    ws.onopen = () => ws.send(JSON.stringify(['REQ', subId, ...filters]))
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data)
      if (msg[0] === 'EVENT' && msg[1] === subId) onEvent(msg[2])
      if (msg[0] === 'EOSE') onEose && onEose()
    }
    ws.onerror = () => {}
    return () => { try { ws.send(JSON.stringify(['CLOSE', subId])); ws.close() } catch {} }
  })
  return () => subs.forEach(u => u())
}

export async function publishKind1(skRaw, pkRaw, action, todoId, extra) {
  return publishToRelays({
    kind: 1,
    created_at: Math.floor(Date.now() / 1000),
    tags: [['t', 'planit'], ['t', action], ['planit-id', todoId]],
    content: JSON.stringify({ id: todoId, ...extra }),
    pubkey: pkRaw,
  }, skRaw)
}

export const publishAddTodo = (skRaw, pkRaw, todo) => publishKind1(skRaw, pkRaw, 'planit-add', todo.id, todo)
export const publishUpdateTodo = (skRaw, pkRaw, todo) => publishKind1(skRaw, pkRaw, 'planit-update', todo.id, todo)
export const publishDeleteTodo = (skRaw, pkRaw, todoId) => publishKind1(skRaw, pkRaw, 'planit-delete', todoId, { deleted: true })
export const publishSnooze = (skRaw, pkRaw, todoId, snoozeTime) => publishKind1(skRaw, pkRaw, 'planit-snooze', todoId, { snooze_time: snoozeTime })
export const publishDismiss = (skRaw, pkRaw, todoId) => publishKind1(skRaw, pkRaw, 'planit-dismiss', todoId, { dismissed: true })

export function fetchProfile(pkHex, onProfile) {
  subscribeRelays([{ kinds: [0], authors: [pkHex], limit: 1 }], (event) => {
    try { onProfile(JSON.parse(event.content)) } catch {}
  })
}

export async function publishProfile(skRaw, pkRaw, profile) {
  return publishToRelays({ kind: 0, created_at: Math.floor(Date.now() / 1000), tags: [], content: JSON.stringify(profile), pubkey: pkRaw }, skRaw)
}
