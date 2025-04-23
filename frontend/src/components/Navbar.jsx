import { Link } from 'react-router-dom'
import { auth, db } from '../firebase'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'

const Navbar = () => {
  const [user, setUser] = useState(null)
  const [plan, setPlan] = useState(null)

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

  return (
    <nav className="bg-black text-white py-4 px-6 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold text-pink-500">
        🧠 AI Blog
      </Link>

      <div className="space-x-4 flex items-center">
        <Link to="/generate" className="hover:text-pink-400">Generate</Link>
        <Link to="/history" className="hover:text-pink-400">History</Link>
        <Link to="/pricing" className="hover:text-pink-400 font-medium">Pricing</Link>

        {plan === 'premium' && (
          <Link to="/dashboard" className="hover:text-green-400 font-medium">Dashboard</Link>
        )}

        {user ? (
          <span className="ml-4 text-sm text-zinc-400">{user.email}</span>
        ) : (
          <>
            <Link to="/login" className="bg-pink-600 px-4 py-2 rounded hover:bg-pink-700">Login</Link>
            <Link to="/signup" className="bg-zinc-700 px-4 py-2 rounded hover:bg-zinc-600">Signup</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar