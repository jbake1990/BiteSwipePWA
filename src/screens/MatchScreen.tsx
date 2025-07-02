import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSession } from '../contexts/SessionContext'
import { ArrowLeft, MapPin, Star, Phone, Globe, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

const MatchScreen = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { observeSession } = useSession()
  const [session, setSession] = useState<any>(null)
  
  // Get restaurant data from navigation state or use fallback
  const restaurant = location.state?.restaurant || {
    name: 'Restaurant',
    cuisine: 'Cuisine',
    rating: 4.5,
    price: '$$',
    address: 'Address',
    imageURL: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
  }

  useEffect(() => {
    if (!sessionId) return

    const unsubscribe = observeSession(sessionId, (sessionData) => {
      setSession(sessionData)
    })

    return unsubscribe
  }, [sessionId, observeSession])

  const shareMatch = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'We found a match on BiteSwipe!',
          text: `We all agreed on ${restaurant.name}! 🎉`,
          url: window.location.origin
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback to copying to clipboard
      const text = `We found a match on BiteSwipe! We all agreed on ${restaurant.name}! 🎉`
      navigator.clipboard.writeText(text)
      toast.success('Match details copied!')
    }
  }

  const openMaps = () => {
    const address = encodeURIComponent(restaurant.address)
    window.open(`https://maps.google.com/?q=${address}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg bg-white shadow-lg mr-4"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 font-poppins">It's a Match!</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          {/* Match Animation */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-bite-swipe-yes rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              Everyone voted YES!
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-gray-600"
            >
              You all agreed on this restaurant
            </motion.p>
          </div>

          {/* Restaurant Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6"
          >
            {/* Restaurant Image */}
            <div className="relative h-48 bg-gray-200">
              <img
                src={restaurant.imageURL}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Restaurant Info */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>
              <p className="text-lg text-gray-600 mb-4">{restaurant.cuisine}</p>
              
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{restaurant.rating}</span>
                </div>
                <span>{restaurant.price}</span>
              </div>

              <div className="flex items-center space-x-2 text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{restaurant.address}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={openMaps}
                  className="flex-1 bg-bite-red hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Directions</span>
                </button>
                
                <button
                  onClick={shareMatch}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Session Info */}
          {session && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Session Participants</h4>
              <div className="space-y-2">
                {session.participants.map((participant: any) => (
                  <div key={participant.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-bite-red rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-700">{participant.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default MatchScreen 