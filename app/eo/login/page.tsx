"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, User, LogIn } from "lucide-react"
import { FadeIn } from "@/components/ui/fade-in"

export default function EOLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/eo/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Redirect to dashboard
      router.push("/eo/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center p-4">
      <FadeIn>
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Image
              src="/ball_a.png"
              alt="INQUIVESTA XII"
              width={120}
              height={120}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] bg-clip-text text-transparent font-futura tracking-wide">
              EO DASHBOARD
            </h1>
            <p className="text-[#D2B997]/80 font-depixel-small mt-2">
              Event Organizer Portal
            </p>
          </div>

          {/* Login Card */}
          <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
            <CardHeader>
              <CardTitle className="text-xl text-[#D2B997] font-futura tracking-wide text-center">
                Login to Continue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg font-depixel-small text-sm text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-[#D2B997] font-depixel-small flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                    placeholder="Enter your username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#D2B997] font-depixel-small flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                    placeholder="Enter your password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body py-6 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Login
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-[#D2B997]/60 font-depixel-small text-xs">
                  Contact the organizing committee if you need access.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>
    </div>
  )
}
