"use client";

import { Timer } from 'lucide-react';

export function ImOkTimerCard() {
  return (
    <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-[20px] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-[32px] h-[32px] rounded-[8px] bg-[#FFFBEB] flex items-center justify-center flex-shrink-0">
          <Timer size={16} className="text-[#F59E0B]" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-sans font-semibold text-[14px] text-[#0F172A]">
            I'm OK Timer
          </h3>
          <p className="font-sans text-[11px] text-[#94A3B8]">
            Contacts alerted automatically if you don't check in.
          </p>
        </div>
      </div>
      <button className="font-sans font-medium text-[13px] text-[#0EA5E9] whitespace-nowrap hover:underline pr-2">
        Set Timer
      </button>
    </div>
  );
}
