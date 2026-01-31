"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, Gamepad2, Trophy } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import { FadeIn } from "@/components/ui/fade-in"

const EVENT_CONFIG = {
  id: "headshot-fc",
  name: "Headshot - FC 25",
  subtitle: "EA Sports FC 25 Tournament",
  fee: 100,
  prizePool: 5000,
}

export default function HeadshotFCRegistrationPage() {
  const [selectedQR, setSelectedQR] = useState<number>(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [registrationId, setRegistrationId] = useState("")

  const [formData, setFormData] = useState({
    participant_name: "",
    participant_phone: "",
    participant_email: "",
    institution: "",
    gaming_id: "",
    utr_number: "",
  })

  useEffect(() => {
    setSelectedQR(Math.floor(Math.random() * 3) + 1)
  }, [])

  const cycleQR = () => {
    setSelectedQR(prev => prev === 3 ? 1 : prev + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    // Validate required fields
    if (!formData.participant_name.trim() || !formData.participant_email.trim() || 
        !formData.participant_phone.trim() || !formData.institution.trim() || !formData.gaming_id.trim()) {
      setErrorMessage("Please fill in all required fields")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.participant_email)) {
      setErrorMessage("Please enter a valid email address")
      return
    }

    // Validate phone number (10 digits)
    const phoneDigits = formData.participant_phone.replace(/\D/g, "")
    if (phoneDigits.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit phone number")
      return
    }

    if (!formData.utr_number.trim()) {
      setErrorMessage("Please enter your UTR/Transaction number after payment")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: EVENT_CONFIG.id,
          participant_name: formData.participant_name.trim(),
          participant_email: formData.participant_email.trim().toLowerCase(),
          participant_phone: phoneDigits,
          institution: formData.institution.trim(),
          gaming_id: formData.gaming_id.trim(),
          amount_paid: EVENT_CONFIG.fee,
          utr_number: formData.utr_number.trim(),
          payment_qr_used: selectedQR,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Registration failed")
      }

      setRegistrationId(result.registrationId)
      setIsSubmitted(true)
    } catch (error) {
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
          <Link href="/events" className="flex items-center space-x-2 text-[#D2B997] hover:text-[#B8A7D9] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-depixel-small">Back to Events</span>
          </Link>
          <Image src="/logo.png" alt="INQUIVESTA XII" width={60} height={60} className="h-10 w-auto" />
        </div>
      </header>

      {/* Success Screen */}
      {isSubmitted ? (
        <main className="container mx-auto px-4 py-20">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#00FF87] to-[#60EFFF] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-[#1A1A1A]" />
                </div>
                <HyperText
                  className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00FF87] to-[#60EFFF] bg-clip-text text-transparent font-futura tracking-wide"
                  text="REGISTERED!"
                />
                <p className="text-[#D2B997] text-lg font-depixel-body mb-8">
                  Your registration for {EVENT_CONFIG.name} has been confirmed
                </p>
              </div>

              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30 mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">Registration Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Registration ID:</span>
                      <span className="text-white font-mono text-sm">{registrationId}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Participant:</span>
                      <span className="text-white font-depixel-body">{formData.participant_name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Gaming ID:</span>
                      <span className="text-white font-depixel-body">{formData.gaming_id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Amount Paid:</span>
                      <span className="text-[#00FF87] font-futura tracking-wide text-xl">₹{EVENT_CONFIG.fee}</span>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-sm text-[#D2B997]/80 font-depixel-small space-y-2">
                    <p>✅ Confirmation email sent to {formData.participant_email}</p>
                    <p>📱 QR Code for entry included in the email</p>
                    <p>⚽ Get ready to score some goals!</p>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-xs text-[#D2B997]/70 font-depixel-small">
                    <p>💬 If you have any issues, reply to the confirmation email with <span className="text-[#D2B997]">inquivesta@iiserkol.ac.in</span> in CC.</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
                <Link href="/events" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-[#00FF87] to-[#60EFFF] hover:from-[#00E67A] hover:to-[#50DFE0] text-[#1A1A1A] font-depixel-body px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base">
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
        <main className="container mx-auto px-4 py-20">
          <FadeIn>
            <div className="text-center mb-12">
              <HyperText
                className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00FF87] to-[#60EFFF] bg-clip-text text-transparent font-futura tracking-wide"
                text="HEADSHOT - FC 25"
              />
              <p className="text-[#D2B997] text-lg font-depixel-body">
                {EVENT_CONFIG.subtitle}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                <div className="inline-flex items-center gap-2 bg-[#00FF87]/10 border border-[#00FF87]/30 px-4 py-2 rounded-full">
                  <Gamepad2 className="w-4 h-4 text-[#00FF87]" />
                  <span className="text-[#00FF87] font-depixel-small">Solo Tournament</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-[#60EFFF]/10 border border-[#60EFFF]/30 px-4 py-2 rounded-full">
                  <span className="text-[#60EFFF] font-depixel-small">₹{EVENT_CONFIG.fee} Entry</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-[#F4D03F]/10 border border-[#F4D03F]/30 px-4 py-2 rounded-full">
                  <Trophy className="w-4 h-4 text-[#F4D03F]" />
                  <span className="text-[#F4D03F] font-depixel-small">₹{EVENT_CONFIG.prizePool} Prize Pool</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {errorMessage && (
            <div className="max-w-4xl mx-auto mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg font-depixel-small">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            {/* Participant Details */}
            <FadeIn delay={0.2}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                    <Gamepad2 className="w-6 h-6 text-[#00FF87]" />
                    Participant Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="participant_name" className="text-[#D2B997] font-depixel-small">
                        Full Name *
                      </Label>
                      <Input
                        id="participant_name"
                        required
                        value={formData.participant_name}
                        onChange={(e) => setFormData({ ...formData, participant_name: e.target.value })}
                        className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="participant_phone" className="text-[#D2B997] font-depixel-small">
                        Contact Number *
                      </Label>
                      <Input
                        id="participant_phone"
                        type="tel"
                        required
                        value={formData.participant_phone}
                        onChange={(e) => setFormData({ ...formData, participant_phone: e.target.value })}
                        className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="participant_email" className="text-[#D2B997] font-depixel-small">
                      Email Address *
                    </Label>
                    <Input
                      id="participant_email"
                      type="email"
                      required
                      value={formData.participant_email}
                      onChange={(e) => setFormData({ ...formData, participant_email: e.target.value })}
                      className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="institution" className="text-[#D2B997] font-depixel-small">
                        Institution/College *
                      </Label>
                      <Input
                        id="institution"
                        required
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                        placeholder="Your institution or college"
                      />
                    </div>

                    <div>
                      <Label htmlFor="gaming_id" className="text-[#D2B997] font-depixel-small">
                        EA/PSN/Xbox Gamertag *
                      </Label>
                      <Input
                        id="gaming_id"
                        required
                        value={formData.gaming_id}
                        onChange={(e) => setFormData({ ...formData, gaming_id: e.target.value })}
                        className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                        placeholder="Your gaming ID"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Payment Section */}
            <FadeIn delay={0.3}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="bg-white p-4 rounded-lg max-w-xs mx-auto">
                        {selectedQR > 0 && (
                          <Image
                            src={`/payment_qr/qr_${selectedQR}.jpg`}
                            alt="Payment QR Code"
                            width={300}
                            height={300}
                            className="w-full h-auto"
                          />
                        )}
                      </div>
                      <p className="text-center text-[#D2B997]/80 font-depixel-small text-sm mt-4">
                        Scan QR code to pay <span className="text-[#F4D03F] font-bold">₹{EVENT_CONFIG.fee}</span>
                      </p>
                      <p className="text-center text-white/60 font-depixel-small text-xs mt-2">
                        QR Code #{selectedQR}/3
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
                      <div className="bg-gradient-to-r from-[#00FF87]/10 to-[#60EFFF]/10 rounded-lg border border-[#D2B997]/20 p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-depixel-body">Registration Fee:</span>
                          <span className="text-[#00FF87] font-futura tracking-wide text-3xl">₹{EVENT_CONFIG.fee}</span>
                        </div>
                        <p className="text-[#D2B997]/60 font-depixel-small text-xs mt-2">
                          Solo Entry
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="utr_number" className="text-[#D2B997] font-depixel-small">UTR Number * (12 digits)</Label>
                        <Input
                          id="utr_number"
                          required
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]{12}"
                          maxLength={12}
                          value={formData.utr_number}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 12)
                            setFormData({ ...formData, utr_number: value })
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
            <FadeIn delay={0.4}>
              <div className="bg-[#00FF87]/10 border border-[#00FF87]/30 p-4 rounded-lg mb-6">
                <p className="text-[#00FF87] font-depixel-small text-sm">
                  <span className="font-bold">Note:</span> Confirmation email with entry QR will be sent to your email. Check spam folder if not received.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#00FF87] to-[#60EFFF] hover:from-[#00E67A] hover:to-[#50DFE0] text-[#1A1A1A] font-depixel-body py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Registering...
                  </>
                ) : (
                  <>
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    Register Now - ₹{EVENT_CONFIG.fee}
                  </>
                )}
              </Button>
            </FadeIn>
          </form>
        </main>
      )}
    </div>
  )
}
