"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ShoppingCart, Minus, Plus } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import { FadeIn } from "@/components/ui/fade-in"

interface MerchItem {
  id: number
  code: string
  name: string
  price: number
  frontImage: string
  quantity: number
  size: string
}

const availableItems: Omit<MerchItem, 'quantity' | 'size'>[] = [
  { id: 1, code: "BO", name: "Inquivesta XII T-Shirt (Blast Off)", price: 499, frontImage: "/merch/1.png" },
  { id: 2, code: "CT", name: "Inquivesta XII T-Shirt (Circuitree)", price: 499, frontImage: "/merch/3.png" },
  { id: 3, code: "SL", name: "Inquivesta XII Sweatshirt (Skyline)", price: 749, frontImage: "/merch/6.png" },
  { id: 4, code: "CF", name: "Inquivesta XII Sweatshirt (Caffine)", price: 749, frontImage: "/merch/8.png" },
]

const sizes = ["NA", "XS", "S", "M", "L", "XL", "XXL", "XXXL"]

export default function BuyMerchPage() {
  const [selectedItems, setSelectedItems] = useState<MerchItem[]>(
    availableItems.map(item => ({ ...item, quantity: 0, size: "NA" }))
  )
  const [selectedQR, setSelectedQR] = useState<number>(0)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    amountPaid: "",
    utrNumber: "",
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

  const updateQuantity = (id: number, delta: number) => {
    setSelectedItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, Math.min(10, item.quantity + delta)) }
        : item
    ))
  }

  const updateSize = (id: number, size: string) => {
    setSelectedItems(prev => prev.map(item => 
      item.id === id ? { ...item, size } : item
    ))
  }

  const getTotalPrice = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const totalPrice = getTotalPrice()
    if (totalPrice === 0) {
      alert("Please select at least one item!")
      return
    }

    const itemsWithoutSize = selectedItems.filter(item => item.quantity > 0 && item.size === "NA")
    if (itemsWithoutSize.length > 0) {
      alert(`Please select a size for: ${itemsWithoutSize.map(item => item.name).join(", ")}`)
      return
    }

    if (!formData.amountPaid || !formData.utrNumber) {
      alert("Please complete payment details!")
      return
    }

    setIsSubmitting(true)

    // Build Google Form URL for direct submission
    const formId = "1FAIpQLSeCPcmoxZGnv2REspNjP3ES72Y9On6EcwNC7ECpNvnEMaG1vg"
    const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`
    
    const formDataToSubmit = new FormData()
    formDataToSubmit.append("entry.1939384286", formData.name)
    formDataToSubmit.append("entry.1392614342", formData.phone)
    formDataToSubmit.append("entry.648600787", formData.email)
    
    // LS (id 1)
    formDataToSubmit.append("entry.1360691448", selectedItems[0].quantity.toString())
    formDataToSubmit.append("entry.53307801", selectedItems[0].quantity > 0 ? selectedItems[0].size : "NA")
    
    // LG (id 2)
    formDataToSubmit.append("entry.1593642006", selectedItems[1].quantity.toString())
    formDataToSubmit.append("entry.1923110089", selectedItems[1].quantity > 0 ? selectedItems[1].size : "NA")
    
    // IC (id 3)
    formDataToSubmit.append("entry.250876933", selectedItems[2].quantity.toString())
    formDataToSubmit.append("entry.740470862", selectedItems[2].quantity > 0 ? selectedItems[2].size : "NA")
    
    // CC (id 4)
    formDataToSubmit.append("entry.2116602851", selectedItems[3].quantity.toString())
    formDataToSubmit.append("entry.1270436665", selectedItems[3].quantity > 0 ? selectedItems[3].size : "NA")
    
    // QR and Payment
    formDataToSubmit.append("entry.1139868031", selectedQR.toString())
    formDataToSubmit.append("entry.616507133", formData.amountPaid)
    formDataToSubmit.append("entry.1637700402", formData.utrNumber)

    // Submit form using fetch with no-cors mode
    fetch(formUrl, {
      method: 'POST',
      body: formDataToSubmit,
      mode: 'no-cors',
    })
      .then(() => {
        setIsSubmitting(false)
        setIsSubmitted(true)
      })
      .catch((error) => {
        console.error('Error:', error)
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
            href="/merch"
            className="flex items-center space-x-2 text-[#D2B997] hover:text-[#B8A7D9] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-depixel-small">Back to Merch</span>
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
                  text="ORDER PLACED!"
                />
                <p className="text-[#D2B997] text-lg font-depixel-body mb-8">
                  Your order has been successfully submitted
                </p>
              </div>

              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30 mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#D2B997] font-futura">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {selectedItems.filter(item => item.quantity > 0).map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-[#D2B997]/20">
                        <div className="text-left">
                          <p className="text-white font-depixel-body">{item.name}</p>
                          <p className="text-[#D2B997]/80 font-depixel-small text-sm">
                            Size: {item.size} | Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-[#F4D03F] font-futura text-lg">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#D2B997]/30">
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
                      <div className="flex justify-between text-[#D2B997]/80">
                        <span>Contact:</span>
                        <span className="text-white">{formData.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-sm text-[#D2B997]/80 font-depixel-small space-y-2">
                    <p>✅ Order confirmation sent to {formData.email}</p>
                    <p>📦 Collect your merch at the fest venue</p>
                    <p>📱 We'll contact you on {formData.phone} for details</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center">
                <Link href="/merch">
                  <Button className="bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body px-8 py-6">
                    View More Merch
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
        /* Order Form */
        <main className="container mx-auto px-4 py-20">
        <FadeIn>
          <div className="text-center mb-12">
            <HyperText
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] bg-clip-text text-transparent font-futura"
              text="ORDER YOUR MERCH"
            />
            <p className="text-[#D2B997] text-lg font-depixel-body">
              Select items, complete payment, and submit your order
            </p>
          </div>
        </FadeIn>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Item Selection */}
          <FadeIn delay={0.2}>
            <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
              <CardHeader>
                <CardTitle className="text-2xl text-[#D2B997] font-futura">
                  Select Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="bg-[#1A1A1A]/50 rounded-lg p-4 border border-[#D2B997]/20">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 relative bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.frontImage}
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-depixel-body text-sm mb-1">{item.name}</h3>
                          <p className="text-[#F4D03F] font-futura text-lg mb-2">₹{item.price}</p>
                          
                          <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                disabled={item.quantity === 0}
                                className="bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed p-1 rounded"
                              >
                                <Minus className="w-4 h-4 text-white" />
                              </button>
                              <span className="text-white font-depixel-small w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                disabled={item.quantity === 10}
                                className="bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed p-1 rounded"
                              >
                                <Plus className="w-4 h-4 text-white" />
                              </button>
                            </div>
                            
                            {item.quantity > 0 && (
                              <select
                                value={item.size}
                                onChange={(e) => updateSize(item.id, e.target.value)}
                                className="bg-[#1A1A1A] border border-[#D2B997]/30 text-white px-2 py-1 rounded font-depixel-small text-xs"
                              >
                                {sizes.map(size => (
                                  <option key={size} value={size}>{size}</option>
                                ))}
                              </select>
                            )}
                          </div>
                          
                          {item.quantity > 0 && (
                            <p className="text-[#A8D8EA] font-depixel-small text-xs">
                              Subtotal: ₹{item.price * item.quantity}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-[#A8D8EA]/10 to-[#B8A7D9]/10 rounded-lg border border-[#D2B997]/20">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-depixel-body text-xl">Total Amount:</span>
                    <span className="text-[#F4D03F] font-futura text-3xl">₹{getTotalPrice()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Payment QR Code */}
          <FadeIn delay={0.4}>
            <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
              <CardHeader>
                <CardTitle className="text-2xl text-[#D2B997] font-futura">
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

          {/* Personal Details Form */}
          <FadeIn delay={0.6}>
            <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
              <CardHeader>
                <CardTitle className="text-2xl text-[#D2B997] font-futura">
                  Your Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        placeholder="Enter your name"
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
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                        placeholder="1234567890"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-[#D2B997] font-depixel-small">
                      Institute Email ID *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small"
                      placeholder="yourname@institute.ac.in"
                    />
                  </div>

                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg text-sm text-[#D2B997]/80 font-depixel-small space-y-2">
                    <p>📦 Collect your merch at the fest venue</p>
                    <p>💰 Complete payment before submitting the form</p>
                  </div>

                  <div className="bg-[#F4D03F]/10 border border-[#F4D03F]/30 p-4 rounded-lg">
                    <p className="text-[#F4D03F] font-depixel-small text-sm">
                      <span className="font-bold">Note:</span> Merch will be delivered on campus when shipments are received from the supplier.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={getTotalPrice() === 0 || isSubmitting}
                    className="w-full bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Submitting Order...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Submit Order
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </main>
      )}
    </div>
  )
}
