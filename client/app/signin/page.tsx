"use client";
"use client";

import { useState } from "react";
import Link from "next/link";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { signIn } from "@/lib/actions/signin";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signIn(formData);

    if (result?.error) {
      setError(result.error);
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
        <div className="absolute inset-0 bg-[#0EA5E9] opacity-25" />
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white text-[#0F172A]">
        <div className="w-full max-w-md">
          {/* Heading */}
          <h1 className="text-[26px] font-bold mb-2">
            Welcome back
          </h1>

          {/* Subtext */}
          <p className="text-[#64748B] text-[13px] mb-8">
            Sign in to access your stroke awareness dashboard.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg">
                {error}
              </div>
            )}

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
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-[#0EA5E9] text-sm hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#0EA5E9] text-white rounded-full text-[15px] font-medium hover:bg-[#0EA5E9]/90 transition-colors mt-6 flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-[#64748B] text-sm mt-4">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="text-[#0EA5E9] hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
