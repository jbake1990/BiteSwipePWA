import React, { createContext, useContext, useState, useEffect } from 'react'
import { useFirebase } from './FirebaseContext'
import { ref, push, get, onValue, off, set, update } from 'firebase/database'
import { database } from '../config/firebase'
import toast from 'react-hot-toast'
import { generateSessionCode } from '../utils/sessionUtils'

export interface Participant {
  id: string
  name: string
  joinedAt: number
  isReady: boolean
}

export interface Session {
  id: string
  shortCode: string
  hostId: string
  participants: Participant[]
  state: 'waiting' | 'voting' | 'completed'
  createdAt: number
  updatedAt: number
}

export interface Vote {
  participantId: string
  restaurantId: string
  vote: 'yes' | 'no'
  timestamp: number
}

export interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  price: string
  distance: string
  imageURL?: string
  address: string
  yelpId: string
}

interface SessionContextType {
  currentSession: Session | null
  createSession: () => Promise<string | null>
  joinSession: (sessionCode: string) => Promise<boolean>
  leaveSession: (sessionId: string) => Promise<void>
  updateSessionState: (sessionId: string, state: Session['state']) => Promise<void>
  submitVote: (sessionId: string, restaurantId: string, vote: Vote['vote']) => Promise<void>
  observeSession: (sessionId: string, callback: (session: Session | null) => void) => () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const useSession = () => {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useFirebase()
  const [currentSession, setCurrentSession] = useState<Session | null>(null)

  const createSession = async (): Promise<string | null> => {
    if (!user || !isAuthenticated) {
      toast.error('Not authenticated')
      return null
    }

    try {
      const sessionRef = push(ref(database, 'sessions'))
      const sessionId = sessionRef.key!
      const shortCode = generateSessionCode()
      
      const participant: Participant = {
        id: user.uid,
        name: 'Host',
        joinedAt: Date.now(),
        isReady: false
      }

      const session: Session = {
        id: sessionId,
        shortCode: shortCode,
        hostId: user.uid,
        participants: [participant],
        state: 'waiting',
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      await set(sessionRef, session)
      setCurrentSession(session)
      toast.success('Session created!')
      return shortCode // Return short code instead of Firebase key
    } catch (error) {
      console.error('Create session error:', error)
      toast.error('Failed to create session')
      return null
    }
  }

  const joinSession = async (sessionCode: string): Promise<boolean> => {
    if (!user || !isAuthenticated) {
      toast.error('Not authenticated')
      return false
    }

    try {
      // First try to find session by short code
      const sessionsRef = ref(database, 'sessions')
      const snapshot = await get(sessionsRef)
      
      if (!snapshot.exists()) {
        toast.error('Session not found')
        return false
      }

      let sessionId: string | null = null
      let session: Session | null = null

      // Search for session with matching short code
      snapshot.forEach((childSnapshot) => {
        const sessionData = childSnapshot.val()
        if (sessionData.shortCode === sessionCode.toUpperCase()) {
          sessionId = childSnapshot.key
          session = sessionData
        }
      })

      if (!sessionId || !session) {
        toast.error('Session not found')
        return false
      }

      // Check if user is already a participant
      if (session.participants.some(p => p.id === user.uid)) {
        setCurrentSession(session)
        return true
      }

      // Add new participant
      const newParticipant: Participant = {
        id: user.uid,
        name: 'Participant',
        joinedAt: Date.now(),
        isReady: false
      }

      session.participants.push(newParticipant)
      session.updatedAt = Date.now()

      await set(ref(database, `sessions/${sessionId}`), session)
      setCurrentSession(session)
      toast.success('Joined session!')
      return true
    } catch (error) {
      console.error('Join session error:', error)
      toast.error('Failed to join session')
      return false
    }
  }

  const leaveSession = async (sessionId: string): Promise<void> => {
    if (!user) return

    try {
      const sessionRef = ref(database, `sessions/${sessionId}`)
      const snapshot = await get(sessionRef)
      
      if (!snapshot.exists()) return

      const session: Session = snapshot.val()
      session.participants = session.participants.filter(p => p.id !== user.uid)
      session.updatedAt = Date.now()

      if (session.participants.length === 0) {
        // Delete session if no participants left
        await set(sessionRef, null)
      } else {
        // Update session
        await set(sessionRef, session)
      }

      setCurrentSession(null)
    } catch (error) {
      console.error('Leave session error:', error)
    }
  }

  const updateSessionState = async (sessionId: string, state: Session['state']): Promise<void> => {
    try {
      const updates: any = {
        state,
        updatedAt: Date.now()
      }
      
      await update(ref(database, `sessions/${sessionId}`), updates)
    } catch (error) {
      console.error('Update session state error:', error)
      toast.error('Failed to update session state')
    }
  }

  const submitVote = async (sessionId: string, restaurantId: string, vote: Vote['vote']): Promise<void> => {
    if (!user) return

    try {
      const voteData: Vote = {
        participantId: user.uid,
        restaurantId,
        vote,
        timestamp: Date.now()
      }

      await set(ref(database, `sessions/${sessionId}/votes/${restaurantId}/${user.uid}`), voteData)
    } catch (error) {
      console.error('Submit vote error:', error)
      toast.error('Failed to submit vote')
    }
  }

  const observeSession = (sessionId: string, callback: (session: Session | null) => void) => {
    const sessionRef = ref(database, `sessions/${sessionId}`)
    
    const unsubscribe = onValue(sessionRef, (snapshot) => {
      if (snapshot.exists()) {
        const session: Session = snapshot.val()
        callback(session)
      } else {
        callback(null)
      }
    })

    return () => off(sessionRef, 'value', unsubscribe)
  }

  const value = {
    currentSession,
    createSession,
    joinSession,
    leaveSession,
    updateSessionState,
    submitVote,
    observeSession
  }

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
} 