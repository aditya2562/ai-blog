import { motion as Motion } from 'framer-motion'
import { BackgroundBeams } from './ui/background-beams'
import { Blogs } from '../data/blogs'

const BlogList = () => {
  return (
    <section className="relative py-20 px-6 bg-neutral-950 text-white overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
      
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Blogs.map((post, idx) => (
            <Motion.div
              key={idx}
              className="bg-white text-black shadow-md p-6 rounded-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{post.desc}</p>
              <a href={post.link} className="text-indigo-600 hover:underline">Read more →</a>
            </Motion.div>
          ))}
        </div>
      </div>
      <BackgroundBeams />
    </section>
  )
}

export default BlogList