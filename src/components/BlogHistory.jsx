import { useEffect, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { auth } from '../firebase'

const BlogHistory = () => {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const user = auth.currentUser
    if (!user) return

    fetch(`http://localhost:5000/blog_history/${user.email}`)
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error('Failed to load blog history:', err))
  }, [])

  return (
    <section className="py-16 px-6 bg-neutral-900 text-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">Your Blog History</h2>
        {blogs.length === 0 ? (
          <p className="text-center text-zinc-400">No blogs found for your account.</p>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <Motion.div
                key={blog.id}
                className="bg-zinc-800 p-6 rounded-xl shadow-md border border-zinc-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-sm text-zinc-400 mb-4">{blog.desc}</p>
                <p className="text-zinc-300 whitespace-pre-line">{blog.content}</p>
              </Motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default BlogHistory