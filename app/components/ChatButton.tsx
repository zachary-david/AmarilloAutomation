'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import DeepChatWidget from './DeepChatWidget'

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-[#ffde59] hover:bg-[#f4c542] text-black rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-40 group"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Chat with us!
          </span>
        </button>
      )}
      
      <DeepChatWidget isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}