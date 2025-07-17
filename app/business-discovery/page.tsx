'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Building2, Mail, Phone, Globe, Star, TrendingUp, AlertCircle, CheckCircle2, Loader2, Target, Database, Zap, Users, Brain, ExternalLink } from 'lucide-react'

interface DiscoveredBusiness {
  placeId: string
  name: string
  address: string
  phone?: string
  website?: string
  rating?: number
  reviewCount?: number
  email?: string
  emailSource?: 'hunter' | 'manual' | 'none'
  automationScore?: number
  leadScore?: number
  painPoints?: string[]
}

interface DiscoveryResponse {
  success: boolean
  businesses: DiscoveredBusiness[]
  totalFound: number
  savedToAirtable: number
  errors?: string[]
}

export default function BusinessDiscovery() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)
  
  const [industry, setIndustry] = useState('')
  const [location, setLocation] = useState('Amarillo, TX')
  const [radius, setRadius] = useState(5) // Default 5 miles
  const [maxResults, setMaxResults] = useState(10)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<DiscoveryResponse | null>(null)
  const [error, setError] = useState('')

  // Initialize Vanta.js background
  useEffect(() => {
    const loadVanta = async () => {
      if (typeof window !== 'undefined' && !window.VANTA) {
        try {
          const threeScript = document.createElement('script')
          threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js'
          document.head.appendChild(threeScript)
          
          await new Promise(resolve => { threeScript.onload = resolve })
          
          const vantaScript = document.createElement('script')
          vantaScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.net.min.js'
          document.head.appendChild(vantaScript)
          
          await new Promise(resolve => { vantaScript.onload = resolve })
          
          if (vantaRef.current && window.VANTA) {
            vantaEffect.current = window.VANTA.NET({
              el: vantaRef.current,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              scale: 1.00,
              scaleMobile: 1.00,
              color: 0x10b981,
              backgroundColor: 0x0a1224,
              points: 6.00,
              maxDistance: 20.00,
              spacing: 18.00,
            })
          }
        } catch (error) {
          console.log('Vanta.js loading failed:', error)
        }
      }
    }
    
    loadVanta()
    
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
        vantaEffect.current = null
      }
    }
  }, [])

  const availableIndustries = [
    'HVAC',
    'Plumber',
    'Electrician',
    'Roofing',
    'Restaurant',
    'Dentist',
    'Auto Repair',
    'Real Estate'
  ]

  // Additional search terms that map to the available categories
  const industrySearchTerms = [
    'HVAC Contractor',
    'Heating and Cooling',
    'Air Conditioning',
    'Furnace Repair',
    'Plumber',
    'Plumbing Services',
    'Pipe Repair',
    'Water Heater',
    'Roofer',
    'Roofing Contractor',
    'Roof Repair',
    'Roof Installation'
  ]

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResults(null)

    try {
      const response = await fetch('/api/business-discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, location, radius, maxResults })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to discover businesses')
      }

      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getPainPointLabel = (painPoint: string) => {
    const labels: Record<string, string> = {
      'no_website': 'No Website',
      'reputation_management': 'Reputation Issues',
      'high_volume_inquiries': 'High Volume',
      'appointment_scheduling': 'Scheduling Needs',
      'lead_follow_up': 'Lead Follow-up',
      'quote_generation': 'Quote Generation'
    }
    return labels[painPoint] || painPoint
  }

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 65) return 'text-yellow-400'
    if (score >= 50) return 'text-orange-400'
    return 'text-red-400'
  }

  const getLeadScoreLabel = (score: number) => {
    if (score >= 80) return 'Hot Lead'
    if (score >= 65) return 'Warm Lead'
    if (score >= 50) return 'Qualified Lead'
    return 'Cold Lead'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-emerald-600'
    if (score >= 65) return 'from-yellow-500 to-yellow-600'
    if (score >= 50) return 'from-orange-500 to-orange-600'
    return 'from-red-500 to-red-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Vanta.js Background */}
      <div ref={vantaRef} className="fixed inset-0 z-0" />
      
      {/* Overlay to subdue background effect */}
      <div className="fixed inset-0 z-[5] bg-gray-900/70 backdrop-blur-[0.5px]" />
      
      {/* Content */}
      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full mb-6">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Business Intelligence Hub
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Advanced AI-powered business discovery system. Find local businesses, analyze automation potential, 
              discover contact information, and automatically populate your CRM with qualified leads.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-gray-300">Google Places API</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Hunter.io Integration</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">AI Scoring Engine</span>
              </div>
            </div>
          </div>

          {/* Search Form */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl p-8 mb-8">
            <form onSubmit={handleSearch} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    Industry / Business Type
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., HVAC Contractor, Plumber, Electrician"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                    required
                  />
                  <div className="mt-3 space-y-3">
                    {/* Main Categories */}
                    <div>
                      <p className="text-xs text-gray-400 mb-2 font-medium">Available Categories:</p>
                      <div className="flex flex-wrap gap-2">
                        {availableIndustries && availableIndustries.map((ind, index) => (
                          <button
                            key={`industry-${index}`}
                            type="button"
                            onClick={() => setIndustry(ind)}
                            className="text-xs px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-emerald-200 rounded-md transition-all duration-200 border border-emerald-500/30 font-medium"
                          >
                            {ind}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Search Terms */}
                    <div>
                      <p className="text-xs text-gray-400 mb-2 font-medium">Common Search Terms:</p>
                      <div className="flex flex-wrap gap-2">
                        {industrySearchTerms && industrySearchTerms.slice(0, 8).map((term, index) => (
                          <button
                            key={`search-${index}`}
                            type="button"
                            onClick={() => setIndustry(term)}
                            className="text-xs px-3 py-1.5 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-md transition-all duration-200 border border-gray-600/30"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Amarillo, TX"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Search Radius
                  </label>
                  <select
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  >
                    <option value={5}>5 miles radius</option>
                    <option value={25}>25 miles radius</option>
                    <option value={50}>50 miles radius</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Maximum Results
                  </label>
                  <select
                    value={maxResults}
                    onChange={(e) => setMaxResults(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  >
                    <option value={5}>5 businesses</option>
                    <option value={10}>10 businesses</option>
                    <option value={20}>20 businesses</option>
                    <option value={50}>50 businesses</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Market...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Discover Businesses
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-8 flex items-start gap-4 backdrop-blur-sm">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-400 mb-1">Discovery Error</h3>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Results Summary */}
          {results && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6 mb-8 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="font-semibold text-emerald-400 mb-1">Discovery Complete!</h3>
                  <p className="text-emerald-300">
                    Found <span className="font-bold">{results.totalFound}</span> businesses • 
                    Analyzed <span className="font-bold">{results.businesses.length}</span> profiles • 
                    Added <span className="font-bold">{results.savedToAirtable}</span> leads to Business Intelligence database
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Results Grid */}
          {results && results.businesses.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.businesses.map((business) => (
                <div key={business.placeId} className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/60 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 transform hover:scale-[1.02]">
                  
                  {/* Business Header */}
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white leading-tight flex-1 pr-3">
                        {business.name}
                      </h3>
                      <Building2 className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{business.address}</p>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3 mb-6">
                    {business.phone && (
                      <div className="flex items-center gap-3 text-sm group">
                        <Phone className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                        <span className="text-gray-300 group-hover:text-white transition-colors">{business.phone}</span>
                      </div>
                    )}
                    {business.website && (
                      <div className="flex items-center gap-3 text-sm group">
                        <Globe className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                        <a 
                          href={business.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 truncate group-hover:underline"
                        >
                          {business.website.replace(/^https?:\/\//, '')}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {business.email && (
                      <div className="flex items-center gap-3 text-sm group">
                        <Mail className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                        <span className="text-gray-300 group-hover:text-white transition-colors truncate">{business.email}</span>
                        {business.emailSource === 'hunter' && (
                          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                            Hunter.io
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Ratings */}
                  {business.rating && (
                    <div className="flex items-center gap-3 mb-6 p-3 bg-gray-900/50 rounded-lg border border-gray-600/30">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-white">{business.rating}</span>
                      <span className="text-sm text-gray-400">({business.reviewCount?.toLocaleString()} reviews)</span>
                    </div>
                  )}

                  {/* Scoring Metrics */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-300 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          Lead Score
                        </span>
                        <span className={`font-bold ${getLeadScoreColor(business.leadScore || 0)}`}>
                          {business.leadScore}% - {getLeadScoreLabel(business.leadScore || 0)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(business.leadScore || 0)} transition-all duration-500`}
                          style={{ width: `${business.leadScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-300 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-blue-400" />
                          Automation Potential
                        </span>
                        <span className="font-bold text-blue-400">{business.automationScore}%</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${business.automationScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pain Points */}
                  {business.painPoints && business.painPoints.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-400" />
                        Automation Opportunities
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {business.painPoints.map((point) => (
                          <span 
                            key={point} 
                            className="text-xs bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full border border-orange-500/30"
                          >
                            {getPainPointLabel(point)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CRM Status */}
                  <div className="pt-4 border-t border-gray-700/50">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300 font-medium">Added to Business Intelligence Database</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}