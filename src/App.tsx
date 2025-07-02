import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HomeScreen from './screens/HomeScreen'
import CreateSessionScreen from './screens/CreateSessionScreen'
import JoinSessionScreen from './screens/JoinSessionScreen'
import WaitingRoomScreen from './screens/WaitingRoomScreen'
import VotingScreen from './screens/VotingScreen'
import MatchScreen from './screens/MatchScreen'
import { FirebaseProvider } from './contexts/FirebaseContext'
import { SessionProvider } from './contexts/SessionContext'

function App() {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }
  }, [])

  return (
    <FirebaseProvider>
      <SessionProvider>
        <div className="min-h-screen bg-gray-50">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/create" element={<CreateSessionScreen />} />
              <Route path="/join" element={<JoinSessionScreen />} />
              <Route path="/waiting/:sessionId" element={<WaitingRoomScreen />} />
              <Route path="/voting/:sessionId" element={<VotingScreen />} />
              <Route path="/match/:sessionId" element={<MatchScreen />} />
            </Routes>
          </AnimatePresence>
        </div>
      </SessionProvider>
    </FirebaseProvider>
  )
}

export default App 