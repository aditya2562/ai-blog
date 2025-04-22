import { useEffect } from 'react'

const Cancel = () => {
  useEffect(() => {
    document.title = 'Payment Cancelled | AI Blog Generator'
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-red-400">⚠️ Payment Cancelled</h1>
        <p className="text-zinc-400">Your payment was not completed. You can try again anytime.</p>
        <a href="/pricing" className="inline-block mt-6 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition">
          Back to Pricing
        </a>
      </div>
    </div>
  )
}

export default Cancel