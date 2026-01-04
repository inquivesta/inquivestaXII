"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Users, User, CheckCircle, AlertCircle, Theater } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import { FadeIn } from "@/components/ui/fade-in"

const EVENT_CONFIG = {
  id: "nukkad-natak",
  name: "Nukkad Natak",
  subtitle: "Street Play Competition",
  minTeamSize: 5,
  maxTeamSize: 15,
  fee: 150, // ₹150 per team
}

const PAYMENT_QR_CODES = [
  "/payment_qr/QR1.jpg",
  "/payment_qr/QR2.jpg",
  "/payment_qr/QR3.jpg",
]

export default function NukkadNatakRegistrationPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [registrationId, setRegistrationId] = useState("")
  const [selectedQR, setSelectedQR] = useState(0)

  // Form fields
  const [teamLeaderName, setTeamLeaderName] = useState("")
  const [teamLeaderEmail, setTeamLeaderEmail] = useState("")
  const [teamLeaderPhone, setTeamLeaderPhone] = useState("")
  const [collegeName, setCollegeName] = useState("")
  const [teamSize, setTeamSize] = useState<number>(5)
  const [dramaSynopsis, setDramaSynopsis] = useState("")
  const [utrNumber, setUtrNumber] = useState("")

  useEffect(() => {
    setSelectedQR(Math.floor(Math.random() * PAYMENT_QR_CODES.length))
  }, [])

  const cycleQR = () => {
    setSelectedQR(prev => (prev + 1) % PAYMENT_QR_CODES.length)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    // Validate required fields
    if (!teamLeaderName.trim() || !teamLeaderEmail.trim() || !teamLeaderPhone.trim() || 
        !collegeName.trim() || !dramaSynopsis.trim()) {
      setErrorMessage("Please fill in all required fields")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(teamLeaderEmail)) {
      setErrorMessage("Please enter a valid email address")
      return
    }

    // Validate phone number (10 digits)
    const phoneDigits = teamLeaderPhone.replace(/\D/g, "")
    if (phoneDigits.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit phone number")
      return
    }

    // Validate team size
    if (teamSize < EVENT_CONFIG.minTeamSize || teamSize > EVENT_CONFIG.maxTeamSize) {
      setErrorMessage(`Team size must be between ${EVENT_CONFIG.minTeamSize} and ${EVENT_CONFIG.maxTeamSize}`)
      return
    }

    // Validate synopsis length
    if (dramaSynopsis.trim().length < 50) {
      setErrorMessage("Please provide a more detailed synopsis (at least 50 characters)")
      return
    }

    // Validate UTR number (12 digits)
    const utrDigits = utrNumber.replace(/\D/g, "")
    if (utrDigits.length !== 12) {
      setErrorMessage("Please enter a valid 12-digit UTR number")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/events/register/nukkad-natak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: EVENT_CONFIG.id,
          team_leader_name: teamLeaderName.trim(),
          team_leader_email: teamLeaderEmail.trim().toLowerCase(),
          team_leader_phone: phoneDigits,
          college_name: collegeName.trim(),
          team_size: teamSize,
          drama_synopsis: dramaSynopsis.trim(),
          amount_paid: EVENT_CONFIG.fee,
          utr_number: utrNumber.replace(/\D/g, ""),
          payment_qr_used: selectedQR + 1,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Registration failed")
      }

      setRegistrationId(result.registrationId)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Registration error:", error)
      setErrorMessage(error instanceof Error ? error.message : "Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#D2B997]/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/events"
            className="flex items-center space-x-2 text-[#D2B997] hover:text-[#B8A7D9] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-depixel-small">Back to Events</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="INQUIVESTA XII" width={60} height={60} className="h-10 w-auto" />
          </div>
        </div>
      </header>

      {/* Success Screen */}
      {isSubmitted ? (
        <main className="container mx-auto px-4 py-20">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#E74C3C] to-[#C0392B] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <HyperText
                  className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#E74C3C] to-[#C0392B] bg-clip-text text-transparent font-futura tracking-wide"
                  text="REGISTERED!"
                />
                <p className="text-[#D2B997] text-lg font-depixel-body mb-8">
                  Your team registration for {EVENT_CONFIG.name} has been confirmed
                </p>
              </div>

              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30 mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">
                    Registration Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Registration ID:</span>
                      <span className="text-white font-mono text-sm">{registrationId}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Team Leader:</span>
                      <span className="text-white font-depixel-body">{teamLeaderName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">College:</span>
                      <span className="text-white font-depixel-body">{collegeName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Team Size:</span>
                      <span className="text-white font-depixel-body">{teamSize} members</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Amount Paid:</span>
                      <span className="text-[#ABEBC6] font-futura tracking-wide text-xl">₹{EVENT_CONFIG.fee}</span>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-sm text-[#D2B997]/80 font-depixel-small space-y-2">
                    <p>✅ Confirmation email sent to {teamLeaderEmail}</p>
                    <p>📱 QR Code for entry included in the email</p>
                    <p>🎭 Break a leg!</p>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-xs text-[#D2B997]/70 font-depixel-small">
                    <p>💬 If you have any issues, reply to the confirmation email with <span className="text-[#D2B997]">inquivesta@iiserkol.ac.in</span> in CC.</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
                <Link href="/events" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-[#E74C3C] to-[#C0392B] hover:from-[#CB4335] hover:to-[#A93226] text-white font-depixel-body px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base">
                    Explore More Events
                  </Button>
                </Link>
                <Link href="/" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-depixel-body px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base border border-[#D2B997]/30">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </main>
      ) : (
        /* Registration Form */
        <main className="container mx-auto px-4 py-12">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Theater className="w-10 h-10 text-[#E74C3C]" />
              </div>
              <HyperText
                className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#E74C3C] to-[#C0392B] bg-clip-text text-transparent font-futura tracking-wide"
                text="NUKKAD NATAK"
              />
              <p className="text-[#D2B997] text-lg font-depixel-body">
                {EVENT_CONFIG.subtitle}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 bg-[#F4D03F]/10 border border-[#F4D03F]/30 px-4 py-2 rounded-full">
                <span className="text-[#F4D03F] font-depixel-small">₹{EVENT_CONFIG.fee} per team</span>
              </div>
            </div>
          </FadeIn>

          {errorMessage && (
            <FadeIn>
              <div className="max-w-4xl mx-auto mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg font-depixel-small flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {errorMessage}
              </div>
            </FadeIn>
          )}

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            {/* Team Leader Details */}
            <FadeIn delay={0.1}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                    <User className="w-6 h-6 text-[#E74C3C]" />
                    Team Leader Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="teamLeaderName" className="text-[#D2B997] font-depixel-small">
                        Team Leader Name *
                      </Label>
                      <Input
                        id="teamLeaderName"
                        required
                        value={teamLeaderName}
                        onChange={(e) => setTeamLeaderName(e.target.value)}
                        className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                        placeholder="Team leader's full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="teamLeaderEmail" className="text-[#D2B997] font-depixel-small">
                        Team Leader Email *
                      </Label>
                      <Input
                        id="teamLeaderEmail"
                        type="email"
                        required
                        value={teamLeaderEmail}
                        onChange={(e) => setTeamLeaderEmail(e.target.value)}
                        className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                        placeholder="leader@email.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="teamLeaderPhone" className="text-[#D2B997] font-depixel-small">
                        Team Leader Phone *
                      </Label>
                      <Input
                        id="teamLeaderPhone"
                        type="tel"
                        required
                        value={teamLeaderPhone}
                        onChange={(e) => setTeamLeaderPhone(e.target.value)}
                        className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                        placeholder="10-digit number"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Team Details */}
            <FadeIn delay={0.2}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                    <Users className="w-6 h-6 text-[#E74C3C]" />
                    Team Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="collegeName" className="text-[#D2B997] font-depixel-small">
                      College Name *
                    </Label>
                    <Input
                      id="collegeName"
                      required
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                      placeholder="Name of your college"
                    />
                  </div>

                  <div>
                    <Label htmlFor="teamSize" className="text-[#D2B997] font-depixel-small">
                      Number of Participants * ({EVENT_CONFIG.minTeamSize}-{EVENT_CONFIG.maxTeamSize})
                    </Label>
                    <Input
                      id="teamSize"
                      type="number"
                      required
                      min={EVENT_CONFIG.minTeamSize}
                      max={EVENT_CONFIG.maxTeamSize}
                      value={teamSize}
                      onChange={(e) => setTeamSize(parseInt(e.target.value) || EVENT_CONFIG.minTeamSize)}
                      className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                    />
                    <p className="text-[#D2B997]/60 text-xs mt-1 font-depixel-small">
                      Team can have {EVENT_CONFIG.minTeamSize} to {EVENT_CONFIG.maxTeamSize} members
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Drama Synopsis */}
            <FadeIn delay={0.3}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                    <Theater className="w-6 h-6 text-[#E74C3C]" />
                    Drama Synopsis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="dramaSynopsis" className="text-[#D2B997] font-depixel-small">
                      Synopsis of Your Drama *
                    </Label>
                    <Textarea
                      id="dramaSynopsis"
                      required
                      value={dramaSynopsis}
                      onChange={(e) => setDramaSynopsis(e.target.value)}
                      className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body min-h-[150px]"
                      placeholder="Describe your street play - theme, message, storyline..."
                    />
                    <p className="text-[#D2B997]/60 text-xs mt-1 font-depixel-small">
                      Provide a brief synopsis of your street play including the theme and message.
                      {dramaSynopsis.length > 0 && (
                        <span className={dramaSynopsis.length < 50 ? " text-red-400" : " text-[#ABEBC6]"}>
                          {" "}({dramaSynopsis.length} characters)
                        </span>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Payment Section */}
            <FadeIn delay={0.4}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="bg-white p-4 rounded-lg max-w-xs mx-auto">
                        <Image
                          src={`/payment_qr/qr_${selectedQR + 1}.jpg`}
                          alt="Payment QR Code"
                          width={300}
                          height={300}
                          className="w-full h-auto"
                        />
                      </div>
                      <p className="text-center text-[#D2B997]/80 font-depixel-small text-sm mt-4">
                        Scan QR code to pay <span className="text-[#F4D03F] font-bold">₹{EVENT_CONFIG.fee}</span>
                      </p>
                      <p className="text-center text-white/60 font-depixel-small text-xs mt-2">
                        QR Code #{selectedQR + 1}/3
                      </p>
                      <button
                        type="button"
                        onClick={cycleQR}
                        className="mt-3 w-full max-w-xs mx-auto block bg-[#D2B997]/20 hover:bg-[#D2B997]/30 border border-[#D2B997]/50 text-[#D2B997] font-depixel-small py-2 px-4 rounded-lg transition-colors"
                      >
                        Change QR Code
                      </button>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="bg-gradient-to-r from-[#E74C3C]/10 to-[#C0392B]/10 rounded-lg border border-[#D2B997]/20 p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-depixel-body">Registration Fee:</span>
                          <span className="text-[#F4D03F] font-futura tracking-wide text-3xl">₹{EVENT_CONFIG.fee}</span>
                        </div>
                        <p className="text-[#D2B997]/60 font-depixel-small text-xs mt-2">
                          Per team (any size from {EVENT_CONFIG.minTeamSize}-{EVENT_CONFIG.maxTeamSize} members)
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="utrNumber" className="text-[#D2B997] font-depixel-small">
                          UTR Number * (12 digits)
                        </Label>
                        <Input
                          id="utrNumber"
                          required
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]{12}"
                          maxLength={12}
                          value={utrNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 12)
                            setUtrNumber(value)
                          }}
                          className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                          placeholder="Enter 12-digit UTR"
                        />
                        <p className="text-white/60 font-depixel-small text-xs mt-1">
                          Found in your payment confirmation (exactly 12 digits)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Submit Button */}
            <FadeIn delay={0.5}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#E74C3C] to-[#C0392B] hover:from-[#CB4335] hover:to-[#A93226] text-white font-depixel-body py-6 text-lg disabled:opacity-50"
              >
                {isSubmitting ? "Registering Team..." : `Register for ${EVENT_CONFIG.name}`}
              </Button>
            </FadeIn>
          </form>
        </main>
      )}
    </div>
  )
}
