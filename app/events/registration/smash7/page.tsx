"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Users, User, CheckCircle, AlertCircle, Link as LinkIcon } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import { FadeIn } from "@/components/ui/fade-in"

const EVENT_CONFIG = {
  id: "smash7",
  name: "Smash 7",
  subtitle: "10-Over Cricket Tournament",
  fee: 900,
  iiserkFee: 500,
  teamSize: 13, // 11 + 2 extra
}

interface TeamMember {
  name: string
  phone: string
  gender: string
}

const PAYMENT_QR_CODES = [
  "/payment_qr/QR1.jpg",
  "/payment_qr/QR2.jpg",
  "/payment_qr/QR3.jpg",
]

export default function Smash7RegistrationPage() {
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
  const [teamLeaderGender, setTeamLeaderGender] = useState("")
  const [photoIdLink, setPhotoIdLink] = useState("")
  const [isIISERKTeam, setIsIISERKTeam] = useState(false)
  const [utrNumber, setUtrNumber] = useState("")

  // Team members (11 compulsory + 2 extra members)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    Array(11).fill(null).map(() => ({ name: "", phone: "", gender: "" }))
  )

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
        !teamLeaderPhone.trim() || !teamLeaderGender || !photoIdLink.trim()) {
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
      setErrorMessage("Please enter a valid 10-digit phone number for team leader")
      return
    }

    // Validate Google Drive link
    if (!photoIdLink.includes("drive.google.com") && !photoIdLink.includes("docs.google.com")) {
      setErrorMessage("Please enter a valid Google Drive link for photo IDs")
      return
    }

    // Validate team members (at least 11 compulsory members with complete details)
    const validMembers = teamMembers.filter(m => m.name.trim() && m.phone.trim() && m.gender)
    if (validMembers.length < 11) {
      setErrorMessage("Please add at least 11 team members with complete details (11 compulsory players)")
      return
    }

    // Validate member phone numbers
    for (let i = 0; i < teamMembers.length; i++) {
      const member = teamMembers[i]
      if (member.name.trim()) {
        const memberPhone = member.phone.replace(/\D/g, "")
        if (memberPhone.length !== 10) {
          setErrorMessage(`Please enter a valid 10-digit phone number for ${member.name || `Member ${i + 2}`}`)
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
      const response = await fetch("/api/events/register/smash7", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: EVENT_CONFIG.id,
          team_name: teamName.trim(),
          team_leader_name: teamLeaderName.trim(),
          team_leader_email: teamLeaderEmail.trim().toLowerCase(),
          team_leader_phone: phoneDigits,
          team_leader_gender: teamLeaderGender,
          team_members: validMembers.map(m => ({
            name: m.name.trim(),
            phone: m.phone.replace(/\D/g, ""),
            gender: m.gender
          })),
          photo_id_link: photoIdLink.trim(),
          is_iiserk_team: isIISERKTeam,
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
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#58D68D] to-[#28B463] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-[#1A1A1A]" />
                </div>
                <HyperText
                  className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#58D68D] to-[#28B463] bg-clip-text text-transparent font-futura tracking-wide"
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
                      <span className="text-[#58D68D] font-futura tracking-wide text-xl">₹{currentFee}</span>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-sm text-[#D2B997]/80 font-depixel-small space-y-2">
                    <p>✅ Confirmation email sent to {teamLeaderEmail}</p>
                    <p>📱 QR Code for entry included in the email</p>
                    <p>🏏 Get ready to smash!</p>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-xs text-[#D2B997]/70 font-depixel-small">
                    <p>💬 If you have any issues, reply to the confirmation email with <span className="text-[#D2B997]">inquivesta@iiserkol.ac.in</span> in CC.</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
                <Link href="/events" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-[#58D68D] to-[#28B463] hover:from-[#45C775] hover:to-[#1D8348] text-[#1A1A1A] font-depixel-body px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base">
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
                className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#58D68D] to-[#28B463] bg-clip-text text-transparent font-futura tracking-wide"
                text="SMASH 7"
              />
              <p className="text-[#D2B997] text-lg font-depixel-body">
                {EVENT_CONFIG.subtitle}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <div className="inline-flex items-center gap-2 bg-[#58D68D]/10 border border-[#58D68D]/30 px-4 py-2 rounded-full">
                  <span className="text-[#58D68D] font-depixel-small">Outside Teams: ₹900</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-[#A8D8EA]/10 border border-[#A8D8EA]/30 px-4 py-2 rounded-full">
                  <span className="text-[#A8D8EA] font-depixel-small">IISER Kolkata: ₹500</span>
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
                    <Users className="w-6 h-6 text-[#58D68D]" />
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

                  <div className="flex items-center space-x-3 p-4 bg-[#1A1A1A]/50 rounded-lg">
                    <Checkbox
                      id="isIISERK"
                      checked={isIISERKTeam}
                      onCheckedChange={(checked) => setIsIISERKTeam(checked === true)}
                      className="border-[#A8D8EA] data-[state=checked]:bg-[#A8D8EA] data-[state=checked]:border-[#A8D8EA]"
                    />
                    <Label htmlFor="isIISERK" className="text-white font-depixel-small cursor-pointer">
                      This is an IISER Kolkata team (₹500 instead of ₹900)
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Team Captain Details */}
            <FadeIn delay={0.2}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                    <User className="w-6 h-6 text-[#58D68D]" />
                    Team Captain Details
                  </CardTitle>
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
                    </div>
                    <div>
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
                    <div>
                      <Label htmlFor="teamLeaderGender" className="text-[#D2B997] font-depixel-small">
                        Captain Gender *
                      </Label>
                      <Select value={teamLeaderGender} onValueChange={setTeamLeaderGender}>
                        <SelectTrigger className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2A2A2A] border-[#D2B997]/30">
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
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
                    Team Members (11 + 2 Extra)
                  </CardTitle>
                  <p className="text-[#D2B997]/70 text-sm font-depixel-small">
                    Add at least 11 team members. Maximum 13 members (11 compulsory + 2 extra).
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="p-4 bg-[#1A1A1A]/30 rounded-lg space-y-3">
                      <p className="text-[#D2B997] font-depixel-small">Player {index + 2}</p>
                      <div className="grid md:grid-cols-3 gap-3">
                        <Input
                          placeholder="Name"
                          value={member.name}
                          onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                          className="bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white"
                        />
                        <Input
                          placeholder="Phone"
                          value={member.phone}
                          onChange={(e) => updateTeamMember(index, "phone", e.target.value)}
                          className="bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white"
                        />
                        <Select
                          value={member.gender}
                          onValueChange={(value) => updateTeamMember(index, "gender", value)}
                        >
                          <SelectTrigger className="bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white">
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#2A2A2A] border-[#D2B997]/30">
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </FadeIn>

            {/* Photo ID Link */}
            <FadeIn delay={0.35}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                    <LinkIcon className="w-6 h-6 text-[#58D68D]" />
                    Photo ID Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="photoIdLink" className="text-[#D2B997] font-depixel-small">
                      Google Drive Link (Photo IDs of all members) *
                    </Label>
                    <Input
                      id="photoIdLink"
                      required
                      value={photoIdLink}
                      onChange={(e) => setPhotoIdLink(e.target.value)}
                      className="mt-1 bg-[#1A1A1A]/50 border-[#D2B997]/30 text-white font-depixel-body"
                      placeholder="https://drive.google.com/..."
                    />
                    <p className="text-[#D2B997]/60 text-xs mt-2 font-depixel-small">
                      Upload photo IDs of all team members to Google Drive and set &quot;Anyone with the link&quot; access. Share the link here.
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
                        Scan QR code to pay <span className="text-[#F4D03F] font-bold">₹{currentFee}</span>
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
                      <div className="bg-gradient-to-r from-[#58D68D]/10 to-[#28B463]/10 rounded-lg border border-[#D2B997]/20 p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-depixel-body">Registration Fee:</span>
                          <span className="text-[#F4D03F] font-futura tracking-wide text-3xl">₹{currentFee}</span>
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
                className="w-full bg-gradient-to-r from-[#58D68D] to-[#28B463] hover:from-[#45C775] hover:to-[#1D8348] text-[#1A1A1A] font-depixel-body py-6 text-lg disabled:opacity-50"
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
