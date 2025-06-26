'use client'

import React, { useState, useRef, useEffect } from 'react'  
import { Bot, X, Send, Calendar, Phone, Video, Mail, Clock } from 'lucide-react'

// Mobile viewport utilities integrated directly into component
const setDynamicVH = (): void => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

const debouncedSetVH = (() => {
  let timeoutId: NodeJS.Timeout;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(setDynamicVH, 100);
  };
})();

const preventBodyScroll = (prevent: boolean): void => {
  if (prevent) {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflowY = 'scroll';
  } else {
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflowY = '';
    
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }
};

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
      timestamp: new Date(),
      type: 'selection',
      options: [
        'Lead generation & follow-up',
        'Customer management & CRM',
        'Marketing automation',
        'Website & analytics',
        'Other business process'
      ]
    }
  ])
  
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isInBookingFlow, setIsInBookingFlow] = useState(false)
  const [bookingStep, setBookingStep] = useState<'preference' | 'name' | 'company' | 'email' | 'complete'>('preference')
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Dynamic viewport height for mobile
  useEffect(() => {
    // Set initial value
    setDynamicVH();
    
    // Update on resize and orientation change
    window.addEventListener('resize', debouncedSetVH);
    window.addEventListener('orientationchange', debouncedSetVH);
    
    // Handle visual viewport API if available (better virtual keyboard support)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', debouncedSetVH);
    }
    
    return () => {
      window.removeEventListener('resize', debouncedSetVH);
      window.removeEventListener('orientationchange', debouncedSetVH);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', debouncedSetVH);
      }
    };
  }, [])

  // Prevent body scroll when chatbot is open
  useEffect(() => {
    preventBodyScroll(isOpen);
    
    return () => {
      preventBodyScroll(false);
    };
  }, [isOpen])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when booking flow starts
  useEffect(() => {
    if (isInBookingFlow && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [bookingStep, isInBookingFlow])

  const addMessage = (role: 'user' | 'assistant', content: string, type?: 'text' | 'selection', options?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      type,
      options
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleOptionSelect = async (option: string) => {
    addMessage('user', option)
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (isInBookingFlow) {
      handleBookingFlow(option)
    } else {
      handleTopicResponse(option)
    }
    
    setIsLoading(false)
  }

  const handleTopicResponse = (topic: string) => {
    const responses = {
      'Lead generation & follow-up': "Great choice! Lead follow-up automation can increase your conversion rate by 30-50%. We typically set up automated responses within 2 minutes of lead capture, with personalized follow-up sequences that run for weeks. Would you like to see a demo of how this works for contractors?",
      'Customer management & CRM': "Smart move! A proper CRM automation setup can save 5-10 hours per week and prevent leads from falling through cracks. We integrate with popular platforms like HubSpot, Salesforce, and Pipedrive. What's your current customer management process?",
      'Marketing automation': "Excellent! Marketing automation can double your lead quality while cutting manual work in half. We build multi-channel campaigns that nurture prospects automatically. Are you looking to automate email, SMS, social media, or all three?",
      'Website & analytics': "Perfect! Your website should be working 24/7 to generate and qualify leads. We optimize for conversion and set up tracking that shows exactly which marketing efforts drive revenue. What's your biggest website challenge right now?",
      'Other business process': "I'd love to understand your specific challenge! Every business has unique pain points. What process takes up too much of your time or causes the most frustration in your daily operations?"
    }
    
    const response = responses[topic as keyof typeof responses] || "That's a great area to focus on! Let me connect you with our team to discuss your specific needs."
    
    addMessage('assistant', response)
    
    // Add consultation CTA after topic response
    setTimeout(() => {
      addMessage('assistant', "Ready to see how this could work for your business?", 'selection', ['Schedule a free consultation', 'Tell me more first', 'Send me information via email'])
    }, 1500)
  }

  const handleBookingFlow = (response: string) => {
    switch (bookingStep) {
      case 'preference':
        if (response === 'Send me an email instead') {
          addMessage('assistant', "Perfect! I'll make sure our team sends you detailed information. What's your email address?")
          setBookingStep('email')
        } else {
          const meetingType = response.includes('Video') ? 'video' : 'phone'
          setBookingDetails(prev => ({ ...prev, meetingType }))
          addMessage('assistant', `Great! Let's set up a ${meetingType.toLowerCase()} consultation. What's your name?`)
          setBookingStep('name')
        }
        break
        
      case 'name':
        setBookingDetails(prev => ({ ...prev, name: response }))
        addMessage('assistant', `Nice to meet you, ${response}! What's your company name?`)
        setBookingStep('company')
        break
        
      case 'company':
        setBookingDetails(prev => ({ ...prev, company: response }))
        addMessage('assistant', `Thanks! What's the best email to send the meeting details to?`)
        setBookingStep('email')
        break
        
      case 'email':
        setBookingDetails(prev => ({ ...prev, email: response }))
        addMessage('assistant', "Perfect! Our team will reach out within 24 hours to schedule your consultation. In the meantime, feel free to explore our case studies on the website!")
        setBookingStep('complete')
        break
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return
    
    const message = inputValue.trim()
    setInputValue('')
    
    if (isInBookingFlow) {
      handleBookingFlow(message)
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      setIsLoading(false)
    } else {
      addMessage('user', message)
      setIsLoading(true)
      
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      if (message.toLowerCase().includes('consultation') || message.toLowerCase().includes('meeting') || message.toLowerCase().includes('demo')) {
        const consultationMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I can help you schedule a consultation with our team. How would you prefer to connect?",
          timestamp: new Date(),
          type: 'selection',
          options: ['Video call', 'Phone call', 'Send me an email instead']
        }
        setMessages(prev => [...prev, consultationMessage])
        setIsInBookingFlow(true)
        setBookingStep('preference')
      } else {
        addMessage('assistant', "That's a great question! Our automation experts can give you specific recommendations for your situation. Would you like to schedule a quick consultation to discuss this in detail?", 'selection', ['Yes, schedule consultation', 'Tell me more about your services first'])
      }
      
      setIsLoading(false)
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
      <div className="chatbot-mobile bg-gray-900 rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="chatbot-header-mobile bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="chatbot-title-mobile text-white font-semibold">Automation Assistant</h3>
              <p className="text-xs text-gray-400 truncate">Ask about marketing, web dev, or automation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="chatbot-close-mobile bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Actions - Show before booking flow */}
        {!isInBookingFlow && (
          <div className="p-4 border-b border-gray-700">
            <button
              onClick={() => {
                const consultationMessage: Message = {
                  id: Date.now().toString(),
                  role: 'assistant',
                  content: "I can help you schedule a consultation with our team. How would you prefer to connect?",
                  timestamp: new Date(),
                  type: 'selection',
                  options: ['Video call', 'Phone call', 'Send me an email instead']
                }
                setMessages(prev => [...prev, consultationMessage])
                setIsInBookingFlow(true)
                setBookingStep('preference')
              }}
              className="chatbot-consultation-mobile bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Schedule Free Consultation
            </button>
          </div>
        )}

        {/* Messages Area */}
        <div className="chatbot-messages-mobile flex-1 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className="chatbot-message-mobile flex flex-col max-w-[85%]">
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
                        className="chatbot-option-mobile text-left flex items-center gap-2 w-full p-3 border border-green-500 rounded-lg bg-green-900/20 text-green-400 hover:bg-green-900/30 transition-all duration-200"
                      >
                        {option.includes('Video') && <Video className="w-4 h-4 flex-shrink-0" />}
                        {option.includes('Phone') && <Phone className="w-4 h-4 flex-shrink-0" />}
                        {option.includes('email') && <Mail className="w-4 h-4 flex-shrink-0" />}
                        {option.includes('consultation') && <Calendar className="w-4 h-4 flex-shrink-0" />}
                        <span className="flex-1">{option}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="chatbot-loading-mobile flex gap-3 items-center">
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

        {/* Input Area */}
        <div className="chatbot-input-mobile bg-gray-800 border-t border-gray-700">
          <div className="flex gap-3">
            <input
              ref={inputRef}
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
              className="chatbot-input-field-mobile flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 text-base"
              disabled={isLoading || bookingStep === 'complete'}
              maxLength={500}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim() || bookingStep === 'complete'}
              className="chatbot-send-mobile bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400">
              {inputValue.length}/500 characters
            </span>
          </div>
        </div>
      </div>
    </div>
  )  
}

export default EnhancedAIChatbot