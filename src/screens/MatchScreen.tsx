import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSession } from '../contexts/SessionContext'
import { ArrowLeft, MapPin, Star, Phone, Globe, Share2 } from 'lucide-react'

const MatchScreen = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { observeSession } = useSession()
  const [session, setSession] = useState<any>(null)
  const [matchedRestaurant, setMatchedRestaurant] = useState<any>(null)

  useEffect(() => {
    if (!sessionId) return

    const unsubscribe = observeSession(sessionId, (sessionData) => {
      setSession(sessionData)
      // In a real app, you'd calculate the matched restaurant based on votes
      // For now, we'll use a sample restaurant
      setMatchedRestaurant({
        id: '1',
        name: 'Pizza Palace',
        cuisine: 'Italian',
        rating: 4.5,
        price: '$$',
        distance: '0.3 mi',
        imageURL: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        address: '123 Main St',
        phone: '+1 (555) 123-4567',
        website: 'https://pizzapalace.com'
      })
    })

    return unsubscribe
  }, [sessionId, observeSession])

  const shareMatch = async () => {
    if (navigator.share && matchedRestaurant) {
      try {
        await navigator.share({
          title: 'We found a match!',
          text: `We're going to ${matchedRestaurant.name}!`,
          url: window.location.origin
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    }
  }

  if (!matchedRestaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding your match...</p>
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
            <h1 className="text-2xl font-bold text-gray-900 font-poppins">It's a Match!</h1>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          {/* Match Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="text-center mb-8"
          >
            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl">��</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h2>
            <p className="text-gray-600">Everyone agreed on this restaurant!</p>
          </motion.div>

          {/* Restaurant Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Restaurant Image */}
            <div className="relative h-48 bg-gray-200">
              <img
                src={matchedRestaurant.imageURL}
                alt={matchedRestaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Restaurant Info */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{matchedRestaurant.name}</h3>
              <p className="text-lg text-gray-600 mb-4">{matchedRestaurant.cuisine}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{matchedRestaurant.rating}</span>
                </div>
                <span className="text-sm text-gray-500">{matchedRestaurant.price}</span>
                <span className="text-sm text-gray-500">{matchedRestaurant.distance}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{matchedRestaurant.address}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </button>
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>Website</span>
                  </button>
                </div>

                <button
                  onClick={shareMatch}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Match</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Participants */}
          {session && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 bg-white rounded-2xl p-6 shadow-lg"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Everyone who voted:</h4>
              <div className="space-y-2">
                {session.participants.map((participant: any) => (
                  <div key={participant.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {participant.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-gray-900">{participant.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MatchScreen 