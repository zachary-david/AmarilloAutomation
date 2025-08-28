'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import DeepChat to avoid SSR issues
const DeepChat = dynamic(() => import('deep-chat-react').then(mod => mod.DeepChat), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading chat...</div>
})

interface DeepChatWidgetProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function DeepChatWidget({ isOpen = true, onClose }: DeepChatWidgetProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const messagesRef = useRef<any[]>([])

  useEffect(() => {
    setIsMounted(true)
    // Load chat history from localStorage
    const savedHistory = localStorage.getItem('amarillo-chat-history')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setChatHistory(parsed)
        messagesRef.current = parsed
      } catch (e) {
        console.error('Failed to parse chat history:', e)
      }
    }
  }, [])

  // Save chat history whenever it changes
  const saveToLocalStorage = (messages: any[]) => {
    try {
      localStorage.setItem('amarillo-chat-history', JSON.stringify(messages))
    } catch (e) {
      console.error('Failed to save chat history:', e)
    }
  }

  // Clear chat history function
  const clearChatHistory = () => {
    localStorage.removeItem('amarillo-chat-history')
    setChatHistory([])
    messagesRef.current = []
  }

  if (!isMounted || !isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        {onClose && (
          <>
            <button
              onClick={onClose}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10"
              aria-label="Close chat"
            >
              ×
            </button>
            <button
              onClick={clearChatHistory}
              className="absolute -top-2 -left-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10"
              aria-label="Clear chat history"
              title="Clear chat history"
            >
              🗑
            </button>
          </>
        )}
        <DeepChat
          style={{
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: 'min(350px, calc(100vw - 32px))',
            height: 'min(500px, calc(100vh - 100px))',
            fontSize: '0.9rem',
          }}
          initialMessages={
            chatHistory.length > 0 
              ? chatHistory 
              : [{ 
                  role: 'ai', 
                  text: 'Hello! I\'m here to help you learn about Amarillo Automation\'s services. How can I assist you today?' 
                }]
          }
          textInput={{
            placeholder: {
              text: 'Ask me anything...',
              style: { color: '#606060' }
            }
          }}
          messageStyles={{
            default: {
              shared: {
                bubble: {
                  backgroundColor: '#f3f4f6',
                  color: '#1f2937',
                  fontSize: '0.875rem',
                  borderRadius: '10px',
                  padding: '10px 14px'
                }
              },
              user: {
                bubble: {
                  backgroundColor: '#10b981',
                  color: '#ffffff'
                }
              },
              ai: {
                bubble: {
                  backgroundColor: '#e5e7eb',
                  color: '#1f2937'
                }
              }
            }
          }}
          connect={{
            url: '/api/llm-chat',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          }}
          requestBodyLimits={{
            maxMessages: -1
          }}
          requestInterceptor={(requestDetails) => {
            console.log('Intercepting request:', requestDetails)
            const messages = requestDetails.body?.messages || []
            const lastMessage = messages[messages.length - 1]
            
            // Update our local message history
            messagesRef.current = messages
            
            // Transform the request to match your API format
            requestDetails.body = {
              message: lastMessage?.text || '',
              conversationHistory: messages.slice(0, -1).map((msg: any) => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.text
              }))
            }
            
            console.log('Transformed request:', requestDetails.body)
            return requestDetails
          }}
          responseInterceptor={(response) => {
            console.log('Intercepting response:', response)
            
            try {
              // Parse the response if it's a string
              const data = typeof response === 'string' ? JSON.parse(response) : response
              
              if (data.error) {
                console.error('API Error:', data)
                return {
                  error: data.response || 'An error occurred'
                }
              }
              
              // Add the AI response to our message history
              const aiMessage = { role: 'ai', text: data.response }
              messagesRef.current.push(aiMessage)
              
              // Save updated history to localStorage
              saveToLocalStorage(messagesRef.current)
              
              // Transform to Deep Chat format
              return {
                text: data.response
              }
            } catch (error) {
              console.error('Response parsing error:', error)
              return {
                error: 'Failed to parse response'
              }
            }
          }}
          errorMessages={{
            displayServiceErrorMessages: true,
            overrides: {
              default: 'Sorry, I encountered an error. Please try again.',
              connection: 'Unable to connect to the chat service.',
              authFailed: 'Authentication failed. Please refresh and try again.'
            }
          }}
          demo={false}
          displayLoadingBubble={true}
          submitButtonStyles={{
            position: 'inside-right',
            submit: {
              container: {
                default: {
                  backgroundColor: '#10b981',
                  borderRadius: '5px'
                },
                hover: {
                  backgroundColor: '#059669'
                }
              },
              svg: {
                content: '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                styles: {
                  default: {
                    width: '1.3em',
                    filter: 'brightness(0) saturate(100%) invert(1)'
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  )
}