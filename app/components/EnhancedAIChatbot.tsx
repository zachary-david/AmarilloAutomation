'use client'

import React, { useState, useRef, useEffect } from 'react'  
import { Bot, X, Send, Calendar, Phone, Video, Mail, Clock } from 'lucide-react'

interface Message {  
  id: string  
  role: 'user' | 'assistant'  
  content: string  
  timestamp: Date  
  type?: 'text' | 'selection'  
  options?: string[]  
}

interface BookingDetails {  
  name?: string  
  company?: string  
  email?: string  
  meetingType?: 'video' | 'phone'  
  timing?: string
}

interface Props {  
  isOpen: boolean  
  onClose: () => void  
}

function EnhancedAIChatbot({ isOpen, onClose }: Props) {  
  const [messages, setMessages] = useState<Message[]>([  
    {  
      id: '1',  
      role: 'assistant',  
      content: "Hi! I'm here to help answer questions about automation, digital marketing, web development, or analytics for your business. What's your biggest operational challenge right now?",  
      timestamp: new Date()
    }  
  ])  
    
  const [inputValue, setInputValue] = useState('')  
  const [isLoading, setIsLoading] = useState(false)  
  const [isInBookingFlow, setIsInBookingFlow] = useState(false)
  const [bookingStep, setBookingStep] = useState<'preference' | 'timing' | 'name' | 'company' | 'email' | 'complete'>('preference')
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({})
  const [conversationCost, setConversationCost] = useState(0)
    
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {  
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })  
  }

  useEffect(() => {  
    scrollToBottom()  
  }, [messages])

  // Prevent body scroll when chatbot is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('chatbot-no-scroll')
    } else {
      document.body.classList.remove('chatbot-no-scroll')
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('chatbot-no-scroll')
    }
  }, [isOpen])

  // Handle OpenAI GPT-4 conversation
  const handleLLMConversation = async (userInput: string) => {
    try {
      const response = await fetch('/api/openai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          conversationHistory: messages.slice(-10) // Last 10 messages for context
        })
      })

      if (!response.ok) {
        throw new Error('OpenAI API failed')
      }

      const data = await response.json()

      // Update cost tracking (for backend monitoring)
      if (data.usage && data.usage.cost) {
        setConversationCost(prev => prev + data.usage.cost)
      }

      // Show if using fallback (when OpenAI API fails)
      if (data.fallback) {
        console.log('Using fallback response - OpenAI API unavailable')
      }

      if (data.triggerBooking) {
        // Transition to booking flow
        setIsInBookingFlow(true)
        setBookingStep('preference')
        
        const bookingMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          type: 'selection',
          options: ['Video call', 'Phone call', 'Send me an email instead']
        }
        setMessages(prev => [...prev, bookingMessage])
      } else {
        // Regular OpenAI response
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      }

    } catch (error) {
      console.error('OpenAI conversation error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble right now. For immediate help, email us at admin@amarilloautomation.com",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  // Handle booking flow
  const handleBookingFlow = async (userInput: string) => {
    if (bookingStep === 'name') {
      setBookingDetails(prev => ({ ...prev, name: userInput.trim() }))
      
      setTimeout(() => {
        const companyMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "What company are you with?",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, companyMessage])
        setBookingStep('company')
      }, 1000)
      return
    }

    if (bookingStep === 'company') {
      setBookingDetails(prev => ({ ...prev, company: userInput.trim() }))
      
      setTimeout(() => {
        const emailMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "And what's your email address?",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, emailMessage])
        setBookingStep('email')
      }, 1000)
      return
    }

    if (bookingStep === 'email') {
      const email = userInput.trim()
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setTimeout(() => {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "That doesn't look like a valid email address. Could you try again?",
            timestamp: new Date()
          }
          setMessages(prev => [...prev, errorMessage])
        }, 1000)
        return
      }

      setBookingDetails(prev => ({ ...prev, email }))
      
      // Submit booking to webhook
      setTimeout(async () => {
        try {
          // Submit booking to webhook using FormData to avoid CORS
          const formData = new FormData()
          formData.append('name', bookingDetails.name || '')
          formData.append('company', bookingDetails.company || '')
          formData.append('email', email)
          formData.append('meetingType', bookingDetails.meetingType || '')
          formData.append('timing', bookingDetails.timing || '')
          formData.append('timestamp', new Date().toISOString())
          formData.append('source', 'llm_chatbot')
          formData.append('conversationCost', conversationCost.toFixed(4))
          
          const response = await fetch('https://hooks.zapier.com/hooks/catch/22949842/ub41u30/', {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            throw new Error('Booking submission failed')
          }

          const successMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "Perfect! I've got your details and someone from our team will reach out within 24 hours to schedule your consultation. Thanks for your interest!",
            timestamp: new Date()
          }
          setMessages(prev => [...prev, successMessage])
          setBookingStep('complete')

        } catch (error) {
          console.error('Booking error:', error)
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "Sorry, there was an issue submitting your request. Please email us directly at admin@amarilloautomation.com and we'll get back to you quickly.",
            timestamp: new Date()
          }
          setMessages(prev => [...prev, errorMessage])
        }
      }, 1500)
    }
  }

  // Main message sending function
  const sendMessage = async () => {  
    if (!inputValue.trim()) return

    const userMessage: Message = {  
      id: Date.now().toString(),  
      role: 'user',  
      content: inputValue,  
      timestamp: new Date()  
    }

    setMessages(prev => [...prev, userMessage])  
    const currentInput = inputValue  
    setInputValue('')  
    setIsLoading(true)

    try {
      if (isInBookingFlow && ['name', 'company', 'email'].includes(bookingStep)) {
        await handleBookingFlow(currentInput)
      } else {
        await handleLLMConversation(currentInput)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle option selections for booking
  const handleOptionSelect = (option: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: option,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    if (isInBookingFlow) {
      if (bookingStep === 'preference') {
        if (option === 'Send me an email instead') {
          setTimeout(() => {
            const emailMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: "No problem! Send us an email at admin@amarilloautomation.com and mention what you're interested in discussing. We'll get back to you within a few hours.",
              timestamp: new Date()
            }
            setMessages(prev => [...prev, emailMessage])
            setBookingStep('complete')
          }, 1000)
          return
        }

        // Set meeting type and ask for timing
        const meetingType = option === 'Video call' ? 'video' : 'phone'
        setBookingDetails(prev => ({ ...prev, meetingType }))

        setTimeout(() => {
          const timeMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "Great! What time works best for you?",
            timestamp: new Date(),
            type: 'selection',
            options: ['This week', 'Next week', 'Flexible - you choose']
          }
          setMessages(prev => [...prev, timeMessage])
          setBookingStep('timing')
        }, 1000)
      } else if (bookingStep === 'timing') {
        setBookingDetails(prev => ({ ...prev, timing: option }))
        
        setTimeout(() => {
          const nameMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "Perfect! What's your name?",
            timestamp: new Date()
          }
          setMessages(prev => [...prev, nameMessage])
          setBookingStep('name')
        }, 1000)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {  
    if (e.key === 'Enter' && !e.shiftKey) {  
      e.preventDefault()  
      sendMessage()  
    }  
  }

  if (!isOpen) return null

  return (
    <div className="chatbot-backdrop-mobile">
      <div className="chatbot-mobile bg-gray-900 text-white rounded-xl shadow-2xl flex flex-col">
        
        {/* Header with enhanced mobile close button */}
        <div className="chatbot-header-mobile bg-green-600 rounded-t-xl border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-white flex-shrink-0" />
            <div className="flex-1">
              <h3 className="chatbot-title-mobile">
                {isInBookingFlow ? 'Schedule Your Consultation' : 'Amarillo Automation AI'}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="chatbot-close-mobile"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Consultation CTA - Mobile Optimized */}
        {!isInBookingFlow && (
          <div className="p-4 bg-gradient-to-r from-green-900/30 to-blue-900/30 border-b border-gray-700">
            <button 
              onClick={() => {
                const consultationMessage: Message = {
                  id: Date.now().toString(),
                  role: 'assistant',
                  content: "Great! I can help you schedule a consultation with our team. How would you prefer to connect?",
                  timestamp: new Date(),
                  type: 'selection',
                  options: ['Video call', 'Phone call', 'Send me an email instead']
                }
                setMessages(prev => [...prev, consultationMessage])
                setIsInBookingFlow(true)
                setBookingStep('preference')
              }}
              className="chatbot-consultation-mobile flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Schedule Free Consultation
            </button>
          </div>
        )}

        {/* Messages Area - Mobile Optimized */}
        <div className="chatbot-messages-mobile">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className="chatbot-message-mobile flex flex-col">
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-green-600 text-white ml-auto'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  {message.content}
                </div>
                
                {/* Selection Options - Mobile Optimized */}
                {message.type === 'selection' && message.options && (
                  <div className="mt-2 space-y-2">
                    {message.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(option)}
                        className="chatbot-option-mobile text-left flex items-center gap-2"
                      >
                        {option.includes('Video') && <Video className="w-4 h-4 flex-shrink-0" />}
                        {option.includes('Phone') && <Phone className="w-4 h-4 flex-shrink-0" />}
                        {option.includes('email') && <Mail className="w-4 h-4 flex-shrink-0" />}
                        {option.includes('week') && <Calendar className="w-4 h-4 flex-shrink-0" />}
                        <span className="flex-1">{option}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Loading indicator - Mobile Optimized */}
          {isLoading && (
            <div className="chatbot-loading-mobile">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="chatbot-loading-dots-mobile animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="chatbot-loading-dots-mobile animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="chatbot-loading-dots-mobile animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Mobile Optimized */}
        <div className="chatbot-input-mobile">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                bookingStep === 'name' ? "Your name..." :
                bookingStep === 'company' ? "Company name..." :
                bookingStep === 'email' ? "Your email address..." :
                bookingStep === 'complete' ? "Consultation scheduled!" :
                "Ask me about automation, marketing, web dev, or analytics..."
              }
              className="chatbot-input-field-mobile flex-1 placeholder-gray-400"
              disabled={isLoading || bookingStep === 'complete'}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim() || bookingStep === 'complete'}
              className="chatbot-send-mobile"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )  
}

export default EnhancedAIChatbot