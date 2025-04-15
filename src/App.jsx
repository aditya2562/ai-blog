import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home' // ✅ Import your home page
import AIBlogGenerator from './components/AIBlogGenerator'
import BlogHistory from './components/BlogHistory'
import BlogDetail from './components/BlogDetail'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-black font-sans">
        <Navbar />
        <Routes>
          {/* ✅ Show full homepage at "/" */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/generate" element={<AIBlogGenerator />} />
          <Route path="/history" element={<BlogHistory />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="*" element={<h2 className="text-center py-10">404 - Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App