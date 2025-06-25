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

  // Handle LLM conversation
  const handleLLMConversation = async (userInput: string) => {
    try {
      // For now, we'll use a mock response until you set up the actual LLM API
      // Replace this with actual Claude or OpenAI API call
      const mockResponse = await simulateLLMResponse(userInput, messages)
      
      if (mockResponse.triggerBooking) {
        // Transition to booking flow
        setIsInBookingFlow(true)
        setBookingStep('preference')
        
        const bookingMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: mockResponse.response,
          timestamp: new Date(),
          type: 'selection',
          options: ['Video call', 'Phone call', 'Send me an email instead']
        }
        setMessages(prev => [...prev, bookingMessage])
      } else {
        // Regular LLM response
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: mockResponse.response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      }

    } catch (error) {
      console.error('LLM conversation error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble right now. For immediate help, email us at admin@amarilloautomation.com",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  // Mock LLM response function (replace with actual API call)
  const simulateLLMResponse = async (userInput: string, messageHistory: Message[]) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const input = userInput.toLowerCase()
    
    // Simple trigger logic for booking (replace with actual LLM logic)
    const bookingTriggers = [
      'schedule', 'consultation', 'call', 'meeting', 'talk', 'discuss', 
      'price', 'cost', 'how much', 'interested', 'next steps', 'learn more'
    ]
    
    const shouldTriggerBooking = bookingTriggers.some(trigger => input.includes(trigger)) && 
                                messageHistory.length > 2 // After some conversation

    if (shouldTriggerBooking) {
      return {
        response: "Great! I can help you schedule a consultation with our team. How would you prefer to connect?",
        triggerBooking: true
      }
    }

    // Mock responses based on keywords (replace with actual LLM)
    if (input.includes('automation')) {
      return {
        response: "Automation is where we really help West Texas businesses shine. We typically save our clients 15+ hours per week by automating lead responses, follow-up sequences, and administrative tasks. What kind of repetitive work is eating up your time?",
        triggerBooking: false
      }
    }
    
    if (input.includes('marketing') || input.includes('ads')) {
      return {
        response: "Our digital marketing focuses on getting you actual customers, not just likes and engagement. Our HVAC clients typically see $4-6 return for every $1 spent on ads. What's your main source of new customers right now?",
        triggerBooking: false
      }
    }
    
    if (input.includes('website') || input.includes('web')) {
      return {
        response: "We build websites that actually work for your business - automated lead capture, booking systems, everything connects to your workflow. Are you currently getting leads through your website, or is it just an online brochure?",
        triggerBooking: false
      }
    }
    
    if (input.includes('analytics') || input.includes('data')) {
      return {
        response: "Most business owners are flying blind on what actually drives growth. We set up dashboards that show which marketing channels bring in money, not just traffic. Do you currently track which lead sources are most profitable?",
        triggerBooking: false
      }
    }

    // Default response
    return {
      response: "That's a great question! Can you tell me more about your specific situation? What industry are you in, and what's your biggest challenge right now?",
      triggerBooking: false
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
          const bookingData = {
            name: bookingDetails.name,
            company: bookingDetails.company,
            email: email,
            meetingType: bookingDetails.meetingType,
            timing: bookingDetails.timing,
            timestamp: new Date().toISOString(),
            source: 'llm_chatbot',
            conversationCost: conversationCost.toFixed(4)
          }
          
          const response = await fetch('https://hooks.zapier.com/hooks/catch/22949842/ub41u30/', {
            method: 'POST',
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
              <h3 className="font-semibold text-white">Amarillo Automation AI</h3>  
              <p className="text-xs text-green-100">LLM-powered • Cost: ${conversationCost.toFixed(3)}</p>  
            </div>  
          </div>  
          <button  
            onClick={onClose}  
            className="text-white hover:text-gray-300 transition-colors p-1"  
          >  
            <X className="w-5 h-5" />  
          </button>  
        </div>

        {/* Schedule Free Consultation Button */}  
        <div className="p-4 border-b border-gray-700 bg-gray-800">  
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
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"  
          >  
            <Calendar className="w-4 h-4" />  
            Schedule Free Consultation  
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
                bookingStep === 'name' ? "Your name..." :  
                bookingStep === 'company' ? "Company name..." :  
                bookingStep === 'email' ? "Your email address..." :
                bookingStep === 'complete' ? "Consultation scheduled!" :
                "Ask me about automation, marketing, web dev, or analytics..."  
              }  
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-green-500"  
              disabled={isLoading || bookingStep === 'complete'}  
            />  
            <button  
              onClick={sendMessage}  
              disabled={isLoading || !inputValue.trim() || bookingStep === 'complete'}  
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

export default EnhancedAIChatbot