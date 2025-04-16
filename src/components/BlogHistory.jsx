import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'

const BlogHistory = () => {
  const [blogs, setBlogs] = useState([])

  const fetchBlogs = async () => {
    const user = auth.currentUser
    if (!user) return

    const snapshot = await getDocs(collection(db, 'users', user.uid, 'blogs'))
    const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setBlogs(fetched)
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const deleteBlog = async (id) => {
    const user = auth.currentUser
    if (!user) return

    await deleteDoc(doc(db, 'users', user.uid, 'blogs', id))
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  const clearAllBlogs = async () => {
    const user = auth.currentUser
    if (!user) return

    const snapshot = await getDocs(collection(db, 'users', user.uid, 'blogs'))
    const batchDeletes = snapshot.docs.map(d => deleteDoc(d.ref))

    await Promise.all(batchDeletes)
    setBlogs([])
  }

  return (
    <section className="p-6 max-w-4xl mx-auto text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Saved Blogs</h2>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-400">No blogs yet.</p>
      ) : (
        <>
          <div className="text-right mb-4">
            <button
              onClick={clearAllBlogs}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white"
            >
              🗑️ Clear All
            </button>
          </div>

          <div className="grid gap-6">
            {blogs.map((blog) => (
              <div key={blog.id} className="p-4 rounded-md bg-zinc-800 shadow-md">
                <h3 className="text-xl font-semibold">{blog.title}</h3>
                <p className="text-sm text-gray-400 mb-2">{blog.description}</p>

                <div className="flex justify-between items-center mt-3">
                  <a href={`/blog/${blog.id}`} className="text-blue-500 hover:underline">
                    Read More →
                  </a>
                  <button
                    onClick={() => deleteBlog(blog.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default BlogHistory