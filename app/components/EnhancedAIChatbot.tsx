'use client'

import React, { useState, useRef, useEffect } from 'react'  
import { Bot, X, Send, Calendar, Phone, Video, Mail, Clock } from 'lucide-react'

interface Message {  
  id: string  
  role: 'user' | 'assistant'  
  content: string  
  timestamp: Date  
  type?: 'text' | 'selection' | 'booking' | 'followup'  
  options?: string[]  
  timeSlot?: {  
    date: string  
    time: string  
    type: 'video' | 'phone'  
  }  
}

interface Props {  
  isOpen: boolean  
  onClose: () => void  
}

// SIMPLIFIED: Just get basic responses working first
const getServiceResponse = (service: string): string => {
  const responses: Record<string, string> = {
    'Automation': "Automation is basically bread and butter here in West Texas. We help local businesses automate the repetitive tasks - lead entry, paperwork, scheduling, service reminders, etc. Most of our customers save at least 15+ hours a week.",
    'Digital Marketing': "We do Facebook and Instagram ads for local home service businesses. These are paid ads that focus on getting you actual customers, not just likes. We track key metrics that focus on getting paying customers, not just post engagement.",
    'Web Development': "We build websites that actually work for your business - not just pretty pictures. Think automated lead capture, built-in booking systems, and everything connects to your workflow. No more leads sitting in random contact forms.",
    'Advanced Analytics': "We set up custom dashboards that show you exactly what's driving your business growth. Like, which marketing channels actually bring in money, not just traffic. Most business owners are flying blind - this gives you the real numbers."
  }
  
  return responses[service] || "That's a great question! I'd love to learn more about your specific situation."
}

function EnhancedAIChatbot({ isOpen, onClose }: Props) {  
  const [messages, setMessages] = useState<Message[]>([  
    {  
      id: '1',  
      role: 'assistant',  
      content: "Hey thanks for visiting the website. Is there anything you'd like to know more about?",  
      timestamp: new Date(),  
      type: 'selection',  
      options: ['Automation', 'Digital Marketing', 'Web Development', 'Advanced Analytics', 'Schedule a Consultation']  
    }  
  ])  
    
  const [inputValue, setInputValue] = useState('')  
  const [isLoading, setIsLoading] = useState(false)  
  const [currentFlow, setCurrentFlow] = useState<'general' | 'scheduling' | 'booking' | 'name' | 'company' | 'email'>('general')  
    
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {  
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })  
  }

  useEffect(() => {  
    scrollToBottom()  
  }, [messages])

  // Handle Schedule Free Consultation button click  
  const handleScheduleConsultation = () => {  
    const newMessage: Message = {  
      id: Date.now().toString(),  
      role: 'assistant',  
      content: "Do you prefer video conference or phone call?",  
      timestamp: new Date(),  
      type: 'selection',  
      options: ['Video call works', 'Just call me', 'Actually, let me email you instead']  
    }  
      
    setMessages(prev => [...prev, newMessage])  
    setCurrentFlow('scheduling')  
  }

  // SIMPLIFIED: Basic service selection handler
  const handleTopicSelection = (topic: string) => {  
    console.log('Topic selected:', topic) // Debug log
    
    // Add user message
    const userMessage: Message = {  
      id: Date.now().toString(),  
      role: 'user',  
      content: topic,  
      timestamp: new Date()  
    }  
    setMessages(prev => [...prev, userMessage])

    if (topic === 'Schedule a Consultation') {  
      handleScheduleConsultation()  
      return  
    }

    // Get service response
    const response = getServiceResponse(topic)
    console.log('Service response:', response) // Debug log
    
    // Add response with delay
    setTimeout(() => {
      const assistantMessage: Message = {  
        id: (Date.now() + 1).toString(),  
        role: 'assistant',  
        content: response,  
        timestamp: new Date()  
      }
      
      console.log('Adding assistant message:', assistantMessage) // Debug log
      setMessages(prev => [...prev, assistantMessage])
      
      // Add consultation offer after response
      setTimeout(() => {
        const consultationMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: "Want to schedule a free consultation to discuss your specific needs?",
          timestamp: new Date(),
          type: 'selection',
          options: ['Yeah, let\'s schedule something', 'Let me think about it', 'Send me some info instead']
        }
        setMessages(prev => [...prev, consultationMessage])
      }, 2000)
      
    }, 1500)
  }

  // Handle meeting type selection
  const handleMeetingTypeSelection = (selection: string) => {
    console.log('Meeting type selected:', selection) // Debug log
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: selection,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    if (selection === 'Actually, let me email you instead') {
      setTimeout(() => {
        const emailMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Shoot us an email at admin@amarilloautomation.com and mention what you're most interested in. We'll send you some case studies and examples specific to your industry. Usually get back to people within a couple hours!",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, emailMessage])
      }, 1500)
      return
    }

    // Show time slot selection
    setTimeout(() => {
      const timeSlotMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "How is Friday, January 3rd at 2:00 PM CST?",
        timestamp: new Date(),
        type: 'selection',
        options: ['Sounds great!', 'Different time please', 'Actually, let me just email you']
      }
      setMessages(prev => [...prev, timeSlotMessage])
      setCurrentFlow('booking')
    }, 1500)
  }

  // Handle option selections
  const handleOptionSelect = (option: string, message: Message) => {  
    console.log('Option selected:', option, 'Current flow:', currentFlow) // Debug log
    
    if (currentFlow === 'general' && message.options?.includes(option)) {  
      handleTopicSelection(option)  
    } else if (currentFlow === 'scheduling') {  
      handleMeetingTypeSelection(option)  
    } else if (option === "Yeah, let's schedule something" || option.includes('Schedule a Consultation')) {  
      handleScheduleConsultation()  
    } else if (option === "Let me think about it" || option.includes('info')) {  
      const userMessage: Message = {  
        id: Date.now().toString(),  
        role: 'user',  
        content: option,  
        timestamp: new Date()  
      }  
      setMessages(prev => [...prev, userMessage])  
        
      setTimeout(() => {  
        const infoMessage: Message = {  
          id: (Date.now() + 1).toString(),  
          role: 'assistant',  
          content: "No problem! Feel free to reach out at admin@amarilloautomation.com when you're ready. Is there anything else I can help you with?",  
          timestamp: new Date(),
          type: 'selection',
          options: ['Automation', 'Digital Marketing', 'Web Development', 'Advanced Analytics', 'Schedule a Consultation']
        }  
        setMessages(prev => [...prev, infoMessage])
        setCurrentFlow('general')
      }, 1500)  
    } else if (option === "Send me some info instead") {
      const userMessage: Message = {  
        id: Date.now().toString(),  
        role: 'user',  
        content: option,  
        timestamp: new Date()  
      }  
      setMessages(prev => [...prev, userMessage])  
        
      setTimeout(() => {  
        const infoMessage: Message = {  
          id: (Date.now() + 1).toString(),  
          role: 'assistant',  
          content: "Shoot us an email at admin@amarilloautomation.com and mention what you're most interested in. We'll send you some case studies and examples specific to your industry. Usually get back to people within a couple hours!",  
          timestamp: new Date(),
          type: 'selection',
          options: ['Automation', 'Digital Marketing', 'Web Development', 'Advanced Analytics', 'Schedule a Consultation']
        }  
        setMessages(prev => [...prev, infoMessage])
        setCurrentFlow('general')
      }, 1500)  
    } else if (option.includes('Sounds great')) {
      // Handle booking confirmation
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: option,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])
      
      setTimeout(() => {
        const nameMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "What's your name?",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, nameMessage])
        setCurrentFlow('name')
      }, 1500)
    }
  }

  // Basic message sending
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

    // Simple flow handling
    if (currentFlow === 'name') {
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
      }, 1500)
      return
    }

    if (currentFlow === 'company') {
      setTimeout(() => {
        const emailMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "And what's your email so I can send you the meeting details?",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, emailMessage])
        setCurrentFlow('email')
        setIsLoading(false)
      }, 1500)
      return
    }

    if (currentFlow === 'email') {
      setTimeout(() => {
        const confirmMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Perfect! I'm setting this up for you right now. You should get a confirmation email in just a minute. Anything else I can help you with?",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, confirmMessage])
        setCurrentFlow('general')
        setIsLoading(false)
      }, 2000)
      return
    }

    // Default response for general conversation
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "That's a great question! For specific details about our services, you can reach us at admin@amarilloautomation.com or schedule a free consultation to discuss your needs.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
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
              <p className="text-xs text-green-100">Ask me anything about our services</p>  
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
            onClick={handleScheduleConsultation}  
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
                        onClick={() => {
                          console.log('Button clicked:', option) // Debug log
                          handleOptionSelect(option, message)
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg border border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"  
                      >  
                        <div className="flex items-center gap-2">  
                          {option.includes('Video') && <Video className="w-4 h-4" />}  
                          {option.includes('Phone') && <Phone className="w-4 h-4" />}  
                          {option.includes('Email') && <Mail className="w-4 h-4" />}  
                          {option.includes('Sounds great') && <Calendar className="w-4 h-4" />}  
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
                "Type your message..."  
              }  
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-green-500"  
              disabled={isLoading}  
            />  
            <button  
              onClick={sendMessage}  
              disabled={isLoading || !inputValue.trim()}  
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