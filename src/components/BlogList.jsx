import { motion as Motion } from 'framer-motion'
import { BackgroundBeams } from './ui/background-beams'
import { Blogs } from '../data/blogs'

const BlogList = () => {
  return (
    <section className="relative py-20 px-6 bg-neutral-950 text-white overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-12">Latest Posts</h2>
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