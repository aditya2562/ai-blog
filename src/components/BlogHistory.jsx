import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { motion as Motion, AnimatePresence } from 'framer-motion'

const BlogHistory = () => {
  const [blogs, setBlogs] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBlogs = async () => {
      const user = auth.currentUser
      if (!user) {
        alert('Please log in to view your blog history.')
        return navigate('/login')
      }

      const snapshot = await getDocs(collection(db, 'users', user.uid, 'blogs'))
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setBlogs(fetched)
    }

    fetchBlogs()
  }, [navigate])

  const deleteBlog = async (id) => {
    const user = auth.currentUser
    if (!user) return

    await deleteDoc(doc(db, 'users', user.uid, 'blogs', id))
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  const clearAllBlogs = async () => {
    const confirmed = window.confirm('Are you sure you want to clear all blog history?')
    if (!confirmed) return

    const user = auth.currentUser
    if (!user) return

    const snapshot = await getDocs(collection(db, 'users', user.uid, 'blogs'))
    const batchDeletes = snapshot.docs.map(d => deleteDoc(d.ref))

    await Promise.all(batchDeletes)
    setBlogs([])
  }

  return (
    <section className="p-6 max-w-5xl mx-auto text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">🕘 Your Blog History</h2>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-400">No blogs found. Start generating!</p>
      ) : (
        <>
          <div className="text-right mb-4">
            <button
              onClick={clearAllBlogs}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white text-sm"
            >
              🗑️ Clear All
            </button>
          </div>

          <div className="grid gap-6">
            <AnimatePresence>
              {blogs.map((blog) => (
                <Motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="p-5 rounded-lg bg-zinc-800 shadow border border-zinc-700"
                >
                  <h3 className="text-xl font-semibold mb-1">{blog.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{blog.description}</p>

                  <div className="flex justify-between items-center">
                    <a
                      href={`/blog/${blog.id}`}
                      className="text-blue-400 hover:underline text-sm"
                    >
                      Read More →
                    </a>
                    <button
                      onClick={() => deleteBlog(blog.id)}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </Motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </section>
  )
}

export default BlogHistory