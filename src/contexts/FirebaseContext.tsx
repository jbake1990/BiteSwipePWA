import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, database } from '../config/firebase'
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth'
import { ref, onValue, off } from 'firebase/ 