"use client"

import { useState, useEffect, Fragment } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  LogOut,
  QrCode,
  Users,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { FadeIn } from "@/components/ui/fade-in"
import { Badge } from "@/components/ui/badge"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Registration = Record<string, any>

interface SubEventInfo {
  id: string
  name: string
  fee: number
  group_size?: number
  members?: string[]
}

export default function EODashboardPage() {
  const router = useRouter()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([])
  const [eventName, setEventName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [totalCount, setTotalCount] = useState(0)
  const [checkedInCount, setCheckedInCount] = useState(0)
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [columns, setColumns] = useState<string[]>([])
  
  // Sub-event filtering
  const [availableSubEvents, setAvailableSubEvents] = useState<string[]>([])
  const [selectedSubEvent, setSelectedSubEvent] = useState<string>("all")
  const [subEventCounts, setSubEventCounts] = useState<Record<string, number>>({})

  // Columns to hide from the table entirely
  const hiddenColumns = [
    "created_at", "updated_at", "payment_verified", "utr_number",
    "payment_qr_used", "qr_code_sent", "email_sent", "registration_status"
  ]
  
  // Columns to show first (priority order)
  const priorityColumns = [
    "id", "team_name", "team_leader_name", "team_leader_email", "team_leader_phone",
    "participant_name", "participant_email", "participant_phone", "roll_number", "college_name",
    "player1_name", "player1_email", "player1_phone", "player1_uid",
    "institute_name", "institution", "sub_events", "total_amount", "amount_paid", "registration_status", "checked_in"
  ]

  // Extract unique sub-events from registrations
  const extractSubEvents = (regs: Registration[]) => {
    const subEvents = new Set<string>()
    const counts: Record<string, number> = { all: regs.length }
    
    regs.forEach(reg => {
      if (reg.sub_events && Array.isArray(reg.sub_events)) {
        reg.sub_events.forEach((se: SubEventInfo) => {
          subEvents.add(se.id)
          counts[se.id] = (counts[se.id] || 0) + 1
        })
      }
    })
    
    setAvailableSubEvents(Array.from(subEvents))
    setSubEventCounts(counts)
  }

  // Format column name for display
  const formatColumnName = (col: string) => {
    return col
      .replace(/_/g, " ")
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/Uid/g, "UID")
      .replace(/Utr/g, "UTR")
      .replace(/Id$/g, "ID")
  }

  // Get visible columns for table
  const getVisibleColumns = () => {
    const visible = columns.filter(col => !hiddenColumns.includes(col))
    // Sort by priority
    return visible.sort((a, b) => {
      const aIndex = priorityColumns.indexOf(a)
      const bIndex = priorityColumns.indexOf(b)
      if (aIndex === -1 && bIndex === -1) return 0
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
  }

  const fetchRegistrations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/eo/registrations")
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/eo/login")
          return
        }
        throw new Error(data.error)
      }

      setEventName(data.eventName)
      setRegistrations(data.registrations)
      setFilteredRegistrations(data.registrations)
      setTotalCount(data.totalCount)
      setCheckedInCount(data.checkedInCount)

      // Extract sub-events if any
      extractSubEvents(data.registrations)

      // Extract all unique column names from registrations
      if (data.registrations.length > 0) {
        const allColumns = new Set<string>()
        data.registrations.forEach((reg: Registration) => {
          Object.keys(reg).forEach(key => allColumns.add(key))
        })
        setColumns(Array.from(allColumns))
      }
    } catch (error) {
      console.error("Error fetching registrations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRegistrations()
  }, [])

  useEffect(() => {
    let filtered = registrations

    // Filter by sub-event first
    if (selectedSubEvent !== "all" && availableSubEvents.length > 0) {
      filtered = filtered.filter((reg) => {
        if (reg.sub_events && Array.isArray(reg.sub_events)) {
          return reg.sub_events.some((se: SubEventInfo) => se.id === selectedSubEvent)
        }
        return false
      })
    }

    // Then filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter((reg) => {
        // Search across ALL fields
        return Object.values(reg).some(value => 
          String(value).toLowerCase().includes(searchLower)
        )
      })
    }

    setFilteredRegistrations(filtered)
  }, [searchTerm, registrations, selectedSubEvent, availableSubEvents])

  const handleLogout = async () => {
    try {
      await fetch("/api/eo/logout", { method: "POST" })
      router.push("/eo/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  // Format cell value for display (simple version for table cells)
  const formatCellValue = (value: unknown, column: string): string => {
    if (value === null || value === undefined) return "-"
    if (typeof value === "boolean") return value ? "Yes" : "No"
    if (column === "created_at" || column === "updated_at") {
      return new Date(String(value)).toLocaleString()
    }
    // Handle sub_events specially - just show names in table
    if (column === "sub_events" && Array.isArray(value)) {
      return value.map((se: SubEventInfo) => se.name || se.id).join(", ")
    }
    // Handle arrays of objects (like team_members)
    if (Array.isArray(value)) {
      if (value.length === 0) return "-"
      if (typeof value[0] === "object") {
        // For arrays of objects, format each object
        return value.map((item, idx) => {
          if (typeof item === "object" && item !== null) {
            const parts = Object.entries(item)
              .filter(([, v]) => v !== null && v !== undefined && v !== "")
              .map(([k, v]) => `${formatColumnName(k)}: ${v}`)
            return `#${idx + 1}: ${parts.join(", ")}`
          }
          return String(item)
        }).join(" | ")
      }
      return value.join(", ")
    }
    // Handle single objects
    if (typeof value === "object" && value !== null) {
      const parts = Object.entries(value)
        .filter(([, v]) => v !== null && v !== undefined && v !== "")
        .map(([k, v]) => `${formatColumnName(k)}: ${v}`)
      return parts.join(", ")
    }
    return String(value)
  }

  // Render sub-events with full team details (for expanded view / dialog)
  const renderSubEventsDetails = (subEvents: SubEventInfo[]) => {
    return (
      <div className="space-y-3">
        {subEvents.map((se, idx) => (
          <div key={idx} className="bg-[#2A2A2A]/50 rounded-lg p-3 border border-[#D2B997]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-depixel-body">{se.name || se.id}</span>
              <span className="text-[#F8C471] font-depixel-small">₹{se.fee}</span>
            </div>
            {se.group_size && (
              <p className="text-[#D2B997]/70 text-xs font-depixel-small mb-2">
                Group Size: {se.group_size} members
              </p>
            )}
            {se.members && se.members.length > 0 && (
              <div className="mt-2 pl-3 border-l-2 border-[#A8D8EA]/30">
                <p className="text-[#A8D8EA] text-xs font-depixel-small mb-1">Team Members:</p>
                <ul className="space-y-1">
                  {se.members.map((member, mIdx) => (
                    <li key={mIdx} className="text-white text-sm font-depixel-small">
                      {mIdx + 1}. {member}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // Export to CSV
  const exportToCSV = () => {
    if (filteredRegistrations.length === 0) return

    // Get all columns except system ones
    const exportColumns = columns.filter(col => col !== "payment_verified")
    
    // Create CSV header
    const header = exportColumns.map(col => formatColumnName(col)).join(",")
    
    // Create CSV rows
    const rows = filteredRegistrations.map(reg => {
      return exportColumns.map(col => {
        const value = reg[col]
        if (value === null || value === undefined) return ""
        if (typeof value === "boolean") return value ? "Yes" : "No"
        // Handle arrays of objects for CSV
        if (Array.isArray(value)) {
          if (value.length === 0) return ""
          if (typeof value[0] === "object") {
            const formatted = value.map((item, idx) => {
              if (typeof item === "object" && item !== null) {
                const parts = Object.entries(item)
                  .filter(([, v]) => v !== null && v !== undefined && v !== "")
                  .map(([k, v]) => `${k}: ${v}`)
                return `Member ${idx + 1} - ${parts.join("; ")}`
              }
              return String(item)
            }).join(" | ")
            return `"${formatted.replace(/"/g, '""')}"`
          }
          return `"${value.join("; ")}"`
        }
        // Handle single objects for CSV
        if (typeof value === "object" && value !== null) {
          const parts = Object.entries(value)
            .filter(([, v]) => v !== null && v !== undefined && v !== "")
            .map(([k, v]) => `${k}: ${v}`)
          return `"${parts.join("; ").replace(/"/g, '""')}"`
        }
        // Escape quotes and wrap in quotes if contains comma
        const strValue = String(value)
        if (strValue.includes(",") || strValue.includes('"') || strValue.includes("\n")) {
          return `"${strValue.replace(/"/g, '""')}"`
        }
        return strValue
      }).join(",")
    }).join("\n")

    const csv = `${header}\n${rows}`
    
    // Download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    const subEventSuffix = selectedSubEvent !== "all" ? `_${selectedSubEvent}` : ""
    link.setAttribute("href", url)
    link.setAttribute("download", `${eventName.replace(/\s+/g, "_")}${subEventSuffix}_registrations_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#D2B997]/30">
        <div className="container mx-auto px-4 py-3">
          {/* Top row - Logo and title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image src="/ball_a.png" alt="INQUIVESTA XII" width={50} height={50} className="h-8 w-auto md:h-10" />
              <div>
                <h1 className="text-[#D2B997] font-futura tracking-wide text-base md:text-lg">EO Dashboard</h1>
                <p className="text-[#A8D8EA] font-depixel-small text-xs md:text-sm truncate max-w-[150px] md:max-w-none">{eventName}</p>
              </div>
            </div>
            {/* Desktop buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/eo/scan">
                <Button className="bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body">
                  <QrCode className="w-4 h-4 mr-2" />
                  Scan QR
                </Button>
              </Link>
              <Button
                onClick={exportToCSV}
                disabled={filteredRegistrations.length === 0}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-depixel-body"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-[#D2B997] text-[#D2B997] hover:bg-[#D2B997]/10 bg-transparent font-depixel-body"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
            {/* Mobile logout button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="md:hidden text-[#D2B997] hover:bg-[#D2B997]/10"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
          {/* Mobile action buttons */}
          <div className="flex md:hidden gap-2 mt-3">
            <Link href="/eo/scan" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body text-xs py-2">
                <QrCode className="w-4 h-4 mr-1" />
                Scan QR
              </Button>
            </Link>
            <Button
              onClick={exportToCSV}
              disabled={filteredRegistrations.length === 0}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-depixel-body text-xs py-2"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 md:py-8">
        <FadeIn>
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2 md:gap-6 mb-4 md:mb-8">
            <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
              <CardHeader className="pb-1 md:pb-2 p-3 md:p-6">
                <CardTitle className="text-[#D2B997] font-depixel-small text-xs md:text-sm flex flex-col md:flex-row items-center gap-1 md:gap-2">
                  <Users className="w-4 h-4" />
                  <span className="hidden md:inline">Total Registrations</span>
                  <span className="md:hidden text-center">Total</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <p className="text-2xl md:text-4xl font-bold text-white text-center md:text-left">{totalCount}</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
              <CardHeader className="pb-1 md:pb-2 p-3 md:p-6">
                <CardTitle className="text-[#D2B997] font-depixel-small text-xs md:text-sm flex flex-col md:flex-row items-center gap-1 md:gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="hidden md:inline">Checked In</span>
                  <span className="md:hidden text-center">In</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <p className="text-2xl md:text-4xl font-bold text-green-400 text-center md:text-left">{checkedInCount}</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
              <CardHeader className="pb-1 md:pb-2 p-3 md:p-6">
                <CardTitle className="text-[#D2B997] font-depixel-small text-xs md:text-sm flex flex-col md:flex-row items-center gap-1 md:gap-2">
                  <XCircle className="w-4 h-4 text-yellow-400" />
                  <span className="hidden md:inline">Pending</span>
                  <span className="md:hidden text-center">Pending</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <p className="text-2xl md:text-4xl font-bold text-yellow-400 text-center md:text-left">{totalCount - checkedInCount}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sub-Event Filters */}
          {availableSubEvents.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                onClick={() => setSelectedSubEvent("all")}
                variant={selectedSubEvent === "all" ? "default" : "outline"}
                size="sm"
                className={selectedSubEvent === "all" 
                  ? "bg-[#D2B997] text-[#1A1A1A] hover:bg-[#D2B997]/90 font-depixel-small text-xs"
                  : "border-[#D2B997]/50 text-[#D2B997] hover:bg-[#D2B997]/10 bg-transparent font-depixel-small text-xs"
                }
              >
                All ({subEventCounts.all || 0})
              </Button>
              {availableSubEvents.map(subEvent => (
                <Button
                  key={subEvent}
                  onClick={() => setSelectedSubEvent(subEvent)}
                  variant={selectedSubEvent === subEvent ? "default" : "outline"}
                  size="sm"
                  className={selectedSubEvent === subEvent 
                    ? "bg-[#D2B997] text-[#1A1A1A] hover:bg-[#D2B997]/90 font-depixel-small text-xs"
                    : "border-[#D2B997]/50 text-[#D2B997] hover:bg-[#D2B997]/10 bg-transparent font-depixel-small text-xs"
                  }
                >
                  {subEvent.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())} ({subEventCounts[subEvent] || 0})
                </Button>
              ))}
            </div>
          )}

          {/* Search and Refresh */}
          <div className="flex gap-2 md:gap-4 mb-4 md:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D2B997] w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1A1A1A] border-[#D2B997]/30 text-white placeholder-[#D2B997]/60 font-depixel-small text-sm"
              />
            </div>
            <Button
              onClick={fetchRegistrations}
              disabled={isLoading}
              variant="outline"
              size="icon"
              className="md:hidden border-[#D2B997] text-[#D2B997] hover:bg-[#D2B997]/10 bg-transparent shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              onClick={fetchRegistrations}
              disabled={isLoading}
              variant="outline"
              className="hidden md:flex border-[#D2B997] text-[#D2B997] hover:bg-[#D2B997]/10 bg-transparent font-depixel-body"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Registrations - Mobile Card View */}
          <div className="md:hidden space-y-3 mb-4">
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#D2B997]" />
                <p className="text-[#D2B997] mt-4 font-depixel-small">Loading...</p>
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#D2B997] font-depixel-small">No registrations found</p>
              </div>
            ) : (
              <>
                <p className="text-[#D2B997] text-sm font-depixel-small">{filteredRegistrations.length} registrations</p>
                {filteredRegistrations.map((reg) => {
                  const displayName = reg.team_name || reg.team_leader_name || reg.participant_name || reg.player1_name || "Unknown"
                  const displayEmail = reg.team_leader_email || reg.participant_email || reg.player1_email || ""
                  const displayPhone = reg.team_leader_phone || reg.participant_phone || reg.player1_phone || ""
                  return (
                    <Card 
                      key={reg.id} 
                      className="bg-[#2A2A2A]/50 border-[#D2B997]/30 cursor-pointer"
                      onClick={() => setSelectedRegistration(reg)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-depixel-small truncate">{displayName}</p>
                            {displayEmail && (
                              <p className="text-[#A8D8EA] text-xs truncate">{displayEmail}</p>
                            )}
                            {displayPhone && (
                              <p className="text-[#D2B997]/60 text-xs font-mono">{displayPhone}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            {reg.checked_in ? (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                In
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">
                                <XCircle className="w-3 h-3 mr-1" />
                                No
                              </Badge>
                            )}
                            {reg.amount_paid !== undefined && (
                              <span className="text-white text-xs font-depixel-small">₹{reg.amount_paid}</span>
                            )}
                          </div>
                        </div>
                        <p className="text-[#A8D8EA]/50 font-mono text-xs mt-2">
                          ID: {String(reg.id).slice(0, 8)}...
                        </p>
                      </CardContent>
                    </Card>
                  )
                })}
              </>
            )}
          </div>

          {/* Registrations Table - Desktop */}
          <Card className="hidden md:block bg-[#2A2A2A]/50 border-[#D2B997]/30">
            <CardHeader>
              <CardTitle className="text-[#D2B997] font-futura tracking-wide flex items-center justify-between">
                <span>Registrations ({filteredRegistrations.length})</span>
                <span className="text-sm font-depixel-small text-[#A8D8EA] hidden lg:block">
                  Click row to expand details
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#D2B997]" />
                  <p className="text-[#D2B997] mt-4 font-depixel-small">Loading registrations...</p>
                </div>
              ) : filteredRegistrations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#D2B997] font-depixel-small">No registrations found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#D2B997]/30">
                        <TableHead className="text-[#D2B997] font-depixel-small w-10"></TableHead>
                        {getVisibleColumns().map((col) => (
                          <TableHead key={col} className="text-[#D2B997] font-depixel-small whitespace-nowrap">
                            {formatColumnName(col)}
                          </TableHead>
                        ))}
                        <TableHead className="text-[#D2B997] font-depixel-small">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRegistrations.map((reg) => (
                        <Fragment key={reg.id}>
                          <TableRow 
                            className="border-[#D2B997]/20 cursor-pointer hover:bg-[#D2B997]/5"
                            onClick={() => toggleRowExpansion(reg.id)}
                          >
                            <TableCell>
                              {expandedRows.has(reg.id) ? (
                                <ChevronUp className="w-4 h-4 text-[#A8D8EA]" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-[#D2B997]" />
                              )}
                            </TableCell>
                            {getVisibleColumns().map((col) => (
                              <TableCell key={col} className="whitespace-nowrap">
                                {col === "id" ? (
                                  <span className="font-mono text-xs text-[#A8D8EA]">
                                    {String(reg[col]).slice(0, 8)}...
                                  </span>
                                ) : col === "checked_in" ? (
                                  reg[col] ? (
                                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Yes
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                                      <XCircle className="w-3 h-3 mr-1" />
                                      No
                                    </Badge>
                                  )
                                ) : col === "amount_paid" ? (
                                  <span className="text-white font-depixel-small">₹{reg[col]}</span>
                                ) : col.includes("email") ? (
                                  <span className="text-[#A8D8EA] font-depixel-small text-xs">{reg[col] || "-"}</span>
                                ) : col.includes("uid") || col.includes("phone") ? (
                                  <span className="font-mono text-xs text-white">{reg[col] || "-"}</span>
                                ) : (
                                  <span className="text-white font-depixel-small text-sm">
                                    {formatCellValue(reg[col], col)}
                                  </span>
                                )}
                              </TableCell>
                            ))}
                            <TableCell>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedRegistration(reg)
                                }}
                                className="text-[#A8D8EA] hover:text-white hover:bg-[#A8D8EA]/10"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                          {/* Expanded Row */}
                          {expandedRows.has(reg.id) && (
                            <TableRow key={`${reg.id}-expanded`} className="bg-[#1A1A1A]/50 border-[#D2B997]/20">
                              <TableCell colSpan={getVisibleColumns().length + 2}>
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {columns.filter(col => !hiddenColumns.includes(col)).map((col) => {
                                    const value = reg[col]
                                    if (value === null || value === undefined) return null
                                    
                                    // Special rendering for sub_events with team details
                                    if (col === "sub_events" && Array.isArray(value)) {
                                      return (
                                        <div key={col} className="md:col-span-2 lg:col-span-3 space-y-1">
                                          <p className="text-[#D2B997]/60 text-xs font-depixel-small">
                                            {formatColumnName(col)}
                                          </p>
                                          {renderSubEventsDetails(value as SubEventInfo[])}
                                        </div>
                                      )
                                    }
                                    
                                    return (
                                      <div key={col} className={`space-y-1 ${Array.isArray(value) || typeof value === "object" ? "md:col-span-2 lg:col-span-3" : ""}`}>
                                        <p className="text-[#D2B997]/60 text-xs font-depixel-small">
                                          {formatColumnName(col)}
                                        </p>
                                        <p className={`text-sm ${col.includes("email") ? "text-[#A8D8EA]" : "text-white"} ${col === "id" || col.includes("uid") || col.includes("utr") ? "font-mono text-xs" : "font-depixel-small"} whitespace-pre-wrap`}>
                                          {formatCellValue(value, col)}
                                        </p>
                                      </div>
                                    )
                                  })}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </main>

      {/* Registration Detail Dialog */}
      <Dialog open={!!selectedRegistration} onOpenChange={() => setSelectedRegistration(null)}>
        <DialogContent className="bg-[#2A2A2A] border-[#D2B997]/30 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#D2B997] font-futura tracking-wide text-base md:text-lg">
              Registration Details
            </DialogTitle>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-3 md:space-y-4">
              {/* Status badge at top */}
              <div className="flex gap-2 flex-wrap">
                {selectedRegistration.checked_in ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Checked In
                  </Badge>
                ) : (
                  <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                    <XCircle className="w-3 h-3 mr-1" />
                    Not Checked In
                  </Badge>
                )}
              </div>

              {/* All fields - filter out hidden columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 pt-2 md:pt-4">
                {columns.filter(col => !hiddenColumns.includes(col)).map((col) => {
                  const value = selectedRegistration[col]
                  if (value === null || value === undefined) return null
                  
                  // Special rendering for sub_events with team details
                  if (col === "sub_events" && Array.isArray(value)) {
                    return (
                      <div key={col} className="col-span-1 md:col-span-2 space-y-1 p-2 md:p-3 bg-[#1A1A1A]/50 rounded-lg">
                        <p className="text-[#D2B997]/60 text-xs font-depixel-small uppercase">
                          {formatColumnName(col)}
                        </p>
                        {renderSubEventsDetails(value as SubEventInfo[])}
                      </div>
                    )
                  }
                  
                  return (
                    <div key={col} className={`space-y-1 p-2 md:p-3 bg-[#1A1A1A]/50 rounded-lg ${Array.isArray(value) || typeof value === "object" ? "col-span-1 md:col-span-2" : ""}`}>
                      <p className="text-[#D2B997]/60 text-xs font-depixel-small uppercase">
                        {formatColumnName(col)}
                      </p>
                      <p className={`text-sm ${col === "id" || col.includes("uid") || col.includes("utr") ? "font-mono text-xs break-all" : "font-depixel-small"} ${col.includes("email") ? "text-[#A8D8EA] break-all" : "text-white"} whitespace-pre-wrap`}>
                        {formatCellValue(value, col)}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Copy ID button */}
              <div className="pt-2 md:pt-4 flex gap-2">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedRegistration.id)
                  }}
                  variant="outline"
                  size="sm"
                  className="border-[#D2B997] text-[#D2B997] hover:bg-[#D2B997]/10 bg-transparent font-depixel-body text-xs md:text-sm"
                >
                  Copy Full ID
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
