const posts = [
    {
      title: 'Top 5 AI Tools for Students in 2025',
      desc: 'Study smarter, not harder. Here are 5 AI tools every student should use.',
      link: '#'
    },
    {
      title: 'Best AI Freelance Assistants',
      desc: 'Automate client work and scale your freelance hustle with these AI apps.',
      link: '#'
    },
    {
      title: 'How to Use ChatGPT to Write Emails 10x Faster',
      desc: 'Boost your communication game using ChatGPT templates.',
      link: '#'
    }
  ]
  
  const BlogList = () => {
    return (
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-semibold text-center mb-10">Latest Posts</h2>
        <div className="grid gap-6 max-w-4xl mx-auto md:grid-cols-3">
          {posts.map((post, idx) => (
            <div key={idx} className="bg-white shadow-md p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{post.desc}</p>
              <a href={post.link} className="text-indigo-600 hover:underline">Read more →</a>
            </div>
          ))}
        </div>
      </section>
    )
  }
  
  export default BlogList