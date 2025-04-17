import React from 'react'
import Hero from '../components/Hero'
import BlogList from '../components/BlogList'
import AIBlogGenerator from '../components/AIBlogGenerator'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'
import { Helmet } from 'react-helmet-async' 

const Home = () => {
  return (
    <div className="font-sans text-white bg-black min-h-screen">
      <Helmet>
        <title>AI Blog Generator - Create AI Powered Blogs Instantly</title>
        <meta name="description" content="Generate high-quality blog posts using AI. Save, share, and export blogs instantly. Trusted by students, freelancers & entrepreneurs." />
        <meta name="keywords" content="AI blog generator, generate blog, cohere ai, sendgrid blog, react blog, flask backend, seo ai blog" />
      </Helmet>

      <Hero />
      <BlogList />
      <AIBlogGenerator />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default Home