"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Target, Grid3X3, User, CheckCircle, AlertCircle } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import { FadeIn } from "@/components/ui/fade-in"

const EVENT_CONFIG = {
  id: "bullseye",
  name: "Bullseye",
  subEvents: [
    {
      id: "dartshot",
      name: "DartShot (Archery)",
      fee: 69,
      iiserkFee: 30,
      type: "individual" as const,
      description: "Precision-based archery challenge - test your aim!",
      Icon: Target
    },
    {
      id: "tic-tac-target",
      name: "Tic Tac Target",
      fee: 99,
      iiserkFee: 50,
      type: "individual" as const,
      description: "Strategic archery Tic-Tac-Toe on a giant 3×3 board",
      Icon: Grid3X3
    }
  ]
}

const isIISERKEmail = (email: string) => {
  return email.toLowerCase().endsWith("@iiserkol.ac.in")
}

interface SubEventSelection {
  id: string
  selected: boolean
}

const PAYMENT_QR_CODES = [
  "/payment_qr/QR1.jpg",
  "/payment_qr/QR2.jpg",
  "/payment_qr/QR3.jpg",
]

export default function BullseyeRegistrationPage() {
  const [selectedQR, setSelectedQR] = useState<number>(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [registrationId, setRegistrationId] = useState("")

  // Form fields
  const [participantName, setParticipantName] = useState("")
  const [participantEmail, setParticipantEmail] = useState("")
  const [participantPhone, setParticipantPhone] = useState("")
  const [institution, setInstitution] = useState("")
  const [utrNumber, setUtrNumber] = useState("")

  // Sub-event selections
  const [subEventSelections, setSubEventSelections] = useState<SubEventSelection[]>(
    EVENT_CONFIG.subEvents.map(se => ({
      id: se.id,
      selected: false
    }))
  )

  // Check if IISER K email
  const isIISERK = isIISERKEmail(participantEmail)

  // Calculate total fee with IISER K discount
  const totalFee = subEventSelections.reduce((total, selection) => {
    if (!selection.selected) return total
    const subEvent = EVENT_CONFIG.subEvents.find(se => se.id === selection.id)
    if (!subEvent) return total
    const fee = isIISERK ? subEvent.iiserkFee : subEvent.fee
    return total + fee
  }, 0)

  const hasSelection = subEventSelections.some(s => s.selected)
  const needsPayment = totalFee > 0

  useEffect(() => {
    setSelectedQR(Math.floor(Math.random() * PAYMENT_QR_CODES.length))
  }, [])

  const cycleQR = () => {
    setSelectedQR(prev => (prev + 1) % PAYMENT_QR_CODES.length)
  }

  const toggleSubEvent = (subEventId: string) => {
    setSubEventSelections(prev => prev.map(s => {
      if (s.id === subEventId) {
        return { ...s, selected: !s.selected }
      }
      return s
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    // Validate at least one selection
    if (!hasSelection) {
      setErrorMessage("Please select at least one event to register")
      return
    }

    // Validate required fields
    if (!participantName.trim() || !participantEmail.trim() || 
        !participantPhone.trim() || !institution.trim()) {
      setErrorMessage("Please fill in all required fields")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(participantEmail)) {
      setErrorMessage("Please enter a valid email address")
      return
    }

    // Validate phone number (10 digits)
    const phoneDigits = participantPhone.replace(/\D/g, "")
    if (phoneDigits.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit phone number")
      return
    }

    // Validate UTR if payment needed
    if (needsPayment) {
      if (!utrNumber || utrNumber.length !== 12) {
        setErrorMessage("Please enter a valid 12-digit UTR number")
        return
      }
    }

    setIsSubmitting(true)

    try {
      // Build sub_events array for submission
      const selectedSubEvents = subEventSelections
        .filter(s => s.selected)
        .map(s => {
          const subEvent = EVENT_CONFIG.subEvents.find(se => se.id === s.id)!
          const fee = isIISERK ? subEvent.iiserkFee : subEvent.fee
          return {
            id: s.id,
            name: subEvent.name,
            fee: fee,
          }
        })

      const response = await fetch("/api/events/register/multi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: EVENT_CONFIG.id,
          participant_name: participantName.trim(),
          participant_email: participantEmail.trim().toLowerCase(),
          participant_phone: phoneDigits,
          institution: institution.trim(),
          sub_events: selectedSubEvents,
          total_amount: totalFee,
          amount_paid: totalFee,
          utr_number: needsPayment ? utrNumber : null,
          payment_qr_used: needsPayment ? selectedQR + 1 : null,
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

  const getSelectedEventsNames = () => {
    return subEventSelections
      .filter(s => s.selected)
      .map(s => EVENT_CONFIG.subEvents.find(se => se.id === s.id)?.name)
      .join(", ")
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#D2B997]/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/events"
            className="flex items-center space-x-2 text-[#D2B997] hover:text-[#F8C471] transition-colors"
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
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#F8C471] to-[#F4D03F] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-[#1A1A1A]" />
                </div>
                <HyperText
                  className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#F8C471] to-[#F4D03F] bg-clip-text text-transparent font-futura tracking-wide"
                  text="REGISTERED!"
                />
                <p className="text-[#D2B997] text-lg font-depixel-body mb-8">
                  Your registration for {EVENT_CONFIG.name} has been confirmed
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
                      <span className="text-[#D2B997]/80 font-depixel-small">Participant:</span>
                      <span className="text-white font-depixel-body">{participantName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Events:</span>
                      <span className="text-white font-depixel-body text-right max-w-[200px]">{getSelectedEventsNames()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Total Paid:</span>
                      <span className="text-[#F8C471] font-futura tracking-wide text-xl">
                        {totalFee === 0 ? "FREE" : `₹${totalFee}`}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-sm text-[#D2B997]/80 font-depixel-small space-y-2">
                    <p>✅ Confirmation email sent to {participantEmail}</p>
                    <p>📱 QR Code for entry included in the email</p>
                    <p>🎯 Get ready to hit the bullseye!</p>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-xs text-[#D2B997]/70 font-depixel-small">
                    <p>💬 If you have any issues, reply to the confirmation email with <span className="text-[#D2B997]">inquivesta@iiserkol.ac.in</span> in CC.</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
                <Link href="/events" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-[#F8C471] to-[#F4D03F] hover:from-[#D4A85A] hover:to-[#D4C430] text-[#1A1A1A] font-depixel-body px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base">
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
                <Target className="w-10 h-10 text-[#F8C471]" />
              </div>
              <HyperText
                className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#F8C471] to-[#F4D03F] bg-clip-text text-transparent font-futura tracking-wide"
                text="BULLSEYE"
              />
              <p className="text-[#D2B997] text-lg font-depixel-body">
                Archery Competition
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
            {/* Participant Details - First so we can detect IISER K email */}
            <FadeIn delay={0.1}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                    <User className="w-6 h-6 text-[#F8C471]" />
                    Your Details
                  </CardTitle>
                  <p className="text-[#D2B997]/70 text-sm font-depixel-small">
                    IISER Kolkata students get discounted pricing - use your @iiserkol.ac.in email!
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="participantName" className="text-[#D2B997] font-depixel-small">
                        Full Name *
                      </Label>
                      <Input
                        id="participantName"
                        required
                        value={participantName}
                        onChange={(e) => setParticipantName(e.target.value)}
                        className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="participantEmail" className="text-[#D2B997] font-depixel-small">
                        Email Address *
                      </Label>
                      <Input
                        id="participantEmail"
                        type="email"
                        required
                        value={participantEmail}
                        onChange={(e) => setParticipantEmail(e.target.value)}
                        className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                        placeholder="your@email.com"
                      />
                      {isIISERK && (
                        <p className="text-green-400 text-xs mt-1 font-depixel-small">
                          ✓ IISER Kolkata email detected - Discounted pricing applied!
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="participantPhone" className="text-[#D2B997] font-depixel-small">
                        WhatsApp Number *
                      </Label>
                      <Input
                        id="participantPhone"
                        type="tel"
                        required
                        value={participantPhone}
                        onChange={(e) => setParticipantPhone(e.target.value)}
                        className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                        placeholder="10-digit number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="institution" className="text-[#D2B997] font-depixel-small">
                        School / College *
                      </Label>
                      <Input
                        id="institution"
                        required
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                        placeholder="Name of institution"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Sub-Event Selection */}
            <FadeIn delay={0.2}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">
                    Select Events
                  </CardTitle>
                  <p className="text-[#D2B997]/70 text-sm font-depixel-small">
                    Choose one or more events to participate in
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {EVENT_CONFIG.subEvents.map((subEvent) => {
                    const selection = subEventSelections.find(s => s.id === subEvent.id)!
                    const Icon = subEvent.Icon

                    return (
                      <div
                        key={subEvent.id}
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          selection.selected
                            ? "border-[#F8C471] bg-[#F8C471]/10"
                            : "border-[#D2B997]/30 hover:border-[#D2B997]/50"
                        }`}
                        onClick={() => toggleSubEvent(subEvent.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div 
                            className={`mt-1 h-4 w-4 shrink-0 rounded-sm border ${
                              selection.selected 
                                ? "bg-[#F8C471] border-[#F8C471]" 
                                : "border-[#D2B997]"
                            } flex items-center justify-center`}
                          >
                            {selection.selected && (
                              <svg className="h-3 w-3 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 cursor-pointer">
                              <Icon className="w-5 h-5 text-[#F8C471]" />
                              <span className="text-white font-depixel-body text-lg">
                                {subEvent.name}
                              </span>
                              <span className="ml-auto text-lg font-futura text-[#F8C471]">
                                {isIISERK ? `₹${subEvent.iiserkFee}` : `₹${subEvent.fee}`}
                                {!isIISERK && (
                                  <span className="text-xs text-[#D2B997]/60 ml-1">
                                    (IISERK: ₹{subEvent.iiserkFee})
                                  </span>
                                )}
                              </span>
                            </div>
                            <p className="text-[#D2B997]/70 text-sm font-depixel-small mt-1 ml-7">
                              {subEvent.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </FadeIn>

            {/* Payment Section - Only show if there's a fee */}
            {hasSelection && needsPayment && (
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
                          Scan QR code to pay <span className="text-[#F4D03F] font-bold">₹{totalFee}</span>
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
                        {/* Fee Summary */}
                        <div className="bg-gradient-to-r from-[#F8C471]/10 to-[#F4D03F]/10 rounded-lg border border-[#D2B997]/20 p-4 space-y-2">
                          <p className="text-[#D2B997] font-depixel-small text-sm">Selected Events:</p>
                          {subEventSelections.filter(s => s.selected).map(s => {
                            const subEvent = EVENT_CONFIG.subEvents.find(se => se.id === s.id)!
                            const fee = isIISERK ? subEvent.iiserkFee : subEvent.fee
                            return (
                              <div key={s.id} className="flex justify-between text-sm">
                                <span className="text-white">{subEvent.name}</span>
                                <span className="text-[#F4D03F]">₹{fee}</span>
                              </div>
                            )
                          })}
                          <div className="border-t border-[#D2B997]/30 pt-2 mt-2 flex justify-between items-center">
                            <span className="text-white font-depixel-body">Total:</span>
                            <span className="text-[#F4D03F] font-futura tracking-wide text-3xl">₹{totalFee}</span>
                          </div>
                          {!isIISERK && (
                            <p className="text-[#D2B997]/60 font-depixel-small text-xs">
                              IISER Kolkata students get discounted rates!
                            </p>
                          )}
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
            )}

            {/* Submit Button */}
            <FadeIn delay={0.4}>
              <Button
                type="submit"
                disabled={isSubmitting || !hasSelection}
                className="w-full bg-gradient-to-r from-[#F8C471] to-[#F4D03F] hover:from-[#D4A85A] hover:to-[#D4C430] text-[#1A1A1A] font-depixel-body py-6 text-lg disabled:opacity-50"
              >
                {isSubmitting ? "Registering..." : `Register for ${EVENT_CONFIG.name}`}
              </Button>
            </FadeIn>
          </form>
        </main>
      )}
    </div>
  )
}
