"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, User, LogIn, Shield } from "lucide-react"
import { FadeIn } from "@/components/ui/fade-in"

export default function AdminLoginPage() {
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
      const response = await fetch("/api/admin/login", {
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
      router.push("/admin/dashboard")
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
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-6 h-6 text-red-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent font-futura tracking-wide">
                ADMIN DASHBOARD
              </h1>
            </div>
            <p className="text-[#D2B997]/80 font-depixel-small mt-2">
              Administrator Portal
            </p>
          </div>

          {/* Login Card */}
          <Card className="bg-[#2A2A2A]/50 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-xl text-red-400 font-futura tracking-wide text-center">
                Admin Login
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
                    className="bg-[#1A1A1A] border-red-500/30 text-white font-depixel-small focus:border-red-400"
                    placeholder="Enter admin username"
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
                    className="bg-[#1A1A1A] border-red-500/30 text-white font-depixel-small focus:border-red-400"
                    placeholder="Enter admin password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-depixel-body py-6 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Login as Admin
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-[#D2B997]/60 font-depixel-small text-xs">
                  Admin access only. Unauthorized access is prohibited.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>
    </div>
  )
}
