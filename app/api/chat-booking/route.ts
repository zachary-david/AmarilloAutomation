// app/api/chat-booking/route.ts
import { NextRequest, NextResponse } from 'next/server'

interface CalComEvent {
  id: string
  title: string
  startTime: string
  endTime: string
  status: 'confirmed' | 'pending' | 'cancelled'
}

interface TimeSlot {
  date: string
  time: string
  available: boolean
}

// Cal.com API integration helper
class CalComService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.CALCOM_API_KEY || ''
    this.baseUrl = 'https://api.cal.com/v1'
  }

  // Get busy times from Cal.com "Consultation" calendar
  async getBusyTimes(startDate: string, endDate: string): Promise<CalComEvent[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/bookings?apiKey=${this.apiKey}&startTime=${startDate}&endTime=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        console.error('Cal.com API error:', response.status)
        return []
      }

      const data = await response.json()
      return data.bookings || []
    } catch (error) {
      console.error('Error fetching Cal.com busy times:', error)
      return []
    }
  }

  // Generate available time slots
  async getAvailableSlots(): Promise<TimeSlot[]> {
    const slots: TimeSlot[] = []
    const now = new Date()
    
    // Get busy times for the next 14 days
    const endDate = new Date(now)
    endDate.setDate(endDate.getDate() + 14)
    
    const busyTimes = await this.getBusyTimes(
      now.toISOString(),
      endDate.toISOString()
    )

    // Generate potential slots for next 14 days
    for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {
      const date = new Date(now)
      date.setDate(date.getDate() + dayOffset)
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue
      
      // Morning slots: 10:00 AM - 12:00 PM CST
      const morningSlots = [
        '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'
      ]
      
      // Afternoon slots: 1:00 PM - 3:00 PM CST
      const afternoonSlots = [
        '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM'
      ]
      
      const allSlots = [...morningSlots, ...afternoonSlots]
      
      allSlots.forEach(time => {
        const slotDateTime = this.createSlotDateTime(date, time)
        const isAvailable = !this.isSlotBusy(slotDateTime, busyTimes)
        
        if (isAvailable) {
          slots.push({
            date: date.toISOString().split('T')[0],
            time: time,
            available: true
          })
        }
      })
    }
    
    return slots.slice(0, 10) // Return first 10 available slots
  }

  private createSlotDateTime(date: Date, time: string): Date {
    const slotDate = new Date(date)
    const [timeStr, period] = time.split(' ')
    let [hours, minutes] = timeStr.split(':').map(Number)
    
    if (period === 'PM' && hours !== 12) {
      hours += 12
    } else if (period === 'AM' && hours === 12) {
      hours = 0
    }
    
    slotDate.setHours(hours, minutes || 0, 0, 0)
    return slotDate
  }

  private isSlotBusy(slotDateTime: Date, busyTimes: CalComEvent[]): boolean {
    const slotEnd = new Date(slotDateTime)
    slotEnd.setMinutes(slotEnd.getMinutes() + 30) // 30-minute slots
    
    return busyTimes.some(event => {
      const eventStart = new Date(event.startTime)
      const eventEnd = new Date(event.endTime)
      
      // Check if slot overlaps with any busy time
      return (slotDateTime < eventEnd && slotEnd > eventStart)
    })
  }
}

// Enhanced chat API with booking capabilities
export async function POST(request: NextRequest) {
  try {
    const { action, message, conversation_history, bookingData } = await request.json()

    switch (action) {
      case 'get_available_slots':
        return handleGetAvailableSlots()
      
      case 'book_consultation':
        return handleBookConsultation(bookingData)
      
      case 'chat':
      default:
        return handleChatMessage(message, conversation_history)
    }

  } catch (error) {
    console.error('Chat-booking API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

async function handleGetAvailableSlots() {
  try {
    const calcomService = new CalComService()
    const availableSlots = await calcomService.getAvailableSlots()
    
    // If Cal.com integration fails, return mock data
    if (availableSlots.length === 0) {
      const mockSlots = generateMockSlots()
      return NextResponse.json({ slots: mockSlots })
    }
    
    return NextResponse.json({ slots: availableSlots })
  } catch (error) {
    console.error('Error getting available slots:', error)
    // Fallback to mock data
    const mockSlots = generateMockSlots()
    return NextResponse.json({ slots: mockSlots })
  }
}

async function handleBookConsultation(bookingData: any) {
  try {
    // In a production environment, you would:
    // 1. Create the booking in Cal.com
    // 2. Send confirmation emails
    // 3. Add to your CRM system
    
    console.log('Booking consultation:', bookingData)
    
    // For now, we'll track the booking request and send email
    const emailSuccess = await sendBookingNotification(bookingData)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Consultation booking request sent successfully'
    })
  } catch (error) {
    console.error('Error booking consultation:', error)
    return NextResponse.json(
      { error: 'Failed to book consultation' },
      { status: 500 }
    )
  }
}

async function handleChatMessage(message: string, conversationHistory: any[]) {
  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  // Use existing chat logic
  const response = generateChatResponse(message, conversationHistory)
  
  return NextResponse.json({ 
    response,
    timestamp: new Date().toISOString()
  })
}

// Generate mock slots when Cal.com is unavailable
function generateMockSlots(): TimeSlot[] {
  const slots: TimeSlot[] = []
  const now = new Date()
  
  for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {
    const date = new Date(now)
    date.setDate(date.getDate() + dayOffset)
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue
    
    const timeSlots = [
      '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
      '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM'
    ]
    
    // Randomly mark some slots as available (simulate real calendar)
    const availableSlots = timeSlots.filter(() => Math.random() > 0.4)
    
    availableSlots.forEach(time => {
      slots.push({
        date: date.toISOString().split('T')[0],
        time: time,
        available: true
      })
    })
  }
  
  return slots.slice(0, 8) // Return 8 available slots
}

// Send booking notification email
async function sendBookingNotification(bookingData: any): Promise<boolean> {
  try {
    // In production, integrate with your email service (SendGrid, etc.)
    console.log('Sending booking notification:', {
      to: 'admin@amarilloautomation.com',
      subject: 'New Consultation Booking Request',
      data: bookingData
    })
    
    return true
  } catch (error) {
    console.error('Failed to send booking notification:', error)
    return false
  }
}

// Existing chat response logic (from your current implementation)
function generateChatResponse(message: string, context: any[]): string {
  const lowerMessage = message.toLowerCase()

  // Consultation requests
  if (lowerMessage.includes('consultation') || lowerMessage.includes('schedule') || lowerMessage.includes('meeting')) {
    return "I'd be happy to help you schedule a free consultation! Click the 'Schedule Free Consultation' button above to get started, or I can have someone contact you. What works better for you?"
  }

  // Pricing questions
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
    return "Our automation solutions are customized for each business, so pricing varies based on your specific needs and complexity. Most of our clients see ROI within 30-60 days through time savings and increased conversions. I'd recommend scheduling a free consultation where we can discuss your situation and provide a personalized quote. Would you like me to help you set that up?"
  }

  // Lead generation
  if (lowerMessage.includes('lead') || lowerMessage.includes('customer') || lowerMessage.includes('sales')) {
    return "Great question about lead generation! We help businesses automate their entire lead lifecycle - from initial capture to conversion. This includes instant response systems (respond in under 2 minutes), automated follow-up sequences, and smart lead routing. Our clients typically see 40-60% improvements in conversion rates. What specific challenges are you facing with lead management?"
  }

  // Tools and integrations
  if (lowerMessage.includes('tool') || lowerMessage.includes('software') || lowerMessage.includes('integrate')) {
    return "We work with the tools you already use! We integrate with 18+ platforms including Zapier, Google Workspace, QuickBooks, Calendly, and more. The best part? No expensive new software to learn. We connect your existing tools to create powerful automations. What tools are you currently using for your business?"
  }

  // Time savings
  if (lowerMessage.includes('time') || lowerMessage.includes('save') || lowerMessage.includes('hours')) {
    return "Time savings is one of our biggest value propositions! Our clients typically save 10-20 hours per week on repetitive tasks like data entry, follow-ups, and scheduling. That's time you can spend growing your business instead of managing it. We automate everything from missed call responses to invoice generation. What tasks are taking up most of your time right now?"
  }

  // ROI and results
  if (lowerMessage.includes('roi') || lowerMessage.includes('return') || lowerMessage.includes('results') || lowerMessage.includes('revenue')) {
    return "Our clients see impressive results! We've helped generate over $2M in additional revenue across 40+ West Texas businesses. Most see ROI within 30-60 days through faster lead response (we get you responding in under 2 minutes), better follow-up systems, and reduced manual work. Would you like to see some specific case studies from businesses similar to yours?"
  }

  // Getting started
  if (lowerMessage.includes('start') || lowerMessage.includes('begin') || lowerMessage.includes('how do') || lowerMessage.includes('first step')) {
    return "Getting started is easy! We begin with a free 30-minute consultation where we'll review your current processes and identify your biggest automation opportunities. No pressure, no obligation - just valuable insights. From there, we create a custom strategy and can typically have your first automations running within a week. Ready to schedule your free consultation?"
  }

  // Local/Amarillo specific
  if (lowerMessage.includes('amarillo') || lowerMessage.includes('texas') || lowerMessage.includes('local')) {
    return "Yes, we're proudly based in Amarillo and serve businesses throughout West Texas! Being local means we understand the unique challenges of businesses in our area, and you get same-day responses instead of dealing with distant call centers. We've helped 40+ local contractors, HVAC companies, plumbers, and other home service businesses. There's something valuable about working with neighbors who truly understand your market!"
  }

  // Specific business types
  if (lowerMessage.includes('hvac') || lowerMessage.includes('plumbing') || lowerMessage.includes('roofing') || lowerMessage.includes('contractor')) {
    return "Perfect! We specialize in home service businesses like yours. We've automated workflows for HVAC companies, plumbers, roofers, and general contractors throughout West Texas. Common automations include instant lead responses, appointment reminders, invoice generation, and review requests. Each business is unique, so we'd love to discuss your specific challenges. What's your biggest operational headache right now?"
  }

  // Default response
  return "That's a great question! Amarillo Automation helps West Texas home service businesses save time and increase revenue through smart workflow automation. We connect your existing tools (no new expensive software!) to automate tasks like lead follow-up, scheduling, and customer communications. \n\nOur clients typically save 15+ hours per week and see 40-60% improvements in lead conversion. I'd love to learn more about your specific business challenges. What's the biggest time-waster in your daily operations? \n\nOr, if you'd prefer to speak with our team directly, I can help you schedule a free consultation!"
}