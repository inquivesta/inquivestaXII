"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, CheckCircle, AlertCircle, Sparkles, Gamepad2, Palette, Globe, Users } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import { FadeIn } from "@/components/ui/fade-in"

const EVENT_CONFIG = {
  id: "inquicon",
  name: "Inquicon Pass",
  subtitle: "Your gateway to the Anime & Gaming Universe!",
  fee: 50,
  iiserkFee: 30,
  events: [
    {
      id: "mascot-fanart",
      name: "Event Mascot Fanart",
      description: "Create fanart of our mascot! Post on Instagram, tag us & use our hashtags. More details at inquicon.github.io",
      Icon: Palette,
      requiresForm: false,
      instructions: "Post your art on Instagram while tagging @inquicon and use the hashtags. More details at inquicon.github.io"
    },
    {
      id: "anime-website",
      name: "Anime Themed Website Competition",
      description: "Build an anime-themed website! Share your GitHub page. More details at inquicon.github.io",
      Icon: Globe,
      requiresForm: false,
      instructions: "Share your GitHub page with us. More details at inquicon.github.io"
    },
    {
      id: "pokemon-pvp",
      name: "Pokemon PvP",
      description: "Battle it out in Pokemon! Fill out the detailed form after registration.",
      Icon: Gamepad2,
      requiresForm: true,
      grantsStagePass: true
    },
    {
      id: "cosplay",
      name: "Cosplay",
      description: "Show off your cosplay skills! Fill out the detailed form after registration.",
      Icon: Users,
      requiresForm: true,
      grantsStagePass: true
    }
  ],
  formLink: "https://docs.google.com/forms/d/e/1FAIpQLSeJvpkFXVb5SwxVKk11BmrZ07zaPY2WUqpLdE23bp4AVZ49bQ/viewform"
}

const isIISERKEmail = (email: string) => {
  return email.toLowerCase().endsWith("@iiserkol.ac.in")
}

interface EventSelection {
  id: string
  selected: boolean
}

const PAYMENT_QR_CODES = [
  "/payment_qr/QR1.jpg",
  "/payment_qr/QR2.jpg",
  "/payment_qr/QR3.jpg",
]

export default function InquiconRegistrationPage() {
  const [selectedQR, setSelectedQR] = useState<number>(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [registrationId, setRegistrationId] = useState("")
  const [passType, setPassType] = useState<"general" | "stage">("general")

  // Form fields
  const [participantName, setParticipantName] = useState("")
  const [participantEmail, setParticipantEmail] = useState("")
  const [participantPhone, setParticipantPhone] = useState("")
  const [institution, setInstitution] = useState("")
  const [utrNumber, setUtrNumber] = useState("")

  // Event selections
  const [eventSelections, setEventSelections] = useState<EventSelection[]>(
    EVENT_CONFIG.events.map(e => ({
      id: e.id,
      selected: false
    }))
  )

  // Check if IISER K email
  const isIISERK = isIISERKEmail(participantEmail)

  // Calculate fee
  const currentFee = isIISERK ? EVENT_CONFIG.iiserkFee : EVENT_CONFIG.fee

  // Check if user selected Pokemon PvP or Cosplay (stage pass events)
  const needsStagePass = eventSelections.some(sel => {
    if (!sel.selected) return false
    const event = EVENT_CONFIG.events.find(e => e.id === sel.id)
    return event?.grantsStagePass
  })

  // Update pass type based on selections
  useEffect(() => {
    setPassType(needsStagePass ? "stage" : "general")
  }, [needsStagePass])

  useEffect(() => {
    setSelectedQR(Math.floor(Math.random() * PAYMENT_QR_CODES.length))
  }, [])

  const cycleQR = () => {
    setSelectedQR(prev => (prev + 1) % PAYMENT_QR_CODES.length)
  }

  const toggleEvent = (eventId: string) => {
    setEventSelections(prev => prev.map(s => {
      if (s.id === eventId) {
        return { ...s, selected: !s.selected }
      }
      return s
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

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

    // Validate UTR
    if (!utrNumber || utrNumber.length !== 12) {
      setErrorMessage("Please enter a valid 12-digit UTR number")
      return
    }

    setIsSubmitting(true)

    try {
      // Build events participation array
      const eventsParticipation = eventSelections.map(s => {
        const event = EVENT_CONFIG.events.find(e => e.id === s.id)!
        return {
          id: s.id,
          name: event.name,
          selected: s.selected,
          requiresForm: event.requiresForm || false,
          grantsStagePass: event.grantsStagePass || false
        }
      })

      const response = await fetch("/api/events/register/inquicon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: EVENT_CONFIG.id,
          participant_name: participantName.trim(),
          participant_email: participantEmail.trim().toLowerCase(),
          participant_phone: phoneDigits,
          institution: institution.trim(),
          pass_type: needsStagePass ? "stage" : "general",
          events_participation: eventsParticipation,
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

  const getSelectedEventsNames = () => {
    const selected = eventSelections
      .filter(s => s.selected)
      .map(s => EVENT_CONFIG.events.find(e => e.id === s.id)?.name)
      .filter(Boolean)
    return selected.length > 0 ? selected.join(", ") : "None (General Pass only)"
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
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#A855F7] to-[#EC4899] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <HyperText
                  className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent font-futura tracking-wide"
                  text="REGISTERED!"
                />
                <p className="text-[#D2B997] text-lg font-depixel-body mb-8">
                  Your Inquicon Pass has been confirmed!
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
                      <span className="text-white font-depixel-body">{participantName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Pass Type:</span>
                      <span className={`font-depixel-body ${passType === "stage" ? "text-[#EC4899]" : "text-[#A855F7]"}`}>
                        {passType === "stage" ? "🎭 Stage Pass" : "🎫 General Pass"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Events:</span>
                      <span className="text-white font-depixel-body text-right max-w-[200px]">{getSelectedEventsNames()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Amount Paid:</span>
                      <span className="text-[#A855F7] font-futura tracking-wide text-xl">₹{currentFee}</span>
                    </div>
                  </div>

                  {needsStagePass && (
                    <div className="bg-gradient-to-r from-[#A855F7]/20 to-[#EC4899]/20 p-4 rounded-lg border border-[#A855F7]/30">
                      <p className="text-white font-depixel-body mb-2">🎯 Next Step Required!</p>
                      <p className="text-[#D2B997]/80 text-sm font-depixel-small mb-3">
                        Since you selected Pokemon PvP or Cosplay, please fill out the detailed form:
                      </p>
                      <a
                        href={EVENT_CONFIG.formLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white px-4 py-2 rounded-lg font-depixel-small hover:opacity-90 transition-opacity"
                      >
                        Fill Event Details Form →
                      </a>
                    </div>
                  )}

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-sm text-[#D2B997]/80 font-depixel-small space-y-2">
                    <p>✅ Confirmation email sent to {participantEmail}</p>
                    <p>📱 QR Code for entry included in the email</p>
                    <p>🎮 Get ready for Inquicon!</p>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-xs text-[#D2B997]/70 font-depixel-small">
                    <p>💬 If you have any issues, reply to the confirmation email with <span className="text-[#D2B997]">inquivesta@iiserkol.ac.in</span> in CC.</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
                <Link href="/events" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-[#A855F7] to-[#EC4899] hover:from-[#9333EA] hover:to-[#DB2777] text-white font-depixel-body px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base">
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
                <Sparkles className="w-10 h-10 text-[#A855F7]" />
              </div>
              <HyperText
                className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent font-futura tracking-wide"
                text="INQUICON PASS"
              />
              <p className="text-[#D2B997] text-lg font-depixel-body">
                {EVENT_CONFIG.subtitle}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <div className="inline-flex items-center gap-2 bg-[#A855F7]/10 border border-[#A855F7]/30 px-4 py-2 rounded-full">
                  <span className="text-[#A855F7] font-depixel-small">External: ₹50</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-[#EC4899]/10 border border-[#EC4899]/30 px-4 py-2 rounded-full">
                  <span className="text-[#EC4899] font-depixel-small">IISER Kolkata: ₹30</span>
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
            {/* Pass Info */}
            <FadeIn delay={0.05}>
              <Card className="bg-gradient-to-r from-[#A855F7] to-[#EC4899] border-[#A855F7]/30">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Sparkles className="w-8 h-8 text-[#000000] flex-shrink-0" />
                    <div>
                      <h3 className="text-black font-depixel-body text-lg mb-2">What&apos;s Included?</h3>
                      <ul className="text-[#D2B997]/80 text-sm font-depixel-small space-y-1">
                        <li>✨ Access to the entire Inquicon event</li>
                        <li>🎮 Participate in any of the optional events below</li>
                        <li>🎭 Stage Pass for Pokemon PvP/Cosplay participants</li>
                        <li>🎁 Exclusive swag and experiences!</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Participant Details */}
            <FadeIn delay={0.1}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                    <User className="w-6 h-6 text-[#A855F7]" />
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
                        Institute / Organization *
                      </Label>
                      <Input
                        id="institution"
                        required
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                        placeholder="Name of your institution"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Event Selection */}
            <FadeIn delay={0.2}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">
                    Events You Want to Participate In
                  </CardTitle>
                  <p className="text-[#D2B997]/70 text-sm font-depixel-small">
                    Optional: Select events you&apos;d like to participate in. Your pass gives access to the whole event regardless!
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {EVENT_CONFIG.events.map((event) => {
                    const selection = eventSelections.find(s => s.id === event.id)!
                    const Icon = event.Icon

                    return (
                      <div
                        key={event.id}
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          selection.selected
                            ? "border-[#A855F7] bg-[#A855F7]/10"
                            : "border-[#D2B997]/30 hover:border-[#D2B997]/50"
                        }`}
                        onClick={() => toggleEvent(event.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div 
                            className={`mt-1 h-4 w-4 shrink-0 rounded-sm border ${
                              selection.selected 
                                ? "bg-[#A855F7] border-[#A855F7]" 
                                : "border-[#D2B997]"
                            } flex items-center justify-center`}
                          >
                            {selection.selected && (
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Icon className="w-5 h-5 text-[#A855F7]" />
                              <span className="text-white font-depixel-body text-lg">
                                {event.name}
                              </span>
                              {event.grantsStagePass && (
                                <span className="text-xs bg-[#EC4899]/20 text-[#EC4899] px-2 py-0.5 rounded-full">
                                  🎭 Stage Pass
                                </span>
                              )}
                              {event.requiresForm && (
                                <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full">
                                  📝 Form Required
                                </span>
                              )}
                            </div>
                            <p className="text-[#D2B997]/70 text-sm font-depixel-small mt-1 ml-7">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {needsStagePass && (
                    <div className="bg-gradient-to-r from-[#A855F7]/20 to-[#EC4899]/20 p-4 rounded-lg border border-[#A855F7]/30">
                      <p className="text-white font-depixel-body text-sm">
                        🎭 You&apos;ll receive a <span className="text-[#EC4899]">Stage Pass</span> for Pokemon PvP/Cosplay!
                      </p>
                      <p className="text-[#D2B997]/70 text-xs font-depixel-small mt-1">
                        A form link will be sent to your email to fill additional details.
                      </p>
                    </div>
                  )}
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
                        Scan QR code to pay <span className="text-[#A855F7] font-bold">₹{currentFee}</span>
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
                      <div className="bg-gradient-to-r from-[#A855F7]/10 to-[#EC4899]/10 rounded-lg border border-[#D2B997]/20 p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-depixel-body">Pass Fee:</span>
                          <span className="text-[#A855F7] font-futura tracking-wide text-3xl">₹{currentFee}</span>
                        </div>
                        <p className="text-[#D2B997]/60 font-depixel-small text-xs mt-2">
                          {isIISERK 
                            ? "IISER Kolkata discount applied!" 
                            : `IISERK students: ₹${EVENT_CONFIG.iiserkFee}`}
                        </p>
                        <div className="mt-3 pt-3 border-t border-[#D2B997]/20">
                          <p className="text-[#D2B997]/80 text-sm font-depixel-small">
                            Pass Type: <span className={passType === "stage" ? "text-[#EC4899]" : "text-[#A855F7]"}>
                              {passType === "stage" ? "🎭 Stage Pass" : "🎫 General Pass"}
                            </span>
                          </p>
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

            {/* Submit Button */}
            <FadeIn delay={0.4}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#A855F7] to-[#EC4899] hover:from-[#9333EA] hover:to-[#DB2777] text-white font-depixel-body py-6 text-lg disabled:opacity-50"
              >
                {isSubmitting ? "Getting Your Pass..." : `Get Your ${passType === "stage" ? "Stage" : "General"} Pass`}
              </Button>
            </FadeIn>
          </form>
        </main>
      )}
    </div>
  )
}
