import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { auth, db } from '../firebase'
import { collection, addDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore'

const AIBlogGenerator = () => {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('Formal')
  const [loading, setLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

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
      const isDev = window.location.hostname === 'localhost'
      const apiUrl = isDev ? '/api-proxy' : 'https://ai-blog-backend-27mp.onrender.com/generate'

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: topic, user_email: user.email, tone })
      })

      if (!response.ok) throw new Error('Blog generation failed.')

      const data = await response.json()
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

      console.log('✅ Blog saved to Firestore')
    } catch (err) {
      console.error('❌ Blog generation failed:', err)
      alert('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const sendEmail = async () => {
    const user = auth.currentUser
    if (!user || !generatedContent) return

    setSendingEmail(true)

    try {
      const isDev = window.location.hostname === 'localhost'
      const emailApiUrl = isDev ? '/send-email-proxy' : 'https://ai-blog-backend-27mp.onrender.com/send_email'

      const res = await fetch(emailApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          title: `Blog on ${topic}`,
          content: generatedContent
        })
      })

      if (!res.ok) throw new Error('Email failed.')

      alert('✅ Blog sent to your email!')
    } catch (err) {
      console.error('❌ Email send error:', err)
      alert('Failed to send email.')
    } finally {
      setSendingEmail(false)
    }
  }

  const handleCheckout = async () => {
    setCheckoutLoading(true)
    try {
      const user = auth.currentUser
      if (!user) {
        alert('Login to proceed to checkout.')
        return
      }

      const isDev = window.location.hostname === 'localhost'
      const checkoutUrl = isDev ? '/checkout-proxy' : 'https://ai-blog-backend-27mp.onrender.com/create-checkout-session'

      const res = await fetch(checkoutUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      })

      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Checkout failed')
      }
    } catch (err) {
      console.error('❌ Stripe checkout error:', err)
      alert('Failed to redirect to checkout.')
    } finally {
      setCheckoutLoading(false)
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

        <div className="flex flex-wrap justify-center gap-4">
          <button
            className="px-6 py-3 rounded-md bg-pink-600 hover:bg-pink-700 text-white"
            onClick={generateBlog}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Blog'}
          </button>

          <button
            className="px-6 py-3 rounded-md bg-green-600 hover:bg-green-700 text-white"
            onClick={handleCheckout}
            disabled={checkoutLoading}
          >
            {checkoutLoading ? 'Processing...' : '💳 Buy with Stripe'}
          </button>
        </div>

        {generatedContent && (
          <>
            <button
              className="mt-6 px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
              onClick={sendEmail}
              disabled={sendingEmail}
            >
              {sendingEmail ? 'Sending...' : '📩 Send to My Email'}
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