import Hero from './components/Hero'
import BlogList from './components/BlogList'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import AIBlogGenerator from './components/AIBlogGenerator'

function App() {
  return (
    <div className="font-sans text-gray-800">
      <Hero />
      <BlogList />
      <AIBlogGenerator />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default App