import { Link } from 'react-router-dom';

const posts = [
  {
    title: 'Top 7 Free AI Tools for Students in 2025',
    slug: 'ai-tools-2025',
    summary: 'Discover the best AI tools to boost productivity and learning as a student this year.'
  },
];

export default function Home() {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.slug} className="p-4 border rounded-xl shadow hover:shadow-lg">
          <Link to={`/blog/${post.slug}`} className="text-xl font-semibold text-blue-600">
            {post.title}
          </Link>
          <p className="text-sm mt-2 text-gray-600">{post.summary}</p>
        </div>
      ))}
    </div>
  );
}
