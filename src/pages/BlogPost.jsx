import { useParams } from 'react-router-dom';

export default function BlogPost() {
  const { slug } = useParams();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{slug.replace(/-/g, ' ')}</h1>
      <p>This is where the blog post content for "{slug}" will go.</p>
    </div>
  );
}
