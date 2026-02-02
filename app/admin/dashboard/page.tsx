"use client"

import { useState, useEffect, Fragment } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
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
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LogOut,
  Users,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  Eye,
  ChevronDown,
  ChevronUp,
  Shield,
  AlertTriangle,
  Clock,
  Mail,
  DollarSign,
  Edit,
  Ban,
  CircleCheck,
  Loader2,
} from "lucide-react"
import { FadeIn } from "@/components/ui/fade-in"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Registration = Record<string, any>

interface EventInfo {
  id: string
  name: string
  tableName: string
  registrationCount: number
  verifiedCount: number
  pendingCount: number
  cancelledCount: number
  totalCollection: number
  checkedInCount: number
}

interface SubEventInfo {
  id: string
  name: string
  fee: number
  group_size?: number
  members?: (string | Record<string, unknown>)[]
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [events, setEvents] = useState<EventInfo[]>([])
  const [selectedEvent, setSelectedEvent] = useState<string>("all")
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [columns, setColumns] = useState<string[]>([])
  
  // Status filter
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [editingStatus, setEditingStatus] = useState<string>("")
  const [editingPaymentStatus, setEditingPaymentStatus] = useState<string>("")
  const [emailMessage, setEmailMessage] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string>("")
  
  // View dialog state
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewRegistration, setViewRegistration] = useState<Registration | null>(null)

  // Columns to hide from the table entirely
  const hiddenColumns = [
    "created_at", "updated_at", "payment_qr_used", "qr_code_sent", "email_sent"
  ]
  
  // Columns to show first (priority order)
  const priorityColumns = [
    "id", "team_name", "team_leader_name", "team_leader_email", "team_leader_phone",
    "participant_name", "participant_email", "participant_phone", "roll_number", "college_name",
    "player1_name", "player1_email", "player1_phone", "player1_uid",
    // Masquerade fields
    "name", "email", "phone", "pass_type", "gender", "partner",
    // Day passes fields
    "pass_name", "pass_date", "quantity_type", "admits",
    // Common fields
    "institute_name", "institution", "category", "sub_events", "total_amount", "amount_paid", 
    "registration_status", "payment_verified", "utr_number", "checked_in"
  ]

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

  // Fetch all events summary
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/admin/events")
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/admin/login")
          return
        }
        throw new Error(data.error)
      }

      setEvents(data.events || [])
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  // Fetch registrations for selected event or all events
  const fetchRegistrations = async (eventId: string = selectedEvent) => {
    setIsLoadingRegistrations(true)
    try {
      const url = eventId === "all" 
        ? "/api/admin/registrations?event=all"
        : `/api/admin/registrations?event=${eventId}`
      
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/admin/login")
          return
        }
        throw new Error(data.error)
      }

      setRegistrations(data.registrations || [])
      setFilteredRegistrations(data.registrations || [])

      // Extract all unique column names from registrations
      if (data.registrations && data.registrations.length > 0) {
        const allColumns = new Set<string>()
        data.registrations.forEach((reg: Registration) => {
          Object.keys(reg).forEach(key => allColumns.add(key))
        })
        setColumns(Array.from(allColumns))
      }
    } catch (error) {
      console.error("Error fetching registrations:", error)
    } finally {
      setIsLoadingRegistrations(false)
    }
  }

  const loadInitialData = async () => {
    setIsLoading(true)
    await fetchEvents()
    await fetchRegistrations("all")
    setIsLoading(false)
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  // Filter registrations based on search and status filters
  useEffect(() => {
    let filtered = registrations

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((reg) => {
        const status = reg.registration_status || "pending"
        return status === statusFilter
      })
    }

    // Filter by payment status
    if (paymentFilter !== "all") {
      filtered = filtered.filter((reg) => {
        const paymentStatus = reg.payment_verified === true ? "verified" : 
                               reg.payment_verified === false ? "pending" : "pending"
        return paymentStatus === paymentFilter
      })
    }

    // Then filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter((reg) => {
        return Object.values(reg).some(value => 
          String(value).toLowerCase().includes(searchLower)
        )
      })
    }

    setFilteredRegistrations(filtered)
  }, [searchTerm, registrations, statusFilter, paymentFilter])

  const handleEventChange = async (eventId: string) => {
    setSelectedEvent(eventId)
    await fetchRegistrations(eventId)
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin/login")
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

  // Format cell value for display
  const formatCellValue = (value: unknown, column: string): string => {
    if (value === null || value === undefined) return "-"
    if (typeof value === "boolean") return value ? "Yes" : "No"
    if (column === "created_at" || column === "updated_at") {
      return new Date(String(value)).toLocaleString()
    }
    if (column === "sub_events" && Array.isArray(value)) {
      return value.map((se) => {
        if (typeof se === 'string') return se
        if (typeof se === 'object' && se !== null) {
          return (se as SubEventInfo).name || (se as SubEventInfo).id || 'Unknown'
        }
        return String(se)
      }).join(", ")
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return "-"
      if (typeof value[0] === "object") {
        return value.map((item, idx) => {
          if (typeof item === "object" && item !== null) {
            const parts = Object.entries(item)
              .filter(([, v]) => v !== null && v !== undefined && v !== "")
              .map(([k, v]) => {
                // Handle nested objects by converting them to string
                if (typeof v === 'object') return `${formatColumnName(k)}: [Object]`
                return `${formatColumnName(k)}: ${v}`
              })
            return `#${idx + 1}: ${parts.join(", ")}`
          }
          return String(item)
        }).join(" | ")
      }
      return value.join(", ")
    }
    if (typeof value === "object" && value !== null) {
      const parts = Object.entries(value)
        .filter(([, v]) => v !== null && v !== undefined && v !== "")
        .map(([k, v]) => {
          // Handle nested objects by converting them to string
          if (typeof v === 'object') return `${formatColumnName(k)}: [Object]`
          return `${formatColumnName(k)}: ${v}`
        })
      return parts.join(", ")
    }
    return String(value)
  }

  // Render sub-events with full team details
  const renderSubEventsDetails = (subEvents: (SubEventInfo | string)[]) => {
    return (
      <div className="space-y-3">
        {subEvents.map((se, idx) => {
          // Handle case where sub_events might be an array of strings
          if (typeof se === 'string') {
            return (
              <div key={idx} className="bg-[#2A2A2A]/50 rounded-lg p-3 border border-[#D2B997]/20">
                <span className="text-white font-depixel-body">{se}</span>
              </div>
            )
          }
          
          // Handle object with name property
          return (
            <div key={idx} className="bg-[#2A2A2A]/50 rounded-lg p-3 border border-[#D2B997]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-depixel-body">{se.name || se.id || 'Unknown'}</span>
                {se.fee !== undefined && <span className="text-[#F8C471] font-depixel-small">₹{se.fee}</span>}
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
                    {se.members.map((member, mIdx) => {
                      // Handle both string and object members
                      let memberDisplay: string
                      if (typeof member === 'string') {
                        memberDisplay = member
                      } else if (typeof member === 'object' && member !== null) {
                        // Handle objects with name, college, etc.
                        const memberObj = member as Record<string, unknown>
                        const parts: string[] = []
                        if (memberObj.name) parts.push(String(memberObj.name))
                        if (memberObj.college) parts.push(`(${String(memberObj.college)})`)
                        if (memberObj.email) parts.push(`- ${String(memberObj.email)}`)
                        if (memberObj.phone) parts.push(`- ${String(memberObj.phone)}`)
                        memberDisplay = parts.length > 0 ? parts.join(' ') : JSON.stringify(member)
                      } else {
                        memberDisplay = String(member)
                      }
                      return (
                        <li key={mIdx} className="text-white text-sm font-depixel-small">
                          {mIdx + 1}. {memberDisplay}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // Open edit dialog
  const openEditDialog = (reg: Registration) => {
    setSelectedRegistration(reg)
    setEditingStatus(reg.registration_status || "pending")
    setEditingPaymentStatus(reg.payment_verified === true ? "verified" : "pending")
    setEmailMessage("")
    setUpdateError("")
    setEditDialogOpen(true)
  }

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedRegistration) return
    
    setIsUpdating(true)
    setUpdateError("")
    
    try {
      const response = await fetch("/api/admin/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationId: selectedRegistration.id,
          eventTableName: selectedRegistration._event_table,
          eventName: selectedRegistration._event_name,
          registrationStatus: editingStatus,
          paymentVerified: editingPaymentStatus === "verified",
          emailMessage: emailMessage.trim() || null,
          recipientEmail: selectedRegistration.team_leader_email || 
                          selectedRegistration.participant_email || 
                          selectedRegistration.player1_email ||
                          selectedRegistration.email,
          recipientName: selectedRegistration.team_name || 
                         selectedRegistration.team_leader_name || 
                         selectedRegistration.participant_name ||
                         selectedRegistration.player1_name ||
                         selectedRegistration.name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Update failed")
      }

      // Refresh data
      await fetchEvents()
      await fetchRegistrations(selectedEvent)
      
      setEditDialogOpen(false)
      setSelectedRegistration(null)
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : "Update failed")
    } finally {
      setIsUpdating(false)
    }
  }

  // Calculate totals
  const totalRegistrations = events.reduce((sum, e) => sum + e.registrationCount, 0)
  const totalVerified = events.reduce((sum, e) => sum + e.verifiedCount, 0)
  const totalPending = events.reduce((sum, e) => sum + e.pendingCount, 0)
  const totalCancelled = events.reduce((sum, e) => sum + e.cancelledCount, 0)
  const totalCollection = events.reduce((sum, e) => sum + (e.totalCollection || 0), 0)
  const totalCheckedIn = events.reduce((sum, e) => sum + (e.checkedInCount || 0), 0)

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <Ban className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  const getPaymentBadge = (verified: boolean | undefined) => {
    if (verified === true) {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          <DollarSign className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      )
    }
    return (
      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-red-500/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image src="/ball_a.png" alt="INQUIVESTA XII" width={50} height={50} className="h-8 w-auto md:h-10" />
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-400" />
                  <h1 className="text-red-400 font-futura tracking-wide text-base md:text-lg">Admin Dashboard</h1>
                </div>
                <p className="text-[#D2B997]/60 font-depixel-small text-xs">All Events Management</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent font-depixel-body"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 md:py-8">
        <FadeIn>
          {isLoading ? (
            <div className="text-center py-20">
              <RefreshCw className="w-12 h-12 animate-spin mx-auto text-red-400" />
              <p className="text-[#D2B997] mt-4 font-depixel-small">Loading admin dashboard...</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4 mb-4 md:mb-8">
                <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30">
                  <CardHeader className="pb-1 md:pb-2 p-3 md:p-6">
                    <CardTitle className="text-[#D2B997] font-depixel-small text-xs md:text-sm flex items-center gap-1 md:gap-2">
                      <Users className="w-4 h-4" />
                      <span className="hidden md:inline">Total Registrations</span>
                      <span className="md:hidden">Total</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                    <p className="text-2xl md:text-3xl font-bold text-white">{totalRegistrations}</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#2A2A2A]/50 border-green-500/30">
                  <CardHeader className="pb-1 md:pb-2 p-3 md:p-6">
                    <CardTitle className="text-green-400 font-depixel-small text-xs md:text-sm flex items-center gap-1 md:gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="hidden md:inline">Verified</span>
                      <span className="md:hidden">Verified</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                    <p className="text-2xl md:text-3xl font-bold text-green-400">{totalVerified}</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#2A2A2A]/50 border-yellow-500/30">
                  <CardHeader className="pb-1 md:pb-2 p-3 md:p-6">
                    <CardTitle className="text-yellow-400 font-depixel-small text-xs md:text-sm flex items-center gap-1 md:gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="hidden md:inline">Pending</span>
                      <span className="md:hidden">Pending</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                    <p className="text-2xl md:text-3xl font-bold text-yellow-400">{totalPending}</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#2A2A2A]/50 border-red-500/30">
                  <CardHeader className="pb-1 md:pb-2 p-3 md:p-6">
                    <CardTitle className="text-red-400 font-depixel-small text-xs md:text-sm flex items-center gap-1 md:gap-2">
                      <XCircle className="w-4 h-4" />
                      <span className="hidden md:inline">Cancelled</span>
                      <span className="md:hidden">Cancelled</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                    <p className="text-2xl md:text-3xl font-bold text-red-400">{totalCancelled}</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#2A2A2A]/50 border-emerald-500/30">
                  <CardHeader className="pb-1 md:pb-2 p-3 md:p-6">
                    <CardTitle className="text-emerald-400 font-depixel-small text-xs md:text-sm flex items-center gap-1 md:gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="hidden md:inline">Total Collection</span>
                      <span className="md:hidden">₹ Collection</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                    <p className="text-2xl md:text-3xl font-bold text-emerald-400">₹{totalCollection.toLocaleString()}</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#2A2A2A]/50 border-blue-500/30">
                  <CardHeader className="pb-1 md:pb-2 p-3 md:p-6">
                    <CardTitle className="text-blue-400 font-depixel-small text-xs md:text-sm flex items-center gap-1 md:gap-2">
                      <CircleCheck className="w-4 h-4" />
                      <span className="hidden md:inline">Checked In</span>
                      <span className="md:hidden">Checked In</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                    <p className="text-2xl md:text-3xl font-bold text-blue-400">{totalCheckedIn}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Events Summary Table */}
              <Card className="bg-[#2A2A2A]/50 border-[#D2B997]/30 mb-6">
                <CardHeader>
                  <CardTitle className="text-[#D2B997] font-futura tracking-wide">
                    Events Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[#D2B997]/30">
                          <TableHead className="text-[#D2B997] font-depixel-small">Event</TableHead>
                          <TableHead className="text-[#D2B997] font-depixel-small text-center">Total</TableHead>
                          <TableHead className="text-[#D2B997] font-depixel-small text-center">Verified</TableHead>
                          <TableHead className="text-[#D2B997] font-depixel-small text-center">Pending</TableHead>
                          <TableHead className="text-[#D2B997] font-depixel-small text-center">Cancelled</TableHead>
                          <TableHead className="text-[#D2B997] font-depixel-small text-center">Collection</TableHead>
                          <TableHead className="text-[#D2B997] font-depixel-small text-center">Checked In</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {events.map((event) => (
                          <TableRow 
                            key={event.id} 
                            className="border-[#D2B997]/20 cursor-pointer hover:bg-[#D2B997]/5"
                            onClick={() => handleEventChange(event.id)}
                          >
                            <TableCell className="font-depixel-small text-white">{event.name}</TableCell>
                            <TableCell className="text-center text-white">{event.registrationCount}</TableCell>
                            <TableCell className="text-center text-green-400">{event.verifiedCount}</TableCell>
                            <TableCell className="text-center text-yellow-400">{event.pendingCount}</TableCell>
                            <TableCell className="text-center text-red-400">{event.cancelledCount}</TableCell>
                            <TableCell className="text-center text-emerald-400">₹{(event.totalCollection || 0).toLocaleString()}</TableCell>
                            <TableCell className="text-center text-blue-400">{event.checkedInCount || 0}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-6">
                {/* Event Selector */}
                <Select value={selectedEvent} onValueChange={handleEventChange}>
                  <SelectTrigger className="w-full md:w-[200px] bg-[#1A1A1A] border-[#D2B997]/30 text-white">
                    <SelectValue placeholder="Select Event" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#D2B997]/30">
                    <SelectItem value="all" className="text-white hover:bg-[#D2B997]/10">All Events</SelectItem>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id} className="text-white hover:bg-[#D2B997]/10">
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] bg-[#1A1A1A] border-[#D2B997]/30 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#D2B997]/30">
                    <SelectItem value="all" className="text-white hover:bg-[#D2B997]/10">All Status</SelectItem>
                    <SelectItem value="pending" className="text-white hover:bg-[#D2B997]/10">Pending</SelectItem>
                    <SelectItem value="verified" className="text-white hover:bg-[#D2B997]/10">Verified</SelectItem>
                    <SelectItem value="cancelled" className="text-white hover:bg-[#D2B997]/10">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                {/* Payment Filter */}
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-[160px] bg-[#1A1A1A] border-[#D2B997]/30 text-white">
                    <SelectValue placeholder="Payment" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#D2B997]/30">
                    <SelectItem value="all" className="text-white hover:bg-[#D2B997]/10">All Payments</SelectItem>
                    <SelectItem value="pending" className="text-white hover:bg-[#D2B997]/10">Payment Pending</SelectItem>
                    <SelectItem value="verified" className="text-white hover:bg-[#D2B997]/10">Payment Verified</SelectItem>
                  </SelectContent>
                </Select>

                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D2B997] w-4 h-4" />
                  <Input
                    placeholder="Search registrations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#1A1A1A] border-[#D2B997]/30 text-white placeholder-[#D2B997]/60 font-depixel-small"
                  />
                </div>

                {/* Refresh Button */}
                <Button
                  onClick={() => {
                    fetchEvents()
                    fetchRegistrations(selectedEvent)
                  }}
                  disabled={isLoadingRegistrations}
                  variant="outline"
                  className="border-[#D2B997] text-[#D2B997] hover:bg-[#D2B997]/10 bg-transparent font-depixel-body"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingRegistrations ? 'animate-spin' : ''}`} />
                  <span className="hidden md:inline">Refresh</span>
                </Button>
              </div>

              {/* Registrations - Mobile Card View */}
              <div className="md:hidden space-y-3 mb-4">
                {isLoadingRegistrations ? (
                  <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-red-400" />
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
                      const displayName = reg.team_name || reg.team_leader_name || reg.participant_name || reg.player1_name || reg.name || "Unknown"
                      const displayEmail = reg.team_leader_email || reg.participant_email || reg.player1_email || reg.email || ""
                      const displayPhone = reg.team_leader_phone || reg.participant_phone || reg.player1_phone || reg.phone || ""
                      const eventName = reg._event_name || "Unknown Event"
                      const cardKey = `${reg._event_table}-${reg.id}`
                      const isExpanded = expandedRows.has(cardKey)
                      return (
                        <Card 
                          key={cardKey} 
                          className="bg-[#2A2A2A]/50 border-[#D2B997]/30"
                        >
                          <CardContent className="p-4">
                            {/* Header - clickable to expand */}
                            <div 
                              className="cursor-pointer"
                              onClick={() => toggleRowExpansion(cardKey)}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    {isExpanded ? (
                                      <ChevronUp className="w-4 h-4 text-[#A8D8EA] shrink-0" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 text-[#D2B997] shrink-0" />
                                    )}
                                    <p className="text-white font-depixel-small truncate">{displayName}</p>
                                  </div>
                                  <p className="text-[#A8D8EA] text-xs truncate ml-6">{displayEmail}</p>
                                  <p className="text-[#D2B997]/60 text-xs font-depixel-small mt-1 ml-6">{eventName}</p>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openEditDialog(reg)
                                  }}
                                  className="bg-red-500/20 text-red-400 hover:bg-red-500/30 shrink-0"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2 ml-6">
                                {getStatusBadge(reg.registration_status || "pending")}
                                {getPaymentBadge(reg.payment_verified)}
                                {reg.checked_in && (
                                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Checked In
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                              <div className="mt-4 pt-4 border-t border-[#D2B997]/20 space-y-3">
                                {/* Basic Info */}
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <p className="text-[#D2B997]/60 text-xs uppercase">ID</p>
                                    <p className="text-[#A8D8EA] font-mono text-xs break-all">{reg.id}</p>
                                  </div>
                                  {displayPhone && (
                                    <div className="space-y-1">
                                      <p className="text-[#D2B997]/60 text-xs uppercase">Phone</p>
                                      <p className="text-white text-sm">{displayPhone}</p>
                                    </div>
                                  )}
                                  {reg.institution && (
                                    <div className="space-y-1 col-span-2">
                                      <p className="text-[#D2B997]/60 text-xs uppercase">Institution</p>
                                      <p className="text-white text-sm">{typeof reg.institution === 'object' ? JSON.stringify(reg.institution) : String(reg.institution)}</p>
                                    </div>
                                  )}
                                  {reg.category && (
                                    <div className="space-y-1">
                                      <p className="text-[#D2B997]/60 text-xs uppercase">Category</p>
                                      <p className="text-[#B8A7D9] text-sm">
                                        {typeof reg.category === 'object' ? JSON.stringify(reg.category) :
                                         reg.category === 'mens' ? "Men's" : 
                                         reg.category === 'womens' ? "Women's" : 
                                         reg.category === 'mixed' ? "Mixed" : String(reg.category)}
                                      </p>
                                    </div>
                                  )}
                                  {reg.pass_type && (
                                    <div className="space-y-1">
                                      <p className="text-[#D2B997]/60 text-xs uppercase">Pass Type</p>
                                      <p className="text-[#B8A7D9] text-sm">
                                        {reg.pass_type === 'couple' ? 'Couple Pass' : 
                                         `Single (${reg.gender === 'male' ? 'Male' : 'Female'})`}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Payment Info */}
                                <div className="grid grid-cols-2 gap-3">
                                  {(reg.amount_paid !== undefined || reg.total_amount !== undefined) && (
                                    <div className="space-y-1">
                                      <p className="text-[#D2B997]/60 text-xs uppercase">Amount Paid</p>
                                      <p className="text-green-400 font-depixel-small">₹{reg.amount_paid ?? reg.total_amount}</p>
                                    </div>
                                  )}
                                  {reg.utr_number && (
                                    <div className="space-y-1">
                                      <p className="text-[#D2B997]/60 text-xs uppercase">UTR Number</p>
                                      <p className="text-white font-mono text-xs">{reg.utr_number}</p>
                                    </div>
                                  )}
                                </div>

                                {/* Partner Info (Masquerade) */}
                                {reg.partner && typeof reg.partner === 'object' && (
                                  <div className="space-y-1 p-3 bg-[#1A1A1A]/50 rounded-lg">
                                    <p className="text-[#D2B997]/60 text-xs uppercase">Partner</p>
                                    <p className="text-white text-sm">{String(reg.partner.name || '-')}</p>
                                    <p className="text-[#A8D8EA] text-xs">{String(reg.partner.email || '-')}</p>
                                    <p className="text-white/60 text-xs">{String(reg.partner.phone || '-')}</p>
                                  </div>
                                )}

                                {/* Sub Events (Soulbeats, Bullseye) */}
                                {reg.sub_events && Array.isArray(reg.sub_events) && reg.sub_events.length > 0 && (
                                  <div className="space-y-1">
                                    <p className="text-[#D2B997]/60 text-xs uppercase">Events</p>
                                    <div className="flex flex-wrap gap-1">
                                      {reg.sub_events.map((se: SubEventInfo | string, idx: number) => (
                                        <Badge key={idx} className="bg-[#A8D8EA]/10 text-[#A8D8EA] border-[#A8D8EA]/30 text-xs">
                                          {typeof se === 'string' ? se : (se.name || se.id || 'Unknown')}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Team Members (if any) */}
                                {reg.team_members && Array.isArray(reg.team_members) && reg.team_members.length > 0 && (
                                  <div className="space-y-1">
                                    <p className="text-[#D2B997]/60 text-xs uppercase">Team Members</p>
                                    <div className="pl-2 border-l-2 border-[#A8D8EA]/30">
                                      {reg.team_members.map((member: string | Record<string, unknown>, idx: number) => {
                                        let memberDisplay: string
                                        if (typeof member === 'string') {
                                          memberDisplay = member
                                        } else if (typeof member === 'object' && member !== null) {
                                          const parts: string[] = []
                                          if (member.name) parts.push(String(member.name))
                                          if (member.college) parts.push(`(${String(member.college)})`)
                                          if (member.email) parts.push(`- ${String(member.email)}`)
                                          if (member.phone) parts.push(`- ${String(member.phone)}`)
                                          memberDisplay = parts.length > 0 ? parts.join(' ') : JSON.stringify(member)
                                        } else {
                                          memberDisplay = String(member)
                                        }
                                        return (
                                          <p key={idx} className="text-white text-sm">{idx + 1}. {memberDisplay}</p>
                                        )
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setViewRegistration(reg)
                                      setViewDialogOpen(true)
                                    }}
                                    className="flex-1 border-[#A8D8EA]/30 text-[#A8D8EA] hover:bg-[#A8D8EA]/10"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View All Details
                                  </Button>
                                </div>
                              </div>
                            )}
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
                    <span className="text-sm font-depixel-small text-[#A8D8EA]">
                      {selectedEvent === "all" ? "All Events" : events.find(e => e.id === selectedEvent)?.name}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingRegistrations ? (
                    <div className="text-center py-12">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto text-red-400" />
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
                            {selectedEvent === "all" && (
                              <TableHead className="text-[#D2B997] font-depixel-small">Event</TableHead>
                            )}
                            {getVisibleColumns().slice(0, 8).map((col) => (
                              <TableHead key={col} className="text-[#D2B997] font-depixel-small whitespace-nowrap">
                                {formatColumnName(col)}
                              </TableHead>
                            ))}
                            <TableHead className="text-[#D2B997] font-depixel-small">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRegistrations.map((reg) => (
                            <Fragment key={`${reg._event_table}-${reg.id}`}>
                              <TableRow 
                                className="border-[#D2B997]/20 cursor-pointer hover:bg-[#D2B997]/5"
                                onClick={() => toggleRowExpansion(`${reg._event_table}-${reg.id}`)}
                              >
                                <TableCell>
                                  {expandedRows.has(`${reg._event_table}-${reg.id}`) ? (
                                    <ChevronUp className="w-4 h-4 text-[#A8D8EA]" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-[#D2B997]" />
                                  )}
                                </TableCell>
                                {selectedEvent === "all" && (
                                  <TableCell className="font-depixel-small text-[#F8C471] whitespace-nowrap">
                                    {reg._event_name || "Unknown"}
                                  </TableCell>
                                )}
                                {getVisibleColumns().slice(0, 8).map((col) => (
                                  <TableCell key={col} className="whitespace-nowrap">
                                    {col === "id" ? (
                                      <span className="font-mono text-xs text-[#A8D8EA]">
                                        {String(reg[col]).slice(0, 8)}...
                                      </span>
                                    ) : col === "registration_status" ? (
                                      getStatusBadge(reg[col] || "pending")
                                    ) : col === "payment_verified" ? (
                                      getPaymentBadge(reg[col])
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
                                    ) : col === "amount_paid" || col === "total_amount" ? (
                                      <span className="text-white font-depixel-small">₹{reg[col]}</span>
                                    ) : col.includes("email") ? (
                                      <span className="text-[#A8D8EA] font-depixel-small text-xs">{reg[col] || "-"}</span>
                                    ) : (
                                      <span className="text-white font-depixel-small text-sm">
                                        {formatCellValue(reg[col], col)}
                                      </span>
                                    )}
                                  </TableCell>
                                ))}
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setViewRegistration(reg)
                                        setViewDialogOpen(true)
                                      }}
                                      className="text-[#A8D8EA] hover:text-white hover:bg-[#A8D8EA]/10"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        openEditDialog(reg)
                                      }}
                                      className="text-red-400 hover:text-white hover:bg-red-500/10"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                              {/* Expanded Row */}
                              {expandedRows.has(`${reg._event_table}-${reg.id}`) && (
                                <TableRow className="bg-[#1A1A1A]/50 border-[#D2B997]/20">
                                  <TableCell colSpan={selectedEvent === "all" ? 11 : 10}>
                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      {columns.filter(col => !hiddenColumns.includes(col) && !col.startsWith("_")).map((col) => {
                                        const value = reg[col]
                                        if (value === null || value === undefined) return null
                                        
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
                                        
                                        // Handle status and payment columns separately to avoid nesting div in p
                                        if (col === "registration_status") {
                                          return (
                                            <div key={col} className="space-y-1">
                                              <p className="text-[#D2B997]/60 text-xs font-depixel-small">
                                                {formatColumnName(col)}
                                              </p>
                                              <div>{getStatusBadge(value)}</div>
                                            </div>
                                          )
                                        }
                                        
                                        if (col === "payment_verified" || col === "checked_in") {
                                          return (
                                            <div key={col} className="space-y-1">
                                              <p className="text-[#D2B997]/60 text-xs font-depixel-small">
                                                {formatColumnName(col)}
                                              </p>
                                              <div>{col === "payment_verified" ? getPaymentBadge(value) : (
                                                value ? (
                                                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                                    <CheckCircle className="w-3 h-3 mr-1" />Yes
                                                  </Badge>
                                                ) : (
                                                  <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                                                    <XCircle className="w-3 h-3 mr-1" />No
                                                  </Badge>
                                                )
                                              )}</div>
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
            </>
          )}
        </FadeIn>
      </main>

      {/* View Registration Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="bg-[#2A2A2A] border-[#D2B997]/30 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#D2B997] font-futura tracking-wide">
              Registration Details
            </DialogTitle>
          </DialogHeader>
          {viewRegistration && (
            <div className="space-y-4">
              {/* Status badges */}
              <div className="flex gap-2 flex-wrap">
                {getStatusBadge(viewRegistration.registration_status || "pending")}
                {getPaymentBadge(viewRegistration.payment_verified)}
                {viewRegistration.checked_in && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Checked In
                  </Badge>
                )}
              </div>

              {/* All fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {columns.filter(col => !hiddenColumns.includes(col) && !col.startsWith("_")).map((col) => {
                  const value = viewRegistration[col]
                  if (value === null || value === undefined) return null
                  
                  if (col === "sub_events" && Array.isArray(value)) {
                    return (
                      <div key={col} className="col-span-1 md:col-span-2 space-y-1 p-3 bg-[#1A1A1A]/50 rounded-lg">
                        <p className="text-[#D2B997]/60 text-xs font-depixel-small uppercase">
                          {formatColumnName(col)}
                        </p>
                        {renderSubEventsDetails(value as (SubEventInfo | string)[])}
                      </div>
                    )
                  }
                  
                  // Skip status fields as they're shown at the top
                  if (col === "registration_status" || col === "payment_verified" || col === "checked_in") {
                    return null
                  }
                  
                  return (
                    <div key={col} className={`space-y-1 p-3 bg-[#1A1A1A]/50 rounded-lg ${Array.isArray(value) || typeof value === "object" ? "col-span-1 md:col-span-2" : ""}`}>
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
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-[#2A2A2A] border-red-500/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-red-400 font-futura tracking-wide flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Update Registration Status
            </DialogTitle>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-6">
              {/* Registration Info */}
              <div className="p-4 bg-[#1A1A1A]/50 rounded-lg space-y-2">
                <p className="text-white font-depixel-body">
                  {selectedRegistration.team_name || selectedRegistration.team_leader_name || 
                   selectedRegistration.participant_name || selectedRegistration.player1_name ||
                   selectedRegistration.name}
                </p>
                <p className="text-[#A8D8EA] text-sm">
                  {selectedRegistration.team_leader_email || selectedRegistration.participant_email || 
                   selectedRegistration.player1_email || selectedRegistration.email}
                </p>
                <p className="text-[#D2B997]/60 text-xs font-depixel-small">
                  {selectedRegistration._event_name}
                </p>
                {selectedRegistration.pass_type && (
                  <p className="text-[#B8A7D9] text-sm font-depixel-small">
                    {selectedRegistration.pass_type === 'couple' ? 'Couple Pass' : 
                     `Single Pass (${selectedRegistration.gender === 'male' ? 'Male' : 'Female'})`}
                  </p>
                )}
                {selectedRegistration.category && (
                  <p className="text-[#B8A7D9] text-sm font-depixel-small">
                    Category: {selectedRegistration.category === 'mens' ? "Men's" : 
                              selectedRegistration.category === 'womens' ? "Women's" : 
                              selectedRegistration.category === 'mixed' ? "Mixed" : 
                              selectedRegistration.category}
                  </p>
                )}
              </div>

              {/* Status Update */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[#D2B997] font-depixel-small">Registration Status</Label>
                  <Select value={editingStatus} onValueChange={setEditingStatus}>
                    <SelectTrigger className="bg-[#1A1A1A] border-[#D2B997]/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-[#D2B997]/30">
                      <SelectItem value="pending" className="text-white hover:bg-[#D2B997]/10">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-400" />
                          Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="verified" className="text-white hover:bg-[#D2B997]/10">
                        <div className="flex items-center gap-2">
                          <CircleCheck className="w-4 h-4 text-green-400" />
                          Verified
                        </div>
                      </SelectItem>
                      <SelectItem value="cancelled" className="text-white hover:bg-[#D2B997]/10">
                        <div className="flex items-center gap-2">
                          <Ban className="w-4 h-4 text-red-400" />
                          Cancelled
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#D2B997] font-depixel-small">Payment Status</Label>
                  <Select value={editingPaymentStatus} onValueChange={setEditingPaymentStatus}>
                    <SelectTrigger className="bg-[#1A1A1A] border-[#D2B997]/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-[#D2B997]/30">
                      <SelectItem value="pending" className="text-white hover:bg-[#D2B997]/10">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          Payment Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="verified" className="text-white hover:bg-[#D2B997]/10">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          Payment Verified
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#D2B997] font-depixel-small flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Message (Optional)
                  </Label>
                  <Textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Add a custom message to the email notification..."
                    className="bg-[#1A1A1A] border-[#D2B997]/30 text-white placeholder-[#D2B997]/40 min-h-[100px]"
                  />
                  <p className="text-[#D2B997]/60 text-xs font-depixel-small">
                    An email will be sent to the registrant with status update. CC: inquivesta@iiserkol.ac.in
                  </p>
                </div>

                {updateError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg font-depixel-small text-sm">
                    {updateError}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  className="border-[#D2B997] text-[#D2B997] hover:bg-[#D2B997]/10 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Update Status
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
