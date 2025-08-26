"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FadeIn } from "@/components/ui/fade-in"
import { Calendar, Clock, Users, ExternalLink, Share2, MapPin, Trophy, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface Event {
  id: string
  name: string
  day: "Day 1" | "Day 2" | "Day 3"
  date: string
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

const events: Event[] = [
  {
    id: "quantum-quest",
    name: "L.O.S.T",
    day: "Day 3",
    date: "Sometime, 2026",
    time: "10:00 AM - 06:00 PM",
    description: "The Flagship Treasure Hunt Event",
    detailedDescription:
      "Embark on an extraordinary journey through the campus! This competition challenges participants to solve fun science problems, from decoding messages to solving riddles. Teams will navigate through multiple rounds of theoretical and practical challenges, culminating in a final showdown. IT WILL BE FUN, Join us and get LOST in the treasure hunt .",
    image: "/lost-event.jpg",
    category: "Competition",
    venue: "All around the campus",
    prizes: "₹20,000 Prize Pool",
    registrationLink: "#register",
    socialLink: "#social",
    maxParticipants: 100,
    difficulty: "Advanced",
    duration: "10 hours",
  },
  {
    id: "bio-innovation",
    name: "Bio Innovation Lab",
    day: "Day 1",
    date: "Feb 15, 2026",
    time: "2:00 PM - 5:00 PM",
    description: "Engineer the future of biotechnology with cutting-edge experiments",
    detailedDescription:
      "Step into the future of biotechnology! This hands-on workshop combines synthetic biology, genetic engineering, and biotech innovation. Participants will work with state-of-the-art equipment to design and prototype biological solutions for real-world problems. From CRISPR gene editing to biocomputing, explore the frontiers of life sciences.",
    image: "/placeholder.svg?height=300&width=300&text=Bio+Innovation",
    category: "Workshop",
    venue: "Biotech Lab Complex",
    prizes: "Certificates & Internship Opportunities",
    registrationLink: "#register",
    socialLink: "#social",
    maxParticipants: 50,
    difficulty: "Intermediate",
    duration: "3 hours",
  },
  {
    id: "cosmic-code",
    name: "Cosmic Code Challenge",
    day: "Day 2",
    date: "Feb 16, 2026",
    time: "9:00 AM - 1:00 PM",
    description: "Program your way through space-age algorithms and AI challenges",
    detailedDescription:
      "Launch into the digital cosmos with our premier coding competition! Tackle algorithmic challenges inspired by space exploration, artificial intelligence, and quantum computing. From orbital mechanics simulations to machine learning models for exoplanet detection, this competition pushes the boundaries of computational thinking.",
    image: "/placeholder.svg?height=300&width=300&text=Cosmic+Code",
    category: "Competition",
    venue: "Computer Science Building",
    prizes: "₹75,000 Prize Pool + Internships",
    registrationLink: "#register",
    socialLink: "#social",
    maxParticipants: 200,
    difficulty: "Intermediate",
    duration: "4 hours",
  },
  {
    id: "astro-photography",
    name: "Astro Photography Workshop",
    day: "Day 2",
    date: "Feb 16, 2026",
    time: "7:00 PM - 11:00 PM",
    description: "Capture the cosmos through the lens of professional astrophotography",
    detailedDescription:
      "Discover the art and science of astrophotography! Learn from professional astronomers and photographers as they guide you through capturing stunning images of celestial objects. From camera settings and equipment to post-processing techniques, master the skills needed to photograph the night sky like a pro.",
    image: "/placeholder.svg?height=300&width=300&text=Astro+Photo",
    category: "Workshop",
    venue: "Observatory Deck",
    prizes: "Professional Equipment & Publication Opportunities",
    registrationLink: "#register",
    socialLink: "#social",
    maxParticipants: 30,
    difficulty: "Beginner",
    duration: "4 hours",
  },
  {
    id: "robo-wars",
    name: "Retro Robo Wars",
    day: "Day 3",
    date: "Feb 17, 2026",
    time: "11:00 AM - 4:00 PM",
    description: "Build and battle with vintage-inspired combat robots",
    detailedDescription:
      "Enter the arena of mechanical mayhem! Design, build, and pilot combat robots inspired by 1960s sci-fi aesthetics. This competition combines engineering prowess with creative design, as teams construct robots that must survive intense battles while maintaining that classic space-age look. May the best bot win!",
    image: "/placeholder.svg?height=300&width=300&text=Robo+Wars",
    category: "Competition",
    venue: "Engineering Arena",
    prizes: "₹1,00,000 Prize Pool + Trophies",
    registrationLink: "#register",
    socialLink: "#social",
    maxParticipants: 80,
    difficulty: "Advanced",
    duration: "5 hours",
  },
  {
    id: "space-talk",
    name: "Legends of Space Exploration",
    day: "Day 3",
    date: "Feb 17, 2026",
    time: "6:00 PM - 8:00 PM",
    description: "Inspiring talks from renowned space scientists and astronauts",
    detailedDescription:
      "Be inspired by the pioneers of space exploration! Join us for an evening of captivating talks from leading space scientists, former astronauts, and visionary researchers. Hear firsthand accounts of space missions, groundbreaking discoveries, and the future of human space exploration. A truly stellar experience!",
    image: "/placeholder.svg?height=300&width=300&text=Space+Talk",
    category: "Talk",
    venue: "Main Auditorium",
    prizes: "Networking & Inspiration",
    registrationLink: "#register",
    socialLink: "#social",
    maxParticipants: 500,
    difficulty: "Beginner",
    duration: "2 hours",
  },
]

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

export function EventsGrid() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
      {events.map((event, index) => {
        const IconComponent = categoryIcons[event.category]
        const isLarge = index === 0 || index === 4 // Make first and fifth cards larger

        return (
          <FadeIn key={event.id} delay={index * 0.1}>
            <Dialog>
              <DialogTrigger asChild>
                <Card
                  className={cn(
                    "group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-[#D2B997]/30 bg-gradient-to-br from-[#2A2A2A]/50 to-[#1A1A1A]/50 backdrop-blur-sm overflow-hidden",
                    isLarge && "md:col-span-2 lg:col-span-1 lg:row-span-2",
                  )}
                  onClick={() => setSelectedEvent(event)}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.name}
                        width={300}
                        height={300}
                        className={cn(
                          "w-full object-cover transition-transform duration-300 group-hover:scale-110",
                          isLarge ? "h-48 md:h-64" : "h-48",
                        )}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className={cn("bg-gradient-to-r text-white border-0", categoryColors[event.category])}>
                          <IconComponent className="w-3 h-3 mr-1" />
                          {event.category}
                        </Badge>
                      </div>

                      {/* Day Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-[#2A2A2A]/60 text-[#D2B997] border-[#D2B997]/30 font-mono">
                          {event.day}
                        </Badge>
                      </div>

                      {/* Difficulty Badge */}
                      <div className="absolute bottom-4 right-4">
                        <Badge className={cn("border font-mono text-xs", difficultyColors[event.difficulty])}>
                          {event.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#A8D8EA] transition-colors">
                          {event.name}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{event.description}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-[#D2B997] text-sm font-mono">
                          <Calendar className="w-4 h-4 mr-2" />
                          {event.date}
                        </div>
                        <div className="flex items-center text-[#D2B997] text-sm font-mono">
                          <Clock className="w-4 h-4 mr-2" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-[#D2B997] text-sm font-mono">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.venue}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#D2B997]/20">
                        <p className="text-[#F4D03F] text-sm font-semibold">{event.prizes}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] border-[#D2B997]/30">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] bg-clip-text text-transparent">
                    {event.name}
                  </DialogTitle>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.name}
                        width={400}
                        height={400}
                        className="w-full h-64 object-cover rounded-lg border border-[#D2B997]/30"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className={cn("bg-gradient-to-r text-white border-0", categoryColors[event.category])}>
                          <IconComponent className="w-3 h-3 mr-1" />
                          {event.category}
                        </Badge>
                        <Badge className="bg-[#2A2A2A]/60 text-[#D2B997] border-[#D2B997]/30 font-mono">
                          {event.day}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-[#D2B997] font-mono">
                        <Calendar className="w-5 h-5 mr-3" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-[#D2B997] font-mono">
                        <Clock className="w-5 h-5 mr-3" />
                        <span>
                          {event.time} ({event.duration})
                        </span>
                      </div>
                      <div className="flex items-center text-[#D2B997] font-mono">
                        <MapPin className="w-5 h-5 mr-3" />
                        <span>{event.venue}</span>
                      </div>
                      {event.maxParticipants && (
                        <div className="flex items-center text-[#D2B997] font-mono">
                          <Users className="w-5 h-5 mr-3" />
                          <span>Max {event.maxParticipants} participants</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">About This Event</h4>
                      <p className="text-gray-300 leading-relaxed">{event.detailedDescription}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-[#2A2A2A]/30 to-[#3A3A3A]/30 rounded-lg border border-[#D2B997]/20">
                        <h5 className="text-[#D2B997] font-semibold mb-1">Difficulty</h5>
                        <Badge className={cn("border font-mono", difficultyColors[event.difficulty])}>
                          {event.difficulty}
                        </Badge>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-[#2A2A2A]/30 to-[#3A3A3A]/30 rounded-lg border border-[#D2B997]/20">
                        <h5 className="text-[#D2B997] font-semibold mb-1">Duration</h5>
                        <p className="text-white font-mono">{event.duration}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-[#F4D03F]/30 to-[#F8C471]/30 rounded-lg border border-[#F4D03F]/30">
                      <h5 className="text-[#F4D03F] font-semibold mb-1">Prizes & Rewards</h5>
                      <p className="text-[#F8C471]">{event.prizes}</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button className="flex-1 bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-mono">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Register Now
                      </Button>
                      <Button
                        variant="outline"
                        className="border-[#D2B997] text-[#D2B997] hover:bg-[#D2B997]/10 bg-transparent"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </FadeIn>
        )
      })}
    </div>
  )
}
