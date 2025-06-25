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
}

interface Props {  
  isOpen: boolean  
  onClose: () => void  
}

function DirectBookingChatbot({ isOpen, onClose }: Props) {  
  const [messages, setMessages] = useState<Message[]>([  
    {  
      id: '1',  
      role: 'assistant',  
      content: "Hi! I can help you schedule a consultation with our team. How would you prefer to connect?",  
      timestamp: new Date(),  
      type: 'selection',  
      options: ['Video call', 'Phone call', 'Send me an email instead']  
    }  
  ])  
    
  const [inputValue, setInputValue] = useState('')  
  const [isLoading, setIsLoading] = useState(false)  
  const [currentFlow, setCurrentFlow] = useState<'general' | 'name' | 'company' | 'email' | 'complete'>('general')  
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({})
    
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {  
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })  
  }

  useEffect(() => {  
    scrollToBottom()  
  }, [messages])

  // Handle initial meeting type selection
  const handleMeetingTypeSelection = (selection: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: selection,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    if (selection === 'Send me an email instead') {
      setTimeout(() => {
        const emailMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "No problem! Send us an email at admin@amarilloautomation.com and mention what you're interested in discussing. We'll get back to you within a few hours.",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, emailMessage])
        setCurrentFlow('complete')
      }, 1000)
      return
    }

    // Set meeting type
    const meetingType = selection === 'Video call' ? 'video' : 'phone'
    setBookingDetails(prev => ({ ...prev, meetingType }))

    // Ask for time preference
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
    }, 1000)
  }

  // Handle time selection
  const handleTimeSelection = (selection: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: selection,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    setTimeout(() => {
      const nameMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Perfect! What's your name?",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, nameMessage])
      setCurrentFlow('name')
    }, 1000)
  }

  // Handle option selections
  const handleOptionSelect = (option: string) => {
    if (currentFlow === 'general') {
      if (['Video call', 'Phone call', 'Send me an email instead'].includes(option)) {
        handleMeetingTypeSelection(option)
      } else if (['This week', 'Next week', 'Flexible - you choose'].includes(option)) {
        handleTimeSelection(option)
      }
    }
  }

  // Handle text input for booking details
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

    // Handle name collection
    if (currentFlow === 'name') {
      setBookingDetails(prev => ({ ...prev, name: currentInput.trim() }))
      
      setTimeout(() => {
        const companyMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "What company are you with?",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, companyMessage])
        setCurrentFlow('company')
        setIsLoading(false)
      }, 1000)
      return
    }

    // Handle company collection
    if (currentFlow === 'company') {
      setBookingDetails(prev => ({ ...prev, company: currentInput.trim() }))
      
      setTimeout(() => {
        const emailMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "And what's your email address?",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, emailMessage])
        setCurrentFlow('email')
        setIsLoading(false)
      }, 1000)
      return
    }

    // Handle email collection and booking completion
    if (currentFlow === 'email') {
      const email = currentInput.trim()
      
      // Basic email validation
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
          setIsLoading(false)
        }, 1000)
        return
      }

      setBookingDetails(prev => ({ ...prev, email }))
      
      // Process the booking
      setTimeout(async () => {
        try {
          const bookingData = {
            name: bookingDetails.name,
            company: bookingDetails.company,
            email: email,
            meetingType: bookingDetails.meetingType,
            timestamp: new Date().toISOString(),
            source: 'website_chatbot_direct_booking'
          }
          
          // Send to your booking webhook
          const response = await fetch('https://hooks.zapier.com/hooks/catch/22949842/ub41u30/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
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
          setCurrentFlow('complete')

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
        
        setIsLoading(false)
      }, 1500)
      return
    }

    // Default response for any other input
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Thanks for reaching out! For specific questions, feel free to email us at admin@amarilloautomation.com",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {  
    if (e.key === 'Enter' && !e.shiftKey) {  
      e.preventDefault()  
      sendMessage()  
    }  
  }

  if (!isOpen) return null

  return (  
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">  
      {/* Backdrop */}  
      <div   
        className="absolute inset-0 bg-black bg-opacity-50 pointer-events-auto"  
        onClick={onClose}  
      />  
        
      {/* Chatbot Window */}  
      <div className="relative bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-full max-w-md h-96 sm:h-[500px] pointer-events-auto flex flex-col">  
        {/* Header */}  
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-green-600 rounded-t-lg">  
          <div className="flex items-center gap-3">  
            <Bot className="w-6 h-6 text-white" />  
            <div>  
              <h3 className="font-semibold text-white">Schedule Consultation</h3>  
              <p className="text-xs text-green-100">Book a free consultation with our team</p>  
            </div>  
          </div>  
          <button  
            onClick={onClose}  
            className="text-white hover:text-gray-300 transition-colors p-1"  
          >  
            <X className="w-5 h-5" />  
          </button>  
        </div>

        {/* Messages */}  
        <div className="flex-1 overflow-y-auto p-4 space-y-4">  
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
                
              <div className={`flex flex-col max-w-xs lg:max-w-md`}>  
                <div  
                  className={`px-4 py-2 rounded-lg ${  
                    message.role === 'user'  
                      ? 'bg-green-600 text-white ml-auto'  
                      : 'bg-gray-700 text-gray-100'  
                  }`}  
                >  
                  {message.content}  
                </div>  
                  
                {/* Selection Options */}  
                {message.type === 'selection' && message.options && (  
                  <div className="mt-2 space-y-2">  
                    {message.options.map((option, index) => (  
                      <button  
                        key={index}  
                        onClick={() => handleOptionSelect(option)}
                        className="w-full text-left px-3 py-2 rounded-lg border border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"  
                      >  
                        <div className="flex items-center gap-2">  
                          {option.includes('Video') && <Video className="w-4 h-4" />}  
                          {option.includes('Phone') && <Phone className="w-4 h-4" />}  
                          {option.includes('email') && <Mail className="w-4 h-4" />}  
                          {option.includes('week') && <Calendar className="w-4 h-4" />}  
                          {option}  
                        </div>  
                      </button>  
                    ))}  
                  </div>  
                )}  
              </div>  
            </div>  
          ))}  
            
          {/* Loading indicator */}  
          {isLoading && (  
            <div className="flex gap-3 justify-start">  
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">  
                <Clock className="w-4 h-4 text-white animate-spin" />  
              </div>  
              <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">  
                <div className="flex space-x-1">  
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>  
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>  
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>  
                </div>  
              </div>  
            </div>  
          )}  
            
          <div ref={messagesEndRef} />  
        </div>

        {/* Input */}  
        <div className="border-t border-gray-700 p-4">  
          <div className="flex gap-2">  
            <input  
              type="text"  
              value={inputValue}  
              onChange={(e) => setInputValue(e.target.value)}  
              onKeyPress={handleKeyPress}  
              placeholder={  
                currentFlow === 'name' ? "Your name..." :  
                currentFlow === 'company' ? "Company name..." :  
                currentFlow === 'email' ? "Your email address..." :
                currentFlow === 'complete' ? "Consultation scheduled!" :
                "Type your message..."  
              }  
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-green-500"  
              disabled={isLoading || currentFlow === 'complete'}  
            />  
            <button  
              onClick={sendMessage}  
              disabled={isLoading || !inputValue.trim() || currentFlow === 'complete'}  
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white p-2 rounded-lg transition-colors"  
            >  
              <Send className="w-4 h-4" />  
            </button>  
          </div>  
        </div>  
      </div>  
    </div>  
  )  
}

export default DirectBookingChatbot