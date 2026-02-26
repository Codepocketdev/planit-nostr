let alarmInterval = null

export function playFallbackAlarm() {
  stopFallbackAlarm()
  const play = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      ;[0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4].forEach(t => {
        ;[440, 880, 1320].forEach((freq, i) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.frequency.value = freq
          osc.type = i === 0 ? 'square' : 'sine'
          gain.gain.setValueAtTime(0.5, ctx.currentTime + t)
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.35)
          osc.start(ctx.currentTime + t)
          osc.stop(ctx.currentTime + t + 0.35)
        })
      })
    } catch (e) { console.warn('Audio error', e) }
  }
  play()
  alarmInterval = setInterval(play, 3000)
}

export function stopFallbackAlarm() {
  if (alarmInterval) {
    clearInterval(alarmInterval)
    alarmInterval = null
  }
}
