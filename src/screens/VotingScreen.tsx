import { useState, useEffect } from 'react'
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
    imageURL: 'https://images.unsplash.com/photo-1568 