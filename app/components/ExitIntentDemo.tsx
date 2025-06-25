'use client'

import { useState, useEffect } from 'react';
import { X, Zap } from 'lucide-react';

const ExitIntentDemo = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        timeoutId = setTimeout(() => {
          setShowPopup(true);
        }, 500);
      }
    };

    const handleMouseEnter = () => {
      clearTimeout(timeoutId);
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      clearTimeout(timeoutId);
    };
  }, []);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500 rounded-xl p-8 max-w-md relative">
        <button 
          onClick={() => setShowPopup(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-black" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-4">
            Wait! See the demo first 👆
          </h3>
          
          <p className="text-gray-300 mb-6">
            You're 30 seconds away from seeing automation that could transform your business
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={() => {
                setShowPopup(false);
                document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
            >
              Show Me The Demo
            </button>
            
            <button 
              onClick={() => setShowPopup(false)}
              className="w-full text-gray-400 text-sm hover:text-white transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentDemo;