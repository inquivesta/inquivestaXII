"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2, Camera, CheckCircle, Sparkles } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import { FadeIn } from "@/components/ui/fade-in"

const EVENT_CONFIG = {
  id: "photon",
  name: "Photon",
  subtitle: "Themed Photography Competition",
}

export default function PhotonRegistrationPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [registrationId, setRegistrationId] = useState("")

  const [formData, setFormData] = useState({
    participant_name: "",
    participant_phone: "",
    participant_email: "",
    institution: "",
  })

  const [photoTitles, setPhotoTitles] = useState<string[]>([""])

  const addPhotoTitle = () => {
    if (photoTitles.length < 5) {
      setPhotoTitles([...photoTitles, ""])
    }
  }

  const removePhotoTitle = (index: number) => {
    if (photoTitles.length > 1) {
      setPhotoTitles(photoTitles.filter((_, i) => i !== index))
    }
  }

  const updatePhotoTitle = (index: number, value: string) => {
    const updated = [...photoTitles]
    updated[index] = value
    setPhotoTitles(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    // Validate at least one photo title
    const validTitles = photoTitles.filter(t => t.trim())
    if (validTitles.length === 0) {
      setErrorMessage("Please enter at least one photograph title")
      return
    }

    // Validate required fields
    if (!formData.participant_name.trim() || !formData.participant_email.trim() || 
        !formData.participant_phone.trim() || !formData.institution.trim()) {
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
          photo_titles: validTitles,
          amount_paid: 0,
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
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-[#1A1A1A]" />
                </div>
                <HyperText
                  className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] bg-clip-text text-transparent font-futura tracking-wide"
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
                      <span className="text-white font-depixel-body">{formData.participant_name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Institution:</span>
                      <span className="text-white font-depixel-body">{formData.institution}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Registration Fee:</span>
                      <span className="text-[#A8D8EA] font-futura tracking-wide text-xl">FREE</span>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-sm text-[#D2B997]/80 font-depixel-small space-y-2">
                    <p>✅ Confirmation email sent to {formData.participant_email}</p>
                    <p>📱 QR Code for entry included in the email</p>
                    <p>📸 Get your cameras ready!</p>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-xs text-[#D2B997]/70 font-depixel-small">
                    <p>💬 If you have any issues, reply to the confirmation email with <span className="text-[#D2B997]">inquivesta@iiserkol.ac.in</span> in CC.</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
                <Link href="/events" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] hover:from-[#7FB3D3] hover:to-[#9A8BC4] text-[#1A1A1A] font-depixel-body px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base">
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
                className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] bg-clip-text text-transparent font-futura tracking-wide"
                text="PHOTON"
              />
              <p className="text-[#D2B997] text-lg font-depixel-body">
                {EVENT_CONFIG.subtitle}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 bg-[#A8D8EA]/10 border border-[#A8D8EA]/30 px-4 py-2 rounded-full">
                <span className="text-[#A8D8EA] font-depixel-small">FREE TO PARTICIPATE</span>
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
                    <Camera className="w-6 h-6 text-[#A8D8EA]" />
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

            {/* Photo Titles */}
            <FadeIn delay={0.3}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-[#B8A7D9]" />
                      Photograph Titles ({photoTitles.length}/5)
                    </span>
                    {photoTitles.length < 5 && (
                      <Button
                        type="button"
                        onClick={addPhotoTitle}
                        className="bg-[#D2B997]/20 hover:bg-[#D2B997]/30 text-[#D2B997] font-depixel-small"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Title
                      </Button>
                    )}
                  </CardTitle>
                  <p className="text-[#D2B997]/60 font-depixel-small text-sm">
                    Enter the title(s) of the photograph(s) you will be submitting
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {photoTitles.map((title, index) => (
                    <div key={index} className="bg-[#1A1A1A]/50 p-4 rounded-lg border border-[#D2B997]/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#A8D8EA] font-depixel-small">Photo {index + 1}</span>
                        {photoTitles.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removePhotoTitle(index)}
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 h-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div>
                        <Label className="text-[#D2B997] font-depixel-small text-xs">
                          Title {index === 0 && "*"}
                        </Label>
                        <Input
                          value={title}
                          onChange={(e) => updatePhotoTitle(index, e.target.value)}
                          className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                          placeholder={`Enter title for photograph ${index + 1}`}
                          required={index === 0}
                        />
                      </div>
                    </div>
                  ))}

                  <p className="text-white/60 font-depixel-small text-xs">
                    You can add up to 5 photograph titles. At least 1 is required.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Submit Button */}
            <FadeIn delay={0.5}>
              <div className="bg-[#A8D8EA]/10 border border-[#A8D8EA]/30 p-4 rounded-lg mb-6">
                <p className="text-[#A8D8EA] font-depixel-small text-sm">
                  <span className="font-bold">Note:</span> Registration confirmation and entry QR code will be sent to your email. Make sure to check your spam folder.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] hover:from-[#7FB3D3] hover:to-[#9A8BC4] text-[#1A1A1A] font-depixel-body py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Registering...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Complete Registration
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
