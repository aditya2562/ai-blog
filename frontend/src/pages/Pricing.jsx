import { useEffect, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { auth, db } from '../firebase'
import { doc, onSnapshot } from 'firebase/firestore'

const Pricing = () => {
  const [user, setUser] = useState(null)
  const [plan, setPlan] = useState('free')

  useEffect(() => {
    document.title = 'Pricing | AI Blog Generator'

    // Track unsubscribe functions for cleanup
    let unsubscribePlan = null

    // Listen for auth state changes
    const unsubscribeAuth = auth.onAuthStateChanged((u) => {
      setUser(u)
      // Clean up previous plan listener
      if (unsubscribePlan) {
        unsubscribePlan()
        unsubscribePlan = null
      }
      if (u) {
        const userDocRef = doc(db, 'users', u.email)
        unsubscribePlan = onSnapshot(
          userDocRef,
          (userDoc) => {
            const userData = userDoc.exists() ? userDoc.data() : {}
            // Defensive trim and lower-case to avoid case/space bugs
            const firestorePlan = (userData?.plan || 'free').toString().trim().toLowerCase()
            setPlan(firestorePlan)
            console.log('Plan from Firestore:', firestorePlan)
          },
          (err) => {
            console.error('Error listening to user plan:', err)
            setPlan('free')
          }
        )
      } else {
        setPlan('free')
      }
    })

    // Clean up all listeners on unmount
    return () => {
      unsubscribeAuth()
      if (unsubscribePlan) unsubscribePlan()
    }
  }, [])

  const handleUpgrade = async () => {
    if (!user) {
      alert('Please log in first to upgrade.')
      return
    }

    try {
      const res = await fetch('https://ai-blog-backend-27mp.onrender.com/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email })
      })

      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        console.error('❌ Unexpected Stripe response:', data)
        alert('Something went wrong while redirecting to payment.')
      }
    } catch (err) {
      console.error('❌ Error creating checkout session:', err)
      alert('Failed to start checkout session.')
    }
  }

  // Debug: See the current plan in the console on every render
  console.log('Current plan state:', plan)

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <Motion.h1
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Choose Your Plan
        </Motion.h1>

        <p className="text-zinc-400 mb-12 max-w-2xl mx-auto text-lg">
          Unlock your full creative potential by upgrading to Premium.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Free Plan */}
          <Motion.div
            className="border border-zinc-700 bg-zinc-800 rounded-2xl p-8 shadow-xl transition hover:shadow-pink-500/20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Free Plan</h2>
            <p className="text-zinc-400 mb-6">Perfect for getting started with AI blog generation.</p>
            <ul className="text-left space-y-2 text-zinc-300 mb-6">
              <li>✅ Generate 3 blog per day</li>
              <li>❌ Email delivery</li>
              <li>❌ PDF downloads</li>
              <li>❌ Premium tones</li>
            </ul>
            {plan === 'free' ? (
              <button className="px-5 py-2 rounded-md bg-zinc-600 text-white cursor-not-allowed opacity-50">
                Current Plan
              </button>
            ) : (
              <button className="px-5 py-2 rounded-md bg-green-600 text-white cursor-not-allowed">
                You're on Premium
              </button>
            )}
          </Motion.div>

          {/* Premium Plan */}
          <Motion.div
            className="border-2 border-pink-600 bg-zinc-900 rounded-2xl p-8 shadow-2xl transition hover:shadow-pink-500/30"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-pink-400">Premium Plan</h2>
            <p className="text-zinc-400 mb-6">Access full features and supercharge your productivity.</p>
            <ul className="text-left space-y-2 text-zinc-300 mb-6">
              <li>✅ Unlimited blog generation</li>
              <li>✅ Email delivery</li>
              <li>✅ PDF downloads</li>
              <li>✅ Premium tones and writing styles</li>
            </ul>
            {plan === 'premium' ? (
              <button className="w-full py-3 rounded-md bg-green-600 text-white text-lg font-medium cursor-not-allowed">
                You're on Premium
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                className="w-full py-3 rounded-md bg-pink-600 hover:bg-pink-700 text-white text-lg font-medium transition"
              >
                Upgrade Now →
              </button>
            )}
          </Motion.div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
