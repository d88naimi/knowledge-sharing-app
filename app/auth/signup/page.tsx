"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
        return;
      }

      // Success! Redirect to sign in
      router.push("/auth/signin?message=Account created! Please sign in.");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-7">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-7">
          <h2 className="text-[30px] font-semibold text-slate-900 tracking-[-0.225px] mb-2">
            Join Method Know
          </h2>
          <p className="text-[20px] text-slate-900 tracking-[-0.1px]">
            Share and discover valuable learning resources
          </p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white rounded-2xl border border-slate-300 p-4">
          <div className="py-2.5 mb-2">
            <h3 className="text-lg font-normal text-slate-900 text-center">
              Create Account
            </h3>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-900"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-900"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-900"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="Create a password (min. 6 characters)"
              />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {/* Log In Link */}
          <div className="mt-4 text-center text-sm">
            <span className="text-slate-900">Already have an account? </span>
            <Link
              href="/auth/signin"
              className="text-slate-900 underline hover:text-slate-700"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
