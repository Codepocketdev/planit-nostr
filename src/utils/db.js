function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('planit', 1)
    req.onupgradeneeded = e => e.target.result.createObjectStore('settings')
    req.onsuccess = e => resolve(e.target.result)
    req.onerror = reject
  })
}

export async function saveSoundToDB(blob) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('settings', 'readwrite')
    tx.objectStore('settings').put(blob, 'alarmSound')
    tx.oncomplete = resolve
    tx.onerror = reject
  })
}

export async function loadSoundFromDB() {
  const db = await openDB()
  return new Promise(resolve => {
    const tx = db.transaction('settings', 'readonly')
    const req = tx.objectStore('settings').get('alarmSound')
    req.onsuccess = e => resolve(e.target.result || null)
    req.onerror = () => resolve(null)
  })
}

