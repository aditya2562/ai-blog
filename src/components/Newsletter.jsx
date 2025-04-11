import { motion as Motion } from 'framer-motion'

const Newsletter = () => {
    return (
      <section className="bg-white py-14 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Join the AI Insider Newsletter</h2>
        <p className="mb-6 text-gray-600">Get weekly updates on top tools, tips, and automation hacks.</p>
        <form className="flex justify-center gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="border px-4 py-2 rounded-lg w-full"
          />
          <Motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#007bff',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
          Subscribe
          </Motion.button>
        </form>
      </section>
    )
  }
  
  export default Newsletter