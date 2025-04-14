import { useState } from 'react'
import axios from 'axios'
import { motion as Motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import Typing from 'react-typing-effect'

const AIBlogGenerator = () => {
  const [topic, setTopic] = useState('')
  const [post, setPost] = useState('')
  const [loading, setLoading] = useState(false)

  const generatePost = async () => {
    if (!topic) return
    setLoading(true)
    setPost('')
    try {
      const response = await axios.post('http://127.0.0.1:5000/generate-blog', {
        topic: topic
      })

      setPost(response.data.post)
      console.log("🎯 AI response:", response.data.post)

      // 🎉 Confetti effect
      confetti({
        particleCount: 180,
        spread: 70,
        startVelocity: 40,
        origin: { y: 0.6 }
      })
    } catch (error) {
      setPost("Something went wrong: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Motion.div
      className={`p-6 rounded-2xl max-w-3xl mx-auto mt-12 transition-all duration-500 ${
        post
          ? 'bg-gradient-to-r from-[#ffecd2] to-[#fcb69f] text-[#1e1e1e]'
          : 'bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-xl'
      }`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2
        className={`text-3xl font-bold mb-4 text-center ${
          post ? 'font-[Space Grotesk]' : 'font-[Inter]'
        }`}
      >
        🧠 AI Blog Generator
      </h2>

      <Motion.input
        type="text"
        placeholder="Enter a topic..."
        className={`border p-3 w-full rounded-lg mb-4 focus:outline-none text-black ${
          post ? 'bg-white/80 border-white/60' : 'bg-white text-black'
        }`}
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        whileFocus={{ scale: 1.02 }}
      />

      <Motion.button
        whileTap={{ scale: 0.95 }}
        animate={{ opacity: loading ? 0.7 : 1 }}
        className={`w-full font-semibold px-4 py-2 rounded-lg transition text-white ${
          loading ? 'cursor-wait bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
        onClick={generatePost}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Blog Post'}
      </Motion.button>

      {post && (
        <Motion.div
          className="mt-6 bg-white/90 text-black p-5 rounded-xl border border-white/40 shadow-md whitespace-pre-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold mb-3 font-[Space Grotesk] text-indigo-900">
            📝 Generated Blog Post:
          </h3>
          <p className="text-black">{post}</p>
        </Motion.div>
      )}
    </Motion.div>
  )
}

export default AIBlogGenerator