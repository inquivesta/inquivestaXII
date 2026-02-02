"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, Ticket, Calendar, Music, PartyPopper, Users } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import { FadeIn } from "@/components/ui/fade-in"

const EVENT_CONFIG = {
  id: "day-passes",
  name: "Day Passes",
  subtitle: "INQUIVESTA XII – Day Pass Registration (6th–8th February 2026)",
}

// Day pass types
const DAY_PASS_TYPES = [
  {
    id: "day2",
    name: "Day 2 Pass",
    date: "7th February 2026",
    highlight: "🎤 7th Feb Live Performance",
    description: "Access to all cultural events and pro-night on Day 2",
  },
  {
    id: "day3",
    name: "Day 3 Pass",
    date: "8th February 2026",
    highlight: "🎧 DJ Night + Live Band",
    description: "Access to all cultural events and closing night celebrations",
  },
  {
    id: "all-days",
    name: "Full Festival Pass",
    date: "6th, 7th & 8th February 2026",
    highlight: "🎉 Complete INQUIVESTA XII Experience",
    description: "Access to all 3 days of events, performances, and pro-nights",
    recommended: true,
  },
]

// Quantity options with pricing
const QUANTITY_OPTIONS = [
  { id: "single", label: "Single", admits: 1, description: "Admits 1 person" },
  { id: "couple", label: "Couple", admits: 2, description: "Admits 2 people" },
  { id: "bulk5", label: "Group of 5", admits: 5, description: "Admits 5 people" },
  { id: "bulk10", label: "Group of 10", admits: 10, description: "Admits 10 people", bestValue: true },
]

// Pricing matrix: passType -> quantity -> price
const PRICING: Record<string, Record<string, number>> = {
  "day2": { single: 299, couple: 590, bulk5: 1425, bulk10: 2699 },
  "day3": { single: 299, couple: 590, bulk5: 1425, bulk10: 2699 },
  "all-days": { single: 499, couple: 990, bulk5: 2250, bulk10: 4499 },
}

export default function DayPassesRegistrationPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [registrationId, setRegistrationId] = useState("")
  const [selectedQR, setSelectedQR] = useState<number>(0)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    institution: "",
    utr_number: "",
  })

  const [selectedPassType, setSelectedPassType] = useState<string>("")
  const [selectedQuantity, setSelectedQuantity] = useState<string>("single")

  useEffect(() => {
    setSelectedQR(Math.floor(Math.random() * 5) + 1)
  }, [])

  const cycleQR = () => {
    setSelectedQR(prev => prev === 5 ? 1 : prev + 1)
  }

  const getSelectedPassDetails = () => {
    return DAY_PASS_TYPES.find(p => p.id === selectedPassType)
  }

  const getSelectedQuantityDetails = () => {
    return QUANTITY_OPTIONS.find(q => q.id === selectedQuantity)
  }

  const getPrice = () => {
    if (!selectedPassType || !selectedQuantity) return 0
    return PRICING[selectedPassType]?.[selectedQuantity] || 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    // Validate pass selection
    if (!selectedPassType) {
      setErrorMessage("Please select a day pass option")
      return
    }

    if (!selectedQuantity) {
      setErrorMessage("Please select a quantity")
      return
    }

    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || 
        !formData.phone.trim() || !formData.institution.trim()) {
      setErrorMessage("Please fill in all required fields")
      return
    }

    // Validate UTR number
    if (!formData.utr_number.trim()) {
      setErrorMessage("Please enter your UTR/Transaction number after payment")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address")
      return
    }

    // Validate phone number (10 digits)
    const phoneDigits = formData.phone.replace(/\D/g, "")
    if (phoneDigits.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit phone number")
      return
    }

    const passDetails = getSelectedPassDetails()
    const quantityDetails = getSelectedQuantityDetails()
    const price = getPrice()

    if (!passDetails || !quantityDetails) {
      setErrorMessage("Invalid pass selection")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: EVENT_CONFIG.id,
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: phoneDigits,
          institution: formData.institution.trim(),
          pass_type: selectedPassType,
          pass_name: passDetails.name,
          pass_date: passDetails.date,
          quantity_type: selectedQuantity,
          admits: quantityDetails.admits,
          amount_paid: price,
          total_amount: price,
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
      console.error("Registration error:", error)
      setErrorMessage(error instanceof Error ? error.message : "Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const passDetails = getSelectedPassDetails()
  const quantityDetails = getSelectedQuantityDetails()
  const price = getPrice()

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
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#F4D03F] to-[#F8C471] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-[#1A1A1A]" />
                </div>
                <HyperText
                  className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#F4D03F] to-[#F8C471] bg-clip-text text-transparent font-futura tracking-wide"
                  text="REGISTERED!"
                />
                <p className="text-[#D2B997] text-lg font-depixel-body mb-8">
                  Your Day Pass registration for INQUIVESTA XII has been confirmed
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
                      <span className="text-[#D2B997]/80 font-depixel-small">Name:</span>
                      <span className="text-white font-depixel-body">{formData.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Institution:</span>
                      <span className="text-white font-depixel-body">{formData.institution}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Pass Type:</span>
                      <span className="text-[#F4D03F] font-depixel-body">{passDetails?.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Valid For:</span>
                      <span className="text-white font-depixel-body">{passDetails?.date}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Admits:</span>
                      <span className="text-[#A8D8EA] font-depixel-body">{quantityDetails?.admits} {quantityDetails?.admits === 1 ? 'person' : 'people'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Amount Paid:</span>
                      <span className="text-[#A8D8EA] font-futura tracking-wide text-xl">₹{price}</span>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-sm text-[#D2B997]/80 font-depixel-small space-y-2">
                    <p>✅ Confirmation email sent to {formData.email}</p>
                    <p>📱 QR Code for entry included in the email</p>
                    <p>🎟️ This pass admits <strong className="text-[#F4D03F]">{quantityDetails?.admits} {quantityDetails?.admits === 1 ? 'person' : 'people'}</strong></p>
                    <p>🎉 See you at INQUIVESTA XII!</p>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-xs text-[#D2B997]/70 font-depixel-small">
                    <p>💬 If you have any issues, reply to the confirmation email with <span className="text-[#D2B997]">inquivesta@iiserkol.ac.in</span> in CC.</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
                <Link href="/events" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-[#F4D03F] to-[#F8C471] hover:from-[#e6c030] hover:to-[#e5b560] text-[#1A1A1A] font-depixel-body px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base">
                    Explore Events
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
                className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#F4D03F] to-[#F8C471] bg-clip-text text-transparent font-futura tracking-wide"
                text="DAY PASSES"
              />
              <p className="text-[#D2B997] text-lg font-depixel-body max-w-2xl mx-auto">
                {EVENT_CONFIG.subtitle}
              </p>
            </div>
          </FadeIn>

          {/* Event Info Banner */}
          <FadeIn delay={0.1}>
            <Card className="bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] border-[#F4D03F] mb-8 max-w-4xl mx-auto">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl text-[#F4D03F] font-futura tracking-wide mb-2">
                    INQUIVESTA XII – IISER Kolkata&apos;s Annual Cultural Fest
                  </h3>
                  <p className="text-[#D2B997]/80 font-depixel-small text-sm">
                    Three days of music, performances, competitions, and unforgettable vibes!
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg border border-[#B8A7D9]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Music className="w-5 h-5 text-[#B8A7D9]" />
                      <span className="text-[#B8A7D9] font-depixel-small">7th February</span>
                    </div>
                    <p className="text-white font-depixel-body">🎤 Monali Thakur Live</p>
                    <p className="text-[#D2B997]/60 text-xs font-depixel-small">Soulful melodies & high energy performance</p>
                  </div>
                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg border border-[#A8D8EA]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <PartyPopper className="w-5 h-5 text-[#A8D8EA]" />
                      <span className="text-[#A8D8EA] font-depixel-small">8th February</span>
                    </div>
                    <p className="text-white font-depixel-body">🎧 DJ Night + Live Band</p>
                    <p className="text-[#D2B997]/60 text-xs font-depixel-small">Grand finale celebrations</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 text-sm text-[#D2B997]/70 font-depixel-small">
                  <span>📍 IISER Kolkata</span>
                  <span>•</span>
                  <span>📅 6–8 February 2026</span>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {errorMessage && (
            <div className="max-w-4xl mx-auto mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg font-depixel-small">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            {/* Day Pass Selection */}
            <FadeIn delay={0.2}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                    <Ticket className="w-6 h-6 text-[#F4D03F]" />
                    Select Your Pass Type *
                  </CardTitle>
                  <p className="text-[#D2B997]/60 font-depixel-small text-sm">
                    Choose the day(s) you want to attend
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {DAY_PASS_TYPES.map((pass) => (
                    <div
                      key={pass.id}
                      onClick={() => setSelectedPassType(pass.id)}
                      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPassType === pass.id
                          ? "border-[#F4D03F] bg-[#F4D03F]/10"
                          : "border-[#D2B997]/30 bg-[#1A1A1A]/50 hover:border-[#D2B997]/50"
                      } ${pass.recommended ? "ring-2 ring-[#F4D03F]/30" : ""}`}
                    >
                      {pass.recommended && (
                        <div className="absolute -top-3 left-4 bg-[#F4D03F] text-[#1A1A1A] px-3 py-1 rounded-full text-xs font-depixel-small">
                          RECOMMENDED
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedPassType === pass.id
                              ? "border-[#F4D03F] bg-[#F4D03F]"
                              : "border-[#D2B997]/50"
                          }`}>
                            {selectedPassType === pass.id && (
                              <CheckCircle className="w-4 h-4 text-[#1A1A1A]" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-white font-depixel-body">{pass.name}</h3>
                            </div>
                            <p className="text-[#D2B997]/60 text-xs font-depixel-small flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {pass.date}
                            </p>
                            <p className="text-[#A8D8EA] text-sm font-depixel-small mt-1">{pass.highlight}</p>
                            <p className="text-[#D2B997]/50 text-xs font-depixel-small">{pass.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-futura text-[#F4D03F]">from ₹{PRICING[pass.id]?.single}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </FadeIn>

            {/* Quantity Selection */}
            {selectedPassType && (
              <FadeIn delay={0.25}>
                <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                      <Users className="w-6 h-6 text-[#A8D8EA]" />
                      Select Quantity *
                    </CardTitle>
                    <p className="text-[#D2B997]/60 font-depixel-small text-sm">
                      How many people will this pass admit?
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {QUANTITY_OPTIONS.map((qty) => (
                        <div
                          key={qty.id}
                          onClick={() => setSelectedQuantity(qty.id)}
                          className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                            selectedQuantity === qty.id
                              ? "border-[#A8D8EA] bg-[#A8D8EA]/10"
                              : "border-[#D2B997]/30 bg-[#1A1A1A]/50 hover:border-[#D2B997]/50"
                          } ${qty.bestValue ? "ring-2 ring-[#A8D8EA]/30" : ""}`}
                        >
                          {qty.bestValue && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#A8D8EA] text-[#1A1A1A] px-2 py-0.5 rounded-full text-xs font-depixel-small whitespace-nowrap">
                              BEST VALUE
                            </div>
                          )}
                          <h4 className="text-white font-depixel-body mb-1">{qty.label}</h4>
                          <p className="text-[#D2B997]/60 text-xs font-depixel-small mb-2">{qty.description}</p>
                          <p className="text-2xl font-futura text-[#F4D03F]">₹{PRICING[selectedPassType]?.[qty.id]}</p>
                          {qty.admits > 1 && (
                            <p className="text-[#A8D8EA]/70 text-xs font-depixel-small mt-1">
                              ₹{Math.round(PRICING[selectedPassType]?.[qty.id] / qty.admits)}/person
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )}

            {/* Personal Details */}
            <FadeIn delay={0.3}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                    Personal Details
                  </CardTitle>
                  <p className="text-[#D2B997]/60 font-depixel-small text-sm">
                    Details of the primary contact / pass holder
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-[#D2B997] font-depixel-small">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-[#D2B997] font-depixel-small">
                        Contact Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-[#D2B997] font-depixel-small">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="institution" className="text-[#D2B997] font-depixel-small">
                      Institution/College Name *
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
                </CardContent>
              </Card>
            </FadeIn>

            {/* Payment Section */}
            {selectedPassType && selectedQuantity && (
              <FadeIn delay={0.4}>
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
                          Scan QR code to pay <span className="text-[#F4D03F] font-bold">₹{price}</span>
                        </p>
                        <p className="text-center text-white/60 font-depixel-small text-xs mt-2">
                          QR Code #{selectedQR}/5
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
                        <div className="bg-gradient-to-r from-[#A8D8EA]/10 to-[#B8A7D9]/10 rounded-lg border border-[#D2B997]/20 p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-depixel-body">{passDetails?.name}:</span>
                            <span className="text-[#F4D03F] font-futura tracking-wide text-3xl">₹{price}</span>
                          </div>
                          <p className="text-[#D2B997]/60 font-depixel-small text-xs mt-2">
                            {passDetails?.date}
                          </p>
                          <div className="mt-3 pt-3 border-t border-[#D2B997]/20">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-[#A8D8EA] font-depixel-small">Admits:</span>
                              <span className="text-[#A8D8EA] font-depixel-body">{quantityDetails?.admits} {quantityDetails?.admits === 1 ? 'person' : 'people'}</span>
                            </div>
                          </div>
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
            )}

            {/* Submit Button */}
            <FadeIn delay={0.5}>
              <div className="bg-[#F4D03F]/10 border border-[#F4D03F]/30 p-4 rounded-lg mb-6">
                <p className="text-[#F4D03F] font-depixel-small text-sm">
                  <span className="font-bold">Note:</span> Limited passes available. Registration confirmation and entry QR code will be sent to your email after payment verification.
                  {quantityDetails && quantityDetails.admits > 1 && (
                    <span className="block mt-1">This pass will admit <strong>{quantityDetails.admits} people</strong> at the venue.</span>
                  )}
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !selectedPassType || !selectedQuantity}
                className="w-full bg-gradient-to-r from-[#F4D03F] to-[#F8C471] hover:from-[#e6c030] hover:to-[#e5b560] text-[#1A1A1A] font-depixel-body py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Registering...
                  </>
                ) : (
                  <>
                    <Ticket className="w-5 h-5 mr-2" />
                    Register Now {price > 0 ? `- ₹${price}` : ""}
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
