// Generate a short, readable session code
export const generateSessionCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Validate session code format
export const isValidSessionCode = (code: string): boolean => {
  return /^[A-Z0-9]{6}$/.test(code)
}

// Convert Firebase key to short code (for existing sessions)
export const keyToShortCode = (key: string): string => {
  // Use first 6 characters of the Firebase key, uppercase
  return key.substring(0, 6).toUpperCase()
} 