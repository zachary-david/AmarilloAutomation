'use client'

interface Props {
  isOpen: boolean
  onClose: () => void
}

function TestChatbot({ isOpen, onClose }: Props) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg">
        <h2>Test Chatbot</h2>
        <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  )
}

export default TestChatbot