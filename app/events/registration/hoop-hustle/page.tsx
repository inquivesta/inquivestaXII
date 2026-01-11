"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, User, CheckCircle, AlertCircle } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import { FadeIn } from "@/components/ui/fade-in"

const EVENT_CONFIG = {
  id: "hoop-hustle",
  name: "Hoop Hustle",
  subtitle: "3v3 Basketball Tournament",
  fee: 200,
  iiserkFee: 100,
  teamSize: 4, // 3 + 1 substitute
}

const isIISERKEmail = (email: string) => {
  return email.toLowerCase().endsWith("@iiserkol.ac.in")
}

interface TeamMember {
  name: string
  phone: string
}

const PAYMENT_QR_CODES = [
  "/payment_qr/QR1.jpg",
  "/payment_qr/QR2.jpg",
  "/payment_qr/QR3.jpg",
]

export default function HoopHustleRegistrationPage() {
  const [selectedQR, setSelectedQR] = useState<number>(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [registrationId, setRegistrationId] = useState("")

  // Form fields
  const [teamName, setTeamName] = useState("")
  const [teamLeaderName, setTeamLeaderName] = useState("")
  const [teamLeaderEmail, setTeamLeaderEmail] = useState("")
  const [teamLeaderPhone, setTeamLeaderPhone] = useState("")
  const [utrNumber, setUtrNumber] = useState("")

  // Team members (3 additional: Player 2, Player 3, and Substitute)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: "", phone: "" }, // Player 2
    { name: "", phone: "" }, // Player 3
    { name: "", phone: "" }, // Substitute (Player 4)
  ])

  // Check if IISER K email for automatic discount
  const isIISERKTeam = isIISERKEmail(teamLeaderEmail)
  const currentFee = isIISERKTeam ? EVENT_CONFIG.iiserkFee : EVENT_CONFIG.fee

  useEffect(() => {
    setSelectedQR(Math.floor(Math.random() * PAYMENT_QR_CODES.length))
  }, [])

  const cycleQR = () => {
    setSelectedQR(prev => (prev + 1) % PAYMENT_QR_CODES.length)
  }

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...teamMembers]
    updated[index][field] = value
    setTeamMembers(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    // Validate required fields
    if (!teamName.trim() || !teamLeaderName.trim() || !teamLeaderEmail.trim() || 
        !teamLeaderPhone.trim()) {
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
      setErrorMessage("Please enter a valid 10-digit phone number for team captain")
      return
    }

    // Validate team members - Player 2 and Player 3 are required, Substitute is optional
    if (!teamMembers[0].name.trim() || !teamMembers[0].phone.trim()) {
      setErrorMessage("Please fill in Player 2 details (name and phone)")
      return
    }
    if (!teamMembers[1].name.trim() || !teamMembers[1].phone.trim()) {
      setErrorMessage("Please fill in Player 3 details (name and phone)")
      return
    }

    // Validate member phone numbers
    for (let i = 0; i < teamMembers.length; i++) {
      const member = teamMembers[i]
      if (member.name.trim() && member.phone.trim()) {
        const memberPhone = member.phone.replace(/\D/g, "")
        if (memberPhone.length !== 10) {
          const playerLabel = i === 2 ? "Substitute" : `Player ${i + 2}`
          setErrorMessage(`Please enter a valid 10-digit phone number for ${playerLabel}`)
          return
        }
      }
    }

    // Validate UTR
    if (!utrNumber || utrNumber.length !== 12) {
      setErrorMessage("Please enter a valid 12-digit UTR number")
      return
    }

    setIsSubmitting(true)

    try {
      // Build team members array with cleaned phone numbers
      const validMembers = teamMembers
        .map((m, idx) => ({
          name: m.name.trim(),
          phone: m.phone.replace(/\D/g, ""),
          role: idx === 2 ? "Substitute" : `Player ${idx + 2}`
        }))
        .filter(m => m.name && m.phone)

      const response = await fetch("/api/events/register/hoop-hustle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: EVENT_CONFIG.id,
          team_name: teamName.trim(),
          team_leader_name: teamLeaderName.trim(),
          team_leader_email: teamLeaderEmail.trim().toLowerCase(),
          team_leader_phone: phoneDigits,
          team_members: validMembers,
          team_size: validMembers.length + 1, // +1 for team leader
          is_iiserk_team: isIISERKTeam,
          total_amount: currentFee,
          amount_paid: currentFee,
          utr_number: utrNumber,
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
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <HyperText
                  className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#F97316] to-[#EA580C] bg-clip-text text-transparent font-futura tracking-wide"
                  text="REGISTERED!"
                />
                <p className="text-[#D2B997] text-lg font-depixel-body mb-8">
                  Your team registration for {EVENT_CONFIG.name} has been confirmed!
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
                      <span className="text-[#D2B997]/80 font-depixel-small">Team Name:</span>
                      <span className="text-white font-depixel-body">{teamName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Captain:</span>
                      <span className="text-white font-depixel-body">{teamLeaderName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Team Type:</span>
                      <span className="text-white font-depixel-body">{isIISERKTeam ? "IISER Kolkata" : "Outside"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Amount Paid:</span>
                      <span className="text-[#F97316] font-futura tracking-wide text-xl">₹{currentFee}</span>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-sm text-[#D2B997]/80 font-depixel-small space-y-2">
                    <p>✅ Confirmation email sent to {teamLeaderEmail}</p>
                    <p>📱 QR Code for entry included in the email</p>
                    <p>🏀 Get ready to hoop!</p>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-xs text-[#D2B997]/70 font-depixel-small">
                    <p>💬 If you have any issues, reply to the confirmation email with <span className="text-[#D2B997]">inquivesta@iiserkol.ac.in</span> in CC.</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
                <Link href="/events" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white font-depixel-body px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base">
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
              <HyperText
                className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#F97316] to-[#EA580C] bg-clip-text text-transparent font-futura tracking-wide"
                text="HOOP HUSTLE"
              />
              <p className="text-[#D2B997] text-lg font-depixel-body">
                {EVENT_CONFIG.subtitle}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/30 px-4 py-2 rounded-full">
                  <span className="text-[#F97316] font-depixel-small">Outside Teams: ₹200/team</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-[#A8D8EA]/10 border border-[#A8D8EA]/30 px-4 py-2 rounded-full">
                  <span className="text-[#A8D8EA] font-depixel-small">IISER Kolkata: ₹100/team</span>
                </div>
              </div>
              <p className="text-[#D2B997]/60 text-sm font-depixel-small mt-4">
                Team of 4 players (3 players + 1 substitute)
              </p>
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
            {/* Team Details */}
            <FadeIn delay={0.1}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                    <Users className="w-6 h-6 text-[#F97316]" />
                    Team Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="teamName" className="text-[#D2B997] font-depixel-small">
                      Team Name *
                    </Label>
                    <Input
                      id="teamName"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                      placeholder="Enter your team name"
                    />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Team Captain Details */}
            <FadeIn delay={0.2}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                    <User className="w-6 h-6 text-[#F97316]" />
                    Player 1 / Team Captain
                  </CardTitle>
                  <p className="text-[#D2B997]/70 text-sm font-depixel-small">
                    IISER Kolkata teams get 50% off - use your @iiserkol.ac.in email!
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="teamLeaderName" className="text-[#D2B997] font-depixel-small">
                        Captain Name *
                      </Label>
                      <Input
                        id="teamLeaderName"
                        required
                        value={teamLeaderName}
                        onChange={(e) => setTeamLeaderName(e.target.value)}
                        className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                        placeholder="Captain's full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="teamLeaderEmail" className="text-[#D2B997] font-depixel-small">
                        Captain Email *
                      </Label>
                      <Input
                        id="teamLeaderEmail"
                        type="email"
                        required
                        value={teamLeaderEmail}
                        onChange={(e) => setTeamLeaderEmail(e.target.value)}
                        className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                        placeholder="captain@email.com"
                      />
                      {isIISERKTeam && (
                        <p className="text-green-400 text-xs mt-1 font-depixel-small">
                          ✓ IISER Kolkata email detected - 50% discount applied!
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="teamLeaderPhone" className="text-[#D2B997] font-depixel-small">
                        Captain Phone *
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

            {/* Team Members */}
            <FadeIn delay={0.3}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">
                    Other Players
                  </CardTitle>
                  <p className="text-[#D2B997]/70 text-sm font-depixel-small">
                    Add Player 2, Player 3, and optionally a Substitute (Player 4)
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="p-4 bg-[#1A1A1A]/30 rounded-lg space-y-3">
                      <p className="text-[#D2B997] font-depixel-small">
                        {index === 2 ? (
                          <span>
                            Substitute (Optional)
                            <span className="text-[#D2B997]/50 ml-2 text-xs">- Only plays if a main player can&apos;t</span>
                          </span>
                        ) : (
                          <span>
                            Player {index + 2} *
                          </span>
                        )}
                      </p>
                      <div className="grid md:grid-cols-2 gap-3">
                        <Input
                          placeholder="Name"
                          value={member.name}
                          onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                          className="bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white"
                          required={index !== 2}
                        />
                        <Input
                          placeholder="Phone (10 digits)"
                          value={member.phone}
                          onChange={(e) => updateTeamMember(index, "phone", e.target.value)}
                          className="bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white"
                          required={index !== 2}
                        />
                      </div>
                    </div>
                  ))}
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
                        Scan QR code to pay <span className="text-[#F97316] font-bold">₹{currentFee}</span>
                        {isIISERKTeam && (
                          <span className="block text-xs text-green-400 mt-1">IISER Kolkata discount applied!</span>
                        )}
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
                      <div className="bg-gradient-to-r from-[#F97316]/10 to-[#EA580C]/10 rounded-lg border border-[#D2B997]/20 p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-depixel-body">Registration Fee:</span>
                          <span className="text-[#F97316] font-futura tracking-wide text-3xl">₹{currentFee}</span>
                        </div>
                        <p className="text-[#D2B997]/60 font-depixel-small text-xs mt-2">
                          {isIISERKTeam 
                            ? "IISER Kolkata team discount applied!" 
                            : `Per team • IISERK teams: ₹${EVENT_CONFIG.iiserkFee}`}
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
                          onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, "").slice(0, 12))}
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
                className="w-full bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white font-depixel-body py-6 text-lg disabled:opacity-50"
              >
                {isSubmitting ? "Registering Team..." : `Register Team for ${EVENT_CONFIG.name}`}
              </Button>
            </FadeIn>
          </form>
        </main>
      )}
    </div>
  )
}
