import { motion as Motion } from 'framer-motion'

const Newsletter = () => {
  return (
    <Motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="relative py-24 px-6 text-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50"
    >
      {/* 🔵 Animated Blob Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <Motion.div
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -50, 50, 0],
            rotate: [0, 45, -45, 0],
          }}
          transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
          className="absolute top-10 left-1/3 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl mix-blend-multiply"
        />
        <Motion.div
          animate={{
            x: [0, -150, 150, 0],
            y: [0, 100, -100, 0],
            rotate: [0, -30, 30, 0],
          }}
          transition={{ repeat: Infinity, duration: 25, ease: 'easeInOut' }}
          className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-400 opacity-20 rounded-full blur-3xl mix-blend-multiply"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl font-bold mb-4 text-gray-900"
        >
          Join the AI Insider Newsletter
        </Motion.h2>

        <Motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8 text-gray-700 text-lg"
        >
          Get weekly updates on top tools, tips, and automation hacks.
        </Motion.p>

        <Motion.form
          className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Motion.input
            type="email"
            placeholder="Enter your email"
            whileHover={{
              scale: 1.03,
              boxShadow: '0 0 12px rgba(99,102,241,0.2)',
              borderColor: '#6366f1',
            }}
            whileFocus={{
              scale: 1.04,
              boxShadow: '0 0 16px rgba(99,102,241,0.4)',
              borderColor: '#6366f1',
            }}
            transition={{ type: 'spring', stiffness: 250 }}
            className="px-4 py-3 rounded-lg w-full shadow-sm border border-gray-300 focus:outline-none transition-all duration-300 bg-white text-black placeholder-gray-500"
            />
          <Motion.button
            whileHover={{
              scale: 1.05,
              background:
                'linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)',
              backgroundSize: '200% 100%',
              backgroundPosition: 'right center',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
          >
            Subscribe
          </Motion.button>
        </Motion.form>
      </div>
    </Motion.section>
  )
}

export default Newsletter