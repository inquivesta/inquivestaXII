"use client"

import { useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Clock,
  MapPin,
  Trophy,
  Zap,
  Users,
  ExternalLink,
  Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Event {
  id: string
  name: string
  day: "Day 1" | "Day 2" | "Day 3"
  date: string // e.g., "Feb 15, 2026"
  time: string
  description: string
  detailedDescription: string
  image: string
  category: "Competition" | "Workshop" | "Exhibition" | "Talk" | "Performance"
  venue: string
  prizes: string
  registrationLink: string
  socialLink: string
  maxParticipants?: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
}

interface EventCalendarProps {
  events: Event[]
}

const categoryIcons = {
  Competition: Trophy,
  Workshop: Zap,
  Exhibition: Users,
  Talk: Users,
  Performance: Users,
}

const categoryColors = {
  Competition: "from-[#F8BBD9] to-[#F8C471]",
  Workshop: "from-[#A8D8EA] to-[#85C1E9]",
  Exhibition: "from-[#ABEBC6] to-[#82E0AA]",
  Talk: "from-[#B8A7D9] to-[#D2B4DE]",
  Performance: "from-[#F4D03F] to-[#F8C471]",
}

const difficultyColors = {
  Beginner: "bg-[#ABEBC6]/20 text-[#ABEBC6] border-[#ABEBC6]/30",
  Intermediate: "bg-[#F4D03F]/20 text-[#F4D03F] border-[#F4D03F]/30",
  Advanced: "bg-[#F8BBD9]/20 text-[#F8BBD9] border-[#F8BBD9]/30",
}

export function EventCalendar({ events }: EventCalendarProps) {
  const year = 2026
  const month = 1 // February
  const numDays = 28
  const startDay = 2 // Tuesday

  const days = Array.from({ length: numDays }, (_, i) => i + 1)
  const emptyCells = Array.from({ length: startDay }, (_, i) => i)

  const eventDates = useMemo(() => {
    const dates: { [key: string]: Event[] } = {}
    events.forEach((event) => {
      const eventDate = new Date(event.date)
      const key = `${eventDate.getFullYear()}-${eventDate.getMonth()}-${eventDate.getDate()}`
      if (!dates[key]) {
        dates[key] = []
      }
      dates[key].push(event)
    })
    return dates
  }, [events])

  const getEventsForDay = (day: number) => {
    const key = `${year}-${month}-${day}`
    return eventDates[key] || []
  }

  const monthName = "February 2026"

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Calendar View */}
      <Card className="flex-1 bg-gradient-to-br from-[#2A2A2A]/50 to-[#1A1A1A]/50 border-[#D2B997]/30 p-6">
        <CardContent className="p-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white font-mono">{monthName}</h2>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-sm font-mono text-[#D2B997] mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="font-bold">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {emptyCells.map((_, i) => (
              <div key={i} className="h-10"></div>
            ))}
            {days.map((day) => (
              <div
                key={day}
                className="h-10 bg-[#1A1A1A] border border-[#D2B997]/30 text-white flex items-center justify-center cursor-pointer"
              >
                {day}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
