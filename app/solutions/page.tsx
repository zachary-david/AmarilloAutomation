// REPLACE the Workflow Automation Expertise Section with this emoji-free version

{/* Workflow Automation Expertise Section */}
<div className="mt-16 mb-16">
  <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-gray-700 rounded-xl p-8">
    <div className="text-center">
      <h3 className="text-3xl font-bold text-white mb-4">
        Certified Automation Platform Experts
      </h3>
      <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
        We're not just users — we're certified specialists in the top automation platforms. 
        From simple Zapier workflows to complex n8n deployments, we speak fluent automation.
      </p>
      
      {/* Platform Expertise Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">Z</div>
          <div className="font-semibold text-orange-400">Zapier</div>
          <div className="text-sm text-gray-400">Advanced Certified</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">M</div>
          <div className="font-semibold text-purple-400">Make.com</div>
          <div className="text-sm text-gray-400">Expert Partner</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">n8n</div>
          <div className="font-semibold text-blue-400">n8n</div>
          <div className="text-sm text-gray-400">Self-Hosted Specialist</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">PA</div>
          <div className="font-semibold text-green-400">Power Automate</div>
          <div className="text-sm text-gray-400">Microsoft Certified</div>
        </div>
      </div>

      {/* Real Automation Examples */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold text-white mb-4">Real Automation Examples We Build:</h4>
        <div className="grid md:grid-cols-2 gap-4 text-left">
          <div className="bg-gray-800/30 rounded-lg p-4">
            <div className="text-blue-400 font-semibold mb-2">Lead Processing Pipeline</div>
            <div className="text-sm text-gray-300">Website form → instant email response → CRM entry → sales team notification → follow-up sequence</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <div className="text-green-400 font-semibold mb-2">Invoice Automation</div>
            <div className="text-sm text-gray-300">Service completion → invoice generation → client approval → payment processing → accounting sync</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <div className="text-purple-400 font-semibold mb-2">Customer Support Flow</div>
            <div className="text-sm text-gray-300">Ticket creation → team assignment → status updates → resolution tracking → satisfaction survey</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <div className="text-amber-400 font-semibold mb-2">E-commerce Workflow</div>
            <div className="text-sm text-gray-300">Order placement → inventory update → shipping label → tracking notification → review request</div>
          </div>
        </div>
      </div>

      {/* Process Overview */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold text-white mb-6">Our Proven Automation Process:</h4>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800/40 rounded-lg p-6">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">1</div>
            <h5 className="font-semibold text-white mb-2">Audit & Map</h5>
            <p className="text-sm text-gray-300">We analyze your current processes and identify the biggest automation opportunities.</p>
          </div>
          <div className="bg-gray-800/40 rounded-lg p-6">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">2</div>
            <h5 className="font-semibold text-white mb-2">Build & Test</h5>
            <p className="text-sm text-gray-300">Using the best platform for each use case, we create robust automations with error handling.</p>
          </div>
          <div className="bg-gray-800/40 rounded-lg p-6">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">3</div>
            <h5 className="font-semibold text-white mb-2">Monitor & Optimize</h5>
            <p className="text-sm text-gray-300">We provide ongoing monitoring and optimization to ensure maximum ROI from your automations.</p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <a
        href="#contact"
        className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-300 active:scale-95 shadow-lg"
        onClick={() => {
          if (typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push({
              event: 'cta_click',
              cta_text: 'workflow_automation_expert',
              cta_location: 'solutions_section',
              conversion_intent: 'high'
            })
          }
        }}
      >
        Get Your Workflow Automated
      </a>
    </div>
  </div>
</div>