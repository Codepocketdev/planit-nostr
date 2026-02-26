import { Layout, Briefcase, User, Bitcoin, Zap, Heart } from 'lucide-react'

export const CATEGORIES = [
  { value: 'general', label: 'General', icon: Layout },
  { value: 'work', label: 'Work', icon: Briefcase },
  { value: 'personal', label: 'Personal', icon: User },
  { value: 'bitcoin', label: 'Bitcoin', icon: Bitcoin },
  { value: 'nostr', label: 'Nostr', icon: Zap },
  { value: 'health', label: 'Health', icon: Heart },
]

export function getCategoryIcon(value) {
  return (CATEGORIES.find(c => c.value === value) || CATEGORIES[0]).icon
}

