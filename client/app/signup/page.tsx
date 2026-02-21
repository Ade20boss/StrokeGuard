"use client";
"use client";

import { useState } from "react";
import Link from "next/link";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { signUp } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string[];
    email?: string[];
    password?: string[];
    message?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const result = await signUp(formData);

    if (result?.error) {
      setErrors(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1684752397429-4ce4d7856cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZG9jdG9yJTIwcHJvZmVzc2lvbmFsJTIwc29mdCUyMGxpZ2h0aW5nfGVufDF8fHx8MTc3MTYzMjk2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Medical professional"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Slightly darker overlay */}
        <div className="absolute inset-0 bg-[#0EA5E9] opacity-25" />
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white text-[#0F172A]">
        <div className="w-full max-w-md">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-1 bg-[#F1F5F9] rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0EA5E9] w-[14%] transition-all duration-300" />
            </div>
            <p className="text-[#64748B] text-[11px] tracking-wider font-mono">
              STEP 1 OF 7
            </p>
          </div>

          {/* Heading */}
          <h1 className="text-[26px] font-bold mb-2">
            Create your account
          </h1>

          {/* Subtext */}
          <p className="text-[#64748B] text-[13px] mb-8">
            We'll keep your health data private and on your device.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.message && (
              <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg">
                {errors.message}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label 
                htmlFor="fullName"
                className="block text-[#374151] text-sm font-medium mb-2"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="w-full h-12 px-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] transition-all"
                placeholder="John Doe"
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName[0]}</p>}
            </div>

            {/* Email */}
            <div>
              <label 
                htmlFor="email"
                className="block text-[#374151] text-sm font-medium mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full h-12 px-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] transition-all"
                placeholder="john@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email[0]}</p>}
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="password"
                className="block text-[#374151] text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full h-12 px-4 pr-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#64748B]"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password[0]}</p>}
            </div>

            {/* Divider with "or" */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2E8F0]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#9CA3AF]">
                  or
                </span>
              </div>
            </div>

            {/* Google OAuth */}
            <button
              type="button"
              className="w-full h-12 bg-white border border-[#E2E8F0] rounded-xl text-[#374151] text-sm font-medium hover:bg-[#F8FAFC] transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#0EA5E9] text-white rounded-full text-[15px] font-medium hover:bg-[#0EA5E9]/90 transition-colors mt-6 flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>

            {/* Terms */}
            <p className="text-center text-[#9CA3AF] text-[11px] mt-4">
              By continuing you agree to our{' '}
              <a href="#" className="text-[#0EA5E9] hover:underline">
                Terms
              </a>
              {' '}and{' '}
              <a href="#" className="text-[#0EA5E9] hover:underline">
                Privacy Policy
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
