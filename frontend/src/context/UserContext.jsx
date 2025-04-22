import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

// Create context
const UserContext = createContext()

// Custom hook to access user data
export const useUser = () => useContext(UserContext)

// Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [plan, setPlan] = useState('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'users', firebaseUser.email)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const data = docSnap.data()
            setPlan(data.plan || 'free')
          }
        } catch (err) {
          console.error('Failed to fetch plan from Firestore:', err)
        }
      } else {
        setPlan('free')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <UserContext.Provider value={{ user, plan, loading }}>
      {children}
    </UserContext.Provider>
  )
}