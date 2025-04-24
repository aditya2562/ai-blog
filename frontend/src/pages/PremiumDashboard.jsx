import { auth } from '../firebase'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PremiumDashboard = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (!u) {
        navigate('/login')
      } else {
        setUser(u)
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [navigate])

  const handleManageSubscription = async () => {
    if (!user) {
      alert("User not loaded yet. Please wait.")
      return
    }

    try {
      const res = await fetch("https://ai-blog-backend-27mp.onrender.com/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Something went wrong.")
      }
    } catch (err) {
      console.error("❌ Portal Error:", err)
      alert("Error accessing Stripe portal.")
    }
  }

  if (loading) return <div className="text-center py-20 text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-zinc-900 text-white px-6 py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome Back 👋</h1>
        <p className="text-zinc-400 mb-4">You're now on the Premium Plan, {user?.email}</p>
        
        <div className="space-y-4 mt-8">
          <button
            onClick={() => navigate('/generate')}
            className="block w-full py-3 bg-pink-600 hover:bg-pink-700 rounded-md"
          >
            ✨ Generate a New Blog
          </button>
          <button
            onClick={() => navigate('/history')}
            className="block w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            📝 View Blog History
          </button>
          <button
            onClick={() => navigate('/account')}
            className="block w-full py-3 bg-zinc-700 hover:bg-zinc-800 rounded-md"
          >
            👤 My Account
          </button>
          <button
            onClick={handleManageSubscription}
            className="block w-full py-3 bg-yellow-600 hover:bg-yellow-700 rounded-md"
          >
            💳 Manage Subscription
          </button>
        </div>
      </div>
    </div>
  )
}

export default PremiumDashboard