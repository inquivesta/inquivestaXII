"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Heart, User, Users, CheckCircle, AlertCircle, Sparkles } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import { FadeIn } from "@/components/ui/fade-in"

const EVENT_CONFIG = {
  id: "masquerade",
  name: "Masquerade",
  subtitle: "Be Bold, Dance Bolder, Have Fun!",
  coupleFee: 169,
  singleMaleFee: 91,
  singleFemaleFee: 52,
}

const PAYMENT_QR_CODES = [
  "/payment_qr/QR1.jpg",
  "/payment_qr/QR2.jpg",
  "/payment_qr/QR3.jpg",
]

export default function MasqueradeRegistrationPage() {
  const [selectedQR, setSelectedQR] = useState<number>(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [registrationId, setRegistrationId] = useState("")

  // Pass type selection
  const [passType, setPassType] = useState<"couple" | "single" | "">("")

  // Main person details
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [institution, setInstitution] = useState("")
  const [gender, setGender] = useState("")

  // Partner details (for couple)
  const [partnerName, setPartnerName] = useState("")
  const [partnerEmail, setPartnerEmail] = useState("")
  const [partnerPhone, setPartnerPhone] = useState("")
  const [partnerInstitution, setPartnerInstitution] = useState("")
  const [partnerGender, setPartnerGender] = useState("")

  // Confirmation checkbox
  const [confirmDetails, setConfirmDetails] = useState(false)

  const [utrNumber, setUtrNumber] = useState("")

  // Calculate fee based on pass type and gender
  const getCurrentFee = () => {
    if (passType === "couple") return EVENT_CONFIG.coupleFee
    if (passType === "single" && gender === "male") return EVENT_CONFIG.singleMaleFee
    if (passType === "single" && gender === "female") return EVENT_CONFIG.singleFemaleFee
    return 0
  }

  const currentFee = getCurrentFee()

  useEffect(() => {
    setSelectedQR(Math.floor(Math.random() * PAYMENT_QR_CODES.length))
  }, [])

  const cycleQR = () => {
    setSelectedQR(prev => (prev + 1) % PAYMENT_QR_CODES.length)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    // Validate pass type
    if (!passType) {
      setErrorMessage("Please select a pass type")
      return
    }

    // Validate required fields
    if (!name.trim() || !email.trim() || !phone.trim() || !institution.trim() || !gender) {
      setErrorMessage("Please fill in all your details")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address")
      return
    }

    // Validate phone number (10 digits)
    const phoneDigits = phone.replace(/\D/g, "")
    if (phoneDigits.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit phone number")
      return
    }

    // Validate partner details for couple pass
    if (passType === "couple") {
      if (!partnerName.trim() || !partnerEmail.trim() || !partnerPhone.trim() || !partnerInstitution.trim() || !partnerGender) {
        setErrorMessage("Please fill in all partner details")
        return
      }
      if (!emailRegex.test(partnerEmail)) {
        setErrorMessage("Please enter a valid email address for your partner")
        return
      }
      const partnerPhoneDigits = partnerPhone.replace(/\D/g, "")
      if (partnerPhoneDigits.length !== 10) {
        setErrorMessage("Please enter a valid 10-digit phone number for your partner")
        return
      }
    }

    // Validate confirmation
    if (!confirmDetails) {
      setErrorMessage("Please confirm that all details are correct")
      return
    }

    // Validate UTR
    if (!utrNumber || utrNumber.length !== 12) {
      setErrorMessage("Please enter a valid 12-digit UTR number")
      return
    }

    setIsSubmitting(true)

    try {
      const partnerPhoneDigits = partnerPhone.replace(/\D/g, "")
      
      const response = await fetch("/api/events/register/masquerade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: EVENT_CONFIG.id,
          pass_type: passType,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phoneDigits,
          institution: institution.trim(),
          gender,
          partner: passType === "couple" ? {
            name: partnerName.trim(),
            email: partnerEmail.trim().toLowerCase(),
            phone: partnerPhoneDigits,
            institution: partnerInstitution.trim(),
            gender: partnerGender,
          } : null,
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

  const getPassTypeLabel = () => {
    if (passType === "couple") return "Couple Pass"
    if (passType === "single") return `Single Pass (${gender === "male" ? "Male" : "Female"})`
    return ""
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#D2B997]/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/events"
            className="flex items-center space-x-2 text-[#D2B997] hover:text-[#EC4899] transition-colors"
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
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#EC4899] to-[#DB2777] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <HyperText
                  className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#EC4899] to-[#DB2777] bg-clip-text text-transparent font-futura tracking-wide"
                  text="YOU'RE IN!"
                />
                <p className="text-[#D2B997] text-lg font-depixel-body mb-8">
                  Your {getPassTypeLabel()} for {EVENT_CONFIG.name} has been confirmed!
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
                      <span className="text-white font-depixel-body">{name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Pass Type:</span>
                      <span className="text-[#EC4899] font-depixel-body">{getPassTypeLabel()}</span>
                    </div>
                    {passType === "couple" && (
                      <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                        <span className="text-[#D2B997]/80 font-depixel-small">Partner:</span>
                        <span className="text-white font-depixel-body">{partnerName}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Amount Paid:</span>
                      <span className="text-[#EC4899] font-futura tracking-wide text-xl">₹{currentFee}</span>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-sm text-[#D2B997]/80 font-depixel-small space-y-2">
                    <p>✅ Confirmation email sent to {email}</p>
                    <p>📱 QR Code for entry included in the email</p>
                    {passType === "single" && (
                      <p>📝 You&apos;ll receive a Google Form for blind date matching!</p>
                    )}
                    <p>🎭 Get ready for an unforgettable night!</p>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-xs text-[#D2B997]/70 font-depixel-small">
                    <p>💬 If you have any issues, reply to the confirmation email with <span className="text-[#D2B997]">inquivesta@iiserkol.ac.in</span> in CC.</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
                <Link href="/events" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-[#EC4899] to-[#DB2777] hover:from-[#DB2777] hover:to-[#BE185D] text-white font-depixel-body px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base">
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
                className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#EC4899] to-[#DB2777] bg-clip-text text-transparent font-futura tracking-wide"
                text="MASQUERADE"
              />
              <p className="text-[#D2B997] text-lg font-depixel-body">
                {EVENT_CONFIG.subtitle}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <div className="inline-flex items-center gap-2 bg-[#EC4899]/10 border border-[#EC4899]/30 px-4 py-2 rounded-full">
                  <Users className="w-4 h-4 text-[#EC4899]" />
                  <span className="text-[#EC4899] font-depixel-small">Couple: ₹169</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-[#3B82F6]/10 border border-[#3B82F6]/30 px-4 py-2 rounded-full">
                  <User className="w-4 h-4 text-[#3B82F6]" />
                  <span className="text-[#3B82F6] font-depixel-small">Single Male: ₹91</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-[#F472B6]/10 border border-[#F472B6]/30 px-4 py-2 rounded-full">
                  <User className="w-4 h-4 text-[#F472B6]" />
                  <span className="text-[#F472B6] font-depixel-small">Single Female: ₹52</span>
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
            {/* Pass Type Selection */}
            <FadeIn delay={0.1}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#EC4899]" />
                    Choose Your Pass
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Couple Pass */}
                    <div
                      onClick={() => setPassType("couple")}
                      className={`cursor-pointer p-6 rounded-xl border-2 transition-all ${
                        passType === "couple"
                          ? "border-[#EC4899] bg-[#EC4899]/10"
                          : "border-[#D2B997]/30 hover:border-[#EC4899]/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          passType === "couple" ? "bg-[#EC4899]" : "bg-[#D2B997]/20"
                        }`}>
                          <Heart className={`w-5 h-5 ${passType === "couple" ? "text-white" : "text-[#D2B997]"}`} />
                        </div>
                        <div>
                          <h3 className="text-white font-depixel-body text-lg">Couple Pass</h3>
                          <p className="text-[#EC4899] font-futura text-2xl">₹169</p>
                        </div>
                      </div>
                      <p className="text-[#D2B997]/70 text-sm font-depixel-small mb-2">Admits Two</p>
                      <ul className="text-[#D2B997]/80 text-xs font-depixel-small space-y-1">
                        <li>✨ Red carpet entry (Paparazzi themed)</li>
                        <li>💕 Loyalty to partner</li>
                      </ul>
                    </div>

                    {/* Single Pass */}
                    <div
                      onClick={() => setPassType("single")}
                      className={`cursor-pointer p-6 rounded-xl border-2 transition-all ${
                        passType === "single"
                          ? "border-[#3B82F6] bg-[#3B82F6]/10"
                          : "border-[#D2B997]/30 hover:border-[#3B82F6]/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          passType === "single" ? "bg-[#3B82F6]" : "bg-[#D2B997]/20"
                        }`}>
                          <User className={`w-5 h-5 ${passType === "single" ? "text-white" : "text-[#D2B997]"}`} />
                        </div>
                        <div>
                          <h3 className="text-white font-depixel-body text-lg">Single Pass</h3>
                          <p className="text-[#3B82F6] font-futura text-2xl">₹91 / ₹52</p>
                        </div>
                      </div>
                      <p className="text-[#D2B997]/70 text-sm font-depixel-small mb-2">Admits One (Male: ₹91, Female: ₹52)</p>
                      <ul className="text-[#D2B997]/80 text-xs font-depixel-small space-y-1">
                        <li>📝 Get a Google Form for blind date matching</li>
                        <li>💫 Chance to find your prom partner!</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Your Details */}
            <FadeIn delay={0.15}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                    <User className="w-6 h-6 text-[#EC4899]" />
                    Your Details
                  </CardTitle>
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-[#D2B997] font-depixel-small">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-[#D2B997] font-depixel-small">
                        WhatsApp Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                        placeholder="10-digit number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="institution" className="text-[#D2B997] font-depixel-small">
                        Institute *
                      </Label>
                      <Input
                        id="institution"
                        required
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                        placeholder="Your college/institution name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender" className="text-[#D2B997] font-depixel-small">
                        Gender *
                      </Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2A2A2A] border-[#D2B997]/30">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      {passType === "single" && gender && (
                        <p className="text-[#EC4899] text-xs mt-1 font-depixel-small">
                          Your fee: ₹{gender === "male" ? EVENT_CONFIG.singleMaleFee : EVENT_CONFIG.singleFemaleFee}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Partner Details (for Couple) */}
            {passType === "couple" && (
              <FadeIn delay={0.2}>
                <Card className="bg-[#2A2A2A]/50 border-[#EC4899]/30">
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                      <Heart className="w-6 h-6 text-[#EC4899]" />
                      Partner Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="partnerName" className="text-[#D2B997] font-depixel-small">
                          Partner&apos;s Full Name *
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
                          Partner&apos;s Email *
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
                      <div>
                        <Label htmlFor="partnerPhone" className="text-[#D2B997] font-depixel-small">
                          Partner&apos;s WhatsApp Number *
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
                      <div>
                        <Label htmlFor="partnerInstitution" className="text-[#D2B997] font-depixel-small">
                          Partner&apos;s Institute *
                        </Label>
                        <Input
                          id="partnerInstitution"
                          required
                          value={partnerInstitution}
                          onChange={(e) => setPartnerInstitution(e.target.value)}
                          className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                          placeholder="Partner's college/institution"
                        />
                      </div>
                      <div>
                        <Label htmlFor="partnerGender" className="text-[#D2B997] font-depixel-small">
                          Partner&apos;s Gender *
                        </Label>
                        <Select value={partnerGender} onValueChange={setPartnerGender}>
                          <SelectTrigger className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#2A2A2A] border-[#D2B997]/30">
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )}

            {/* Payment Section */}
            {passType && gender && (
              <FadeIn delay={0.25}>
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
                          Scan QR code to pay <span className="text-[#EC4899] font-bold">₹{currentFee}</span>
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
                        <div className="bg-gradient-to-r from-[#EC4899]/10 to-[#DB2777]/10 rounded-lg border border-[#D2B997]/20 p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-depixel-body">{getPassTypeLabel()}:</span>
                            <span className="text-[#EC4899] font-futura tracking-wide text-3xl">₹{currentFee}</span>
                          </div>
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

            {/* Confirmation & Disclaimer */}
            <FadeIn delay={0.3}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="confirmDetails"
                        checked={confirmDetails}
                        onCheckedChange={(checked) => setConfirmDetails(checked === true)}
                        className="mt-1 border-[#D2B997]/50 data-[state=checked]:bg-[#EC4899] data-[state=checked]:border-[#EC4899]"
                      />
                      <label htmlFor="confirmDetails" className="text-[#D2B997] font-depixel-small text-sm cursor-pointer">
                        I confirm all the details I have provided are correct *
                      </label>
                    </div>

                    <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-xs text-[#D2B997]/70 font-depixel-small space-y-2">
                      <p>🔒 All data is kept confidential and safe.</p>
                      <p>⚠️ While arriving at the event venue, your details will be verified. If any discrepancy is found, your pass will be declared void.</p>
                      <p>💔 No refunds if you wish to break up with your partner at prom, lol!</p>
                      <p className="text-[#EC4899]">🎭 Be Bold, Dance Bolder, Have Fun!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Submit Button */}
            <FadeIn delay={0.35}>
              <Button
                type="submit"
                disabled={isSubmitting || !passType || !confirmDetails || (passType === "single" && !gender)}
                className="w-full bg-gradient-to-r from-[#EC4899] to-[#DB2777] hover:from-[#DB2777] hover:to-[#BE185D] text-white font-depixel-body py-6 text-lg disabled:opacity-50"
              >
                {isSubmitting ? "Registering..." : `Get Your ${passType === "couple" ? "Couple" : "Single"} Pass - ₹${currentFee || "..."}`}
              </Button>
            </FadeIn>
          </form>
        </main>
      )}
    </div>
  )
}
