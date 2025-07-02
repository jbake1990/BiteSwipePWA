import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useFirebase } from '../contexts/FirebaseContext'
import { Utensils, Users } from 'lucide-react'

const HomeScreen = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isConnected } = useFirebase()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6">
              <img
                src="/biteswipe-logo.png"
                alt="BiteSwipe Logo"
                className="w-24 h-24 object-contain"
                draggable={false}
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-poppins">
              BiteSwipe
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Make restaurant decisions together with friends using Tinder-style swiping
            </p>
          </motion.div>

          {/* Connection Status */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="space-y-4 max-w-sm mx-auto">
            <button
              onClick={() => navigate('/create')}
              className="w-full bg-bite-red hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Invite
            </button>

            <button
              onClick={() => navigate('/join')}
              className="w-full bg-white border-2 border-bite-red text-bite-red hover:bg-red-50 font-semibold py-4 px-6 rounded-xl transition-all duration-200"
            >
              Join
            </button>
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Utensils className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Swipe to Vote</h3>
              <p className="text-gray-600">Tinder-style interface for restaurant voting</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Sync</h3>
              <p className="text-gray-600">See votes and results in real-time</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Utensils className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Matches</h3>
              <p className="text-gray-600">Discover restaurants everyone likes</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default HomeScreen 