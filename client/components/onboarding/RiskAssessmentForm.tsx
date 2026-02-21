"use client";

import { useState } from "react";
import { Shield, ChevronDown, Loader2, Heart, Activity, Cigarette } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { saveRiskAssessment } from "@/lib/actions/onboarding";
import { toast } from "react-hot-toast";

export default function RiskAssessmentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    bloodPressure: "",
    diabetesStatus: "no",
    smokingStatus: "never",
    familyHistory: "no",
    activityLevel: "3-4", // standard tiers: '5+', '3-4', '1-2', '0'
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("bloodPressure", formData.bloodPressure);
      formDataToSubmit.append("diabetesStatus", formData.diabetesStatus);
      formDataToSubmit.append("smokingStatus", formData.smokingStatus);
      formDataToSubmit.append("familyHistory", formData.familyHistory);
      formDataToSubmit.append("activityLevel", formData.activityLevel);

      const result = await saveRiskAssessment(formDataToSubmit);
      
      if (result?.error) {
        toast.error(result.error);
        setIsLoading(false);
      } else {
        toast.success("Risk assessment saved!");
      }
    } catch (err: any) {
      if (err.message === 'NEXT_REDIRECT') {
        throw err;
      }
      toast.error("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwaGVhbHRoeSUyMGxpZmVzdHlsZXxlbnwxfHx8fDE3NzE2MzI5NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Healthy lifestyle"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0EA5E9] opacity-20" />
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white text-[#0F172A] overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-1 bg-[#F1F5F9] rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0EA5E9] w-[57%] transition-all duration-300" />
            </div>
            <p className="text-[#64748B] text-[11px] tracking-wider font-mono">
              STEP 4 OF 7
            </p>
          </div>

          {/* Heading */}
          <h1 className="text-[26px] font-bold mb-2">
            Lifestyle & Health
          </h1>

          {/* Subtext */}
          <p className="text-[#64748B] text-[13px] mb-8">
            These factors significantly influence your stroke risk profile.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Blood Pressure */}
            <div>
              <label 
                htmlFor="bloodPressure"
                className="flex items-center gap-2 text-[#374151] text-sm font-medium mb-2"
              >
                <Heart className="w-4 h-4 text-[#EF4444]" />
                Recent Blood Pressure (Sys/Dia)
              </label>
              <input
                id="bloodPressure"
                type="text"
                placeholder="e.g. 120/80"
                required
                value={formData.bloodPressure}
                onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                className="w-full h-12 px-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] transition-all"
              />
            </div>

            {/* Diabetes, Smoking, Family History Grid */}
            <div className="space-y-4">
              {/* Diabetes */}
              <div>
                <label className="block text-[#374151] text-sm font-medium mb-2">
                  Diagnosed with Diabetes?
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-[#F1F5F9] rounded-xl">
                  {['no', 'unsure', 'yes'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, diabetesStatus: status })}
                      className={`h-9 rounded-lg text-xs font-medium transition-all ${
                        formData.diabetesStatus === status
                          ? 'bg-[#0EA5E9] text-white shadow-sm'
                          : 'bg-transparent text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Smoking */}
              <div>
                <label className="block text-[#374151] text-sm font-medium mb-2">
                  Smoking Status
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-[#F1F5F9] rounded-xl">
                  {['never', 'former', 'active'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, smokingStatus: status })}
                      className={`h-9 rounded-lg text-xs font-medium transition-all ${
                        formData.smokingStatus === status
                          ? 'bg-[#0EA5E9] text-white shadow-sm'
                          : 'bg-transparent text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Family History */}
              <div>
                <label className="block text-[#374151] text-sm font-medium mb-2">
                  Family History of Stroke?
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-[#F1F5F9] rounded-xl">
                  {['no', 'unsure', 'yes'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, familyHistory: status })}
                      className={`h-9 rounded-lg text-xs font-medium transition-all ${
                        formData.familyHistory === status
                          ? 'bg-[#0EA5E9] text-white shadow-sm'
                          : 'bg-transparent text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-[#374151] text-sm font-medium mb-2">
                  Weekly Exercise (Sessions)
                </label>
                <div className="grid grid-cols-4 gap-2 p-1 bg-[#F1F5F9] rounded-xl">
                  {['5+', '3-4', '1-2', '0'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, activityLevel: level })}
                      className={`h-9 rounded-lg text-xs font-medium transition-all ${
                        formData.activityLevel === level
                          ? 'bg-[#0EA5E9] text-white shadow-sm'
                          : 'bg-transparent text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Privacy info row */}
            <div className="flex items-center gap-2 pt-2">
              <Shield className="w-[14px] h-[14px] text-[#0EA5E9]" />
              <p className="text-[#64748B] text-xs">
                Encrypted and private
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#0EA5E9] text-white rounded-full text-[15px] font-medium hover:bg-[#0EA5E9]/90 transition-colors mt-4 flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Save and Continue"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
