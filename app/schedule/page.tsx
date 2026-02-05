"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FadeIn } from "@/components/ui/fade-in"
import { HyperText } from "@/components/ui/hyper-text"
import {
  ArrowLeft,
  Clock,
  MapPin,
  Zap,
  Music,
  Gamepad2,
  Camera,
  Dumbbell,
  PartyPopper,
  Navigation,
  Map,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Venue information with Google Maps embeds
const venues: Record<string, { name: string; description: string; mapUrl: string }> = {
  "tennis": {
    name: "Tennis Court",
    description: "IISER-K Lawn Tennis Court",
    mapUrl: "https://maps.google.com/maps?width=600&height=400&hl=en&q=IISER-K Lawn tennis court&t=&z=19&ie=UTF8&iwloc=B&output=embed"
  },
  "lhc": {
    name: "LHC (Lecture Hall Complex)",
    description: "A P C Ray Lecture Hall Complex - Rooms with G-- (ground floor), 1-- (1st floor), 2-- (2nd floor)",
    mapUrl: "https://maps.google.com/maps?width=600&height=400&hl=en&q=A P C Ray Lecture Hall Complex&t=&z=19&ie=UTF8&iwloc=B&output=embed"
  },
  "cricket": {
    name: "Cricket Ground",
    description: "IISER Kolkata Cricket Ground",
    mapUrl: "https://maps.google.com/maps?width=600&height=400&hl=en&q=IISER Kolkata Cricket Ground&t=&z=19&ie=UTF8&iwloc=B&output=embed"
  },
  "athletics": {
    name: "Athletics Ground",
    description: "IISER Kolkata Athletics Ground",
    mapUrl: "https://maps.google.com/maps?width=600&height=400&hl=en&q=IISER Kolkata Athletics Ground&t=&z=17&ie=UTF8&iwloc=B&output=embed"
  },
  "football": {
    name: "Football Ground",
    description: "IISER Campus Football Play Ground",
    mapUrl: "https://maps.google.com/maps?width=600&height=400&hl=en&q=IISER Campus Football Play Ground&t=&z=18&ie=UTF8&iwloc=B&output=embed"
  },
  "rnt": {
    name: "RNT Auditorium",
    description: "IISER-K R N Tagore Auditorium",
    mapUrl: "https://maps.google.com/maps?width=600&height=400&hl=en&q=IISER-K R N Tagore AUDITORIUM&t=&z=18&ie=UTF8&iwloc=B&output=embed"
  },
  "sac": {
    name: "SAC (Student Activity Centre)",
    description: "Centre for Student's Activity - includes Dance Room",
    mapUrl: "https://maps.google.com/maps?width=600&height=400&hl=en&q=Centre for Student's Activity (CSA / SAC) IISER Kolkata&t=&z=19&ie=UTF8&iwloc=B&output=embed"
  },
  "basketball": {
    name: "Basketball Court",
    description: "IISER Kolkata Basketball Court",
    mapUrl: "https://maps.google.com/maps?width=600&height=400&hl=en&q=IISER Kolkata&t=&z=17&ie=UTF8&iwloc=B&output=embed"
  },
  "tt": {
    name: "Table Tennis Room",
    description: "Table Tennis Rooms at SAC",
    mapUrl: "https://maps.google.com/maps?width=600&height=400&hl=en&q=Centre for Student's Activity (CSA / SAC) IISER Kolkata&t=&z=19&ie=UTF8&iwloc=B&output=embed"
  },
  "pronite": {
    name: "Open Air Stage",
    description: "Pronite venue - Open Air Stage",
    mapUrl: "https://maps.google.com/maps?width=600&height=400&hl=en&q=inquivesta&t=&z=18&ie=UTF8&iwloc=B&output=embed"
  },
  "khokho": {
    name: "Kho Kho Ground",
    description: "IISER Kolkata Kho Kho Ground",
    mapUrl: "https://maps.google.com/maps?width=600&height=400&hl=en&q=IISER Kolkata Kho Kho Ground&t=&z=19&ie=UTF8&iwloc=B&output=embed"
  }
}

// Event categories with colors
const categoryConfig: Record<string, { color: string; icon: React.ElementType; gradient: string }> = {
  "Science": { color: "bg-[#A8D8EA]", icon: Zap, gradient: "from-[#A8D8EA] to-[#85C1E9]" },
  "Sports": { color: "bg-[#F8BBD9]", icon: Dumbbell, gradient: "from-[#F8BBD9] to-[#F8C471]" },
  "Cultural": { color: "bg-[#B8A7D9]", icon: Music, gradient: "from-[#B8A7D9] to-[#D2B4DE]" },
  "Gaming": { color: "bg-[#ABEBC6]", icon: Gamepad2, gradient: "from-[#ABEBC6] to-[#82E0AA]" },
  "Exhibition": { color: "bg-[#F4D03F]", icon: Camera, gradient: "from-[#F4D03F] to-[#F8C471]" },
  "Special": { color: "bg-[#F8C471]", icon: PartyPopper, gradient: "from-[#F8C471] to-[#F4D03F]" },
}

interface ScheduleEvent {
  id: string
  name: string
  time: string
  endTime?: string
  venue: string
  venueKey: string
  category: string
  description: string
  prizes?: string
  isHighlight?: boolean
  isContinuous?: boolean
  link?: string
}

interface DaySchedule {
  day: number
  date: string
  fullDate: string
  events: ScheduleEvent[]
}

// Schedule data
const scheduleData: DaySchedule[] = [
  {
    day: 1,
    date: "Feb 6",
    fullDate: "February 6, 2026 (Friday)",
    events: [
      {
        id: "opening",
        name: "Opening Ceremony",
        time: "10:00",
        endTime: "11:00",
        venue: "RNT Auditorium",
        venueKey: "rnt",
        category: "Special",
        description: "Grand inauguration of Inquivesta XII - The annual science and cultural festival of IISER Kolkata",
        isHighlight: true
      },
      {
        id: "smash7-day1",
        name: "Smash 7 (Cricket)",
        time: "11:00",
        endTime: "17:00",
        venue: "Cricket Ground",
        venueKey: "cricket",
        category: "Sports",
        description: "10-over tennis ball box cricket league - League matches Day 1",
        prizes: "₹14,000",
        link: "/events#smash7"
      },
      {
        id: "basketball-day1",
        name: "Hoop Hustle (3v3 Basketball)",
        time: "11:00",
        endTime: "17:00",
        venue: "Basketball Court",
        venueKey: "basketball",
        category: "Sports",
        description: "3v3 basketball tournament - Preliminary rounds",
        prizes: "₹10,000",
        link: "/events#hoop-hustle"
      },
      {
        id: "headshot-day1",
        name: "Krafton x Headshot - (Real Cricket)",
        time: "11:00",
        endTime: "18:00",
        venue: "LHC Rooms G02, G08, G09",
        venueKey: "lhc",
        category: "Exhibition",
        description: "Krafton x Headshot - Day 1",
        prizes: "₹7,500",
        isContinuous: true,
        link: "/events"
      },
      {
        id: "photon-day1",
        name: "Photon Exhibition",
        time: "11:00",
        endTime: "18:00",
        venue: "Beside LHC Cafeteria",
        venueKey: "lhc",
        category: "Exhibition",
        description: "Photography exhibition showcasing 'Life in Motion' themed photographs - Exhibition open all day",
        prizes: "₹7,500",
        isContinuous: true,
        link: "/events#photon"
      },
      {
        id: "art-culture",
        name: "Art in a Culture",
        time: "14:00",
        endTime: "18:00",
        venue: "DBS Teaching Lab",
        venueKey: "lhc",
        category: "Science",
        description: "Create living art by designing patterns on petri dishes with bacterial cultures",
        prizes: "₹5,000",
        link: "/events#art-in-a-culture"
      },
      {
        id: "nukkad",
        name: "Nukkad Natak",
        time: "15:00",
        endTime: "17:30",
        venue: "Kho Kho Ground",
        venueKey: "khokho",
        category: "Cultural",
        description: "Street play competition spreading awareness about social issues",
        prizes: "₹10,000",
        link: "/events#nukkad-natak"
      },
      {
        id: "masquerade",
        name: "Masquerade",
        time: "18:00",
        endTime: "21:00",
        venue: "LHC Backyard",
        venueKey: "lhc",
        category: "Special",
        description: "New Year's Eve 1969 themed masquerade ball - Dance, mystery, and romance under the stars",
        isHighlight: true,
        link: "/masquerade"
      },
      {
        id: "cultural-night",
        name: "Spotlight - Cultural Night",
        time: "21:00",
        endTime: "00:00",
        venue: "RNT Auditorium",
        venueKey: "rnt",
        category: "Cultural",
        description: "Grand cultural night featuring performances by IISER Kolkata students",
        isHighlight: true,
        link: "/events#spotlight"
      }
    ]
  },
  {
    day: 2,
    date: "Feb 7",
    fullDate: "February 7, 2026 (Saturday)",
    events: [
      {
        id: "smash7-day2",
        name: "Smash 7 (Cricket)",
        time: "09:00",
        endTime: "17:00",
        venue: "Cricket Ground",
        venueKey: "cricket",
        category: "Sports",
        description: "10-over tennis ball box cricket league - League matches Day 2",
        prizes: "₹14,000",
        link: "/events#smash7"
      },
      {
        id: "csi-day1",
        name: "CSI - Crime Scene Investigation",
        time: "09:30",
        endTime: "17:30",
        venue: "LHC",
        venueKey: "lhc",
        category: "Science",
        description: "Unleash your inner detective! Day 1 - 4 crime scenes, top 25% advance",
        prizes: "₹20,000",
        link: "/events#csi"
      },
      {
        id: "inquicon",
        name: "Inquicon",
        time: "09:00",
        endTime: "17:00",
        venue: "RNT Auditorium",
        venueKey: "rnt",
        category: "Cultural",
        description: "Anime, manga, gaming celebration - Karaoke, Pokémon Showdown, Cosplay performances",
        prizes: "₹15,000",
        isHighlight: true,
        link: "/events#inquicon"
      },
      {
        id: "botprix",
        name: "Botprix",
        time: "10:00",
        endTime: "17:00",
        venue: "Beside Room 107",
        venueKey: "lhc",
        category: "Science",
        description: "Robot racing competition - Engineer bots to navigate challenging racetrack",
        prizes: "₹10,000",
        link: "/events#botprix"
      },
      {
        id: "inquizzitive-day1",
        name: "Inquizzitive (Quiz)",
        time: "10:00",
        endTime: "15:00",
        venue: "Room G06",
        venueKey: "lhc",
        category: "Science",
        description: "Thrilling quiz competition - Test your knowledge across multiple domains",
        prizes: "₹30,000",
        link: "/events#inquizzitive"
      },
      {
        id: "photon-day2",
        name: "Photon Exhibition",
        time: "10:00",
        endTime: "18:00",
        venue: "Beside LHC Cafeteria",
        venueKey: "lhc",
        category: "Exhibition",
        description: "Photography exhibition continues - All-day viewing",
        prizes: "₹7,500",
        isContinuous: true,
        link: "/events#photon"
      },
      {
        id: "basketball-day2",
        name: "Hoop Hustle (3v3 Basketball)",
        time: "10:00",
        endTime: "17:00",
        venue: "Basketball Court",
        venueKey: "basketball",
        category: "Sports",
        description: "3v3 basketball tournament continues - Knockout rounds",
        prizes: "₹10,000",
        link: "/events#hoop-hustle"
      },
      {
        id: "table-tennis",
        name: "Table Tennis Tournament",
        time: "09:00",
        endTime: "17:00",
        venue: "SAC Table Tennis Room",
        venueKey: "tt",
        category: "Sports",
        description: "Singles & Doubles categories - Men's, Women's, Mixed",
        prizes: "₹10,000",
        link: "/events#table-tennis"
      },
      {
        id: "beat-drop",
        name: "Beat the Drop",
        time: "11:00",
        endTime: "16:00",
        venue: "LHC Cafeteria, Room 210",
        venueKey: "lhc",
        category: "Science",
        description: "Egg drop challenge - Design a contraption to protect an egg from a height drop",
        prizes: "₹10,000",
        link: "/events#beat-the-drop"
      },
      {
        id: "headshot-day1",
        name: "Headshot - Gaming Tournament",
        time: "10:00",
        endTime: "18:00",
        venue: "Rooms G02, G08, G09",
        venueKey: "lhc",
        category: "Gaming",
        description: "E-sports tournament - BGMI, Valorant, FC26, VR gaming",
        prizes: "₹55,000",
        isHighlight: true,
        link: "/events#headshot-bgmi"
      },
      {
        id: "soulbeats-day1",
        name: "Soulbeats - X-Press & Dance Battle",
        time: "13:00",
        endTime: "17:30",
        venue: "Room 107",
        venueKey: "lhc",
        category: "Cultural",
        description: "Dance fest - X-Press stage performances & Survival of the Fittest battle",
        prizes: "₹22,000",
        link: "/events#soulbeats"
      },
      {
        id: "pronite-day1",
        name: "PRONITE - Monali Thakur Live",
        time: "19:00",
        endTime: "00:00",
        venue: "Open Air Stage",
        venueKey: "pronite",
        category: "Special",
        description: "National Award winner Monali Thakur performs live! Gates open at 6 PM",
        isHighlight: true,
        link: "/pronite"
      }
    ]
  },
  {
    day: 3,
    date: "Feb 8",
    fullDate: "February 8, 2026 (Sunday)",
    events: [
      {
        id: "smash7-day3",
        name: "Smash 7 Finals",
        time: "09:00",
        endTime: "12:00",
        venue: "Cricket Ground",
        venueKey: "cricket",
        category: "Sports",
        description: "Box cricket finals - Semi-finals & Championship match",
        prizes: "₹14,000",
        isHighlight: true,
        link: "/events#smash7"
      },
      {
        id: "csi-day2",
        name: "CSI - Crime Scene Investigation Finals",
        time: "09:30",
        endTime: "17:30",
        venue: "LHC",
        venueKey: "lhc",
        category: "Science",
        description: "CSI Finals - Complex scenes and in-depth analysis for qualified teams",
        prizes: "₹20,000",
        link: "/events#csi"
      },
      {
        id: "inquizzitive-day2",
        name: "Inquizzitive Finals (Quiz)",
        time: "10:00",
        endTime: "15:00",
        venue: "Room G06",
        venueKey: "lhc",
        category: "Science",
        description: "Quiz competition finals - Ultimate battle of wits",
        prizes: "₹30,000",
        link: "/events#inquizzitive"
      },
      {
        id: "lost",
        name: "LOST - Treasure Hunt",
        time: "10:00",
        endTime: "17:00",
        venue: "LHC & Campus",
        venueKey: "lhc",
        category: "Science",
        description: "High-stakes AI-themed treasure hunt across campus - Decode, decrypt, survive!",
        isHighlight: true,
        link: "/events#lost"
      },
      {
        id: "photon-day3",
        name: "Photon Exhibition & Awards",
        time: "10:00",
        endTime: "18:00",
        venue: "Beside LHC Cafeteria",
        venueKey: "lhc",
        category: "Exhibition",
        description: "Final day of exhibition - Winner announcement",
        prizes: "₹7,500",
        isContinuous: true,
        link: "/events#photon"
      },
      {
        id: "junkyard",
        name: "Junkyard Wars",
        time: "10:00",
        endTime: "18:00",
        venue: "Beside Room 107 + Room 108",
        venueKey: "lhc",
        category: "Science",
        description: "Build working machines from random scrap materials - Imagination rules!",
        prizes: "₹13,000",
        link: "/events#junkyard-wars"
      },
      {
        id: "headshot-day2",
        name: "Headshot - Gaming Tournament Finals",
        time: "10:00",
        endTime: "18:00",
        venue: "Rooms G02, G08, G09",
        venueKey: "lhc",
        category: "Gaming",
        description: "E-sports finals - Championship matches",
        prizes: "₹55,000",
        link: "/events#headshot-bgmi"
      },
    //   {
    //     id: "bullseye",
    //     name: "Bulls Eye",
    //     time: "10:00",
    //     endTime: "17:00",
    //     venue: "Athletics Ground",
    //     venueKey: "athletics",
    //     category: "Sports",
    //     description: "Archery-based fun competition - DartShot, Target Tac-Toe, Cup Knockdown",
    //     prizes: "₹8,000"
    //   },
      {
        id: "thrust",
        name: "THRUST - Water Rocket",
        time: "11:00",
        endTime: "16:00",
        venue: "SAC + Football Ground",
        venueKey: "football",
        category: "Science",
        description: "Water bottle rocketry competition - Maximum range, payload test, target challenge",
        prizes: "₹10,000",
        link: "/events#thrust"
      },
      {
        id: "soulbeats-workshop",
        name: "Soulbeats Workshop",
        time: "11:00",
        endTime: "14:00",
        venue: "Dance Room (SAC)",
        venueKey: "sac",
        category: "Cultural",
        description: "Dance workshop by guest judges - Learn from professional dancers",
        link: "/events#soulbeats"
      },
      {
        id: "pronite-day2",
        name: "PRONITE - Grand Finale",
        time: "19:00",
        endTime: "00:00",
        venue: "Open Air Stage",
        venueKey: "pronite",
        category: "Special",
        description: "Grand closing night with live performance! Gates open at 6 PM",
        isHighlight: true,
        link: "/pronite"
      }
    ]
  }
]

// Time slot helper
const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":")
  const h = parseInt(hours)
  const ampm = h >= 12 ? "PM" : "AM"
  const h12 = h % 12 || 12
  return `${h12}:${minutes} ${ampm}`
}

// Sort events by time
const sortEventsByTime = (events: ScheduleEvent[]) => {
  return [...events].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
}

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(1)
  const [selectedVenue, setSelectedVenue] = useState<string | null>("lhc")
  const [showMap, setShowMap] = useState(false)
  const [isQuickVenueOpen, setIsQuickVenueOpen] = useState(false)
  const scheduleRef = useRef<HTMLDivElement>(null)

  const currentDayData = scheduleData.find(d => d.day === selectedDay)
  const sortedEvents = currentDayData ? sortEventsByTime(currentDayData.events) : []

  // Handle venue click to show map
  const handleVenueClick = (venueKey: string) => {
    setSelectedVenue(venueKey)
    setShowMap(true)
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#D2B997]/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-[#D2B997] hover:text-[#B8A7D9] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-depixel-small">Back to Home</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Image src="/ball_a.png" alt="INQUIVESTA XII" width={60} height={60} className="h-10 w-auto" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <FadeIn>
            <div className="text-center mb-4">
              <HyperText
                className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#F8C471] to-[#F7DC6F] bg-clip-text text-transparent font-futura"
                text="SCHEDULE"
              />
              <p className="text-[#D2B997] text-lg font-depixel-body mb-2">FEBRUARY 6-8, 2026</p>
              <p className="text-[#B8A7D9] text-sm font-depixel-small">IISER Kolkata, Mohanpur</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Sticky Campus Map - Mobile/Tablet Only */}
      <div className="sticky top-[73px] z-40 bg-[#1A1A1A] border-b border-[#D2B997]/30 lg:hidden">
        <div className="relative overflow-hidden flex justify-center">
          <Image
            src="/CampusMap.png"
            alt="IISER Kolkata Campus Map"
            width={1800}
            height={1023}
            className="w-full h-auto max-h-[50vh] md:max-h-[40vh] object-contain"
          />
          <div className="absolute bottom-3 right-3">
            <Badge className="bg-[#1A1A1A]/90 text-[#D2B997] border-[#D2B997]/30 font-depixel-small text-xs">
              <Map className="w-3 h-3 mr-1" />
              Campus Map
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content - Schedule with Sticky Map */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          {/* Day Selector Tabs */}
          <FadeIn delay={0.2}>
            <div className="flex justify-center mb-8 py-4">
              <div className="inline-flex bg-[#2A2A2A]/50 rounded-lg p-1 border border-[#D2B997]/30">
                {scheduleData.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={cn(
                      "px-6 py-3 rounded-lg font-depixel-body transition-all duration-300",
                      selectedDay === day.day
                        ? "bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] text-[#1A1A1A]"
                        : "text-[#D2B997] hover:bg-[#2A2A2A]"
                    )}
                  >
                    <span className="block text-lg font-bold">Day {day.day}</span>
                    <span className="block text-xs opacity-80">{day.date}</span>
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Schedule Content with Sidebar Map */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Schedule Timeline */}
            <div className="flex-1" ref={scheduleRef}>
              <FadeIn delay={0.3}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white font-depixel-body mb-2">
                    {currentDayData?.fullDate}
                  </h2>
                  <p className="text-[#D2B997] font-depixel-small">
                    {sortedEvents.length} events scheduled
                  </p>
                </div>
              </FadeIn>

              {/* Timeline */}
              <div className="space-y-4">
                {sortedEvents.map((event, index) => {
                  const config = categoryConfig[event.category]

                  return (
                    <FadeIn key={event.id} delay={0.1 * Math.min(index, 5)}>
                      <Card
                        className={cn(
                          "border-l-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl",
                          "bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] border-[#D2B997]/30",
                          event.isHighlight && "ring-2 ring-[#F4D03F]/50"
                        )}
                        style={{ borderLeftColor: config?.color.includes('A8D8EA') ? '#A8D8EA' : 
                                                  config?.color.includes('F8BBD9') ? '#F8BBD9' :
                                                  config?.color.includes('B8A7D9') ? '#B8A7D9' :
                                                  config?.color.includes('ABEBC6') ? '#ABEBC6' :
                                                  config?.color.includes('F4D03F') ? '#F4D03F' :
                                                  '#F8C471' }}
                      >
                        <CardContent className="p-4 md:p-5">
                          {/* Event Name - Most Prominent */}
                          <h3 className="text-xl md:text-2xl font-bold text-white font-depixel-body mb-3">
                            {event.link ? (
                              <Link href={event.link} className="hover:text-[#A8D8EA] transition-colors">
                                {event.name}
                              </Link>
                            ) : (
                              event.name
                            )}
                          </h3>

                          {/* Time and Location - Big and Prominent */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-3">
                            {/* Time */}
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-[#F4D03F]" />
                              <span className="text-xl md:text-2xl font-bold text-[#F4D03F] font-mono">
                                {formatTime(event.time)}
                              </span>
                              {event.endTime && (
                                <span className="text-lg text-[#D2B997]/80 font-mono">
                                  - {formatTime(event.endTime)}
                                </span>
                              )}
                            </div>

                            {/* Location */}
                            <button
                              onClick={() => handleVenueClick(event.venueKey)}
                              className="flex items-center gap-2 text-[#A8D8EA] hover:text-[#85C1E9] transition-colors group"
                            >
                              <MapPin className="w-5 h-5" />
                              <span className="text-lg md:text-xl font-bold">
                                {event.venue}
                              </span>
                              <Navigation className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                            </button>
                          </div>

                          {/* Description */}
                          <p className="text-[#D2B997]/80 text-sm font-depixel-small">
                            {event.description}
                          </p>

                          {/* View Details Link */}
                          {event.link && (
                            <div className="mt-3">
                              <Link href={event.link} className="text-[#A8D8EA] hover:text-[#85C1E9] text-sm font-depixel-small transition-colors">
                                View Details →
                              </Link>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </FadeIn>
                  )
                })}
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Mobile Map Modal */}
      {showMap && selectedVenue && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/80 flex items-end">
          <div className="w-full bg-[#1A1A1A] rounded-t-2xl border-t border-[#D2B997]/30 p-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white font-depixel-body">
                {venues[selectedVenue]?.name}
              </h3>
              <button
                onClick={() => setShowMap(false)}
                className="p-2 rounded-full bg-[#2A2A2A] text-[#D2B997] hover:bg-[#3A3A3A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-lg overflow-hidden border border-[#D2B997]/30 mb-4">
              <iframe
                className="w-full h-64"
                frameBorder="0"
                scrolling="no"
                src={venues[selectedVenue]?.mapUrl}
              />
            </div>
            <p className="text-[#D2B997]/80 text-sm font-depixel-small mb-4">
              {venues[selectedVenue]?.description}
            </p>
            <Button
              onClick={() => setShowMap(false)}
              className="w-full bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] text-[#1A1A1A] font-depixel-small"
            >
              Close Map
            </Button>
          </div>
        </div>
      )}

      {/* Quick Navigation FAB - Mobile */}
      <div className="fixed bottom-6 right-6 z-40">
        <Dialog open={isQuickVenueOpen} onOpenChange={setIsQuickVenueOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="rounded-full w-14 h-14 bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] text-[#1A1A1A] shadow-lg"
            >
              <Map className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] border-[#D2B997]/30 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white font-depixel-body">
                Quick Venue Access
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {Object.entries(venues).map(([key, venue]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedVenue(key)
                    setShowMap(true)
                    setIsQuickVenueOpen(false)
                  }}
                  className="p-3 rounded-lg bg-[#2A2A2A] border border-[#D2B997]/30 hover:bg-[#3A3A3A] transition-colors text-left"
                >
                  <MapPin className="w-4 h-4 text-[#A8D8EA] mb-1" />
                  <p className="text-white text-sm font-depixel-small">{venue.name}</p>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Footer Note */}
      <section className="py-8 px-4 border-t border-[#D2B997]/30">
        <div className="container mx-auto text-center">
          <p className="text-[#D2B997]/60 text-sm font-depixel-small mb-2">
            Schedule is subject to minor changes. Follow our social media for real-time updates.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/events" className="text-[#A8D8EA] hover:text-[#85C1E9] text-sm font-depixel-small transition-colors">
              View All Events →
            </Link>
            <Link href="/pronite" className="text-[#B8A7D9] hover:text-[#D2B4DE] text-sm font-depixel-small transition-colors">
              Pronite Details →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
