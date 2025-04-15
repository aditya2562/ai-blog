import React from 'react'
import Hero from '../components/Hero'
import BlogList from '../components/BlogList'
import AIBlogGenerator from '../components/AIBlogGenerator'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="font-sans text-white bg-black min-h-screen">
      <Hero />
      <BlogList />
      <AIBlogGenerator />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default Home