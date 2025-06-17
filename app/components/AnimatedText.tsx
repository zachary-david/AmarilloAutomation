// app/components/AnimatedText.tsx
'use client'

import { useEffect, useState } from 'react'

interface AnimatedTextProps {
  text: string
  className?: string
}

export default function AnimatedText({ text, className = "" }: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    setDisplayText('')
    const timeouts: NodeJS.Timeout[] = []
    
    Array.from(text).forEach((char, i) => {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + char)
      }, i * 55)
      timeouts.push(timeout)
    })

    return () => timeouts.forEach(clearTimeout)
  }, [text])

  return (
    <div className={className}>
      {Array.from(displayText).map((char, i) => (
        <span
          key={i}
          className="inline-block opacity-0 translate-y-6 blur-sm animate-letter-fade"
          style={{ animationDelay: `${i * 55}ms` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  )
}