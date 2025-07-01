import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

const UserContext = createContext()
export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [plan, setPlan] = useState('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        try {
          const uidRef = doc(db, 'users', firebaseUser.uid)
          const emailRef = doc(db, 'users', firebaseUser.email)

          const [uidSnap, emailSnap] = await Promise.all([
            getDoc(uidRef),
            getDoc(emailRef),
          ])

          const uidData = uidSnap.exists() ? uidSnap.data() : {}
          const emailData = emailSnap.exists() ? emailSnap.data() : {}

          const detectedPlan = emailData.plan || uidData.plan || 'free'
          setPlan(detectedPlan)
        } catch (err) {
          console.error('⚠️ Failed to fetch plan:', err)
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