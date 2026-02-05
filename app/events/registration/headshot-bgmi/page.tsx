"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, CheckCircle, Gamepad2 } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import { FadeIn } from "@/components/ui/fade-in"

interface Player {
  name: string
  phone: string
  email: string
  uid: string
}

const EVENT_CONFIG = {
  id: "headshot-bgmi",
  name: "Headshot x Krafton - BGMI",
  fee: 0,
  teamSize: 4,
}

export default function HeadshotBGMIRegistrationPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [registrationId, setRegistrationId] = useState("")

  const [formData, setFormData] = useState({
    team_name: "",
    institute_name: "",
  })

  const [players, setPlayers] = useState<Player[]>([
    { name: "", phone: "", email: "", uid: "" }, // Player 1 (IGL)
    { name: "", phone: "", email: "", uid: "" }, // Player 2
    { name: "", phone: "", email: "", uid: "" }, // Player 3
    { name: "", phone: "", email: "", uid: "" }, // Player 4
  ])

  const updatePlayer = (index: number, field: keyof Player, value: string) => {
    const updated = [...players]
    updated[index][field] = value
    setPlayers(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    // Validate all 4 players (all required for BGMI)
    for (let i = 0; i < 4; i++) {
      const player = players[i]
      if (!player.name.trim() || !player.phone.trim() || !player.email.trim() || !player.uid.trim()) {
        setErrorMessage(`Please fill in all details for Player ${i + 1}`)
        return
      }
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: EVENT_CONFIG.id,
          team_name: formData.team_name,
          institute_name: formData.institute_name,
          // Player 1 (IGL) - used as team leader for email
          player1_name: players[0].name,
          player1_phone: players[0].phone,
          player1_email: players[0].email,
          player1_uid: players[0].uid,
          // Player 2
          player2_name: players[1].name,
          player2_phone: players[1].phone,
          player2_email: players[1].email,
          player2_uid: players[1].uid,
          // Player 3
          player3_name: players[2].name,
          player3_phone: players[2].phone,
          player3_email: players[2].email,
          player3_uid: players[2].uid,
          // Player 4
          player4_name: players[3].name,
          player4_phone: players[3].phone,
          player4_email: players[3].email,
          player4_uid: players[3].uid,
          amount_paid: 0,
          utr_number: "000000000000",
          payment_qr_used: 1,
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
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-[#1A1A1A]" />
                </div>
                <HyperText
                  className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent font-futura tracking-wide"
                  text="REGISTERED!"
                />
                <p className="text-[#D2B997] text-lg font-depixel-body mb-8">
                  Your team is registered for {EVENT_CONFIG.name}
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
                      <span className="text-[#D2B997]/80 font-depixel-small">Team Name:</span>
                      <span className="text-white font-depixel-body">{formData.team_name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">In-Game Leader:</span>
                      <span className="text-white font-depixel-body">{players[0].name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#D2B997]/20">
                      <span className="text-[#D2B997]/80 font-depixel-small">Amount Paid:</span>
                      <span className="text-[#F4D03F] font-futura tracking-wide text-xl">₹{EVENT_CONFIG.fee}</span>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-sm text-[#D2B997]/80 font-depixel-small space-y-2">
                    <p>✅ Confirmation email sent to {players[0].email}</p>
                    <p>📱 QR Code for entry included in the email</p>
                    <p>🎮 Winner Winner Chicken Dinner awaits!</p>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-xs text-[#D2B997]/70 font-depixel-small">
                    <p>💬 If you have any issues, reply to the confirmation email with <span className="text-[#D2B997]">inquivesta@iiserkol.ac.in</span> in CC.</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
                <Link href="/events" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#E6C200] hover:to-[#E69500] text-[#1A1A1A] font-depixel-body px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base">
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
                className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent font-futura tracking-wide"
                text="HEADSHOT x KRAFTON - BGMI"
              />
              <p className="text-[#D2B997] text-lg font-depixel-body">
                Ultimate BGMI Showdown at IISER Kolkata
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                <div className="inline-flex items-center gap-2 bg-[#F4D03F]/10 border border-[#F4D03F]/30 px-4 py-2 rounded-full">
                  <Users className="w-4 h-4 text-[#F4D03F]" />
                  <span className="text-[#F4D03F] font-depixel-small">Squad: 4 Players</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-[#ABEBC6]/10 border border-[#ABEBC6]/30 px-4 py-2 rounded-full">
                  <span className="text-[#ABEBC6] font-depixel-small font-bold">FREE ENTRY</span>
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
            {/* Team Info */}
            <FadeIn delay={0.2}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">Team Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="team_name" className="text-[#D2B997] font-depixel-small">Team Name *</Label>
                      <Input
                        id="team_name"
                        required
                        value={formData.team_name}
                        onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                        className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                        placeholder="Enter your squad name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="institute_name" className="text-[#D2B997] font-depixel-small">Institute Name *</Label>
                      <Input
                        id="institute_name"
                        required
                        value={formData.institute_name}
                        onChange={(e) => setFormData({ ...formData, institute_name: e.target.value })}
                        className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                        placeholder="Your college/institute"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Players */}
            {players.map((player, index) => (
              <FadeIn key={index} delay={0.25 + index * 0.05}>
                <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                      <Gamepad2 className="w-5 h-5" />
                      Player {index + 1} {index === 0 && <span className="text-[#FFD700] text-sm">(In-Game Leader)</span>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[#D2B997] font-depixel-small text-xs">Name *</Label>
                        <Input
                          required
                          value={player.name}
                          onChange={(e) => updatePlayer(index, "name", e.target.value)}
                          className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                          placeholder="Player's real name"
                        />
                      </div>
                      <div>
                        <Label className="text-[#D2B997] font-depixel-small text-xs">BGMI UID *</Label>
                        <Input
                          required
                          value={player.uid}
                          onChange={(e) => updatePlayer(index, "uid", e.target.value)}
                          className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                          placeholder="In-game UID"
                        />
                      </div>
                      <div>
                        <Label className="text-[#D2B997] font-depixel-small text-xs">Phone *</Label>
                        <Input
                          required
                          type="tel"
                          value={player.phone}
                          onChange={(e) => updatePlayer(index, "phone", e.target.value)}
                          className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                          placeholder="10-digit number"
                        />
                      </div>
                      <div>
                        <Label className="text-[#D2B997] font-depixel-small text-xs">Email *</Label>
                        <Input
                          required
                          type="email"
                          value={player.email}
                          onChange={(e) => updatePlayer(index, "email", e.target.value)}
                          className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}

            {/* Submit Button */}
            <FadeIn delay={0.5}>
              <div className="bg-[#ABEBC6]/10 border border-[#ABEBC6]/30 p-4 rounded-lg mb-6">
                <p className="text-[#ABEBC6] font-depixel-small text-sm">
                  <span className="font-bold">🎮 FREE REGISTRATION!</span> Confirmation email with entry QR will be sent to Player 1 (In-Game Leader). Check spam folder if not received.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#E6C200] hover:to-[#E69500] text-[#1A1A1A] font-depixel-body py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Registering Squad...
                  </>
                ) : (
                  <>
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    Register Squad - FREE
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
