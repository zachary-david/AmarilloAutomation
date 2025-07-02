'use client'

interface Props {
  isOpen: boolean
  onClose: () => void
}

function SimpleChatbot({ isOpen, onClose }: Props) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-900 text-white p-8 rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Simple Chatbot</h2>
          <button 
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            ×
          </button>
        </div>
        <p className="text-gray-300">This is a test chatbot component.</p>
        <button 
          onClick={onClose}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default SimpleChatbot