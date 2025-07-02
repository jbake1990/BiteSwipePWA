import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, database } from '../config/firebase'
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth'
import { ref, onValue, off } from 'firebase/database'

interface FirebaseContextType {
  user: User | null
  isAuthenticated: boolean
  isConnected: boolean
  signIn: () => Promise<void>
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined)

export const useFirebase = () => {
  const context = useContext(FirebaseContext)
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider')
  }
  return context
}

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const signIn = async () => {
    try {
      await signInAnonymously(auth)
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  useEffect(() => {
    // Monitor authentication state
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setIsAuthenticated(!!user)
    })

    // Monitor database connection
    const connectedRef = ref(database, '.info/connected')
    const unsubscribeConnection = onValue(connectedRef, (snapshot) => {
      setIsConnected(snapshot.val() || false)
    })

    // Auto-sign in if not authenticated
    if (!auth.currentUser) {
      signIn()
    }

    return () => {
      unsubscribeAuth()
      off(connectedRef, 'value', unsubscribeConnection)
    }
  }, [])

  const value = {
    user,
    isAuthenticated,
    isConnected,
    signIn
  }

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  )
} 