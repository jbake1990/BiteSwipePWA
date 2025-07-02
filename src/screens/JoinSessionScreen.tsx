import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSession } from '../contexts/SessionContext'
import { ArrowLeft, Loader, Copy, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

const JoinSessionScreen = () => {
  const navigate = useNavigate()
  const { joinSession } = useSession()
  const [sessionId, setSessionId] = useState('')
  const [isJoining, setIsJoining] = useState(false)

  const handleJoinSession = async () => {
    if (!sessionId.trim()) {
      toast.error('Please enter a session code')
      return
    }

    setIsJoining(true)
    const success = await joinSession(sessionId.trim())
    setIsJoining(false)
    
    if (success) {
      // We need to get the actual session ID from the current session
      // For now, we'll navigate to home and let the user create/join again
      navigate('/')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sessionId)
    toast.success('Session ID copied!')
  }

  const shareSessionId = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my BiteSwipe session',
          text: `Join my BiteSwipe session: ${sessionId}`,
          url: window.location.origin
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      copyToClipboard()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg bg-white shadow-lg mr-4"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 font-poppins">Join Session</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter Session Code</h2>
              <p className="text-gray-600">
                Enter the session code to join. You'll be redirected to the waiting screen.
              </p>
            </div>

            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="w-full bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 p-2.5"
              placeholder="Session Code (e.g., ABC123)"
            />

            <button
              onClick={handleJoinSession}
              disabled={isJoining}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isJoining ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                <span>Join Session</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default JoinSessionScreen 