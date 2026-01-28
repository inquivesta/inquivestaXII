"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Store, Clock, MapPin, IndianRupee } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import { FadeIn } from "@/components/ui/fade-in"

export default function StallsPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#D2B997]/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 text-[#D2B997] hover:text-[#B8A7D9] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-depixel-small">Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="INQUIVESTA XII" width={60} height={60} className="h-10 w-auto" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-4 mt-6">
        <FadeIn>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Store className="w-8 h-8 text-[#A8D8EA]" />
              <span className="text-[#D2B997] font-depixel-small">Student Stalls</span>
            </div>
            <HyperText
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] bg-clip-text text-transparent font-futura"
              text="INQUIVESTA STALLS"
            />
          </div>
        </FadeIn>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Overview Card */}
          <FadeIn delay={0.1}>
            <Card className="bg-gradient-to-r from-[#141415] to-[#292530] border-[#D2B997]">
              <CardHeader>
                <CardTitle className="text-2xl text-[#A8D8EA] font-futura tracking-wide">
                  📋 Stall Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-[#D2B997] font-depixel-small">
                  <p>
                    We are hosting student stalls from <span className="font-bold text-[#F4D03F]">6th to 8th February 2026</span> during INQUIVESTA XII. These will be provided on a chargeable basis with flexible options for all budgets.
                  </p>
                  <p>
                    Whether you're selling merchandise, food, crafts, or services, this is the perfect opportunity to showcase your work to hundreds of festival attendees!
                  </p>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Register Your Stall Now Button */}
          <FadeIn delay={0.2}>
            <div className="flex justify-center pt-8">
              <Link href="/stalls/registration">
                <Button className="bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] hover:from-[#7FB3D3] hover:to-[#9A8BC4] text-[#1A1A1A] font-depixel-body px-12 py-7 text-lg">
                  Register Your Stall Now
                </Button>
              </Link>
            </div>
          </FadeIn>

          {/* Pricing Card */}
          <FadeIn delay={0.3}>
            <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
              <CardHeader>
                <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                  <IndianRupee className="w-6 h-6" />
                  Pricing & Offers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Regular Pricing */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-[#1A1A1A]/50 p-6 rounded-lg border border-[#D2B997]/30 hover:border-[#D2B997]/60 transition-colors">
                      <p className="text-[#D2B997] font-depixel-small text-sm">Lecture Hall Complex (LHC)</p>
                      <p className="text-[#F4D03F] font-futura text-3xl">
                        ₹999/day
                      </p>
                    </div>

                    <div className="bg-[#1A1A1A]/50 p-6 rounded-lg border border-[#D2B997]/30 hover:border-[#D2B997]/60 transition-colors">
                      <p className="text-[#D2B997] font-depixel-small text-sm">Open Air Stage Arena</p>
                      <p className="text-[#F4D03F] font-futura text-3xl">
                        <span className="line-through">₹1499</span> ₹1250/day
                      </p>
                    </div>
                  </div>

                  {/* Special Offer */}
                  <div className="bg-gradient-to-r from-[#F4D03F]/10 to-[#D2B997]/10 p-6 rounded-lg border-2 border-[#F4D03F]/50">
                    <div className="flex items-center gap-2 mb-3">
                      <IndianRupee className="w-6 h-6 text-[#F4D03F]" />
                      <span className="text-[#F4D03F] font-futura text-lg">Special Pre-Fest Offer</span>
                    </div>
                    <p className="text-white font-depixel-body text-lg mb-2">
                      2-day stall at Open Air Stage Arena
                    </p>
                    <p className="text-[#F4D03F] font-futura text-3xl">
                      <span className="line-through">₹2,859</span> ₹2,400
                    </p>
                    <p className="text-[#D2B997]/80 font-depixel-small text-sm mt-3">
                      Save ₹459! Perfect if you want maximum exposure for 2 days.
                    </p>
                  </div>

                  {/* Important Notes */}
                  <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
                    <p className="text-red-400 font-depixel-small text-sm space-y-1">
                      <span className="block font-bold">⚠️ Important Notes:</span>
                      <span className="block">• Limited capacity available - first-come-first-serve basis</span>
                      <span className="block">• Entire payment must be made in advance</span>
                      <span className="block">• Registration deadline: Tuesday, January 27, 2026 at 11:59 PM</span>
                      <span className="block">• Non-food stalls are not preferred at the Open Air Stage Arena</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* What's Included */}
          <FadeIn delay={0.4}>
            <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
              <CardHeader>
                <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">
                  What's Provided
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[#A8D8EA] font-depixel-body mb-3">✅ Included with Every Stall:</h4>
                    <ul className="space-y-2 text-[#D2B997] font-depixel-small text-sm">
                      <li>✓ 2 tables (at MAX)</li>
                      <li>✓ 4 chairs (at MAX)</li>
                      <li>✓ Stall space allocation</li>
                      <li>✓ ID cards for registered members</li>
                      <li>✓ Access to festival amenities</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[#A8D8EA] font-depixel-body mb-3">🔌 Optional Add-ons:</h4>
                    <ul className="space-y-2 text-[#D2B997] font-depixel-small text-sm">
                      <li>✓ Electric point (request during registration)</li>
                      <li>✓ LPG cylinder support (bring your own)</li>
                      <li>✓ Additional tables/chairs (subject to availability)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Registration Details */}
          <FadeIn delay={0.5}>
            <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
              <CardHeader>
                <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  Registration Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-[#D2B997] font-depixel-small">
                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg border border-[#D2B997]/30">
                    <p className="font-bold text-[#A8D8EA] mb-2">📅 Registration Timeline</p>
                    <p className="mb-2">Registration is now OPEN!</p>
                    <p className="text-[#F4D03F] font-bold">Deadline: Tuesday, January 27, 2026 at 11:59 PM</p>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg border border-[#D2B997]/30">
                    <p className="font-bold text-[#A8D8EA] mb-2">📝 Registration Process</p>
                    <ol className="space-y-2 list-decimal list-inside">
                      <li>Fill out the registration form with your details</li>
                      <li>Describe your stall and list team members</li>
                      <li>Select location and dates</li>
                      <li>Make advance payment via UPI</li>
                      <li>Receive confirmation via email</li>
                    </ol>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg border border-[#D2B997]/30">
                    <p className="font-bold text-[#A8D8EA] mb-2">📋 Required Information</p>
                    <ul className="space-y-1">
                      <li>✓ Primary contact person details</li>
                      <li>✓ All team members names and count</li>
                      <li>✓ Detailed stall description (food/non-food)</li>
                      <li>✓ Infrastructure requirements</li>
                      <li>✓ Payment proof (UTR number)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Festival Dates */}
          <FadeIn delay={0.6}>
            <Card className="bg-gradient-to-r from-[#0f7c54] to-[#474154] border-[#D2B997]">
              <CardHeader>
                <CardTitle className="text-2xl text-[#A8D8EA] font-futura tracking-wide flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  Stall Dates & Venue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-[#F4D03F] font-futura text-2xl mb-1">6th Feb</p>
                    <p className="text-[#D2B997] font-depixel-body">Friday</p>
                  </div>
                  <div className="text-center border-l border-r border-[#D2B997]/30">
                    <p className="text-[#F4D03F] font-futura text-2xl mb-1">7th Feb</p>
                    <p className="text-[#D2B997] font-depixel-body">Saturday</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[#F4D03F] font-futura text-2xl mb-1">8th Feb</p>
                    <p className="text-[#D2B997] font-depixel-body">Sunday</p>
                  </div>
                </div>
                <p className="text-[#D2B997] font-depixel-small text-center mt-6 text-sm">
                  Venue: IISER Kolkata (LHC and Open Air Stage Arena)
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          {/* CTA Button */}
          <FadeIn delay={0.7}>
            <div className="flex justify-center pt-8">
              <Link href="/stalls/registration">
                <Button className="bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] hover:from-[#7FB3D3] hover:to-[#9A8BC4] text-[#1A1A1A] font-depixel-body px-12 py-7 text-lg">
                  Register Your Stall Now
                </Button>
              </Link>
            </div>
          </FadeIn>

          {/* FAQ Section */}
          <FadeIn delay={0.8}>
            <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
              <CardHeader>
                <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-[#A8D8EA] font-depixel-body mb-2">Q: What types of stalls are allowed?</h4>
                  <p className="text-[#D2B997] font-depixel-small text-sm">
                    A: Both food and non-food stalls are welcome. You can sell merchandise, crafts, food items, services, or showcase projects. Just be clear about what you're offering.
                  </p>
                </div>

                <div className="border-t border-[#D2B997]/20 pt-4">
                  <h4 className="text-[#A8D8EA] font-depixel-body mb-2">Q: Can I bring my own equipment?</h4>
                  <p className="text-[#D2B997] font-depixel-small text-sm">
                    A: Yes! You can bring additional equipment as needed. Basic infrastructure (2 tables, 4 chairs) is provided. You can request electric points during registration.
                  </p>
                </div>

                <div className="border-t border-[#D2B997]/20 pt-4">
                  <h4 className="text-[#A8D8EA] font-depixel-body mb-2">Q: When will I know my stall allocation?</h4>
                  <p className="text-[#D2B997] font-depixel-small text-sm">
                    A: Confirmation and stall allocation will be sent via email after your payment is verified. This typically happens within 2-3 days of registration.
                  </p>
                </div>

                <div className="border-t border-[#D2B997]/20 pt-4">
                  <h4 className="text-[#A8D8EA] font-depixel-body mb-2">Q: What if my team size changes?</h4>
                  <p className="text-[#D2B997] font-depixel-small text-sm">
                    A: Contact us at inquivesta@iiserkol.ac.in with updated member details. ID cards will be issued only for registered members.
                  </p>
                </div>

                <div className="border-t border-[#D2B997]/20 pt-4">
                  <h4 className="text-[#A8D8EA] font-depixel-body mb-2">Q: Is there a limit on team members?</h4>
                  <p className="text-[#D2B997] font-depixel-small text-sm">
                    A: There's no specific limit, but remember you'll have 2 tables and 4 chairs. Larger teams will need to manage space accordingly.
                  </p>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Contact Info */}
          <FadeIn delay={0.9}>
            <Card className="bg-gradient-to-r from-[#141415] to-[#292530] border-[#D2B997]">
              <CardHeader>
                <CardTitle className="text-2xl text-[#A8D8EA] font-futura tracking-wide">
                  Have Questions?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#D2B997] font-depixel-small mb-4">
                  For any queries regarding stall registration, reach out to us:
                </p>
                <div className="space-y-2 text-[#D2B997] font-depixel-small text-sm">
                  <p>📧 Email: <span className="text-[#A8D8EA]">inquivesta@iiserkol.ac.in</span></p>
                  <p>📍 Location: IISER Kolkata</p>
                  <p>📅 Registration closes: January 27, 2026 at 11:59 PM</p>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
