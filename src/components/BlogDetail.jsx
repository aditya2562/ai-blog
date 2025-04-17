import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { auth } from '../firebase'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Helmet } from 'react-helmet-async'

const BlogDetail = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      const user = auth.currentUser
      if (!user) {
        alert('Please log in to view the blog.')
        return
      }

      try {
        const blogRef = doc(db, 'users', user.uid, 'blogs', id)
        const blogSnap = await getDoc(blogRef)

        if (blogSnap.exists()) {
          setBlog(blogSnap.data())
        } else {
          console.log('No such blog!')
        }
      } catch (err) {
        console.error('Error fetching blog:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [id])

  const downloadAsPDF = () => {
    const input = document.getElementById('blog-content')

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${blog?.title || 'blog'}.pdf`)
    })
  }

  if (loading) return <div className="text-center py-20">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-white">
      {blog && (
        <>
          <Helmet>
            <title>{blog.title} | AI Blog Generator</title>
            <meta name="description" content={blog.description || blog.content.slice(0, 150)} />
          </Helmet>

          <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
          <button
            onClick={downloadAsPDF}
            className="mb-6 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition"
          >
            📄 Download as PDF
          </button>
          <div id="blog-content" className="bg-zinc-800 p-6 rounded-lg shadow">
            <p className="whitespace-pre-line">{blog.content}</p>
          </div>
        </>
      )}
    </div>
  )
}

export default BlogDetail