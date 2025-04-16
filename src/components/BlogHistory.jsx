import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'

const BlogHistory = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const user = auth.currentUser
        if (!user) return

        const q = query(
          collection(db, 'users', user.uid, 'blogs'),
          orderBy('createdAt', 'desc')
        )
        const querySnapshot = await getDocs(q)
        const userBlogs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setBlogs(userBlogs)
      } catch (error) {
        console.error('Error fetching blog history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  return (
    <section className="px-6 py-12 bg-gradient-to-br from-zinc-900 to-black min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center">📚 Your Blog History</h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-zinc-400">No blogs found. Try generating one!</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {blogs.map((blog, index) => (
              <Motion.div
                key={blog.id}
                className="bg-zinc-800 p-6 rounded-xl shadow hover:shadow-lg border border-zinc-700 hover:border-pink-500 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-sm text-zinc-400 mb-4">{blog.description}</p>
                <button
                  onClick={() => navigate(`/blog/${blog.id}`, { state: { blog } })}
                  className="text-pink-500 hover:underline font-medium"
                >
                  Read More →
                </button>
              </Motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default BlogHistory
