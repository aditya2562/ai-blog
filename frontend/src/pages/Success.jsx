import { useEffect } from 'react'

const Success = () => {
  useEffect(() => {
    document.title = 'Payment Successful | AI Blog Generator'
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-400">🎉 Payment Successful</h1>
        <p className="text-zinc-400">You are now a premium member! Enjoy unlimited features.</p>
        <a href="/generate" className="inline-block mt-6 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition">
          Start Creating Blogs
        </a>
      </div>
    </div>
  )
}

export default Success