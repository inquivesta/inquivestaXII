"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, Trash2, Users, CheckCircle } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import { FadeIn } from "@/components/ui/fade-in"

interface TeamMember {
  name: string
}

const EVENT_CONFIG = {
  id: "csi",
  name: "CSI - Crime Scene Investigation",
  fee: 200,
  iiserkFee: 120,
  minTeamSize: 1,
  maxTeamSize: 4,
}

export default function CSIRegistrationPage() {
  const [selectedQR, setSelectedQR] = useState<number>(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [registrationId, setRegistrationId] = useState("")

  const [formData, setFormData] = useState({
    team_name: "",
    team_leader_name: "",
    team_leader_phone: "",
    team_leader_email: "",
    utr_number: "",
    played_csi_before: false,
    agrees_to_rules: false,
  })

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])

  const isIISERKEmail = (email: string) => {
    return email.toLowerCase().endsWith("@iiserkol.ac.in")
  }

  const getCurrentFee = () => {
    return isIISERKEmail(formData.team_leader_email) ? EVENT_CONFIG.iiserkFee : EVENT_CONFIG.fee
  }

  useEffect(() => {
    // Randomly select QR on mount (1, 2, or 3)
    setSelectedQR(Math.floor(Math.random() * 3) + 1)
  }, [])

  const cycleQR = () => {
    setSelectedQR(prev => prev === 3 ? 1 : prev + 1)
  }

  const addTeamMember = () => {
    // Max additional members is maxTeamSize - 1 (since leader counts as 1)
    if (teamMembers.length < EVENT_CONFIG.maxTeamSize - 1) {
      setTeamMembers([...teamMembers, { name: "" }])
    }
  }

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index))
  }

  const updateTeamMember = (index: number, value: string) => {
    const updated = [...teamMembers]
    updated[index].name = value
    setTeamMembers(updated)
  }

  const getTotalTeamSize = () => {
    // Leader + other members
    return 1 + teamMembers.filter(m => m.name.trim()).length
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    // Validate agreement to rules
    if (!formData.agrees_to_rules) {
      setErrorMessage("You must agree to follow the rules to register")
      return
    }

    // Validate UTR
    if (!formData.utr_number || formData.utr_number.length !== 12) {
      setErrorMessage("Please enter a valid 12-digit UTR number")
      return
    }

    const validMembers = teamMembers.filter(m => m.name.trim())

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: EVENT_CONFIG.id,
          team_name: formData.team_name,
          team_leader_name: formData.team_leader_name,
          team_leader_phone: formData.team_leader_phone,
          team_leader_email: formData.team_leader_email,
          team_size: getTotalTeamSize(),
          team_members: validMembers,
          played_csi_before: formData.played_csi_before,
          agrees_to_rules: formData.agrees_to_rules,
          amount_paid: getCurrentFee(),
          utr_number: formData.utr_number,
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
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-[#1A1A1A]" />
                </div>
                <HyperText
                  className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] bg-clip-text text-transparent font-futura tracking-wide"
                  text="REGISTERED!"
                />
                <p className="text-[#D2B997] text-lg font-depixel-body mb-8">
                  Your registration for CSI has been confirmed
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
                      <span className="text-white font-depixel-body">{formData.team_name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Team Leader:</span>
                      <span className="text-white font-depixel-body">{formData.team_leader_name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Team Size:</span>
                      <span className="text-white font-depixel-body">{getTotalTeamSize()} member(s)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Amount Paid:</span>
                      <span className="text-[#F4D03F] font-futura tracking-wide text-xl">₹{getCurrentFee()}</span>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-sm text-[#D2B997]/80 font-depixel-small space-y-2">
                    <p>✅ Confirmation email sent to {formData.team_leader_email}</p>
                    <p>📱 QR Code for entry included in the email</p>
                    <p>🔍 Get ready to solve the mystery!</p>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-xs text-[#D2B997]/70 font-depixel-small">
                    <p>💬 If you have any issues, reply to the confirmation email with <span className="text-[#D2B997]">inquivesta@iiserkol.ac.in</span> in CC.</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
                <Link href="/events" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base">
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
                text="CSI REGISTRATION"
              />
              <p className="text-[#D2B997] text-lg font-depixel-body">
                Crime Scene Investigation - Can you solve the mystery?
              </p>
              <div className="mt-4 inline-flex items-center gap-2 bg-[#F4D03F]/10 border border-[#F4D03F]/30 px-4 py-2 rounded-full">
                <Users className="w-4 h-4 text-[#F4D03F]" />
                <span className="text-[#F4D03F] font-depixel-small">Team Size: {EVENT_CONFIG.minTeamSize}-{EVENT_CONFIG.maxTeamSize} members</span>
              </div>
            </div>
          </FadeIn>

          {errorMessage && (
            <div className="max-w-4xl mx-auto mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg font-depixel-small">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            {/* Team Leader Details */}
            <FadeIn delay={0.2}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">
                    Team Leader Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="team_name" className="text-[#D2B997] font-depixel-small">
                        Team Name *
                      </Label>
                      <Input
                        id="team_name"
                        required
                        value={formData.team_name}
                        onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                        className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                        placeholder="Enter your team name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="team_leader_name" className="text-[#D2B997] font-depixel-small">
                        Team Leader Name *
                      </Label>
                      <Input
                        id="team_leader_name"
                        required
                        value={formData.team_leader_name}
                        onChange={(e) => setFormData({ ...formData, team_leader_name: e.target.value })}
                        className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                        placeholder="Leader's full name"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="team_leader_phone" className="text-[#D2B997] font-depixel-small">
                        WhatsApp Number *
                      </Label>
                      <Input
                        id="team_leader_phone"
                        type="tel"
                        required
                        value={formData.team_leader_phone}
                        onChange={(e) => setFormData({ ...formData, team_leader_phone: e.target.value })}
                        className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                        placeholder="10-digit number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="team_leader_email" className="text-[#D2B997] font-depixel-small">
                        Email ID *
                      </Label>
                      <Input
                        id="team_leader_email"
                        type="email"
                        required
                        value={formData.team_leader_email}
                        onChange={(e) => setFormData({ ...formData, team_leader_email: e.target.value })}
                        className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Team Members (Optional) */}
            <FadeIn delay={0.3}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center justify-between">
                    <span>Additional Team Members (Optional)</span>
                    {teamMembers.length < EVENT_CONFIG.maxTeamSize - 1 && (
                      <Button
                        type="button"
                        onClick={addTeamMember}
                        className="bg-[#D2B997]/20 hover:bg-[#D2B997]/30 text-[#D2B997] font-depixel-small"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Member
                      </Button>
                    )}
                  </CardTitle>
                  <p className="text-[#D2B997]/60 font-depixel-small text-sm">
                    Current team size: {getTotalTeamSize()} / {EVENT_CONFIG.maxTeamSize}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {teamMembers.length === 0 ? (
                    <div className="text-center py-8 text-[#D2B997]/60 font-depixel-small">
                      <p>You can participate solo or add up to {EVENT_CONFIG.maxTeamSize - 1} more team members</p>
                    </div>
                  ) : (
                    teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center gap-4 bg-[#1A1A1A]/50 p-4 rounded-lg border border-[#D2B997]/20">
                        <span className="text-[#A8D8EA] font-depixel-small w-24">Member {index + 2}</span>
                        <Input
                          value={member.name}
                          onChange={(e) => updateTeamMember(index, e.target.value)}
                          className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small flex-1"
                          placeholder="Member's full name"
                        />
                        <Button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 h-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </FadeIn>

            {/* Additional Questions */}
            <FadeIn delay={0.35}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="played_csi_before"
                      checked={formData.played_csi_before}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, played_csi_before: checked === true })
                      }
                      className="border-[#D2B997]/50 data-[state=checked]:bg-[#A8D8EA] data-[state=checked]:border-[#A8D8EA]"
                    />
                    <Label htmlFor="played_csi_before" className="text-white font-depixel-small cursor-pointer">
                      Have you played a CSI / mystery game before?
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 bg-[#F4D03F]/10 border border-[#F4D03F]/30 p-4 rounded-lg">
                    <Checkbox
                      id="agrees_to_rules"
                      checked={formData.agrees_to_rules}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, agrees_to_rules: checked === true })
                      }
                      className="border-[#F4D03F]/50 data-[state=checked]:bg-[#F4D03F] data-[state=checked]:border-[#F4D03F] mt-1"
                    />
                    <Label htmlFor="agrees_to_rules" className="text-[#F4D03F] font-depixel-small cursor-pointer">
                      I agree to follow the rules and not share clues or spoilers *
                    </Label>
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
                        Scan QR code to pay <span className="text-[#F4D03F] font-bold">₹{getCurrentFee()}</span>
                        {isIISERKEmail(formData.team_leader_email) && (
                          <span className="block text-xs text-green-400 mt-1">IISER Kolkata discount applied!</span>
                        )}
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
                      <div className="bg-gradient-to-r from-[#A8D8EA]/10 to-[#B8A7D9]/10 rounded-lg border border-[#D2B997]/20 p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-depixel-body">Registration Fee:</span>
                          <span className="text-[#F4D03F] font-futura tracking-wide text-3xl">₹{getCurrentFee()}</span>
                        </div>
                        <p className="text-[#D2B997]/60 font-depixel-small text-xs mt-2">
                          {isIISERKEmail(formData.team_leader_email) 
                            ? "IISER Kolkata student discount applied!" 
                            : `Per team • IISERK students: ₹${EVENT_CONFIG.iiserkFee}`}
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="utr_number" className="text-[#D2B997] font-depixel-small">
                          UTR Number * (12 digits)
                        </Label>
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
            <FadeIn delay={0.5}>
              <div className="bg-[#F4D03F]/10 border border-[#F4D03F]/30 p-4 rounded-lg mb-6">
                <p className="text-[#F4D03F] font-depixel-small text-sm">
                  <span className="font-bold">Note:</span> Registration confirmation and entry QR code will be sent to the team leader&apos;s email. Make sure to check your spam folder.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !formData.agrees_to_rules}
                className="w-full bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Registering...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Complete Registration - ₹{getCurrentFee()}
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
