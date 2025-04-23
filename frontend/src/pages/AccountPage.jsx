import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

const AccountPage = () => {
  const [user, setUser] = useState(null)
  const [plan, setPlan] = useState('free')

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u)
      if (u) {
        const userDoc = await getDoc(doc(db, 'users', u.email))
        const userData = userDoc.data()
        setPlan(userData?.plan || 'free')
      }
    })
    return () => unsubscribe()
  }, [])

  const manageSubscription = async () => {
    try {
      const res = await fetch('https://ai-blog-backend-27mp.onrender.com/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Something went wrong.')
      }
    } catch (err) {
      console.error(err)
      alert('Error accessing Stripe portal.')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">My Account</h1>
        <p className="mb-2">👤 Email: {user?.email}</p>
        <p className="mb-4">⭐ Plan: {plan}</p>

        {plan === 'premium' && (
          <button
            onClick={manageSubscription}
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-md"
          >
            Manage Subscription
          </button>
        )}
      </div>
    </div>
  )
}

export default AccountPage