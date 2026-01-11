"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, User, Users } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import { FadeIn } from "@/components/ui/fade-in"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TableTennisLandingPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#D2B997]/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/events"
            className="flex items-center space-x-2 text-[#D2B997] hover:text-[#22C55E] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-depixel-small">Back to Events</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="INQUIVESTA XII" width={60} height={60} className="h-10 w-auto" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <FadeIn>
          <div className="text-center mb-12">
            <HyperText
              className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] bg-clip-text text-transparent font-futura tracking-wide"
              text="TABLE TENNIS"
            />
            <p className="text-[#D2B997] text-lg font-depixel-body">
              Standard ITTF Rules • Reporting Time: 9:00 AM
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-[#D2B997]/80 font-depixel-small mb-8">
              Choose your event category to register
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Singles Card */}
              <Card className="bg-[#2A2A2A]/50 border-[#22C55E]/30 hover:border-[#22C55E] transition-all group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-[#22C55E] font-futura tracking-wide">
                    Singles
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="space-y-2">
                    <p className="text-white font-depixel-body">Men&apos;s Singles & Women&apos;s Singles</p>
                    <p className="text-[#D2B997]/70 text-sm font-depixel-small">Individual Event</p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] px-3 py-1 rounded-full text-sm font-depixel-small">
                      External: ₹100
                    </span>
                    <span className="bg-[#A8D8EA]/10 border border-[#A8D8EA]/30 text-[#A8D8EA] px-3 py-1 rounded-full text-sm font-depixel-small">
                      IISERK: ₹30
                    </span>
                  </div>

                  <Link href="/events/registration/table-tennis/singles">
                    <Button className="w-full mt-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-depixel-body py-5">
                      Register for Singles
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Doubles Card */}
              <Card className="bg-[#2A2A2A]/50 border-[#3B82F6]/30 hover:border-[#3B82F6] transition-all group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-[#3B82F6] font-futura tracking-wide">
                    Doubles
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="space-y-2">
                    <p className="text-white font-depixel-body">Men&apos;s Doubles & Mixed Doubles</p>
                    <p className="text-[#D2B997]/70 text-sm font-depixel-small">Team of 2</p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6] px-3 py-1 rounded-full text-sm font-depixel-small">
                      External: ₹200/team
                    </span>
                    <span className="bg-[#A8D8EA]/10 border border-[#A8D8EA]/30 text-[#A8D8EA] px-3 py-1 rounded-full text-sm font-depixel-small">
                      IISERK: ₹60/team
                    </span>
                  </div>

                  <Link href="/events/registration/table-tennis/doubles">
                    <Button className="w-full mt-4 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white font-depixel-body py-5">
                      Register for Doubles
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Info Section */}
            <FadeIn delay={0.2}>
              <Card className="mt-8 bg-[#2A2A2A]/30 border-[#D2B997]/20">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h3 className="text-[#D2B997] font-depixel-body mb-2">📋 Rules</h3>
                      <p className="text-[#D2B997]/70 font-depixel-small">
                        Standard ITTF (International Table Tennis Federation) rules will be followed for all matches.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-[#D2B997] font-depixel-body mb-2">⏰ Schedule</h3>
                      <p className="text-[#D2B997]/70 font-depixel-small">
                        Reporting Time: 9:00 AM sharp. Please arrive on time with your ID and registration confirmation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </FadeIn>
      </main>
    </div>
  )
}
