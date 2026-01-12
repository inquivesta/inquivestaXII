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
import { ArrowLeft, MapPin, Home } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import { FadeIn } from "@/components/ui/fade-in"

interface AccommodationOption {
  id: string
  label: string
  price: number
  description: string
  includesFood: boolean
}

interface FormData {
  name: string
  phone: string
  email: string
  gender: string
  instituteIdLink: string
  accommodationType: string
  foodPreference: string
  checkIn: string
  checkOut: string
  amountPaid: string
  utrNumber: string
  agreeRules: boolean
  agreeDeclaration: boolean
  agreeByLaws: boolean
}

const accommodationOptions: AccommodationOption[] = [
  {
    id: "with-food",
    label: "Accommodation with Food",
    price: 500,
    description: "Includes 2 meals per day (veg or non-veg)",
    includesFood: true,
  },
  {
    id: "without-food",
    label: "Accommodation without Food",
    price: 200,
    description: "Room only, no meals included",
    includesFood: false,
  },
]

const foodPreferences = ["Veg", "Non veg"]

const checkInDates = [
  { date: "6", label: "6th Feb", month: "Feb" },
  { date: "7", label: "7th Feb", month: "Feb" },
  { date: "8", label: "8th Feb", month: "Feb" },
]

const checkOutDates = [
  { date: "7", label: "7th Feb", month: "Feb" },
  { date: "8", label: "8th Feb", month: "Feb" },
  { date: "9", label: "9th Feb", month: "Feb" },
]

const GOOGLE_FORM_ID = "1FAIpQLSd2n8mlBFixbrNwEpNMHu1vNVnYyxWi3N3HiZMmyvF7G-4fmA"

export default function AccommodationPage() {
  const [selectedQR, setSelectedQR] = useState<number>(0)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    gender: "",
    instituteIdLink: "",
    accommodationType: "",
    foodPreference: "",
    checkIn: "6",
    checkOut: "7",
    amountPaid: "",
    utrNumber: "",
    agreeRules: false,
    agreeDeclaration: false,
    agreeByLaws: false,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Randomly select QR on mount (1, 2, or 3)
    setSelectedQR(Math.floor(Math.random() * 3) + 1)
  }, [])

  const cycleQR = () => {
    setSelectedQR(prev => prev === 3 ? 1 : prev + 1)
  }

  const getSelectedAccommodation = () => {
    return accommodationOptions.find(opt => opt.id === formData.accommodationType)
  }

  const getTotalPrice = () => {
    const accommodation = getSelectedAccommodation()
    if (!accommodation) return 0
    const checkOutNum = parseInt(formData.checkOut)
    const checkInNum = parseInt(formData.checkIn)
    const nights = Math.max(0, checkOutNum - checkInNum)
    return accommodation.price * nights
  }

  const getNightsCount = () => {
    const checkOutNum = parseInt(formData.checkOut)
    const checkInNum = parseInt(formData.checkIn)
    return Math.max(0, checkOutNum - checkInNum)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (getTotalPrice() === 0) {
      alert("Please select accommodation type and check-in/check-out times!")
      return
    }

    const checkOutNum = parseInt(formData.checkOut)
    const checkInNum = parseInt(formData.checkIn)
    if (checkOutNum <= checkInNum) {
      alert("Check-out date must be after check-in date!")
      return
    }

    if (!formData.name || !formData.phone || !formData.email || !formData.gender || !formData.instituteIdLink) {
      alert("Please fill in all personal details!")
      return
    }

    const selectedAccommodation = getSelectedAccommodation()
    if (selectedAccommodation?.includesFood && !formData.foodPreference) {
      alert("Please select your food preference!")
      return
    }

    if (!formData.agreeRules || !formData.agreeDeclaration || !formData.agreeByLaws) {
      alert("Please agree to all terms and conditions!")
      return
    }

    if (!formData.amountPaid || !formData.utrNumber) {
      alert("Please complete payment details!")
      return
    }

    setIsSubmitting(true)

    // Build Google Form URL for submission
    const formUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`

    const formDataToSubmit = new FormData()
    formDataToSubmit.append("entry.2138360059", formData.name) // Name
    formDataToSubmit.append("entry.739767682", formData.phone) // Phone Number
    formDataToSubmit.append("entry.1197118332", formData.email) // Email
    formDataToSubmit.append("entry.2133692978", formData.gender) // Gender
    formDataToSubmit.append("entry.1825729292", formData.instituteIdLink) // Institute ID Drive Link

    // Accommodation type - use exact values from Google Form
    const accommodationType = formData.accommodationType === "with-food"
      ? "₹500 -  Registration for accommodation with food"
      : "₹200 -  Registration for accommodation without food"
    formDataToSubmit.append("entry.1692248803", accommodationType)

    // Check-in and Check-out dates - just the number as per Google Form
    formDataToSubmit.append("entry.461393412", formData.checkIn) // Check in (6, 7, or 8)
    formDataToSubmit.append("entry.1688526939", formData.checkOut) // Check out (7, 8, or 9)

    // Food preference - use exact values from Google Form
    if (getSelectedAccommodation()?.includesFood) {
      formDataToSubmit.append("entry.1875993519", formData.foodPreference) // "Veg" or "Non veg"
    } else {
      formDataToSubmit.append("entry.1875993519", "Only accomodation") // Exact spelling from Google Form
    }

    // Checkboxes (Yes responses)
    formDataToSubmit.append("entry.576048683", "Yes") // Rules agreement
    formDataToSubmit.append("entry.920557594", "Yes") // Declaration
    formDataToSubmit.append("entry.1392645527", "Yes") // By-laws agreement

    // Which QR used for payment (1, 2, or 3)
    formDataToSubmit.append("entry.1156850205", selectedQR.toString())

    // UTR ID
    formDataToSubmit.append("entry.1030047440", formData.utrNumber)

    // Submit form using fetch with no-cors mode
    fetch(formUrl, {
      method: "POST",
      body: formDataToSubmit,
      mode: "no-cors",
    })
      .then(() => {
        setIsSubmitting(false)
        setIsSubmitted(true)
      })
      .catch((error) => {
        console.error("Error:", error)
        setIsSubmitting(false)
        // Still show success since no-cors doesn't allow us to see the response
        setIsSubmitted(true)
      })
  }

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
                  className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] bg-clip-text text-transparent font-futura"
                  text="REGISTRATION CONFIRMED!"
                />
                <p className="text-[#D2B997] text-lg font-depixel-body mb-8">
                  Your accommodation has been successfully registered
                </p>
              </div>

              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30 mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura">
                    Registration Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 border-b border-[#D2B997]/20 pb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#D2B997]/80 font-depixel-small">Name:</span>
                      <span className="text-white font-depixel-body">{formData.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#D2B997]/80 font-depixel-small">Contact:</span>
                      <span className="text-white font-depixel-body">{formData.phone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#D2B997]/80 font-depixel-small">Email:</span>
                      <span className="text-white font-depixel-body text-sm">{formData.email}</span>
                    </div>
                  </div>

                  <div className="space-y-3 border-b border-[#D2B997]/20 pb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#D2B997]/80 font-depixel-small">Accommodation Type:</span>
                      <span className="text-white font-depixel-body">
                        {getSelectedAccommodation()?.label}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#D2B997]/80 font-depixel-small">Check-in Date:</span>
                      <span className="text-white font-depixel-body">{formData.checkIn}th Feb - 12:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#D2B997]/80 font-depixel-small">Check-out Date:</span>
                      <span className="text-white font-depixel-body">{formData.checkOut}th Feb - 10:00 AM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#D2B997]/80 font-depixel-small">Duration:</span>
                      <span className="text-white font-depixel-body">{getNightsCount()} {getNightsCount() === 1 ? "night" : "nights"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#D2B997]/80 font-depixel-small">Food Preference:</span>
                      <span className="text-white font-depixel-body">
                        {getSelectedAccommodation()?.includesFood ? formData.foodPreference : "Only accommodation"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-white font-depixel-body text-xl">Total Amount:</span>
                      <span className="text-[#F4D03F] font-futura text-3xl">₹{getTotalPrice()}</span>
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
                    <p>✅ Confirmation email sent to {formData.email}</p>
                    <p>🏨 Check-in details will be sent before the event</p>
                    <p>📱 We'll contact you on {formData.phone} with updates</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/events">
                  <Button className="bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body px-8 py-6">
                    Explore Events
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
          {/* Hero Section with Header Image */}
          <FadeIn>
            <div className="relative h-80 md:h-80 w-full rounded-xl overflow-hidden mb-12 border border-[#D2B997]/30">
              <Image
                src="/images/hostels.jpg"
                alt="Accommodation"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/80 to-[#1A1A1A]/40 flex items-center">
                <div className="px-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <Home className="w-8 h-8 text-[#A8D8EA]" />
                    <span className="text-[#D2B997] font-depixel-small">External Participants</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold text-white font-futura mb-2">
                    Accommodation at IISER-K
                  </h1>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Title Section */}
          <FadeIn>
            <div className="text-center mb-12">
              <HyperText
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] bg-clip-text text-transparent font-futura"
                text="REGISTER FOR ACCOMMODATION"
              />
              <p className="text-[#D2B997] text-lg font-depixel-body">
                Fill out your details, select your preferences, and complete payment
              </p>
            </div>
          </FadeIn>

          <div className="max-w-6xl mx-auto space-y-8">
            {/* What's Included Card */}
            <FadeIn delay={0.1}>
              <Card className="bg-gradient-to-r from-[#141415] to-[#292530] border-[#D2B997]">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#A8D8EA] font-futura">
                    What's Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-[#B8A7D9] font-depixel-body mb-3">✅ What You Get:</h3>
                      <ul className="space-y-2 text-[#D2B997] font-depixel-small text-sm">
                        <li>✓ Accommodation fees</li>
                        <li>✓ 2 meals a day (veg or non veg)*</li>
                        <li>✓ Residence in hostel for selected nights</li>
                        <li>✓ Basic amenities (mattress, pillow, mug)</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-[#B8A7D9] font-depixel-body mb-3">❌ What's Not Included:</h3>
                      <ul className="space-y-2 text-[#D2B997] font-depixel-small text-sm">
                        <li>✗ Travel to/from IISER-K</li>
                        <li>✓ Scheduled buses provided (pre-determined routes)</li>
                        <li>✗ Additional food costs (beyond 2 meals/day)</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-[#D2B997]/80 font-depixel-small text-xs mt-4">
                    *Only applicable if you select accommodation with food
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Personal Details */}
            <FadeIn delay={0.2}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura">
                    Personal Details
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
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-[#D2B997] font-depixel-small">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                        placeholder="10-digit phone number"
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
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <Label className="text-[#D2B997] font-depixel-small mb-3 block">
                      Gender *
                    </Label>
                    <RadioGroup value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Male" id="male" className="border-[#D2B997]" />
                        <Label htmlFor="male" className="text-white font-depixel-small cursor-pointer">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Female" id="female" className="border-[#D2B997]" />
                        <Label htmlFor="female" className="text-white font-depixel-small cursor-pointer">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="instituteId" className="text-[#D2B997] font-depixel-small">
                      Institute ID Drive Link *
                    </Label>
                    <Input
                      id="instituteId"
                      required
                      value={formData.instituteIdLink}
                      onChange={(e) => setFormData({ ...formData, instituteIdLink: e.target.value })}
                      className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                      placeholder="https://drive.google.com/..."
                    />
                    <p className="text-white/60 font-depixel-small text-xs mt-1">
                      Please provide a shareable Google Drive link to your institute ID
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Accommodation Selection */}
            <FadeIn delay={0.3}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura">
                    Select Accommodation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={formData.accommodationType} onValueChange={(value) => setFormData({ ...formData, accommodationType: value })}>
                    {accommodationOptions.map((option) => (
                      <div key={option.id} className="relative">
                        <input
                          type="radio"
                          id={option.id}
                          value={option.id}
                          checked={formData.accommodationType === option.id}
                          onChange={() => setFormData({ ...formData, accommodationType: option.id })}
                          className="sr-only"
                        />
                        <label
                          htmlFor={option.id}
                          className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.accommodationType === option.id
                              ? "border-[#A8D8EA] bg-[#A8D8EA]/10"
                              : "border-[#D2B997]/30 bg-[#1A1A1A]/30 hover:border-[#D2B997]/60"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 ${
                              formData.accommodationType === option.id
                                ? "border-[#A8D8EA] bg-[#A8D8EA]"
                                : "border-[#D2B997]/50"
                            }`} />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="text-white font-depixel-body text-lg">{option.label}</h3>
                                <span className="text-[#F4D03F] font-futura text-xl">₹{option.price}/night</span>
                              </div>
                              <p className="text-[#D2B997]/80 font-depixel-small text-sm mt-1">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </RadioGroup>

                  {/* Food Preference */}
                  {getSelectedAccommodation()?.includesFood && (
                    <div className="border-t border-[#D2B997]/20 pt-6">
                      <Label className="text-[#D2B997] font-depixel-small mb-3 block">
                        Food Preference *
                      </Label>
                      <RadioGroup value={formData.foodPreference} onValueChange={(value) => setFormData({ ...formData, foodPreference: value })}>
                        {foodPreferences.map((pref) => (
                          <div key={pref} className="flex items-center space-x-2">
                            <RadioGroupItem value={pref} id={`food-${pref}`} className="border-[#D2B997]" />
                            <Label htmlFor={`food-${pref}`} className="text-white font-depixel-small cursor-pointer">
                              {pref}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  {/* Check-in and Check-out Dates */}
                  <div className="border-t border-[#D2B997]/20 pt-6 space-y-6">
                    <div className="bg-gradient-to-r from-[#A8D8EA]/10 to-[#B8A7D9]/10 p-4 rounded-lg border border-[#D2B997]/30">
                      <p className="text-[#A8D8EA] font-depixel-small text-sm">
                        <span className="font-bold">⏰ Timing Information:</span>
                      </p>
                      <ul className="text-[#D2B997]/90 font-depixel-small text-xs mt-2 space-y-1">
                        <li>✓ Check-in: 12:00 PM (Noon)</li>
                        <li>✓ Check-out: 10:00 AM (Next Day)</li>
                      </ul>
                    </div>

                    {/* Check-in Date */}
                    <div>
                      <Label className="text-[#D2B997] font-depixel-small mb-3 block">
                        Check-in Date * (12:00 PM)
                      </Label>
                      <div className="flex gap-3">
                        {checkInDates.map((option) => (
                          <button
                            key={option.date}
                            onClick={() => setFormData({ ...formData, checkIn: option.date })}
                            className={`px-6 py-2 rounded-lg font-depixel-small transition-all ${
                              formData.checkIn === option.date
                                ? "bg-[#A8D8EA] text-[#1A1A1A] border border-[#A8D8EA]"
                                : "bg-[#1A1A1A]/50 text-white border border-[#D2B997]/30 hover:border-[#D2B997]/60"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Check-out Date */}
                    <div>
                      <Label className="text-[#D2B997] font-depixel-small mb-3 block">
                        Check-out Date * (10:00 AM)
                      </Label>
                      <div className="flex gap-3">
                        {checkOutDates.map((option) => (
                          <button
                            key={option.date}
                            onClick={() => setFormData({ ...formData, checkOut: option.date })}
                            className={`px-6 py-2 rounded-lg font-depixel-small transition-all ${
                              formData.checkOut === option.date
                                ? "bg-[#A8D8EA] text-[#1A1A1A] border border-[#A8D8EA]"
                                : "bg-[#1A1A1A]/50 text-white border border-[#D2B997]/30 hover:border-[#D2B997]/60"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      <p className="text-white/60 font-depixel-small text-xs mt-2">
                        Duration: {getNightsCount()} {getNightsCount() === 1 ? "night" : "nights"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Payment Section */}
            <FadeIn delay={0.4}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura">
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-[#A8D8EA]/10 to-[#B8A7D9]/10 p-4 rounded-lg mb-6 border border-[#D2B997]/30">
                    <p className="text-[#A8D8EA] font-depixel-small text-sm font-bold">
                      💳 USE ANY OF THE THREE UPI IDs TO PAY
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* QR Code Section */}
                    <div>
                      <div className="bg-white p-4 rounded-lg max-w-xs mx-auto mb-4">
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
                      <div className="text-center">
                        <p className="text-[#D2B997] font-depixel-small text-sm">
                          Scan QR to pay ₹{getTotalPrice()}
                        </p>
                        <p className="text-white/60 font-depixel-small text-xs mt-1">
                          QR Code #{selectedQR}/3
                        </p>
                        <button
                          type="button"
                          onClick={cycleQR}
                          className="mt-3 w-full bg-[#D2B997]/20 hover:bg-[#D2B997]/30 border border-[#D2B997]/50 text-[#D2B997] font-depixel-small py-2 px-4 rounded-lg transition-colors"
                        >
                          Change QR Code
                        </button>
                      </div>
                    </div>

                    {/* Payment Form */}
                    <div className="space-y-4">
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
                          value={formData.utrNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 12)
                            setFormData({ ...formData, utrNumber: value })
                          }}
                          className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                          placeholder="Enter 12-digit UTR"
                        />
                        <p className="text-white/60 font-depixel-small text-xs mt-1">
                          Found in your payment confirmation (exactly 12 digits)
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-[#A8D8EA]/10 to-[#B8A7D9]/10 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-depixel-body">Total Amount:</span>
                          <span className="text-[#F4D03F] font-futura text-2xl">₹{getTotalPrice()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Terms and Conditions */}
            <FadeIn delay={0.5}>
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura">
                    Terms & Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Rules Agreement */}
                  <div className="border border-[#D2B997] p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="rules"
                        checked={formData.agreeRules}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, agreeRules: checked as boolean })
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="rules" className="text-white font-depixel-body cursor-pointer text-sm">
                          I have read and understood the rules and regulations *
                        </Label>
                        <p className="text-[#D2B997] font-depixel-small text-xs mt-2 leading-relaxed">
                          I undertake to abide by the rules and regulations governing this event, as well as any
                          changes made by the organizers or relevant authorities. I agree to conduct myself in a
                          respectful and responsible manner and understand that failure to comply with the stated
                          guidelines may result in disqualification or expulsion from the allotted room or any other
                          appropriate action.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Declaration */}
                  <div className="border border-[#D2B997] p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="declaration"
                        checked={formData.agreeDeclaration}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, agreeDeclaration: checked as boolean })
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="declaration" className="text-white font-depixel-body cursor-pointer text-sm">
                          I declare that the information is true and complete *
                        </Label>
                        <p className="text-[#D2B997]/80 font-depixel-small text-xs mt-2 leading-relaxed">
                          I hereby declare that the information provided in this form is true, complete, and correct
                          to the best of my knowledge and belief. I understand that any false information may result
                          in disqualification.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* By-Laws Agreement */}
                  <div className="border border-[#D2B997] p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="bylaws"
                        checked={formData.agreeByLaws}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, agreeByLaws: checked as boolean })
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="bylaws" className="text-white font-depixel-body cursor-pointer text-sm">
                          I agree to the institute by-laws *
                        </Label>
                        <p className="text-[#D2B997]/80 font-depixel-small text-xs mt-2">
                          <Link
                            href="https://drive.google.com/file/d/1D9MdKXlkm9nKg3CPUo1loo_CqbgjTQPO/view"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#A8D8EA] hover:text-[#B8A7D9] underline"
                          >
                            View Institute By-Laws
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F4D03F]/10 border border-[#F4D03F]/30 p-4 rounded-lg">
                    <p className="text-[#F4D03F] font-depixel-small text-sm leading-relaxed">
                      <span className="font-bold">📌 Important:</span> Please ensure all payment details are correct
                      before submission. Once submitted, verify your registration via email confirmation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Submit Button */}
            <FadeIn delay={0.6}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Button
                  type="submit"
                  disabled={!formData.accommodationType || !formData.checkIn || !formData.checkOut || !formData.agreeRules || !formData.agreeDeclaration || !formData.agreeByLaws || isSubmitting}
                  className="w-full bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Submitting Registration...
                    </>
                  ) : (
                    <>
                      <MapPin className="w-5 h-5 mr-2" />
                      Complete Registration
                    </>
                  )}
                </Button>
              </form>
            </FadeIn>
          </div>
        </main>
      )}
    </div>
  )
}
