import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { auth, db } from '../firebase'
import { collection, addDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore'

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
      alert('Please login to generate blogs')
      setLoading(false)
      return
    }
    
    try {
      // Use relative URL to work with both local and production
      const apiUrl = '/api-proxy'
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: topic, user_email: user.email })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.blog) {
        throw new Error('Failed to generate blog')
      }
      
      const blogTitle = `Blog on ${topic}`
      const blogDescription = data.blog.substring(0, 120) + '...'
      
      setGeneratedContent(data.blog)
      
      // Save to Firestore
      await setDoc(
        doc(db, 'users', user.uid),
        { email: user.email, lastActive: serverTimestamp() },
        { merge: true }
      )
      
      await addDoc(collection(db, 'users', user.uid, 'blogs'), {
        title: blogTitle,
        description: blogDescription,
        content: data.blog,
        createdAt: serverTimestamp()
      })
      
    } catch (err) {
      console.error('❌ Blog generation failed:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <section className="relative py-20 px-6 bg-black text-white overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <Motion.h2 className="text-3xl md:text-4xl font-bold mb-6">
          AI Blog Generator
        </Motion.h2>
        
        <input
          className="w-full h-12 rounded-md border border-zinc-600 bg-zinc-900 text-white mb-4"
          type="text"
          placeholder="Enter a topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        
        <button
          className="px-6 py-3 rounded-md bg-pink-600 hover:bg-pink-700 text-white"
          onClick={generateBlog}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Blog Post'}
        </button>
      </div>
      
      {generatedContent && (
        <Motion.div 
          className="mt-10 p-6 rounded-lg bg-zinc-800 text-left max-h-[500px] overflow-y-auto shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-2xl font-semibold mb-4">{topic}</h3>
          <div className="text-zinc-300 whitespace-pre-line">{generatedContent}</div>
        </Motion.div>
      )}
    </section>
  )
}

export default AIBlogGenerator