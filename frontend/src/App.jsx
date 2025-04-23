import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import AIBlogGenerator from './components/AIBlogGenerator'
import BlogHistory from './components/BlogHistory'
import BlogDetail from './components/BlogDetail'
import Pricing from './pages/Pricing'
import { UserProvider } from './context/UserContext'
import Success from './pages/Success'
import Cancel from './pages/Cancel'
import AccountPage from './pages/AccountPage'
import PremiumDashboard from './pages/PremiumDashboard'

function App() {
  return (
  <UserProvider>
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
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/success" element={<Success />} />  
          <Route path="/cancel" element={<Cancel />} /> 
          <Route path="/account" element={<AccountPage />} />
          <Route path="/dashboard" element={<PremiumDashboard />} />
          <Route path="*" element={<h2 className="text-center py-10">404 - Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  </UserProvider>
  )
}

export default App