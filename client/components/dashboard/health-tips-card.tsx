"use client";

import { Lightbulb, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const tips = [
  {
    text: "Walking 30 minutes daily can reduce stroke risk by up to 20%. It also supports healthy blood pressure over time.",
    source: "American Heart Association"
  },
  {
    text: "Managing stress through mindfulness or deep breathing exercises can help regulate blood pressure and reduce cardiovascular strain.",
    source: "American Heart Association"
  },
  {
    text: "Limiting sodium to less than 2,300mg per day can significantly reduce your risk of high blood pressure and stroke.",
    source: "American Heart Association"
  },
  {
    text: "Getting 7-9 hours of quality sleep each night helps your heart recover and maintains healthy blood vessel function.",
    source: "American Heart Association"
  },
  {
    text: "Eating foods rich in potassium like bananas, sweet potatoes, and spinach helps balance sodium levels and support heart health.",
    source: "American Heart Association"
  }
];

export function HealthTipsCard() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  const handleRefresh = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };
  
  const currentTip = tips[currentTipIndex];

  return (
    <div 
      className="bg-white rounded-xl p-5 mx-5 border border-[#E2E8F0]"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-[#0EA5E9]" />
          <span 
            className="text-[14px] font-semibold text-[#0F172A]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Health Tips
          </span>
        </div>
        
        <button 
          onClick={handleRefresh}
          className="text-[12px] font-medium text-[#0EA5E9] hover:text-[#0284C7]"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Refresh
        </button>
      </div>
      
      <p 
        className="text-[14px] text-[#334155] leading-relaxed mb-3 line-clamp-3"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        {currentTip.text}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span 
            className="text-[10px] text-[#94A3B8]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Source: {currentTip.source}
          </span>
          <ExternalLink className="w-2.5 h-2.5 text-[#CBD5E1]" />
        </div>
        
        <div className="flex items-center gap-1.5">
          {tips.map((_, index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 rounded-full transition-colors"
              style={{ 
                backgroundColor: index === currentTipIndex ? '#0EA5E9' : '#E2E8F0'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
