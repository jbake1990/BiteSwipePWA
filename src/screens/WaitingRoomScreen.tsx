import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from '../contexts/SessionContext'
import { useFirebase } from '../contexts/FirebaseContext'
import { ArrowLeft, Users, Play, Copy, Share2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const WaitingRoomScreen = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { user } = useFirebase()
  const { currentSession, observeSession, updateSessionState } = useSession()
  const [session, setSession] = useState<any>(null)
  const [isHost, setIsHost] = useState(false)

  useEffect(() => {
    if (!sessionId) return

    const unsubscribe = observeSession(sessionId, (sessionData) => {
      console.log('WaitingRoom: Session data received:', sessionData)
      setSession(sessionData)
      if (sessionData && user) {
        const isHostUser = sessionData.hostId === user.uid
        setIsHost(isHostUser)
        console.log('WaitingRoom: User is host:', isHostUser, 'Session state:', sessionData.state)
        
        // Auto-navigate to voting when session state changes to 'voting'
        if (sessionData.state === 'voting') {
          console.log('WaitingRoom: Session state is voting, navigating to voting screen')
          navigate(`/voting/${sessionId}`)
        }
      }
    })

    return unsubscribe
  }, [sessionId, user, observeSession, navigate])

  const copySessionId = () => {
    navigator.clipboard.writeText(session.shortCode || sessionId!)
    toast.success('Session code copied!')
  }

  const shareSession = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my BiteSwipe session',
          text: `Join my BiteSwipe session: ${session.shortCode || sessionId}`,
          url: window.location.origin
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      copySessionId()
    }
  }

  const startVoting = async () => {
    if (!sessionId) return
    
    console.log('WaitingRoom: Starting voting for session:', sessionId)
    await updateSessionState(sessionId, 'voting')
    console.log('WaitingRoom: Session state updated to voting, navigating...')
    navigate(`/voting/${sessionId}`)
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg bg-white shadow-lg mr-4"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 font-poppins">Waiting Room</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Session Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Session ID</h2>
              <div className="bg-gray-100 rounded-xl p-4 mb-4">
                <p className="text-2xl font-mono font-bold text-gray-900">
                  {session.shortCode || sessionId}
                </p>
              </div>
              <div className="flex space-x-2 justify-center">
                <button
                  onClick={copySessionId}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={shareSession}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Participants */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">Participants</h3>
              </div>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {session.participants.length}
              </span>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {session.participants.map((participant: any, index: number) => (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {participant.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{participant.name}</p>
                        <p className="text-sm text-gray-500">
                          {participant.id === session.hostId ? 'Host' : 'Participant'}
                        </p>
                      </div>
                    </div>
                    {participant.isReady && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Start Voting Button */}
          {isHost && session.participants.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <button
                onClick={startVoting}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center space-x-2 mx-auto"
              >
                <Play className="w-5 h-5" />
                <span>Start Voting</span>
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Ready to start voting with {session.participants.length} participants
              </p>
            </motion.div>
          )}

          {!isHost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <p className="text-gray-600">
                Waiting for the host to start voting...
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WaitingRoomScreen 