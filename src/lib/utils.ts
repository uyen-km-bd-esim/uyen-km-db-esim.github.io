import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Local storage utilities
export const storage = {
  get: (key: string) => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
      } catch (error) {
        console.error(`Error getting ${key} from localStorage:`, error)
        return null
      }
    }
    return null
  },
  
  set: (key: string, value: any) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error(`Error setting ${key} in localStorage:`, error)
      }
    }
  },
  
  remove: (key: string) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.error(`Error removing ${key} from localStorage:`, error)
      }
    }
  },
  
  clear: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear()
      } catch (error) {
        console.error('Error clearing localStorage:', error)
      }
    }
  }
}