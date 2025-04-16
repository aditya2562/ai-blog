import { useState } from 'react'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // ✅ Save user info to localStorage
      localStorage.setItem('firebaseUser', JSON.stringify(user))

      navigate('/')
    } catch (err) {
      alert('Login failed: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-zinc-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-md bg-zinc-900 border border-zinc-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded-md bg-zinc-900 border border-zinc-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-md font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  )
}

export default Login