import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyBEv3ESCCvsw-W58YUgbv40Rctd7I0UP9I",
  authDomain: "project-6188492910497320230.firebaseapp.com",
  databaseURL: "https://project-6188492910497320230-default-rtdb.firebaseio.com",
  projectId: "project-6188492910497320230",
  storageBucket: "project-6188492910497320230.firebasestorage.app",
  messagingSenderId: "80259007577",
  appId: "1:80259007577:ios:640aca01109895dc919d48"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const database = getDatabase(app)

export default app 