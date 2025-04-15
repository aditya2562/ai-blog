import { useParams } from 'react-router-dom'

const BlogDetail = () => {
  const { id } = useParams()
  const blogHistory = JSON.parse(localStorage.getItem('blogHistory')) || []
  const blog = blogHistory.find((b) => b.id.toString() === id)

  if (!blog) {
    return <div className="text-center text-white p-6">Blog not found 🥲</div>
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-6 text-white">
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <p className="text-zinc-400 text-lg mb-8">{blog.desc}</p>
      <div className="prose prose-invert">
        {blog.content.split('\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </div>
  )
}

export default BlogDetail