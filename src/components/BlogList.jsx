import { blogs } from '../data/blogs'
import { motion as Motion } from 'framer-motion' 

const BlogList = () => {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <h2 className="text-3xl font-semibold text-center mb-10">Latest Posts</h2>
      <div className="grid gap-6 max-w-5xl mx-auto md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((post, idx) => (
          <Motion.div
            key={idx}
            className="bg-white shadow-md p-6 rounded-xl"
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
    </section>
  )
}

export default BlogList