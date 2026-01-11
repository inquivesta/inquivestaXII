"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Users, CheckCircle, AlertCircle, User } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import { FadeIn } from "@/components/ui/fade-in"

const EVENT_CONFIG = {
  id: "table-tennis-doubles",
  name: "Table Tennis Doubles",
  subtitle: "Men's Doubles & Mixed Doubles",
  fee: 200,
  iiserkFee: 60,
}

const isIISERKEmail = (email: string) => {
  return email.toLowerCase().endsWith("@iiserkol.ac.in")
}

const PAYMENT_QR_CODES = [
  "/payment_qr/QR1.jpg",
  "/payment_qr/QR2.jpg",
  "/payment_qr/QR3.jpg",
]

export default function TableTennisDoublesRegistrationPage() {
  const [selectedQR, setSelectedQR] = useState<number>(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [registrationId, setRegistrationId] = useState("")

  // Form fields - Team Leader
  const [teamLeaderName, setTeamLeaderName] = useState("")
  const [teamLeaderEmail, setTeamLeaderEmail] = useState("")
  const [teamLeaderPhone, setTeamLeaderPhone] = useState("")
  const [institution, setInstitution] = useState("")
  const [category, setCategory] = useState("")
  const [teamName, setTeamName] = useState("")

  // Partner details
  const [partnerName, setPartnerName] = useState("")
  const [partnerEmail, setPartnerEmail] = useState("")
  const [partnerPhone, setPartnerPhone] = useState("")

  const [utrNumber, setUtrNumber] = useState("")

  // Check if IISER K email for automatic discount
  const isIISERK = isIISERKEmail(teamLeaderEmail)
  const currentFee = isIISERK ? EVENT_CONFIG.iiserkFee : EVENT_CONFIG.fee

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
        !institution.trim() || !category || !teamName.trim() ||
        !partnerName.trim() || !partnerEmail.trim() || !partnerPhone.trim()) {
      setErrorMessage("Please fill in all required fields")
      return
    }

    // Validate email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(teamLeaderEmail)) {
      setErrorMessage("Please enter a valid email address for Team Leader")
      return
    }
    if (!emailRegex.test(partnerEmail)) {
      setErrorMessage("Please enter a valid email address for Partner")
      return
    }

    // Validate phone numbers (10 digits)
    const leaderPhoneDigits = teamLeaderPhone.replace(/\D/g, "")
    const partnerPhoneDigits = partnerPhone.replace(/\D/g, "")
    
    if (leaderPhoneDigits.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit phone number for Team Leader")
      return
    }
    if (partnerPhoneDigits.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit phone number for Partner")
      return
    }

    // Validate UTR
    if (!utrNumber || utrNumber.length !== 12) {
      setErrorMessage("Please enter a valid 12-digit UTR number")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/events/register/table-tennis-doubles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: EVENT_CONFIG.id,
          team_name: teamName.trim(),
          team_leader_name: teamLeaderName.trim(),
          team_leader_email: teamLeaderEmail.trim().toLowerCase(),
          team_leader_phone: leaderPhoneDigits,
          institution: institution.trim(),
          category,
          partner: {
            name: partnerName.trim(),
            email: partnerEmail.trim().toLowerCase(),
            phone: partnerPhoneDigits,
          },
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

  const getCategoryLabel = () => {
    if (category === "mens") return "Men's Doubles"
    if (category === "mixed") return "Mixed Doubles"
    return ""
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#D2B997]/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/events/registration/table-tennis"
            className="flex items-center space-x-2 text-[#D2B997] hover:text-[#3B82F6] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-depixel-small">Back to Table Tennis</span>
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
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <HyperText
                  className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] bg-clip-text text-transparent font-futura tracking-wide"
                  text="REGISTERED!"
                />
                <p className="text-[#D2B997] text-lg font-depixel-body mb-8">
                  Your team is registered for {EVENT_CONFIG.name}!
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
                      <span className="text-[#D2B997]/80 font-depixel-small">Category:</span>
                      <span className="text-[#3B82F6] font-depixel-body">{getCategoryLabel()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Amount Paid:</span>
                      <span className="text-[#3B82F6] font-futura tracking-wide text-xl">₹{currentFee}</span>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-sm text-[#D2B997]/80 font-depixel-small space-y-2">
                    <p>✅ Confirmation email sent to {teamLeaderEmail}</p>
                    <p>📱 QR Code for entry included in the email</p>
                    <p>🏓 Report at 9:00 AM sharp with your partner!</p>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-xs text-[#D2B997]/70 font-depixel-small">
                    <p>💬 If you have any issues, reply to the confirmation email with <span className="text-[#D2B997]">inquivesta@iiserkol.ac.in</span> in CC.</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
                <Link href="/events" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white font-depixel-body px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base">
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
                className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] bg-clip-text text-transparent font-futura tracking-wide"
                text="TT DOUBLES"
              />
              <p className="text-[#D2B997] text-lg font-depixel-body">
                {EVENT_CONFIG.subtitle}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <div className="inline-flex items-center gap-2 bg-[#3B82F6]/10 border border-[#3B82F6]/30 px-4 py-2 rounded-full">
                  <span className="text-[#3B82F6] font-depixel-small">External: ₹200</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-[#A8D8EA]/10 border border-[#A8D8EA]/30 px-4 py-2 rounded-full">
                  <span className="text-[#A8D8EA] font-depixel-small">IISER Kolkata: ₹60</span>
                </div>
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
            {/* Team Details */}
            <FadeIn delay={0.1}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                    <Users className="w-6 h-6 text-[#3B82F6]" />
                    Team Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
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
                        placeholder="Your team name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="institution" className="text-[#D2B997] font-depixel-small">
                        Institution *
                      </Label>
                      <Input
                        id="institution"
                        required
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                        placeholder="Your college/school name"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Team Leader Details */}
            <FadeIn delay={0.15}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                    <User className="w-6 h-6 text-[#3B82F6]" />
                    Player 1 (Team Leader)
                  </CardTitle>
                  <p className="text-[#D2B997]/70 text-sm font-depixel-small">
                    IISER Kolkata students get discounted pricing - use your @iiserkol.ac.in email!
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="teamLeaderName" className="text-[#D2B997] font-depixel-small">
                        Full Name *
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
                        Email Address *
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
                      {isIISERK && (
                        <p className="text-green-400 text-xs mt-1 font-depixel-small">
                          ✓ IISER Kolkata email detected - 70% discount applied!
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-1">
                      <Label htmlFor="teamLeaderPhone" className="text-[#D2B997] font-depixel-small">
                        WhatsApp Number *
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

            {/* Partner Details */}
            <FadeIn delay={0.2}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                    <User className="w-6 h-6 text-[#3B82F6]" />
                    Player 2 (Partner)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="partnerName" className="text-[#D2B997] font-depixel-small">
                        Full Name *
                      </Label>
                      <Input
                        id="partnerName"
                        required
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                        placeholder="Partner's full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="partnerEmail" className="text-[#D2B997] font-depixel-small">
                        Email Address *
                      </Label>
                      <Input
                        id="partnerEmail"
                        type="email"
                        required
                        value={partnerEmail}
                        onChange={(e) => setPartnerEmail(e.target.value)}
                        className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                        placeholder="partner@email.com"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <Label htmlFor="partnerPhone" className="text-[#D2B997] font-depixel-small">
                        WhatsApp Number *
                      </Label>
                      <Input
                        id="partnerPhone"
                        type="tel"
                        required
                        value={partnerPhone}
                        onChange={(e) => setPartnerPhone(e.target.value)}
                        className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                        placeholder="10-digit number"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Category Selection */}
            <FadeIn delay={0.25}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">
                    Select Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="category" className="text-[#D2B997] font-depixel-small">
                      Category *
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white">
                        <SelectValue placeholder="Select your category" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#2A2A2A] border-[#D2B997]/30">
                        <SelectItem value="mens">Men&apos;s Doubles</SelectItem>
                        <SelectItem value="mixed">Mixed Doubles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Payment Section */}
            <FadeIn delay={0.3}>
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
                        Scan QR code to pay <span className="text-[#3B82F6] font-bold">₹{currentFee}</span>
                        {isIISERK && (
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
                      <div className="bg-gradient-to-r from-[#3B82F6]/10 to-[#2563EB]/10 rounded-lg border border-[#D2B997]/20 p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-depixel-body">Team Registration Fee:</span>
                          <span className="text-[#3B82F6] font-futura tracking-wide text-3xl">₹{currentFee}</span>
                        </div>
                        <p className="text-[#D2B997]/60 font-depixel-small text-xs mt-2">
                          {isIISERK 
                            ? "IISER Kolkata discount applied!" 
                            : `IISERK teams: ₹${EVENT_CONFIG.iiserkFee}`}
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
            <FadeIn delay={0.35}>
              <Button
                type="submit"
                disabled={isSubmitting || !category}
                className="w-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white font-depixel-body py-6 text-lg disabled:opacity-50"
              >
                {isSubmitting ? "Registering..." : `Register Team`}
              </Button>
            </FadeIn>
          </form>
        </main>
      )}
    </div>
  )
}
