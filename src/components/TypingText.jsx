import { useEffect, useState } from 'react'

const TypingText = ({ text, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[i])
      i++
      if (i >= text.length) clearInterval(interval)
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return <p className="whitespace-pre-wrap">{displayedText}</p>
}

export default TypingText