"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  CameraOff,
  UserCheck,
} from "lucide-react"
import { FadeIn } from "@/components/ui/fade-in"
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode"

interface Registration {
  id: string
  // Team-based events (hoop-hustle, tt-doubles, smash7, nukkad-natak)
  team_name?: string
  team_leader_name?: string
  team_leader_email?: string
  team_leader_phone?: string
  // Participant-based events (inquicon, tt-singles)
  participant_name?: string
  participant_email?: string
  participant_phone?: string
  // Doubles/pairs events
  player1_name?: string
  player1_email?: string
  player1_phone?: string
  // Direct field events (masquerade, soulbeats)
  name?: string
  email?: string
  phone?: string
  institution?: string
  // Masquerade-specific
  pass_type?: string
  gender?: string
  partner?: {
    name: string
    email: string
    phone: string
    institution: string
    gender: string
  } | null
  // Day passes specific
  pass_name?: string
  pass_date?: string
  // Multi-event specific (soulbeats, bullseye)
  sub_events?: string[]
  // Common fields
  category?: string
  amount_paid?: number
  registration_status?: string
  checked_in: boolean
}

type ScanStatus = "idle" | "scanned" | "confirming" | "success" | "error" | "already-checked-in"

export default function EOScanPage() {
  const router = useRouter()
  const [manualId, setManualId] = useState("")
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle")
  const [message, setMessage] = useState("")
  const [scannedRegistration, setScannedRegistration] = useState<Registration | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isScannerActive, setIsScannerActive] = useState(false)
  const [scannedId, setScannedId] = useState<string | null>(null)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const scannerContainerRef = useRef<HTMLDivElement>(null)

  // Initialize scanner
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error)
      }
    }
  }, [])

  const startScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error)
    }

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      rememberLastUsedCamera: true,
      // Prefer back camera (environment) for mobile devices
      videoConstraints: {
        facingMode: { ideal: "environment" },
      },
    }

    scannerRef.current = new Html5QrcodeScanner("qr-reader", config, false)
    
    scannerRef.current.render(
      (decodedText) => {
        // QR code successfully scanned
        handleQRScan(decodedText)
      },
      (errorMessage) => {
        // Parse error - usually just means no QR code in frame
        console.debug("QR scan error:", errorMessage)
      }
    )
    
    setIsScannerActive(true)
  }

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error)
      scannerRef.current = null
    }
    setIsScannerActive(false)
  }

  const handleQRScan = async (registrationId: string) => {
    // Stop scanner after successful scan
    stopScanner()
    
    // Fetch registration details first (without checking in)
    setIsProcessing(true)
    setScanStatus("scanned")
    setMessage("Fetching registration details...")
    setScannedId(registrationId)

    try {
      const response = await fetch("/api/eo/registration-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ registrationId }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/eo/login")
          return
        }
        throw new Error(data.error || "Failed to fetch registration")
      }

      setScannedRegistration(data.registration)
      
      if (data.registration.checked_in) {
        setScanStatus("already-checked-in")
        setMessage("This attendee is already checked in!")
      } else {
        setScanStatus("scanned")
        setMessage("Registration found! Confirm check-in below.")
      }
    } catch (err) {
      setScanStatus("error")
      setMessage(err instanceof Error ? err.message : "Failed to fetch registration")
      setScannedRegistration(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const confirmCheckIn = async () => {
    if (!scannedId || isProcessing) return
    
    setIsProcessing(true)
    setScanStatus("confirming")
    setMessage("Confirming check-in...")

    try {
      const response = await fetch("/api/eo/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ registrationId: scannedId }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/eo/login")
          return
        }
        throw new Error(data.error || "Check-in failed")
      }

      if (data.alreadyCheckedIn) {
        setScanStatus("already-checked-in")
        setMessage("This attendee was already checked in!")
        setScannedRegistration(data.registration)
      } else if (data.success) {
        setScanStatus("success")
        setMessage("Check-in successful! ✓")
        setScannedRegistration(data.registration)
      }
    } catch (err) {
      setScanStatus("error")
      setMessage(err instanceof Error ? err.message : "Check-in failed")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualId.trim()) {
      handleQRScan(manualId.trim())
    }
  }

  const resetScan = (autoStartScanner: boolean = false) => {
    setScanStatus("idle")
    setMessage("")
    setScannedRegistration(null)
    setScannedId(null)
    setManualId("")
    
    // Auto-start scanner after a brief delay (allows DOM to update)
    if (autoStartScanner) {
      setTimeout(() => {
        startScanner()
      }, 100)
    }
  }

  const getDisplayName = (reg: Registration) => {
    return reg.team_leader_name || reg.participant_name || reg.player1_name || reg.name || "N/A"
  }

  const getDisplayEmail = (reg: Registration) => {
    return reg.team_leader_email || reg.participant_email || reg.player1_email || reg.email || "N/A"
  }

  const getDisplayPhone = (reg: Registration) => {
    return reg.team_leader_phone || reg.participant_phone || reg.player1_phone || reg.phone || "N/A"
  }

  const getDisplayInstitution = (reg: Registration) => {
    return reg.institution || "N/A"
  }

  const getEventSpecificInfo = (reg: Registration) => {
    // Build array of extra info to display based on event type
    const info: { label: string; value: string }[] = []
    
    // Category (for TT singles/doubles)
    if (reg.category) {
      const categoryLabels: Record<string, string> = {
        mens: "Men's",
        womens: "Women's",
        mixed: "Mixed",
      }
      info.push({ label: "Category", value: categoryLabels[reg.category] || reg.category })
    }
    
    // Pass type and gender (for Masquerade)
    if (reg.pass_type && !reg.pass_name) {
      const passLabel = reg.pass_type === 'couple' 
        ? 'Couple Pass' 
        : `Single Pass (${reg.gender === 'male' ? 'Male' : 'Female'})`
      info.push({ label: "Pass Type", value: passLabel })
    }
    
    // Day pass info
    if (reg.pass_name) {
      info.push({ label: "Pass Type", value: reg.pass_name })
    }
    if (reg.pass_date) {
      info.push({ label: "Valid For", value: reg.pass_date })
    }
    
    // Partner info (for Masquerade couples)
    if (reg.partner && reg.pass_type === 'couple') {
      info.push({ label: "Partner", value: reg.partner.name })
    }
    
    // Sub-events (for Soulbeats, Bullseye)
    if (reg.sub_events && Array.isArray(reg.sub_events) && reg.sub_events.length > 0) {
      info.push({ label: "Events", value: reg.sub_events.join(", ") })
    }
    
    return info
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#D2B997]/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/eo/dashboard"
            className="flex items-center space-x-2 text-[#D2B997] hover:text-[#B8A7D9] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-depixel-small">Back to Dashboard</span>
          </Link>
          <Image src="/ball_a.png" alt="INQUIVESTA XII" width={50} height={50} className="h-10 w-auto" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-lg">
        <FadeIn>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] bg-clip-text text-transparent font-futura tracking-wide">
              Check-In Scanner
            </h1>
            <p className="text-[#D2B997]/80 font-depixel-small mt-2">
              Scan QR code or enter Registration ID
            </p>
          </div>

          {/* Scanned Registration Details */}
          {scanStatus !== "idle" && (
            <Card
              className={`mb-6 border-2 ${
                scanStatus === "success"
                  ? "bg-green-500/10 border-green-500/50"
                  : scanStatus === "already-checked-in"
                  ? "bg-yellow-500/10 border-yellow-500/50"
                  : scanStatus === "error"
                  ? "bg-red-500/10 border-red-500/50"
                  : "bg-[#2A2A2A]/50 border-[#D2B997]/30"
              }`}
            >
              <CardContent className="pt-6">
                <div className="text-center">
                  {(scanStatus === "scanned" || scanStatus === "confirming") && !isProcessing && (
                    <UserCheck className="w-16 h-16 mx-auto text-[#A8D8EA]" />
                  )}
                  {isProcessing && (
                    <RefreshCw className="w-16 h-16 mx-auto text-[#A8D8EA] animate-spin" />
                  )}
                  {scanStatus === "success" && (
                    <CheckCircle className="w-16 h-16 mx-auto text-green-400" />
                  )}
                  {scanStatus === "already-checked-in" && (
                    <AlertCircle className="w-16 h-16 mx-auto text-yellow-400" />
                  )}
                  {scanStatus === "error" && (
                    <XCircle className="w-16 h-16 mx-auto text-red-400" />
                  )}
                  
                  <p
                    className={`mt-4 font-depixel-body text-lg ${
                      scanStatus === "success"
                        ? "text-green-400"
                        : scanStatus === "already-checked-in"
                        ? "text-yellow-400"
                        : scanStatus === "error"
                        ? "text-red-400"
                        : "text-[#D2B997]"
                    }`}
                  >
                    {message}
                  </p>

                  {/* Registration Details Card */}
                  {scannedRegistration && (
                    <div className="mt-4 p-4 bg-[#1A1A1A]/50 rounded-lg text-left space-y-3">
                      <div className="flex justify-between items-center border-b border-[#D2B997]/20 pb-2">
                        <span className="text-[#D2B997] font-depixel-small text-sm">Registration Details</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          scannedRegistration.checked_in 
                            ? "bg-green-500/20 text-green-400" 
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {scannedRegistration.checked_in ? "Checked In" : "Not Checked In"}
                        </span>
                      </div>
                      
                      {scannedRegistration.team_name && (
                        <div className="flex justify-between">
                          <span className="text-[#D2B997]/60 text-sm">Team:</span>
                          <span className="text-white font-depixel-small">{scannedRegistration.team_name}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-[#D2B997]/60 text-sm">Name:</span>
                        <span className="text-white font-depixel-small">{getDisplayName(scannedRegistration)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-[#D2B997]/60 text-sm">Email:</span>
                        <span className="text-[#A8D8EA] font-depixel-small text-xs break-all">{getDisplayEmail(scannedRegistration)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-[#D2B997]/60 text-sm">Phone:</span>
                        <span className="text-white font-depixel-small">{getDisplayPhone(scannedRegistration)}</span>
                      </div>

                      {getDisplayInstitution(scannedRegistration) !== "N/A" && (
                        <div className="flex justify-between">
                          <span className="text-[#D2B997]/60 text-sm">Institution:</span>
                          <span className="text-white font-depixel-small text-right max-w-[60%]">{getDisplayInstitution(scannedRegistration)}</span>
                        </div>
                      )}

                      {/* Event-specific info (category, pass type, partner, etc.) */}
                      {getEventSpecificInfo(scannedRegistration).map((info, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-[#D2B997]/60 text-sm">{info.label}:</span>
                          <span className="text-[#B8A7D9] font-depixel-small">{info.value}</span>
                        </div>
                      ))}

                      {scannedRegistration.amount_paid !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-[#D2B997]/60 text-sm">Amount Paid:</span>
                          <span className="text-green-400 font-depixel-small">₹{scannedRegistration.amount_paid}</span>
                        </div>
                      )}

                      {scannedRegistration.registration_status && (
                        <div className="flex justify-between">
                          <span className="text-[#D2B997]/60 text-sm">Status:</span>
                          <span className={`font-depixel-small ${
                            scannedRegistration.registration_status === "confirmed" 
                              ? "text-green-400" 
                              : "text-yellow-400"
                          }`}>
                            {scannedRegistration.registration_status}
                          </span>
                        </div>
                      )}
                      
                      <div className="pt-2 border-t border-[#D2B997]/20">
                        <p className="text-[#D2B997]/40 font-mono text-xs">
                          ID: {scannedRegistration.id}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-3">
                    {scanStatus === "scanned" && !scannedRegistration?.checked_in && (
                      <Button
                        onClick={confirmCheckIn}
                        disabled={isProcessing}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-depixel-body py-6"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Confirm Check-In
                          </>
                        )}
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => resetScan(scanStatus === "success" || scanStatus === "already-checked-in")}
                      variant={scanStatus === "scanned" && !scannedRegistration?.checked_in ? "outline" : "default"}
                      className={
                        scanStatus === "scanned" && !scannedRegistration?.checked_in
                          ? "border-[#D2B997] text-[#D2B997] hover:bg-[#D2B997]/10 bg-transparent font-depixel-body"
                          : "flex-1 bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body"
                      }
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      {scanStatus === "success" || scanStatus === "already-checked-in" ? "Scan Next" : "Cancel"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scanner UI - Only show when idle */}
          {scanStatus === "idle" && (
            <>
              {/* QR Scanner */}
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30 mb-6">
                <CardHeader>
                  <CardTitle className="text-[#D2B997] font-futura tracking-wide flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    QR Scanner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Scanner Container */}
                    <div 
                      id="qr-reader" 
                      ref={scannerContainerRef}
                      className={`rounded-lg overflow-hidden ${isScannerActive ? 'block' : 'hidden'}`}
                      style={{ width: '100%' }}
                    />
                    
                    {!isScannerActive && (
                      <div className="aspect-square bg-[#1A1A1A] rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <CameraOff className="w-16 h-16 mx-auto text-[#D2B997]/40 mb-4" />
                          <p className="text-[#D2B997]/60 font-depixel-small">
                            Camera not active
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {!isScannerActive ? (
                        <Button
                          onClick={startScanner}
                          className="flex-1 bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body py-6"
                        >
                          <Camera className="w-5 h-5 mr-2" />
                          Start Scanner
                        </Button>
                      ) : (
                        <Button
                          onClick={stopScanner}
                          variant="outline"
                          className="flex-1 border-[#D2B997] text-[#D2B997] hover:bg-[#D2B997]/10 bg-transparent font-depixel-body py-6"
                        >
                          <CameraOff className="w-5 h-5 mr-2" />
                          Stop Scanner
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Manual Entry */}
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                <CardHeader>
                  <CardTitle className="text-[#D2B997] font-futura tracking-wide">
                    Manual Entry
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="registrationId" className="text-[#D2B997] font-depixel-small">
                        Registration ID
                      </Label>
                      <Input
                        id="registrationId"
                        type="text"
                        value={manualId}
                        onChange={(e) => setManualId(e.target.value)}
                        placeholder="Enter registration ID (UUID)"
                        className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-mono text-sm"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={!manualId.trim() || isProcessing}
                      className="w-full bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body disabled:opacity-50 py-6"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Look Up Registration
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </>
          )}
        </FadeIn>
      </main>

      {/* Custom styles for html5-qrcode */}
      <style jsx global>{`
        #qr-reader {
          border: none !important;
        }
        #qr-reader__scan_region {
          background: #1A1A1A !important;
        }
        #qr-reader__dashboard {
          padding: 10px !important;
        }
        #qr-reader__dashboard_section_swaplink {
          color: #A8D8EA !important;
        }
        #qr-reader__status_span {
          color: #D2B997 !important;
          font-size: 12px !important;
        }
        #qr-reader video {
          border-radius: 8px !important;
        }
        #html5-qrcode-button-camera-permission,
        #html5-qrcode-button-camera-start,
        #html5-qrcode-button-camera-stop {
          background: linear-gradient(to right, #A8D8EA, #85C1E9) !important;
          color: #1A1A1A !important;
          border: none !important;
          padding: 10px 20px !important;
          border-radius: 6px !important;
          cursor: pointer !important;
          font-weight: 600 !important;
        }
        #html5-qrcode-button-camera-permission:hover,
        #html5-qrcode-button-camera-start:hover,
        #html5-qrcode-button-camera-stop:hover {
          opacity: 0.9 !important;
        }
        #html5-qrcode-anchor-scan-type-change {
          color: #A8D8EA !important;
          text-decoration: none !important;
        }
        select {
          background: #1A1A1A !important;
          color: white !important;
          border: 1px solid rgba(210, 185, 151, 0.3) !important;
          padding: 8px !important;
          border-radius: 6px !important;
        }
      `}</style>
    </div>
  )
}
