import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSession } from '../contexts/SessionContext'
import { ArrowLeft, Loader } from 'lucide-react'

const CreateSessionScreen = () => {
  const navigate = useNavigate()
  const { createSession } = useSession()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateSession = async () => {
    setIsCreating(true)
    const sessionId = await createSession()
    setIsCreating(false)
    
    if (sessionId) {
      navigate(`/waiting/${sessionId}`)
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
          <h1 className="text-2xl font-bold text-gray-900 font-poppins">Create Session</h1>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Start a New Session</h2>
              <p className="text-gray-600">
                Create a session and invite friends to join. You'll be the host and can start voting when everyone's ready.
              </p>
            </div>

            <button
              onClick={handleCreateSession}
              disabled={isCreating}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isCreating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Session</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CreateSessionScreen 