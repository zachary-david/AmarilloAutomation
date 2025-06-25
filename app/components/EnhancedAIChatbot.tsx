'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Bot, X, Send, Calendar, Phone, Video, Mail, Clock } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'text' | 'selection' | 'booking'
  options?: string[]
  timeSlot?: {
    date: string
    time: string
    type: 'video' | 'phone'
  }
}

interface BookingDetails {
  name?: string
  company?: string
  email?: string
  meetingType: 'video' | 'phone'
  timeSlot: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

// Simulated available time slots (replace with actual Cal.com integration)
const generateAvailableSlots = (): Array<{date: string, time: string}> => {
  const slots: Array<{date: string, time: string}> = []
  const now = new Date()
  
  // Generate slots for the next 14 days
  for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {
    const date = new Date(now)
    date.setDate(date.getDate() + dayOffset)
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue
    
    // Morning slots: 10 AM - 12 PM CST
    const morningSlots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM']
    
    // Afternoon slots: 1 PM - 3 PM CST
    const afternoonSlots = ['1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM']
    
    // Randomly select 2-3 available slots per day (simulating booked slots)
    const allSlots = [...morningSlots, ...afternoonSlots]
    const availableSlots = allSlots.filter(() => Math.random() > 0.4) // 60% availability
    
    availableSlots.forEach(time => {
      slots.push({
        date: date.toISOString().split('T')[0],
        time: time
      })
    })
  }
  
  return slots.slice(0, 10) // Return first 10 available slots
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
  const [bookingDetails, setBookingDetails] = useState<Partial<BookingDetails>>({})
  const [availableSlots, setAvailableSlots] = useState<Array<{date: string, time: string}>>([])
  
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
      content: "Sweet! So do you want to hop on a video call or would you prefer I just give you a ring?",
      timestamp: new Date(),
      type: 'selection',
      options: ['Video call works', 'Just call me', 'Actually, let me email you instead']
    }
    
    setMessages(prev => [...prev, newMessage])
    setCurrentFlow('scheduling')
  }

  // Handle meeting type selection
  const handleMeetingTypeSelection = async (selection: string) => {
    // Add user selection message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: selection,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    if (selection === 'Email Instead') {
      // Natural delay before email message
      setTimeout(() => {
        const emailMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "No problem! Please include your name and company name when you email us.",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, emailMessage])
        
        // Open email client after another delay
        setTimeout(() => {
          window.location.href = 'mailto:admin@amarilloautomation.com?subject=Website Chatbot Consultation Request'
        }, 1500)
      }, 1500)
      return
    }

    // Set booking type
    setBookingDetails(prev => ({
      ...prev,
      meetingType: selection === 'Video Conference' ? 'video' : 'phone'
    }))

    // Show "thinking" message with delay
    setTimeout(() => {
      const thinkingMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Okay... Let me find the next available time.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, thinkingMessage])

      // Simulate thinking delay
      setIsLoading(true)
      
      setTimeout(async () => {
        // Generate available slots
        const slots: Array<{date: string, time: string}> = generateAvailableSlots()
        setAvailableSlots(slots)
        
        // Pick a random slot from the first few available
        const randomSlot = slots[Math.floor(Math.random() * Math.min(3, slots.length))]
        
        if (randomSlot) {
          const date = new Date(randomSlot.date)
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
          const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric' 
          })
          
          const timeSlotMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: `How is ${dayName}, ${formattedDate} at ${randomSlot.time} CST?`,
            timestamp: new Date(),
            type: 'selection',
            options: ['Sounds great!', 'Email for appointment instead'],
            timeSlot: {
              date: randomSlot.date,
              time: randomSlot.time,
              type: selection === 'Video Conference' ? 'video' : 'phone'
            }
          }
          
          setMessages(prev => [...prev, timeSlotMessage])
          setCurrentFlow('booking')
        }
        
        setIsLoading(false)
      }, 3000) // 3 second thinking delay
    }, 1000) // 1 second delay before thinking message
  }

  // Handle time slot confirmation
  const handleTimeSlotConfirmation = (selection: string, timeSlot?: any) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: selection,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    if (selection === 'Actually, let me just email you') {
      setTimeout(() => {
        const emailMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "No worries! Just shoot us an email at admin@amarilloautomation.com. Toss in your name and company name and we'll get back to you super quick - usually within a few hours.",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, emailMessage])
      }, 1500)
      return
    }

    // Request booking details with natural delay
    setTimeout(() => {
      const detailsMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Awesome! What's your name?",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, detailsMessage])
      setCurrentFlow('name')
      
      // Store selected time slot
      if (timeSlot) {
        setBookingDetails(prev => ({
          ...prev,
          timeSlot: `${timeSlot.date} at ${timeSlot.time}`
        }))
      }
    }, 1500) // 1.5 second delay
  }

  // Handle regular chat messages
  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Handle booking flow step by step
      if (currentFlow === 'name') {
        // Capture name with natural delay
        const name = inputValue.trim()
        setBookingDetails(prev => ({ ...prev, name }))
        
        setTimeout(() => {
          const companyMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "Cool! And what company are you with?",
            timestamp: new Date()
          }
          setMessages(prev => [...prev, companyMessage])
          setCurrentFlow('company')
          setIsLoading(false)
        }, 1500) // 1.5 second delay
        return
      }

      if (currentFlow === 'company') {
        // Capture company with natural delay
        const company = inputValue.trim()
        setBookingDetails(prev => ({ ...prev, company }))
        
        setTimeout(() => {
          const emailMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "Perfect! And what's your email so I can send you the meeting details?",
            timestamp: new Date()
          }
          setMessages(prev => [...prev, emailMessage])
          setCurrentFlow('email')
          setIsLoading(false)
        }, 2000) // 2 second delay
        return
      }

      if (currentFlow === 'email') {
        // Capture email and complete booking with natural flow
        const email = inputValue.trim()
        setBookingDetails(prev => ({ ...prev, email }))
        
        // First message - booking in progress
        setTimeout(() => {
          const bookingMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "Sweet! I'm getting this set up for you right now. You should get a confirmation email in just a minute.",
            timestamp: new Date()
          }
          setMessages(prev => [...prev, bookingMessage])
          
          // Execute all booking actions
          setTimeout(async () => {
            try {
              // Create Cal.com booking and trigger Zapier webhook
              const bookingData = {
                name: bookingDetails.name,
                company: bookingDetails.company,
                email: email,
                meetingType: bookingDetails.meetingType,
                timeSlot: bookingDetails.timeSlot,
                timestamp: new Date().toISOString()
              }
              
              // Call our API to handle Cal.com and Zapier
              const response = await fetch('/api/chat-booking', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  action: 'create_booking',
                  bookingData: bookingData
                })
              })
              
              if (!response.ok) {
                console.error('Booking API failed:', response.status)
              } else {
                console.log('Booking created successfully')
              }
              
            } catch (error) {
              console.error('Booking process error:', error)
            }
            
            // Second message - offer additional help
            setTimeout(() => {
              const helpMessage: Message = {
                id: (Date.now() + 2).toString(),
                role: 'assistant',
                content: "Anything else I can help you with while you're here?",
                timestamp: new Date()
              }
              setMessages(prev => [...prev, helpMessage])
              setCurrentFlow('general') // Reset to general chat mode
              setIsLoading(false)
            }, 3000) // 3 second delay after booking actions
            
          }, 2000) // 2 second delay before executing booking actions
          
        }, 2500) // 2.5 second delay for first message
        return
      }

      // Check if this is legacy booking information (for backwards compatibility)
      if (currentFlow === 'booking') {
        console.log('Legacy booking flow detected, input:', inputValue)
        
        // More flexible parsing - handle different formats
        let name = '', company = ''
        
        // Try different parsing methods
        if (inputValue.includes('Name:') || inputValue.includes('Company:')) {
          // Format: "Name: John Doe Company: ABC Corp" or multiline
          const lines = inputValue.split(/[\n\r]|(?=Company:)|(?=Name:)/)
          
          lines.forEach(line => {
            const trimmedLine = line.trim()
            if (trimmedLine.toLowerCase().startsWith('name:')) {
              name = trimmedLine.split(':')[1]?.trim() || ''
            }
            if (trimmedLine.toLowerCase().startsWith('company:')) {
              company = trimmedLine.split(':')[1]?.trim() || ''
            }
          })
        } else {
          // Try to extract from single line without labels
          const words = inputValue.trim().split(/\s+/)
          if (words.length >= 2) {
            // Assume first part is name, rest is company
            const spaceIndex = inputValue.indexOf(' ')
            if (spaceIndex > 0) {
              name = inputValue.substring(0, spaceIndex).trim()
              company = inputValue.substring(spaceIndex + 1).trim()
            }
          }
        }

        console.log('Parsed name:', name, 'company:', company)

        // If we have at least a name, proceed with booking
        if (name.length > 0) {
          const confirmationMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Perfect! I'm setting up your ${bookingDetails.meetingType} consultation for ${bookingDetails.timeSlot}. ${company ? `I have your company as "${company}".` : ''} Please include your contact details when you email us to confirm this appointment.`,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, confirmationMessage])
          
          setTimeout(() => {
            window.location.href = `mailto:admin@amarilloautomation.com?subject=Website Chatbot - Consultation Booking&body=Name: ${name}%0A${company ? `Company: ${company}%0A` : ''}Meeting Type: ${bookingDetails.meetingType}%0ARequested Time: ${bookingDetails.timeSlot}%0A%0APlease confirm this appointment time.`
          }, 2000)
          setIsLoading(false)
          return
        } else {
          // Ask for clarification
          const clarificationMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "I didn't catch your name clearly. Could you please provide it again? You can just type your name, or use the format 'Name: Your Name'",
            timestamp: new Date()
          }
          setMessages(prev => [...prev, clarificationMessage])
          setIsLoading(false)
          return
        }
      }

      // Regular chat API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          conversation_history: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please feel free to contact us directly at admin@amarilloautomation.com or try again in a moment.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleOptionSelect = (option: string, message: Message) => {
    if (currentFlow === 'general' && message.options?.includes(option)) {
      // Handle topic selection from welcome message
      handleTopicSelection(option)
    } else if (currentFlow === 'scheduling') {
      handleMeetingTypeSelection(option)
    } else if (currentFlow === 'booking' && message.timeSlot) {
      handleTimeSlotConfirmation(option, message.timeSlot)
    }
  }

  // Handle topic selection from welcome message
  const handleTopicSelection = (topic: string) => {
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

    // Generate casual responses for each topic
    setTimeout(() => {
      let response = ""
      
      switch (topic) {
        case 'Automation':
          response = "Nice! So automation is basically our bread and butter. We help local businesses like HVAC companies, contractors, and plumbers automate all the boring stuff - like follow-ups, scheduling, invoice generation, you name it. Most of our clients save like 15+ hours a week and see way better lead conversion. What kind of business are you running?"
          break
        case 'Digital Marketing':
          response = "Sweet! Yeah, we do Facebook and Instagram ads for local home service businesses. The cool thing is we actually track real ROI - not just 'engagement' or whatever. We focus on getting you actual customers, not just likes. Plus we tie it all into your automation so leads don't fall through the cracks. What's your main way of getting customers right now?"
          break
        case 'Web Development':
          response = "Awesome! We build websites that actually work for your business - not just pretty pictures. Think automated lead capture, built-in booking systems, and everything connects to your workflow. No more leads sitting in some random contact form. Want to see what we can do with yours?"
          break
        case 'Advanced Analytics':
          response = "Oh this is cool stuff! We set up custom dashboards that show you exactly what's driving your business growth. Like, which marketing channels actually bring in money, not just traffic. Most business owners are flying blind - this gives you the real numbers. What metrics do you wish you had better visibility on?"
          break
        default:
          response = "That's a great question! I'd love to learn more about your specific situation. What's the biggest challenge you're dealing with in your business right now?"
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    }, 1500) // 1.5 second delay for natural feel
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
                        onClick={() => handleOptionSelect(option, message)}
                        className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                          option.includes('Email') 
                            ? 'border-blue-500 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                            : 'border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20'
                        }`}
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
                currentFlow === 'booking' ? "Enter your name and company..." :
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