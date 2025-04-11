import { motion as Motion, useMotionValue, useTransform } from 'framer-motion'
import { BackgroundBeams } from './ui/background-beams'
import { Blogs } from '../data/blogs'

const BlogList = () => {
  return (
    <section className="relative py-20 px-6 bg-neutral-950 text-white overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Heading */}
        <div className="relative text-center mb-12">
          <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 opacity-20 rounded-full w-1/2 mx-auto h-12 top-1/2 -translate-y-1/2"></div>
          <Motion.h2
            className="relative text-4xl md:text-5xl font-extrabold text-white"
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            Latest Posts
          </Motion.h2>
        </div>

        {/* Blog Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Blogs.map((post, idx) => (
            <HoverCard key={idx} post={post} delay={idx * 0.1} />
          ))}
        </div>
      </div>
      <BackgroundBeams />
    </section>
  )
}

export default BlogList

// ✨ Unique HoverCard component with 3D tilt and glow
const HoverCard = ({ post, delay }) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-50, 50], [15, -15])
  const rotateY = useTransform(x, [-50, 50], [-15, 15])

  return (
    <Motion.div
      onMouseMove={(e) => {
        const bounds = e.currentTarget.getBoundingClientRect()
        const xVal = e.clientX - bounds.left - bounds.width / 2
        const yVal = e.clientY - bounds.top - bounds.height / 2
        x.set(xVal)
        y.set(yVal)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 120,
        damping: 10,
      }}
      className="relative bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl overflow-hidden border border-slate-700 shadow-lg group hover:border-cyan-500 transition-all duration-500"
    >
      {/* Glow Border Sweep */}
      <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-700 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
        <p className="text-sm text-zinc-400 mb-6">{post.desc}</p>

        {/* Animated arrow */}
        <Motion.a
          href={post.link}
          className="inline-flex items-center text-cyan-400 font-medium"
          whileHover={{ x: 5 }}
        >
          Read more →
        </Motion.a>
      </div>
    </Motion.div>
  )
}
``