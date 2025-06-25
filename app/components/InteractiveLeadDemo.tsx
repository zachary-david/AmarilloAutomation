// app/components/InteractiveLeadDemo.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { Phone, Mail, MessageSquare, Clock, CheckCircle, Zap, Play, RotateCcw } from 'lucide-react';

const InteractiveLeadDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userBusiness, setUserBusiness] = useState('');
  const [demoStarted, setDemoStarted] = useState(false);
  const [responseTime, setResponseTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const demoSteps = [
    {
      title: "📱 Incoming Lead Detected",
      description: "ANGI lead for emergency roof repair",
      detail: "Customer: Sarah Johnson - Water damage in kitchen",
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      delay: 1000,
      color: "border-yellow-500 bg-yellow-50"
    },
    {
      title: "🤖 AI Analysis Complete", 
      description: "Emergency repair + high-value customer detected",
      detail: "Priority: HIGH | Estimated Value: $8,500",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      delay: 2000,
      color: "border-green-500 bg-green-50"
    },
    {
      title: "📲 Contractor Notified",
      description: `SMS sent to ${userPhone || 'your phone'}`,
      detail: "Text: 'URGENT: $8K roof repair lead - respond now!'",
      icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
      delay: 2500,
      color: "border-blue-500 bg-blue-50"
    },
    {
      title: "✉️ Customer Response Sent",
      description: "Personalized reply sent automatically",
      detail: "Hi Sarah! I specialize in emergency repairs. I'm 15 min away...",
      icon: <Mail className="w-5 h-5 text-purple-500" />,
      delay: 3000,
      color: "border-purple-500 bg-purple-50"
    },
    {
      title: "📅 Follow-up Activated",
      description: "Smart sequence started for maximum conversion",
      detail: "Calendar link sent + 2hr check-in scheduled",
      icon: <Clock className="w-5 h-5 text-orange-500" />,
      delay: 3500,
      color: "border-orange-500 bg-orange-50"
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentStep < demoSteps.length) {
      timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setResponseTime(responseTime + 0.8);
      }, demoSteps[currentStep]?.delay || 1000);
    } else if (currentStep >= demoSteps.length && isPlaying) {
      setIsPlaying(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentStep, demoSteps.length, responseTime]);

  const startDemo = async () => {
    if (!userPhone || !userEmail || !userBusiness) {
      alert('Please fill in all fields to see your personalized demo!');
      return;
    }

    setIsSubmitting(true);
    
    // Submit to AirTable via API (with error handling)
    try {
      const response = await fetch('/api/demo-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userPhone,
          email: userEmail,
          business: userBusiness,
          source: 'Interactive Demo',
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();
      console.log('Lead submission result:', result);
      
    } catch (error) {
      console.error('Lead submission error:', error);
      // Don't block the demo if API fails
    }

    setIsSubmitting(false);
    setDemoStarted(true);
    setCurrentStep(0);
    setResponseTime(0);
    setIsPlaying(true);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setDemoStarted(false);
    setResponseTime(0);
  };

  if (!demoStarted) {
    return (
      <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-8 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">
            See Your Business Automation in Action
          </h3>
          <p className="text-gray-400 text-sm">
            Watch what happens when a lead comes in while your competition is still checking email
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Phone Number
            </label>
            <input
              type="tel"
              placeholder="(806) 555-0123"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Email
            </label>
            <input
              type="email"
              placeholder="your@business.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Business Type
            </label>
            <select
              value={userBusiness}
              onChange={(e) => setUserBusiness(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select your business type</option>
              <option value="Roofing">Roofing Contractor</option>
              <option value="HVAC">HVAC Service</option>
              <option value="Plumbing">Plumbing Service</option>
              <option value="General">General Contractor</option>
              <option value="Electrical">Electrical Service</option>
              <option value="Other">Other Home Service</option>
            </select>
          </div>

          <button
            onClick={startDemo}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            {isSubmitting ? '⏳ Starting Demo...' : '🚀 Start My Demo'}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          See what 4-second response time looks like for your business
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Fake Lead Alert */}
      <div className="bg-red-900/20 border-2 border-red-500 rounded-lg p-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-bold">🚨 ANGI Lead Alert</h4>
            <p className="text-red-300 text-sm">Emergency roof repair - Water damage</p>
          </div>
          <div className="text-right">
            <div className="text-yellow-400 font-bold">$8,500</div>
            <div className="text-xs text-gray-400">Est. Value</div>
          </div>
        </div>
      </div>

      {/* Response Timer */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-white">
          {responseTime.toFixed(1)} seconds
        </div>
        <div className="text-sm text-green-100">
          Your response time vs Industry avg: 2-4 hours
        </div>
      </div>

      {/* Demo Steps */}
      <div className="space-y-3">
        {demoSteps.map((step, index) => (
          <div
            key={index}
            className={`rounded-lg p-4 transition-all duration-500 ${
              index <= currentStep 
                ? `border-2 ${step.color} shadow-lg transform scale-105` 
                : 'border border-gray-700 bg-gray-800/50'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${
                index <= currentStep ? 'bg-white' : 'bg-gray-700'
              }`}>
                {step.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-sm">{step.title}</h4>
                <p className="text-gray-300 text-sm">{step.description}</p>
                {index <= currentStep && (
                  <p className="text-xs text-gray-400 mt-1 italic">{step.detail}</p>
                )}
              </div>
              {index <= currentStep && (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Results */}
      {currentStep >= demoSteps.length && (
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-4">
            🎉 Demo Complete!
          </h3>
          <div className="grid grid-cols-2 gap-4 text-center mb-6">
            <div>
              <div className="text-2xl font-bold text-white">{responseTime.toFixed(1)}s</div>
              <div className="text-xs text-green-100">Response Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-xs text-green-100">Automated</div>
            </div>
          </div>
          
          <p className="text-white mb-4 text-sm">
            While competitors read emails, you've already won the lead.
          </p>

          <div className="flex flex-col gap-3">
            <button 
              onClick={resetDemo}
              className="flex items-center justify-center px-4 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Run Demo Again
            </button>
            <a 
              href="https://cal.com/amarilloautomation/consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors text-sm"
            >
              Get This System For Your Business
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveLeadDemo;