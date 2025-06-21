import { calculateLeadScore, ContactFormData } from '../contact/page'

describe('calculateLeadScore', () => {
  it('returns higher score for workflow automation service with urgent need in enterprise company', () => {
    const data: ContactFormData = {
      name: 'Jane',
      email: 'jane@example.com',
      company: 'Big Corp',
      serviceType: 'workflow_automation',
      companySize: 'enterprise',
      projectUrgency: 'urgent',
      message: 'Need it fast'
    }
    expect(calculateLeadScore(data)).toBe(100)
  })

  it('computes medium score for medium company planning AI agents project', () => {
    const data: ContactFormData = {
      name: 'John',
      email: 'john@example.com',
      company: 'Medium Co',
      serviceType: 'ai_agents',
      companySize: 'medium',
      projectUrgency: 'planning',
      message: 'Looking ahead'
    }
    expect(calculateLeadScore(data)).toBe(50 + 25 + 20 + 15)
  })

  it('uses defaults when values are missing or unknown', () => {
    const data: ContactFormData = {
      name: 'Sam',
      email: 'sam@example.com',
      company: 'Startup',
      serviceType: '',
      companySize: '',
      projectUrgency: 'exploring',
      message: 'Tell me more'
    }
    const expected = 50 + 10 + 10 + 10
    expect(calculateLeadScore(data)).toBe(expected)
  })
})
