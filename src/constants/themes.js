export const themes = {
  midnight: { name: 'Midnight', bg: '#0f0f1a', surface: '#1a1a2e', card: '#16213e', primary: '#e94560', text: '#eee', subtext: '#888', border: '#222244' },
  bitcoin: { name: 'Bitcoin', bg: '#1a0f00', surface: '#2a1800', card: '#1f1200', primary: '#f7931a', text: '#fff', subtext: '#aaa', border: '#3a2200' },
  nostr: { name: 'Nostr', bg: '#0d0014', surface: '#1a0028', card: '#150020', primary: '#9b59b6', text: '#eee', subtext: '#999', border: '#2a0040' },
  ocean: { name: 'Ocean', bg: '#001a2e', surface: '#002a4a', card: '#00223d', primary: '#00b4d8', text: '#eee', subtext: '#89c4e1', border: '#003366' },
  forest: { name: 'Forest', bg: '#0a1a0a', surface: '#122012', card: '#0f1a0f', primary: '#2ecc71', text: '#eee', subtext: '#8bc34a', border: '#1a2e1a' },
  light: { name: 'Light', bg: '#f5f5f5', surface: '#ffffff', card: '#f0f0f0', primary: '#e94560', text: '#222', subtext: '#666', border: '#ddd' },
  slate: { name: 'Slate', bg: '#1a1a1a', surface: '#2a2a2a', card: '#222', primary: '#9e9e9e', text: '#eee', subtext: '#888', border: '#333' },
  emerald: { name: 'Emerald', bg: '#0a1a10', surface: '#122018', card: '#0f1a12', primary: '#2ecc71', text: '#eee', subtext: '#7ecfa0', border: '#1a3022' },
  rose: { name: 'Rose', bg: '#1a0010', surface: '#2a0018', card: '#200012', primary: '#e91e8c', text: '#eee', subtext: '#c07090', border: '#3a0022' },
  violet: { name: 'Violet', bg: '#0e0a1a', surface: '#1a1228', card: '#150e20', primary: '#7c3aed', text: '#eee', subtext: '#9980c0', border: '#2a1a40' },
  amber: { name: 'Amber', bg: '#1a1200', surface: '#2a1e00', card: '#201800', primary: '#f59e0b', text: '#fff', subtext: '#c0a040', border: '#3a2e00' },
  pine: { name: 'Pine', bg: '#081210', surface: '#101e18', card: '#0c1814', primary: '#1a6b4a', text: '#eee', subtext: '#60a080', border: '#162e22' },
  mocha: { name: 'Mocha', bg: '#1a1008', surface: '#2a1e10', card: '#201608', primary: '#a0714a', text: '#eee', subtext: '#a08060', border: '#3a2818' },
  cobalt: { name: 'Cobalt', bg: '#080e1a', surface: '#101828', card: '#0c1220', primary: '#1e6bb5', text: '#eee', subtext: '#6090c0', border: '#162040' },
  blush: { name: 'Blush', bg: '#1a0e14', surface: '#2a1820', card: '#201218', primary: '#e06090', text: '#eee', subtext: '#c080a0', border: '#3a1e28' },
}

export const THEME_COLORS = Object.values(themes).map(t => t.primary)

