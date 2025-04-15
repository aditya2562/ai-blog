import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { motion as Motion } from 'framer-motion'
import { auth } from '../firebase'

const AIBlogGenerator = () => {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')

  const generateBlog = async () => {
    if (!topic.trim()) return

    setLoading(true)
    setGeneratedContent('')

    const user = auth.currentUser
    if (!user) {
      alert("Please login to generate blogs")
      setLoading(false)
      return
    }

    try {
      const response = await fetch('https://ai-blog-backend-27mp.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, user_email: user.email }), // ✅ FIXED KEY
      })

      const data = await response.json()

      if (response.ok) {
        setGeneratedContent(data.blog)
      } else {
        console.error('API Error:', data.error)
        alert('Failed to generate blog: ' + data.error)
      }
    } catch (err) {
      console.error('❌ Error generating blog:', err)
      alert('Something went wrong while generating the blog.')
    }

    setLoading(false)
  }

  return (
    <section className="relative py-20 px-6 bg-black text-white overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <Motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkles className="inline-block text-pink-500 mr-2" />
          AI Blog Generator
        </Motion.h2>

        <input
          className="w-full p-3 rounded-md border border-zinc-600 bg-zinc-900 text-white mb-4"
          type="text"
          placeholder="Enter a topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button
          className="px-6 py-3 rounded-md bg-pink-600 hover:bg-pink-700 text-white transition disabled:opacity-50"
          onClick={generateBlog}
          disabled={loading}
        >
          ✨ {loading ? 'Generating...' : 'Generate Blog Post'}
        </button>

        {generatedContent && (
          <Motion.div
            className="mt-10 p-6 rounded-lg bg-zinc-800 text-left max-h-[500px] overflow-y-auto shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-2xl font-semibold mb-4">{topic}</h3>
            <p className="text-zinc-300 whitespace-pre-line">{generatedContent}</p>
          </Motion.div>
        )}
      </div>
    </section>
  )
}

export default AIBlogGenerator