import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { motion as Motion } from 'framer-motion'
import { auth } from '../firebase'

const AIBlogGenerator = () => {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const generateBlog = async () => {
    if (!topic.trim()) return

    setLoading(true)
    setGeneratedContent('')
    setErrorMessage('')

    const user = auth.currentUser
    if (!user) {
      alert("Please login to generate blogs")
      setLoading(false)
      return
    }

    try {
      const response = await fetch('https://ai-blog-backend-27mp.onrender.com/generate', {
        method: 'POST',
        headers: { "Content-Type": 'application/json' },
        body: JSON.stringify({ prompt: topic, user_email: user.email })
    })

      const data = await response.json()

      if (response.ok) {
        setGeneratedContent(data.blog)
      } else {
        setErrorMessage(data.error || 'Something went wrong.')
      }
    } catch (err) {
      console.error('❌ Error generating blog:', err)
      setErrorMessage('Server is currently unavailable. Please try again later.')
    }

    setLoading(false)
  }

  return (
    <section className="relative py-20 px-6 bg-black text-white overflow-hidden min-h-screen">
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <Motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkles className="inline-block text-pink-500 mr-2" />
          AI Blog Generator
        </Motion.h2>

        <p className="mb-6 text-zinc-400">
          Generate high-quality blog posts on any topic related to AI tools, freelancing, productivity, and more.
        </p>

        <input
          className="w-full p-3 rounded-md border border-zinc-600 bg-zinc-900 text-white mb-4"
          type="text"
          placeholder="e.g., Make Money with AI: 3 Passive Income Ideas"
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

        {errorMessage && (
          <Motion.p
            className="mt-4 text-red-400 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {errorMessage}
          </Motion.p>
        )}

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