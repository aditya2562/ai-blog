import { useState, useEffect } from 'react'
import { motion as Motion } from 'framer-motion'
import { db } from '../firebase'
import {
  collection,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore'
import { useUser } from '../context/UserContext'

const AIBlogGenerator = () => {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('Formal')
  const [loading, setLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)

  const { user, plan, loading: userLoading } = useUser()
  const [canGenerate, setCanGenerate] = useState(true)

  useEffect(() => {
    const checkBlogLimit = async () => {
      if (!user || plan !== 'free') return

      const todayStart = Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0)))
      const q = query(
        collection(db, 'users', user.uid, 'blogs'),
        where('createdAt', '>=', todayStart)
      )

      const snapshot = await getDocs(q)
      if (snapshot.size >= 3) {
        setCanGenerate(false)
      }
    }

    checkBlogLimit()
  }, [user, plan])

  const generateBlog = async () => {
    if (!topic.trim()) return

    if (!user) {
      alert('Please login to generate blogs')
      return
    }

    if (plan === 'free' && !canGenerate) {
      alert('Free users can only generate 3 blogs per day. Upgrade to premium for unlimited access.')
      return
    }

    setLoading(true)
    setGeneratedContent('')

    try {
      const isDev = ['localhost', '127.0.0.1'].includes(window.location.hostname)
      const apiUrl = isDev
        ? '/api-proxy'
        : 'https://ai-blog-backend-27mp.onrender.com/generate'

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: topic, user_email: user.email, tone })
      })

      const data = await res.json()

      if (!res.ok) {
        console.error("Error from backend:", data)
        alert(data.error || "Something went wrong.")
        return
      }

      const blogTitle = `Blog on ${topic}`
      const blogDescription = data.blog.substring(0, 120) + '...'

      setGeneratedContent(data.blog)

      await setDoc(
        doc(db, 'users', user.uid),
        { email: user.email, lastActive: serverTimestamp() },
        { merge: true }
      )

      await addDoc(collection(db, 'users', user.uid, 'blogs'), {
        title: blogTitle,
        description: blogDescription,
        content: data.blog,
        topic,
        tone,
        createdAt: serverTimestamp()
      })

      // Update generation limit after storing
      if (plan === 'free') {
        const todayStart = Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0)))
        const q = query(
          collection(db, 'users', user.uid, 'blogs'),
          where('createdAt', '>=', todayStart)
        )
        const snapshot = await getDocs(q)
        if (snapshot.size >= 3) {
          setCanGenerate(false)
        }
      }
    } catch (err) {
      console.error('❌ Blog generation failed:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const sendEmail = async () => {
    if (!user || !generatedContent || plan !== 'premium') {
      alert('Only premium users can send emails.')
      return
    }

    setSendingEmail(true)

    try {
      const isDev = ['localhost', '127.0.0.1'].includes(window.location.hostname)
      const emailApiUrl = isDev
        ? '/send-email-proxy'
        : 'https://ai-blog-backend-27mp.onrender.com/send_email'

      const res = await fetch(emailApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          title: `Blog on ${topic}`,
          content: generatedContent
        })
      })

      if (!res.ok) throw new Error((await res.json()).error || 'Failed to send email')
      alert('✅ Blog sent to your email!')
    } catch (err) {
      console.error('❌ Email send error:', err)
      alert('Error sending email. Please try again.')
    } finally {
      setSendingEmail(false)
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

        <select
          className="w-full h-12 mb-4 rounded-md border border-zinc-600 bg-zinc-900 text-white px-2"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option>Formal</option>
          <option>Casual</option>
          <option>Funny</option>
          <option>Poetic</option>
          <option>Persuasive</option>
        </select>

        <button
          className="px-6 py-3 rounded-md bg-pink-600 hover:bg-pink-700 text-white mr-4"
          onClick={generateBlog}
          disabled={loading || userLoading}
        >
          {loading ? 'Generating...' : 'Generate Blog Post'}
        </button>

        {generatedContent && (
          <>
            <button
              className="mt-4 px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
              onClick={sendEmail}
              disabled={sendingEmail || plan !== 'premium'}
            >
              {sendingEmail ? 'Sending...' : '📩 Send to My Email (Premium only)'}
            </button>

            <Motion.div
              className="mt-10 p-6 rounded-lg bg-zinc-800 text-left max-h-[500px] overflow-y-auto shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-2xl font-semibold mb-4">{topic}</h3>
              <div className="text-zinc-300 whitespace-pre-line">{generatedContent}</div>
            </Motion.div>
          </>
        )}
      </div>
    </section>
  )
}

export default AIBlogGenerator