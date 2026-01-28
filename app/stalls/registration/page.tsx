"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Store } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import { FadeIn } from "@/components/ui/fade-in"

interface FormData {
  primaryMemberName: string
  instituteEmail: string
  contactNumber: string
  memberNames: string
  stallDescription: string
  stallRequirements: string
  lpgCylinders: string
  location: string
  days: {
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
  amountPaid: string
  utrNumber: string
  selectedQR: number
}

const GOOGLE_FORM_ID = "1FAIpQLSc6fAn8jBDvGZHodDi6CaApLcrT9u-mOEuv4YY6uDCcB_0zmw"

const stallPricing = [
  { location: "Lecture Hall Complex (LHC)", price: 999, description: "₹999 per day" },
  { location: "Open Air Stage Arena", price: 1250, description: "<span class='line-through'>₹1,499</span> ₹1,250 per day. Note: Non-food stalls are not preferred and OAS is not available on 6th Feb." },
]

const days = [
  { id: "friday", label: "Friday, 6th Feb", value: "Friday, 6th" },
  { id: "saturday", label: "Saturday, 7th Feb", value: "Saturday, 7th" },
  { id: "sunday", label: "Sunday, 8th Feb", value: "Sunday, 8th" },
]

export default function StallsRegistrationPage() {
  const [selectedQR, setSelectedQR] = useState<number>(0)
  const [formData, setFormData] = useState<FormData>({
    primaryMemberName: "",
    instituteEmail: "",
    contactNumber: "",
    memberNames: "",
    stallDescription: "",
    stallRequirements: "",
    lpgCylinders: "",
    location: "",
    days: {
      friday: false,
      saturday: false,
      sunday: false,
    },
    amountPaid: "",
    utrNumber: "",
    selectedQR: 0,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    setSelectedQR(Math.floor(Math.random() * 3) + 1)
  }, [])

  const cycleQR = () => {
    setSelectedQR((prev) => (prev === 3 ? 1 : prev + 1))
  }

  const getSelectedDays = (): string[] => {
    const selected = []
    if (formData.days.friday) selected.push("Friday, 6th")
    if (formData.days.saturday) selected.push("Saturday, 7th")
    if (formData.days.sunday) selected.push("Sunday, 8th")
    return selected
  }

  const getSelectedLocation = () => {
    return stallPricing.find((s) => s.location === formData.location)
  }

  const getNumberOfDays = (): number => {
    return getSelectedDays().length
  }

  const getTotalPrice = (): number => {
    const location = getSelectedLocation()
    if (!location) return 0

    // Check if it's 2 days at Open Air Stage Arena for special offer
    const days = getNumberOfDays()
    if (location.location === "Open Air Stage Arena" && days === 2) {
      return 2400
    }

    // Regular pricing
    return location.price * days
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    // Validation
    if (!formData.primaryMemberName.trim()) {
      setErrorMessage("Please enter the primary member name")
      return
    }

    if (!formData.instituteEmail.trim()) {
      setErrorMessage("Please enter the institute email")
      return
    }

    if (!formData.contactNumber.trim()) {
      setErrorMessage("Please enter the contact number")
      return
    }

    if (!formData.memberNames.trim()) {
      setErrorMessage("Please provide member names and count")
      return
    }

    if (!formData.stallDescription.trim()) {
      setErrorMessage("Please describe your stall")
      return
    }

    if (!formData.stallRequirements.trim()) {
      setErrorMessage("Please state your stall requirements")
      return
    }

    if (!formData.lpgCylinders) {
      setErrorMessage("Please indicate if you need LPG cylinders")
      return
    }

    if (!formData.location) {
      setErrorMessage("Please select a location")
      return
    }

    if (getNumberOfDays() === 0) {
      setErrorMessage("Please select at least one day")
      return
    }

    if (getTotalPrice() === 0) {
      setErrorMessage("Unable to calculate total price")
      return
    }

    if (!formData.amountPaid || !formData.utrNumber) {
      setErrorMessage("Please complete payment details")
      return
    }

    setIsSubmitting(true)

    try {
      const formUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`
      const formDataToSubmit = new FormData()

      // Basic fields
      formDataToSubmit.append("entry.641445190", formData.primaryMemberName)
      formDataToSubmit.append("entry.1509293287", formData.instituteEmail)
      formDataToSubmit.append("entry.1197385959", formData.contactNumber)
      formDataToSubmit.append("entry.122420896", formData.memberNames)
      formDataToSubmit.append("entry.429571191", formData.stallDescription)
      formDataToSubmit.append("entry.210801950", formData.stallRequirements)

      // LPG Cylinders
      formDataToSubmit.append("entry.1189055213", formData.lpgCylinders)

      // Location
      formDataToSubmit.append("entry.1661894264", formData.location)

      // Days - append each selected day
      const selectedDays = getSelectedDays()
      selectedDays.forEach((day) => {
        formDataToSubmit.append("entry.723848085", day)
      })

      // Payment - QR number, amount paid, and UTR
      formDataToSubmit.append("entry.400901891", `QR ${selectedQR}`)
      formDataToSubmit.append("entry.1359768598", formData.amountPaid)
      formDataToSubmit.append("entry.604879631", formData.utrNumber)

      // Submit form using fetch with no-cors mode
      await fetch(formUrl, {
        method: "POST",
        body: formDataToSubmit,
        mode: "no-cors",
      })

      setIsSubmitting(false)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error:", error)
      setIsSubmitting(false)
      setIsSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#D2B997]/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/stalls"
            className="flex items-center space-x-2 text-[#D2B997] hover:text-[#B8A7D9] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-depixel-small">Back to Stalls</span>
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
                  <svg className="w-12 h-12 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <HyperText
                  className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] bg-clip-text text-transparent font-futura tracking-wide"
                  text="REGISTRATION CONFIRMED!"
                />
                <p className="text-[#D2B997] text-lg font-depixel-body mb-8">
                  Your stall registration for Inquivesta XII has been successfully submitted
                </p>
              </div>

              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30 mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">
                    Registration Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-left border-b border-[#D2B997]/20 pb-4">
                    <div className="flex justify-between">
                      <span className="text-[#D2B997]/80 font-depixel-small">Primary Member:</span>
                      <span className="text-white font-depixel-body">{formData.primaryMemberName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#D2B997]/80 font-depixel-small">Contact:</span>
                      <span className="text-white font-depixel-body">{formData.contactNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#D2B997]/80 font-depixel-small">Email:</span>
                      <span className="text-white font-depixel-body text-sm">{formData.instituteEmail}</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-left border-b border-[#D2B997]/20 pb-4">
                    <div className="flex justify-between">
                      <span className="text-[#D2B997]/80 font-depixel-small">Location:</span>
                      <span className="text-white font-depixel-body">{formData.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#D2B997]/80 font-depixel-small">Days:</span>
                      <span className="text-white font-depixel-body">{getSelectedDays().join(", ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#D2B997]/80 font-depixel-small">LPG Cylinders:</span>
                      <span className="text-white font-depixel-body">{formData.lpgCylinders}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-white font-depixel-body text-xl">Total Amount:</span>
                      <span className="text-[#F4D03F] font-futura tracking-wide text-3xl">₹{getTotalPrice()}</span>
                    </div>

                    <div className="text-left space-y-2 text-sm font-depixel-small">
                      <div className="flex justify-between text-[#D2B997]/80">
                        <span>Payment Method:</span>
                        <span className="text-white">UPI (QR #{selectedQR})</span>
                      </div>
                      <div className="flex justify-between text-[#D2B997]/80">
                        <span>UTR Number:</span>
                        <span className="text-white">{formData.utrNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-sm text-[#D2B997]/80 font-depixel-small space-y-2">
                    <p>✅ Registration submitted successfully</p>
                    <p>🏪 Stall allocation will be confirmed after payment verification</p>
                    <p>📱 We&apos;ll contact you on {formData.contactNumber} with updates</p>
                    <p>⏰ Registration closes on January 27, 2026 at 11:59 PM</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/stalls">
                  <Button className="bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body px-8 py-6">
                    Back to Stalls
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="bg-white/10 hover:bg-white/20 text-white font-depixel-body px-8 py-6 border border-[#D2B997]/30">
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
          {/* Hero Section */}
          <FadeIn>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Store className="w-8 h-8 text-[#A8D8EA]" />
                <span className="text-[#D2B997] font-depixel-small">Student Stalls</span>
              </div>
              <HyperText
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] bg-clip-text text-transparent font-futura tracking-wide"
                text="REGISTER YOUR STALL"
              />
              <p className="text-[#D2B997] text-lg font-depixel-body">
                Showcase your products and services at Inquivesta XII (Feb 6-8, 2026)
              </p>
            </div>
          </FadeIn>

          {errorMessage && (
            <div className="max-w-4xl mx-auto mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg font-depixel-small">
              {errorMessage}
            </div>
          )}

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Important Notice */}
            <FadeIn delay={0.1}>
              <Card className="bg-gradient-to-r from-[#141415] to-[#292530] border-[#D2B997]">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#A8D8EA] font-futura tracking-wide">
                    📋 Important Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-[#D2B997] font-depixel-small">
                    <p>
                      <span className="font-bold">🏪 Stall Locations & Pricing:</span>
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li>✓ LHC - ₹999 per day</li>
                      <li>✓ Open Air Stage Arena - <span className="line-through">₹1,499</span> ₹1,250 per day</li>
                      <li>✓ <span className="text-[#F4D03F]">SPECIAL OFFER</span>: 2-day stall at Open Air Stage Arena - <span className="line-through">₹2,859</span> ₹2,400</li>
                    </ul>
                    <p className="text-[#D2B997]/80 text-xs mt-4">
                      ⚠️ Limited capacity available on a first-come-first-serve basis. Entire payment must be made in advance.
                    </p>
                    <p className="text-[#D2B997]/80 text-xs">
                      📅 Registration deadline: Tuesday, January 27, 2026 at 11:59 PM
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Personal Details */}
            <FadeIn delay={0.2}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">
                    Primary Member Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="primaryName" className="text-[#D2B997] font-depixel-small">
                      Name of Primary Member *
                    </Label>
                    <Input
                      id="primaryName"
                      required
                      value={formData.primaryMemberName}
                      onChange={(e) => setFormData({ ...formData, primaryMemberName: e.target.value })}
                      className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                      placeholder="Enter primary member name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-[#D2B997] font-depixel-small">
                        Institute Email ID *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.instituteEmail}
                        onChange={(e) => setFormData({ ...formData, instituteEmail: e.target.value })}
                        className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                        placeholder="name@iiserkol.ac.in"
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
                        value={formData.contactNumber}
                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                        className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                        placeholder="10-digit phone number"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Stall Team */}
            <FadeIn delay={0.3}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">
                    Stall Team Members
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="members" className="text-[#D2B997] font-depixel-small">
                      Number of People and Their Names *
                    </Label>
                    <Textarea
                      id="members"
                      required
                      value={formData.memberNames}
                      onChange={(e) => setFormData({ ...formData, memberNames: e.target.value })}
                      className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small min-h-24"
                      placeholder="E.g., 3 members: John Doe, Jane Smith, Bob Johnson&#10;(ID cards will be issued only to registered members)"
                    />
                    <p className="text-white/60 font-depixel-small text-xs mt-1">
                      ID cards will be issued only to registered stall members
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Stall Details */}
            <FadeIn delay={0.4}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">
                    Stall Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="description" className="text-[#D2B997] font-depixel-small">
                      Stall Description *
                    </Label>
                    <Textarea
                      id="description"
                      required
                      value={formData.stallDescription}
                      onChange={(e) => setFormData({ ...formData, stallDescription: e.target.value })}
                      className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small min-h-24"
                      placeholder="Describe all items/services you will provide. Please explicitly mention whether this is a FOOD or NON-FOOD stall."
                    />
                    <p className="text-white/60 font-depixel-small text-xs mt-1">
                      Note: Providing both food and non-food services in a single stall is discouraged
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="requirements" className="text-[#D2B997] font-depixel-small">
                      Stall Requirements *
                    </Label>
                    <Textarea
                      id="requirements"
                      required
                      value={formData.stallRequirements}
                      onChange={(e) => setFormData({ ...formData, stallRequirements: e.target.value })}
                      className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small min-h-24"
                      placeholder="State number of tables, chairs, and if electric point required (A maximum of 2 tables and 4 chairs will be provided)"
                    />
                    <p className="text-white/60 font-depixel-small text-xs mt-1">
                      Maximum: 2 tables and 4 chairs will be provided
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* LPG Cylinders */}
            <FadeIn delay={0.5}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">
                    LPG Cylinders
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Label className="text-[#D2B997] font-depixel-small mb-3 block">
                    Will you be using LPG cylinders? *
                  </Label>
                  <RadioGroup value={formData.lpgCylinders} onValueChange={(value) => setFormData({ ...formData, lpgCylinders: value })}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="lpg-yes" className="border-[#D2B997] text-[#A8D8EA] data-[state=checked]:border-[#A8D8EA] data-[state=checked]:bg-[#A8D8EA]" />
                      <Label htmlFor="lpg-yes" className="text-white font-depixel-small cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="lpg-no" className="border-[#D2B997] text-[#A8D8EA] data-[state=checked]:border-[#A8D8EA] data-[state=checked]:bg-[#A8D8EA]" />
                      <Label htmlFor="lpg-no" className="text-white font-depixel-small cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                  <p className="text-white/60 font-depixel-small text-xs mt-2">
                    Note: No cylinders will be provided from our end
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Location and Days */}
            <FadeIn delay={0.6}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">
                    Location & Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Location */}
                  <div>
                    <Label className="text-[#D2B997] font-depixel-small mb-3 block">
                      Select Location *
                    </Label>
                    <RadioGroup value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                      {stallPricing.map((location) => (
                        <div key={location.location} className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer mb-2 transition-all ${formData.location === location.location ? 'border-[#A8D8EA] bg-[#A8D8EA]/10' : 'border-[#D2B997]/30 hover:border-[#D2B997]/60'}`}>
                          <RadioGroupItem value={location.location} id={location.location} className="border-[#D2B997] text-[#A8D8EA] data-[state=checked]:border-[#A8D8EA] data-[state=checked]:bg-[#A8D8EA]" />
                          <Label htmlFor={location.location} className="cursor-pointer flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-white font-depixel-body">{location.location}</p>
                                <p className="text-[#D2B997]/80 font-depixel-small text-xs">{location.description}</p>
                              </div>
                              <span className="text-[#F4D03F] font-futura tracking-wide">₹{location.price}/day</span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <p className="text-white/60 font-depixel-small text-xs mt-2">
                      Non-food stalls are not preferred at the Open Air Stage Arena location
                    </p>
                  </div>

                  {/* Days Selection */}
                  <div className="border-t border-[#D2B997]/20 pt-6">
                    <Label className="text-[#D2B997] font-depixel-small mb-3 block">
                      Which day(s) do you plan to keep your stall open? *
                    </Label>
                    <div className="space-y-3">
                      {days.map((day) => (
                        <div key={day.id} className="flex items-center space-x-3 p-3 rounded-lg border border-[#D2B997]/30 hover:border-[#D2B997]/60 cursor-pointer">
                          <Checkbox
                            id={day.id}
                            checked={formData.days[day.id as keyof typeof formData.days]}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                days: {
                                  ...formData.days,
                                  [day.id]: checked,
                                },
                              })
                            }
                            className="border-[#D2B997]"
                          />
                          <Label htmlFor={day.id} className="cursor-pointer flex-1 text-white font-depixel-body">
                            {day.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Summary */}
                  {formData.location && getNumberOfDays() > 0 && (
                    <div className="border-t border-[#D2B997]/20 pt-6 bg-[#1A1A1A]/50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-depixel-body">Total Amount:</span>
                        <span className="text-[#F4D03F] font-futura tracking-wide text-2xl">₹{getTotalPrice()}</span>
                      </div>
                      <p className="text-[#D2B997]/80 font-depixel-small text-xs mt-2">
                        {formData.location} × {getNumberOfDays()} day{getNumberOfDays() !== 1 ? "s" : ""}
                        {formData.location === "Open Air Stage Arena" && getNumberOfDays() === 2 && " (Special offer applied)"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeIn>

            {/* Payment */}
            <FadeIn delay={0.7}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura tracking-wide">
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-[#A8D8EA]/10 to-[#B8A7D9]/10 p-4 rounded-lg border border-[#D2B997]/30 mb-6">
                    <p className="text-[#A8D8EA] font-depixel-small text-sm font-bold">
                      ⚠️ IMPORTANT: Entire payment must be made in advance
                    </p>
                  </div>

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
                        Scan QR code to pay ₹{getTotalPrice()}
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
                      <div>
                        <Label htmlFor="amountPaid" className="text-[#D2B997] font-depixel-small">
                          Amount Paid *
                        </Label>
                        <Input
                          id="amountPaid"
                          type="number"
                          required
                          value={formData.amountPaid}
                          onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                          className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                          placeholder={getTotalPrice().toString()}
                        />
                      </div>

                      <div>
                        <Label htmlFor="utr" className="text-[#D2B997] font-depixel-small">
                          UTR Number * (12 digits)
                        </Label>
                        <Input
                          id="utr"
                          required
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]{12}"
                          maxLength={12}
                          value={formData.utrNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 12)
                            setFormData({ ...formData, utrNumber: value })
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
            <FadeIn delay={0.8}>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] hover:from-[#7FB3D3] hover:to-[#9A8BC4] text-[#1A1A1A] font-depixel-body px-12 py-6 text-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </Button>
              </div>
            </FadeIn>
          </div>
        </main>
      )}
    </div>
  )
}
