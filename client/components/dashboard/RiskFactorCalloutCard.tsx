"use client";

import { AlertTriangle } from 'lucide-react';

interface RiskFactorCalloutCardProps {
  hasRisk: boolean;
  riskFactor?: string;
  recommendation?: string;
}

export function RiskFactorCalloutCard({
  hasRisk,
  riskFactor = 'Active smoker — significantly elevated stroke risk.',
  recommendation = 'Talk to your doctor about a cessation program. Quitting can halve your risk within 2 years.'
}: RiskFactorCalloutCardProps) {
  if (!hasRisk) return null;

  return (
    <div className="bg-[#FFFBEB] rounded-[12px] border border-[#FDE68A] relative overflow-hidden p-[16px]">
      <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-[#F59E0B]" />
      
      <div className="flex gap-3">
        <AlertTriangle size={18} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />
        <div className="flex flex-col">
          <p className="font-sans font-semibold text-[10px] uppercase text-[#92400E] tracking-[0.8px] mb-1">
            Top Risk Factor
          </p>
          <p className="font-sans font-semibold text-[13px] text-[#92400E] mb-2 leading-snug">
            {riskFactor}
          </p>
          <p className="font-sans text-[12px] text-[#B45309] leading-relaxed mb-3">
            {recommendation}
          </p>
          
          <button className="font-sans font-medium text-[12px] text-[#92400E] hover:underline self-end">
            Learn more →
          </button>
        </div>
      </div>
    </div>
  );
}
