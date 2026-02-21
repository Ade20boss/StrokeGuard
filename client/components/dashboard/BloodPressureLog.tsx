"use client";

import { Heart } from 'lucide-react';

interface BloodPressureLogProps {
  systolic: number | null;
  diastolic: number | null;
  status: 'normal' | 'elevated' | 'high';
  history?: number[][];
  averageSystolic?: number;
  averageDiastolic?: number;
}

export function BloodPressureLog({
  systolic,
  diastolic,
  status,
  averageSystolic = 0,
  averageDiastolic = 0,
}: BloodPressureLogProps) {
  
  const getStatusBadge = () => {
    switch (status) {
      case 'normal':
        return <span className="bg-[#ECFDF5] text-[#10B981] font-sans font-bold text-[10px] px-[10px] py-1 rounded-full uppercase tracking-[0.5px]">Normal</span>;
      case 'elevated':
        return <span className="bg-[#FFFBEB] text-[#F59E0B] font-sans font-bold text-[10px] px-[10px] py-1 rounded-full uppercase tracking-[0.5px]">Elevated</span>;
      case 'high':
        return <span className="bg-[#FEF2F2] text-[#EF4444] font-sans font-bold text-[10px] px-[10px] py-1 rounded-full uppercase tracking-[0.5px]">High</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-[24px]">
      {/* Card header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Heart size={16} className="text-[#EF4444] fill-[#EF4444]" />
          <h3 className="font-sans font-semibold text-[16px] text-[#0F172A]">Blood Pressure</h3>
        </div>
        <button className="font-sans font-medium text-[13px] text-[#0EA5E9] hover:underline">
          Log Reading +
        </button>
      </div>

      {/* Main reading */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-baseline gap-2">
          <span className="font-mono font-bold text-[28px] text-[#0F172A]">
            {systolic ?? '--'} / {diastolic ?? '--'}
          </span>
          <span className="font-mono text-[14px] text-[#94A3B8]">mmHg</span>
        </div>
        {getStatusBadge()}
      </div>

      {/* Two-column stats below */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="font-sans text-[12px] text-[#94A3B8] mb-1">Systolic avg 7d</p>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-[16px] text-[#0F172A]">{averageSystolic || '--'}</span>
            <span className="font-mono text-[12px] text-[#94A3B8]">mmHg</span>
          </div>
        </div>
        <div>
          <p className="font-sans text-[12px] text-[#94A3B8] mb-1">Diastolic avg 7d</p>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-[16px] text-[#0F172A]">{averageDiastolic || '--'}</span>
            <span className="font-mono text-[12px] text-[#94A3B8]">mmHg</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
        <p className="font-sans text-[12px] text-[#94A3B8]">Target: below 120/80</p>
        <p className="font-sans text-[12px] text-[#94A3B8]">Source: AHA</p>
      </div>
    </div>
  );
}
