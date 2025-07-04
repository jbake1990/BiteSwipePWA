import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, PanInfo } from 'framer-motion'
import { useSession } from '../contexts/SessionContext'
import { ArrowLeft, Heart, X, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

// Sample restaurant data (replace with Yelp API integration)
const sampleRestaurants = [
  {
    id: '1',
    name: 'Pizza Palace',
    cuisine: 'Italian',
    rating: 4.5,
    price: '$$',
    distance: '0.3 mi',
    imageURL: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    address: '123 Main St',
    yelpId: 'pizza-palace-1'
  },
  {
    id: '2',
    name: 'Sushi Express',
    cuisine: 'Japanese',
    rating: 4.2,
    price: '$$$',
    distance: '0.5 mi',
    imageURL: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    address: '456 Oak Ave',
    yelpId: 'sushi-express-2'
  },
  {
    id: '3',
    name: 'Burger Joint',
    cuisine: 'American',
    rating: 4.0,
    price: '$',
    distance: '0.2 mi',
    imageURL: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    address: '789 Pine St',
    yelpId: 'burger-joint-3'
  },
  {
    id: '4',
    name: 'Taco Town',
    cuisine: 'Mexican',
    rating: 4.3,
    price: '$',
    distance: '0.4 mi',
    imageURL: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    address: '321 Elm St',
    yelpId: 'taco-town-4'
  },
  {
    id: '5',
    name: 'Thai Delight',
    cuisine: 'Thai',
    rating: 4.6,
    price: '$$',
    distance: '0.7 mi',
    imageURL: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400',
    address: '654 Maple Dr',
    yelpId: 'thai-delight-5'
  }
]

const VotingScreen = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { submitVote, observeSession, observeVotes } = useSession()
  const [session, setSession] = useState<any>(null)
  const [restaurants, setRestaurants] = useState(sampleRestaurants)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showMatch, setShowMatch] = useState(false)
  const [matchedRestaurant, setMatchedRestaurant] = useState<any>(null)
  const [userVotes, setUserVotes] = useState<Record<string, 'yes' | 'no'>>({})
  const [allVotes, setAllVotes] = useState<Record<string, Record<string, any>>>({})

  useEffect(() => {
    if (!sessionId) return

    const unsubscribeSession = observeSession(sessionId, (sessionData) => {
      console.log('Session updated:', sessionData)
      setSession(sessionData)
      if (sessionData?.state !== 'voting') {
        console.log('Session state changed from voting, navigating to home')
        navigate('/')
      }
    })

    const unsubscribeVotes = observeVotes(sessionId, (votes) => {
      console.log('Votes updated:', votes)
      console.log('Current session participants:', session?.participants?.length)
      setAllVotes(votes)
      
      // Only check for unanimous votes if we have session data
      if (!session?.participants) {
        console.log('No session data yet, skipping unanimous vote check')
        return
      }
      
      // Check for unanimous votes
      Object.entries(votes).forEach(([restaurantId, participantVotes]) => {
        console.log('Checking restaurant ID:', restaurantId)
        console.log('Participant votes:', participantVotes)
        
        const participantIds = Object.keys(participantVotes as Record<string, any>)
        const yesVotes = participantIds.filter(id => (participantVotes as Record<string, any>)[id].vote === 'yes')
        
        console.log('Total participants who voted:', participantIds.length)
        console.log('Yes votes:', yesVotes.length)
        console.log('Required for unanimous:', session?.participants?.length)
        console.log('Yes voters:', yesVotes)
        
        // If all participants voted yes for this restaurant
        if (yesVotes.length === session?.participants?.length && session?.participants?.length > 0) {
          console.log('Unanimous vote condition met! Looking for restaurant...')
          
          // Try to find restaurant by yelpId first, then by id
          let restaurant = restaurants.find(r => r.yelpId === restaurantId)
          if (!restaurant) {
            restaurant = restaurants.find(r => r.id === restaurantId)
          }
          
          console.log('Found restaurant:', restaurant?.name, 'for ID:', restaurantId)
          console.log('Available restaurants:', restaurants.map(r => ({ id: r.id, yelpId: r.yelpId, name: r.name })))
          
          if (restaurant) {
            console.log('🎉 Unanimous vote detected for:', restaurant.name)
            setMatchedRestaurant(restaurant)
            setShowMatch(true)
            toast.success('It\'s a match! 🎉')
            
            // Navigate to match screen after a short delay
            setTimeout(() => {
              console.log('Navigating to match screen...')
              navigate(`/match/${sessionId}`, { 
                state: { restaurant: restaurant }
              })
            }, 1500)
          } else {
            console.log('❌ Restaurant not found for ID:', restaurantId)
          }
        } else {
          console.log('Not unanimous - need', session?.participants?.length, 'yes votes, got', yesVotes.length)
        }
      })
    })

    // Simulate loading restaurants
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => {
      unsubscribeSession()
      unsubscribeVotes()
    }
  }, [sessionId, observeSession, observeVotes, navigate, restaurants])

  // Re-check for unanimous votes when session data becomes available
  useEffect(() => {
    if (session?.participants && Object.keys(allVotes).length > 0) {
      console.log('Session data available, re-checking for unanimous votes...')
      
      Object.entries(allVotes).forEach(([restaurantId, participantVotes]) => {
        const participantIds = Object.keys(participantVotes as Record<string, any>)
        const yesVotes = participantIds.filter(id => (participantVotes as Record<string, any>)[id].vote === 'yes')
        
        console.log('Re-checking restaurant ID:', restaurantId)
        console.log('Yes votes:', yesVotes.length, 'Required:', session.participants.length)
        
        if (yesVotes.length === session.participants.length && session.participants.length > 0) {
          console.log('Unanimous vote found on re-check!')
          
          let restaurant = restaurants.find(r => r.yelpId === restaurantId)
          if (!restaurant) {
            restaurant = restaurants.find(r => r.id === restaurantId)
          }
          
          if (restaurant) {
            console.log('🎉 Unanimous vote detected for:', restaurant.name)
            setMatchedRestaurant(restaurant)
            setShowMatch(true)
            toast.success('It\'s a match! 🎉')
            
            setTimeout(() => {
              console.log('Navigating to match screen...')
              navigate(`/match/${sessionId}`, { 
                state: { restaurant: restaurant }
              })
            }, 1500)
          }
        }
      })
    }
  }, [session, allVotes, restaurants, sessionId, navigate])

  const handleSwipe = async (direction: 'left' | 'right', restaurant: any) => {
    const vote = direction === 'right' ? 'yes' : 'no'
    
    if (sessionId) {
      await submitVote(sessionId, restaurant.yelpId, vote)
    }

    // Store vote locally
    setUserVotes(prev => ({
      ...prev,
      [restaurant.yelpId]: vote
    }))

    if (currentIndex < restaurants.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // All restaurants voted on
      toast.success('Voting complete! Waiting for others...')
    }
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (!restaurants[currentIndex]) return

    const swipeThreshold = 100
    const restaurant = restaurants[currentIndex]

    if (info.offset.x > swipeThreshold) {
      handleSwipe('right', restaurant)
    } else if (info.offset.x < -swipeThreshold) {
      handleSwipe('left', restaurant)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-bite-red animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    )
  }

  if (showMatch && matchedRestaurant) {
    console.log('Rendering match screen - showMatch:', showMatch, 'matchedRestaurant:', matchedRestaurant.name)
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-bite-swipe-yes rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">It's a Match! 🎉</h2>
          <p className="text-xl text-gray-600 mb-4">Everyone voted YES for</p>
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-sm mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{matchedRestaurant.name}</h3>
            <p className="text-gray-600">{matchedRestaurant.cuisine}</p>
          </div>
        </div>
      </div>
    )
  }

  if (currentIndex >= restaurants.length && !showMatch) {
    console.log('Rendering voting complete screen - currentIndex:', currentIndex, 'restaurants.length:', restaurants.length, 'showMatch:', showMatch)
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Voting Complete!</h2>
          <p className="text-gray-600">Waiting for other participants...</p>
        </div>
      </div>
    )
  }

  const currentRestaurant = restaurants[currentIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
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
            <h1 className="text-2xl font-bold text-gray-900 font-poppins">Swipe to Vote</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {currentIndex + 1} of {restaurants.length}
            </p>
            {session && (
              <p className="text-sm text-gray-600">
                {session.participants.length} participants
              </p>
            )}
          </div>
        </div>

        {/* Restaurant Card */}
        <div className="max-w-sm mx-auto">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Restaurant Image */}
              <div className="relative h-64 bg-gray-200">
                <img
                  src={currentRestaurant.imageURL}
                  alt={currentRestaurant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Restaurant Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-1">{currentRestaurant.name}</h2>
                  <p className="text-lg opacity-90 mb-2">{currentRestaurant.cuisine}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>⭐ {currentRestaurant.rating}</span>
                    <span>{currentRestaurant.price}</span>
                    <span>{currentRestaurant.distance}</span>
                  </div>
                </div>
              </div>

              {/* Restaurant Details */}
              <div className="p-6">
                <p className="text-gray-600 mb-4">{currentRestaurant.address}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSwipe('left', currentRestaurant)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
                  >
                    <X className="w-5 h-5" />
                    <span>Pass</span>
                  </button>
                  <button
                    onClick={() => handleSwipe('right', currentRestaurant)}
                    className="flex-1 bg-bite-red hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
                  >
                    <Heart className="w-5 h-5" />
                    <span>Like</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default VotingScreen 