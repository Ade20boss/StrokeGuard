"use client";

import { Lightbulb, RefreshCw, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const healthTips = [
  {
    text: 'Walking 30 minutes daily can reduce stroke risk by up to 20%. Consistent movement supports healthy blood pressure and heart rhythm over time.',
    source: 'American Heart Association',
  },
  {
    text: 'Getting 7-9 hours of quality sleep helps regulate heart rate variability and reduces inflammation, both key factors in stroke prevention.',
    source: 'National Sleep Foundation',
  },
  {
    text: 'Eating foods rich in potassium like bananas and spinach can help lower blood pressure naturally and support cardiovascular health.',
    source: 'American Heart Association',
  },
  {
    text: 'Reducing sodium intake to less than 2,300mg per day can significantly lower blood pressure and reduce stroke risk.',
    source: 'CDC',
  },
  {
    text: 'Managing stress through meditation or deep breathing exercises for just 10 minutes daily can improve heart rate variability.',
    source: 'Mayo Clinic',
  },
];

export function HealthTipsCard() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % healthTips.length);
  };

  const currentTip = healthTips[currentTipIndex];

  return (
    <div
      className="bg-white rounded-2xl p-5 border"
      style={{
        borderColor: '#E2E8F0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb size={14} style={{ color: '#0EA5E9' }} />
          <span
            className="text-sm font-semibold"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#0F172A',
            }}
          >
            Health Tips
          </span>
        </div>
        <button
          onClick={handleNextTip}
          className="p-1 hover:bg-gray-50 rounded transition-colors"
        >
          <RefreshCw size={14} style={{ color: '#94A3B8' }} />
        </button>
      </div>

      {/* Tip Text */}
      <p
        className="text-sm mb-3"
        style={{
          fontFamily: 'DM Sans, sans-serif',
          color: '#334155',
          lineHeight: '1.6',
        }}
      >
        {currentTip.text}
      </p>

      {/* Source */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span
            className="text-[10px]"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#94A3B8',
            }}
          >
            Source: {currentTip.source}
          </span>
          <ExternalLink size={10} style={{ color: '#CBD5E1' }} />
        </div>
      </div>

      {/* Position Indicator Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {healthTips.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTipIndex(index)}
            className="rounded-full transition-all"
            style={{
              width: index === currentTipIndex ? '7px' : '7px',
              height: index === currentTipIndex ? '7px' : '7px',
              backgroundColor: index === currentTipIndex ? '#0EA5E9' : '#E2E8F0',
            }}
          />
        ))}
      </div>
    </div>
  );
}
