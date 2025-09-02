"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FadeIn } from "@/components/ui/fade-in"
import { HyperText } from "@/components/ui/hyper-text"
import { NumberTicker } from "@/components/ui/number-ticker"
import {
  ArrowLeft,
  Mail,
  Linkedin,
  Github,
  Twitter,
  Star,
  Users,
  Zap,
  Trophy,
  Heart,
  Sparkles,
  Rocket,
  Target,
  Award,
  Coffee,
  Gamepad2,
  Brain,
  Lightbulb,
  Instagram,
  Menu,
  X,
  Facebook,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TeamMember {
  id: string
  name: string
  role: string
  image: string
  bio: string
  email?: string
  phone?: string
  linkedin?: string
  github?: string
  twitter?: string
  instagram?: string
  stats: {
    leadership: number
    creativity: number
    technical: number
    communication: number
    problemSolving: number
  } | Record<string, number>
  achievements: string[]
  funFact: string
  favoriteQuote: string
  teamType: "core" | "extended"
  department?: string
  year?: string
  coffeeConsumed: number
  projectsCompleted: number
  sleeplessNights: number
  superpower: string
}

const coreTeam: TeamMember[] = [
  {
    id: "mridul-rawat",
    name: "Mridul Krishna Rawat",
    role: "Sponsorship Head",
    image: "/cc/mridul.jpg",
    bio: "Driving strategic collaborations for INQUIVESTA XII with strong negotiation skills, creative branding ideas, and a gamer's precision. Ensuring top-tier sponsorship experiences while keeping the festival dynamic and engaging.",
    email: "mridul.rawat@iiserkol.ac.in",
    linkedin: "https://www.linkedin.com/in/mridul-rawat-762781289/",
    github: "#",
    instagram: "https://www.instagram.com/mridul.rawat.1656?utm_source=qr&igsh=MTJzbjE4dzdjeXBqaw==",
    stats: {
      gaming: 100,
      networking: 95,
      negotiation: 90,
      hyperfocus: 88,
      dealClosing: 85,
    },
    achievements: ["Secured 50+ sponsorships", "Strategic partnership expert", "Gaming tournament champion"],
    funFact: "Can negotiate sponsorships while hitting perfect headshots in FPS games.",
    favoriteQuote: "Losing is just another opportunity to shine even brighter.",
    teamType: "core",
    department: "Chemical Sciences",
    year: "3rd Year BSMS",
    coffeeConsumed: 923,
    projectsCompleted: 28,
    sleeplessNights: 171,
    superpower: "Deal Closer",
  },
  {
    id: "rupanjan-biswas",
    name: "Rupanjan Biswas",
    role: "Sponsorship Head",
    image: "/cc/rupanjan.JPG",
    bio: "Building bridges between INQUIVESTA and industry partners. Rupanjan's networking skills ensure our festival has the best support and resources.",
    email: "rb23ms126@iiserkol.ac.in",
    linkedin: "https://www.linkedin.com/in/rupanjan-biswas-0177161b0?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    instagram: "https://www.instagram.com/rupanjan._biswas?igsh=MXdzb2Q3NTI2MDFweg%3D%3D&utm_source=qr",
    stats: {
      networking: 98,
      negotiation: 88,
      persuasion: 92,
      relationshipBuilding: 85,
      dealClosing: 90,
    },
    achievements: ["Secured ₹10L+ in sponsorships", "Network of 100+ industry contacts", "Negotiation Master"],
    funFact: "Can charm anyone into sponsoring an event with just a smile!",
    favoriteQuote: "Opportunities don't happen. You create them.",
    teamType: "core",
    department: "Mathematical Sciences",
    year: "3rd Year BSMS",
    coffeeConsumed: 5,
    projectsCompleted: 18,
    sleeplessNights: 9,
    superpower: "Persuasion Master",
  },
  {
    id: "aritra-paul",
    name: "Aritra Paul",
    role: "Fest Coordinator",
    image: "/cc/aritra.jpeg",
    bio: "Leading INQUIVESTA XII with passion and dedication. Aritra ensures every aspect of the festival runs smoothly while maintaining the spirit of scientific exploration and fun.",
    email: "ap23ms129@iiserkol.ac.in",
    linkedin: "#",
    github: "#",
    instagram: "https://www.instagram.com/aritrapaul27",
    stats: {
      leadership: 95,
      timeManagement: 92,
      crisisHandling: 98,
      teamCoordination: 90,
      visionClarity: 88,
    },
    achievements: ["Led 5 successful events", "Increased participation by 200%", "Master of Crisis Management"],
    funFact: "Can solve a Rubik's cube in under 2 minutes while discussing quantum mechanics!",
    favoriteQuote: "Science is not only a disciple of reason but also one of romance and passion.",
    teamType: "core",
    department: "Physical Sciences",
    year: "3rd Year BSMS",
    coffeeConsumed: 847,
    projectsCompleted: 23,
    sleeplessNights: 156,
    superpower: "Time Management Wizard",
  },
  {
    id: "aniket-mishra",
    name: "Aniket Mishra",
    role: "Event Coordinator",
    image: "/cc/aniket.jpg",
    bio: "The mastermind behind all our exciting events and competitions. Aniket brings creativity and precision to every challenge we present.",
    email: "am23ms096@iiserkol.ac.in",
    linkedin: "https://www.linkedin.com/in/aniket-santosh-mishra-050a70344/?originalSubdomain=in",
    instagram: "https://www.instagram.com/aniket_mishra_1009",
    stats: {
      creativity: 95,
      eventPlanning: 92,
      competitionDesign: 90,
      innovation: 88,
      logistics: 85,
    },
    achievements: ["Designed 15+ unique competitions", "Innovation Award Winner", "Event Planning Guru"],
    funFact: "Has participated in over 50 science competitions and won 30 of them!",
    favoriteQuote: "Innovation distinguishes between a leader and a follower.",
    teamType: "core",
    department: "Biological Sciences",
    year: "3rd Year BSMS",
    coffeeConsumed: 53,
    projectsCompleted: 31,
    sleeplessNights: 134,
    superpower: "Idea Generator 3000",
  },
  {
    id: "khimavath-srishanth",
    name: "Khimavath Srishanth",
    role: "Hospitality Head",
    image: "/cc/srishanth.jpg",
    bio: "Ensuring every participant feels welcome and comfortable. Srishanth's attention to detail makes INQUIVESTA a memorable experience for all.",
    email: "khimavath.srishanth@iiserkol.ac.in",
    linkedin: "https://www.linkedin.com/public-profile/settings?trk=d_flagship3_profile_self_view_public_profile",
    instagram: "https://www.instagram.com/_srishanth00?igsh=bnRsZGZ4eHlrMHdo",
    stats: {
      communication: 95,
      organization: 90,
      temper: 50,
      networking: 85,
      multitasking: 88,
      gaming: 85
    },
    achievements: ["Managed 5000+ participants", "Zero hospitality complaints", "Cultural Ambassador"],
    funFact: "Speaks 6 languages and can cook authentic dishes from 10 different cuisines!",
    favoriteQuote: "Hospitality is making your guests feel at home, even when you wish they were.",
    teamType: "core",
    department: "Chemical Sciences",
    year: "3rd Year BSMS",
    coffeeConsumed: 356,
    projectsCompleted: 27,
    sleeplessNights: 112,
    superpower:"Universal Translator"
  },
  {
    id: "sayan-podder",
    name: "Sayan Podder",
    role: "PR Head",
    image: "/cc/sayan.jpg",
    bio: "The storyteller of the Inquivesta XII—turning ideas into impact and moments into memories, building bridges with media, sponsors, and collaborators while amplifying the festival’s reach.",
    email: "sp23ms070@iiserkol.ac.in",
    linkedin: "https://www.linkedin.com/in/sayan-podder-3350a22b9?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    github: "#",
    instagram: "https://www.instagram.com/__sayaan___?igsh=cWltNmViM3Q4N2l2",
    stats: {
      communication: 98,
      networking: 95,
      creativity: 85,
      temper: 35,
      negotiation: 88,
      gaming: 75
    },
    achievements: ["Managed 5000+ participants", "Zero hospitality complaints", "Cultural Ambassador"],
    funFact: "Can pitch a fest in under 60 seconds – and make it sound like the next big thing.",
    favoriteQuote: "Connection is the key to celebration.",
    teamType: "core",
    department: "Chemical Sciences",
    year: "3rd Year BSMS",
    coffeeConsumed: 800,
    projectsCompleted: 22,
    sleeplessNights: 160,
    superpower: "Universal Translator",
  },
  {
    id: "tanishq-sachdev",
    name: "Tanishq Sachdev",
    role: "Finance Head",
    image: "/cc/tanishq.jpg",
    bio: "Managing the financial backbone of INQUIVESTA. Tanishq ensures every rupee is utilized efficiently to create maximum impact for our participants.",
    email: "ts23ms089@iiserkol.ac.in",
    linkedin: "https://www.linkedin.com/in/tanishq-sachdev-8b058728a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    instagram: "https://www.instagram.com/tan.ishq_777?igsh=d3FoMTNiMmNpbG10",
    stats: {
      budgetManagement: 95,
      mentalMath: 92,
      costOptimization: 88,
      financialForecasting: 87,
      riskAssessment: 90,
    },
    achievements: ["Managed ₹50L+ budget", "Cost optimization expert", "Financial Planning Pro"],
    funFact: "Can calculate complex financial projections in his head faster than most calculators!",
    favoriteQuote: "A penny saved is a penny earned, but a rupee invested wisely is a future secured.",
    teamType: "core",
    department: "Mathematical Sciences",
    year: "3rd Year BSMS",
    coffeeConsumed: 7,
    projectsCompleted: 19,
    sleeplessNights: 269,
    superpower: "Human Calculator",
  },
  {
    id: "kshitiz-singh",
    name: "Kshitiz Singh",
    role: "Social Media Head",
    image: "/cc/kshitiz.png",
    bio: "Spreading the word about INQUIVESTA across the nation. Kshitiz's creative trends and publicity strategies shows our content to thousands of the population.",
    email: "ks23ms269@iiserkol.ac.in",
    twitter: "#",
    linkedin: "https://www.linkedin.com/in/kshitizdoes/",
    instagram: "https://www.instagram.com/dagur_kshitiz/",
    stats: {
      leadership: 100,
      creativity: 95,
      technical: 80,
      communication: 92,
      problemSolving: 89,
    },
    achievements: ["10K+ social media reach", "Viral content creator", "Brand Building Expert"],
    funFact: "Created a viral tribute reel that got 5K views in 12 hours!",
    favoriteQuote: "The best way to predict the future is to post it.",
    teamType: "core",
    department: "Earth Sciences",
    year: "3rd Year BSMS",
    coffeeConsumed: 2,
    projectsCompleted: 1,
    sleeplessNights: 0,
    superpower: "Viral Content Wizard",
  },
  {
    id: "divyanshu-saha",
    name: "Divyanshu Saha",
    role: "Media and Design Head",
    image: "/cc/div.jpg",
    bio: "Bringing INQUIVESTA to life through stunning visuals and compelling media. Divyanshu's creative vision shapes how the world sees our festival.",
    email: "ds23ms141@iiserkol.ac.in",
    linkedin: "https://www.linkedin.com/in/divyanshu-saha",
    github: "#",
    instagram: "https://www.instagram.com/dittogreninja/",
    stats: {
      graphicDesign: 98,
      videoProduction: 90,
      brandIdentity: 88,
      visualStorytelling: 95,
      colorTheory: 85,
    },
    achievements: ["Designed 100+ graphics", "Video production master", "Brand identity creator"],
    funFact: "Designed the logo in a dream and sketched it immediately after waking up! (👉ﾟヮﾟ)👉",
    favoriteQuote: "Design is not just what it looks like and feels like. Design is how it works.",
    teamType: "core",
    department: "Biological Sciences",
    year: "3rd Year BSMS",
    coffeeConsumed: 567,
    projectsCompleted: 38,
    sleeplessNights: 145,
    superpower: "Visual Storyteller",
  },
  {
    id: "manish-behera",
    name: "Manish Behera",
    role: "Web Development Head",
    image: "/cc/manish.jpg",
    bio: "Crafting the digital experience of INQUIVESTA. Manish builds the technological infrastructure, connecting participants and organizers seamlessly.",
    email: "mb23ms121@iiserkol.ac.in",
    github: "https://github.com/xeylenol",
    linkedin: "https://www.linkedin.com/in/manish-b-ehera/",
    instagram: "https://www.instagram.com/m.anishb/",
    stats: {
      introvertedness: 55,
      insomnia: 98,
      debuggingSpeed: 72,
      coffeeAddiction: 90,
      procrastination: 100,
    },
    achievements: ["Built 10+ web applications", "Full-stack developer", "Code optimization ninja"],
    funFact: "Made this very website in a caffeine-fueled all-nighter session, while studying for a class test ╚(•⌂•)╝",
    favoriteQuote: "Morden Web is a propoganda; we must go back to HTML",
    teamType: "core",
    department: "Physical Sciences",
    year: "3rd Year BSMS",
    coffeeConsumed: 923,
    projectsCompleted: 47,
    sleeplessNights: 357,
    superpower: "Code Whisperer",
  },
  {
    id: "sidharth-sagar",
    name: "Sidharth Sagar",
    role: "Arena Head",
    image: "/cc/sidharth.jpg",
    bio: "Creating the perfect battlegrounds for our competitions. Sidharth ensures every arena is equipped with cutting-edge technology and safety measures.",
    email: "ss23ms008@iiserkol.ac.in",
    linkedin: "#",
    stats: {
      arenaDesign: 95,
      technicalSetup: 93,
      safetyProtocols: 90,
      equipmentManagement: 88,
      spatialPlanning: 85,
    },
    achievements: ["Built 8 competition arenas", "Safety protocol expert", "Technical setup master"],
    funFact: "Loves playing basketball",
    favoriteQuote: "Hello There",
    teamType: "core",
    department: "Physical Sciences",
    year: "3rd Year BSMS",
    coffeeConsumed: 6,
    projectsCompleted: 29,
    sleeplessNights: 17,
    superpower: "Arena Architect",
  },

]

const extendedTeam: TeamMember[] = [
  {
    id: "extended-1",
    name: "Priya Sharma",
    role: "Content Writer",
    image: "/placeholder.svg?height=300&width=300&text=Priya+Sharma",
    bio: "Crafting compelling narratives that capture the essence of scientific discovery and innovation.",
    stats: {
      leadership: 75,
      creativity: 95,
      technical: 70,
      communication: 98,
      problemSolving: 85,
    },
    achievements: ["Published 50+ articles", "Science communication expert", "Storytelling master"],
    funFact: "Has written over 100 science articles and still gets excited about every new discovery!",
    favoriteQuote: "Words have the power to change the world, one story at a time.",
    teamType: "extended",
    department: "Biological Sciences",
    year: "2nd Year MS",
    coffeeConsumed: 445,
    projectsCompleted: 52,
    sleeplessNights: 89,
    superpower: "Word Weaver",
  },
  {
    id: "extended-2",
    name: "Rahul Kumar",
    role: "Technical Support",
    image: "/placeholder.svg?height=300&width=300&text=Rahul+Kumar",
    bio: "Ensuring all technical aspects run smoothly during events and competitions.",
    stats: {
      leadership: 78,
      creativity: 82,
      technical: 98,
      communication: 80,
      problemSolving: 95,
    },
    achievements: ["Fixed 200+ technical issues", "Zero downtime record", "Hardware whisperer"],
    funFact: "Can fix any technical issue with just a paperclip and some creative thinking!",
    favoriteQuote: "Technology is best when it brings people together.",
    teamType: "extended",
    department: "Physical Sciences",
    year: "2nd Year MS",
    coffeeConsumed: 678,
    projectsCompleted: 34,
    sleeplessNights: 123,
    superpower: "Tech Troubleshooter",
  },
  {
    id: "extended-3",
    name: "Ananya Gupta",
    role: "Social Media Manager",
    image: "/placeholder.svg?height=300&width=300&text=Ananya+Gupta",
    bio: "Managing our digital presence and engaging with our community across all platforms.",
    stats: {
      leadership: 80,
      creativity: 92,
      technical: 85,
      communication: 95,
      problemSolving: 83,
    },
    achievements: ["5M+ total reach", "Viral content creator", "Community building expert"],
    funFact: "Created a TikTok video explaining quantum physics that went viral with 5M views!",
    favoriteQuote: "In the digital age, engagement is the new currency.",
    teamType: "extended",
    department: "Chemical Sciences",
    year: "2nd Year MS",
    coffeeConsumed: 567,
    projectsCompleted: 89,
    sleeplessNights: 145,
    superpower: "Viral Content Creator",
  },
  {
    id: "extended-4",
    name: "Vikram Singh",
    role: "Logistics Coordinator",
    image: "/placeholder.svg?height=300&width=300&text=Vikram+Singh",
    bio: "Coordinating the complex logistics that make INQUIVESTA possible.",
    stats: {
      leadership: 88,
      creativity: 75,
      technical: 80,
      communication: 90,
      problemSolving: 92,
    },
    achievements: ["Managed 1000+ logistics operations", "Zero delay record", "Efficiency expert"],
    funFact: "Once organized transportation for 500 participants using only public transport!",
    favoriteQuote: "Success is in the details, and details are everything.",
    teamType: "extended",
    department: "Earth Sciences",
    year: "2nd Year MS",
    coffeeConsumed: 389,
    projectsCompleted: 26,
    sleeplessNights: 98,
    superpower: "Logistics Ninja",
  },
  {
    id: "extended-5",
    name: "Sneha Patel",
    role: "Photography Lead",
    image: "/placeholder.svg?height=300&width=300&text=Sneha+Patel",
    bio: "Capturing the magical moments and memories that make INQUIVESTA unforgettable.",
    stats: {
      leadership: 82,
      creativity: 95,
      technical: 88,
      communication: 85,
      problemSolving: 80,
    },
    achievements: ["Captured 10,000+ photos", "Visual storytelling expert", "Moment hunter"],
    funFact: "Has taken over 10,000 photos during science events and remembers the story behind each one!",
    favoriteQuote: "A picture is worth a thousand words, but a great picture is worth a thousand memories.",
    teamType: "extended",
    department: "Biological Sciences",
    year: "2nd Year MS",
    coffeeConsumed: 456,
    projectsCompleted: 67,
    sleeplessNights: 134,
    superpower: "Memory Capturer",
  },
  {
    id: "extended-6",
    name: "Arjun Reddy",
    role: "Security Coordinator",
    image: "/placeholder.svg?height=300&width=300&text=Arjun+Reddy",
    bio: "Ensuring the safety and security of all participants throughout the festival.",
    stats: {
      leadership: 90,
      creativity: 70,
      technical: 85,
      communication: 88,
      problemSolving: 95,
    },
    achievements: ["Zero security incidents", "Emergency response expert", "Safety protocol designer"],
    funFact: "Trained in martial arts and once helped catch a pickpocket during a science fair!",
    favoriteQuote: "Safety first, science second, but both are equally important.",
    teamType: "extended",
    department: "Physical Sciences",
    year: "2nd Year MS",
    coffeeConsumed: 234,
    projectsCompleted: 15,
    sleeplessNights: 78,
    superpower: "Guardian Angel",
  },
]

const roleIcons = {
  "Fest Coordinator": Rocket,
  "Event Coordinator": Trophy,
  "Sponsorship Head": Target,
  "Hospitality Head": Heart,
  "Publicity Head": Sparkles,
  "Finance Head": Star,
  "Media and Design Head": Zap,
  "Web Development Head": Users,
  "Arena Head": Users,
  "Content Writer": Users,
  "Technical Support": Users,
  "Social Media Manager": Users,
  "Logistics Coordinator": Users,
  "Photography Lead": Users,
  "Security Coordinator": Users,
}

const roleColors = {
  "Fest Coordinator": "from-[#F8BBD9] to-[#F8C471]",
  "Event Coordinator": "from-[#A8D8EA] to-[#85C1E9]",
  "Sponsorship Head": "from-[#ABEBC6] to-[#82E0AA]",
  "Hospitality Head": "from-[#F4D03F] to-[#F8C471]",
  "Publicity Head": "from-[#B8A7D9] to-[#D2B4DE]",
  "Finance Head": "from-[#F8BBD9] to-[#B8A7D9]",
  "Media and Design Head": "from-[#A8D8EA] to-[#ABEBC6]",
  "Web Development Head": "from-[#D60270] via-[#9B4F96] to-[#0038A8]",
  "Arena Head": "from-[#F8C471] to-[#F8BBD9]",
  "Content Writer": "from-[#85C1E9] to-[#B8A7D9]",
  "Technical Support": "from-[#82E0AA] to-[#A8D8EA]",
  "Social Media Manager": "from-[#D2B4DE] to-[#F4D03F]",
  "Logistics Coordinator": "from-[#F8C471] to-[#85C1E9]",
  "Photography Lead": "from-[#ABEBC6] to-[#F8BBD9]",
  "Security Coordinator": "from-[#B8A7D9] to-[#82E0AA]",
}

export default function AboutUsPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [activeTab, setActiveTab] = useState<"core" | "extended">("core")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[#D2B997] font-depixel-small text-sm">{label}</span>
        <span className="text-white font-bold font-depixel-small">
          <NumberTicker value={value} />%
        </span>
      </div>
      <div className="w-full bg-[#1A1A1A] rounded-full h-3 border border-[#D2B997]/30">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-1000", color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white border-8 border-[#D2B997]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#D2B997]/30">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center justify-left pl-4">
            <Image src="/ball_a.png" alt="INQUIVESTA XII" width={60} height={60} className="h-10 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-[#B8A7D9] hover:text-[#D2B997] transition-colors font-depixel-small">
              Home
            </Link>
            <Link href="/sponsors" className="text-[#B8A7D9] hover:text-[#D2B997] transition-colors font-depixel-small">
              Sponsors
            </Link>
            <Link href="/events" className="text-[#B8A7D9] hover:text-[#D2B997] transition-colors font-depixel-small">
              Events
            </Link>
            <Link href="/coming_soon" className="text-[#B8A7D9] hover:text-[#D2B997] transition-colors font-depixel-small">
              Pronite
            </Link>
            <Link href="/coming_soon" className="text-[#B8A7D9] hover:text-[#D2B997] transition-colors font-depixel-small">
              Merch
            </Link>
            {/* <Link href="#schedule" className="text-[#B8A7D9] hover:text-[#D2B997] transition-colors font-depixel-small">
              Schedule
            </Link> */}
            <Link href="/about_us" className="text-[#D2B997] font-depixel-small font-bold">
              About Us
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-[#D2B997]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#1A1A1A]/95 backdrop-blur-md border-t border-[#D2B997]/30">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link href="/" className="text-[#B8A7D9] hover:text-[#D2B997] transition-colors font-depixel-small">
                Home
              </Link>
              <Link href="/sponsors" className="text-[#B8A7D9] hover:text-[#D2B997] transition-colors font-depixel-small">
                Sponsors
              </Link>
              <Link href="/events" className="text-[#B8A7D9] hover:text-[#D2B997] transition-colors font-depixel-small">
                Events
              </Link>
              <Link href="/coming_soon" className="text-[#B8A7D9] hover:text-[#D2B997] transition-colors font-depixel-small">
                Pronite
              </Link>
              <Link href="/coming_soon" className="text-[#B8A7D9] hover:text-[#D2B997] transition-colors font-depixel-small">
                Merch
              </Link>
              <Link href="/about_us" className="text-[#D2B997] font-depixel-small font-bold">
                About Us
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <HyperText
                className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] bg-clip-text text-transparent font-futura"
                text="MEET THE TEAM"
              />
              <p className="text-[#D2B997] text-lg font-depixel-body mb-8">THE BRILLIANT MINDS BEHIND INQUIVESTA XII</p>
            </div>
          </FadeIn>

          {/* About INQUIVESTA Section */}
          <FadeIn delay={0.2}>
            <div className="max-w-4xl mx-auto mb-20">
              <Card className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] border-[#D2B997]/30 p-8">
                <CardContent className="p-0 text-center space-y-6">
                  <p className="text-[#D2B997]/90 text-lg leading-relaxed font-depixel-small">
                    INQUIVESTA XII is more than just a science festival – it's a celebration of curiosity, innovation, and the boundless potential of young minds. Our team of dedicated students works tirelessly to create an experience that inspires, educates, and entertains.
                  </p>
                  <p className="text-[#D2B997]/80 leading-relaxed font-depixel-small">
                    From organizing cutting-edge competitions to managing complex logistics, each team member brings their unique skills and passion to make INQUIVESTA a memorable journey for thousands of participants from across the country.
                  </p>
                </CardContent>
              </Card>
            </div>
          </FadeIn>

          {/* Team Tabs */}
          <FadeIn delay={0.4}>
            <div className="flex justify-center mb-12">
              <div className="bg-[#2A2A2A] rounded-lg p-2 border border-[#D2B997]/30">
                <Button
                  onClick={() => setActiveTab("core")}
                  className={cn(
                    "font-depixel-body px-8 py-3 rounded-md transition-all",
                    activeTab === "core"
                      ? "bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] text-[#1A1A1A]"
                      : "bg-transparent text-[#D2B997] hover:bg-[#D2B997]/10",
                  )}
                >
                  Core Committee
                </Button>
                <Button
                  onClick={() => setActiveTab("extended")}
                  className={cn(
                    "font-depixel-body px-8 py-3 rounded-md transition-all ml-2",
                    activeTab === "extended"
                      ? "bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] text-[#1A1A1A]"
                      : "bg-transparent text-[#D2B997] hover:bg-[#D2B997]/10",
                  )}
                >
                  Extended Team
                </Button>
              </div>
            </div>
          </FadeIn>

          {/* Team Grid */}
          {activeTab === "core" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreTeam.map((member, index) => {
                const IconComponent = roleIcons[member.role as keyof typeof roleIcons] || Users
                const roleColor = roleColors[member.role as keyof typeof roleColors] || "from-[#A8D8EA] to-[#85C1E9]"

                return (
                  <FadeIn key={member.id} delay={index * 0.1}>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Card
                          className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-[#D2B997]/30 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] backdrop-blur-sm overflow-hidden"
                          onClick={() => setSelectedMember(member)}
                        >
                          <CardContent className="p-0">
                            <div className="relative">
                              <Image
                                src={member.image || "/placeholder.svg"}
                                alt={member.name}
                                width={300}
                                height={300}
                                className="w-full h-68 object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent" />
                            </div>

                            <div className="p-6 text-center space-y-4 bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A]">
                              <div>
                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#A8D8EA] transition-colors font-depixel-body">
                                  {member.name}
                                </h3>
                                <Badge
                                  className={cn("bg-gradient-to-r text-white border-0 text-sm px-4 py-2 font-depixel-small", roleColor)}
                                >
                                  <IconComponent className="w-4 h-4 mr-2" />
                                  {member.role}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>

                      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto scrollbar-hide bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] border-[#D2B997]/30">
                        <DialogHeader>
                          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] bg-clip-text text-transparent text-center font-depixel-body">
                            {member.name}
                          </DialogTitle>
                        </DialogHeader>

                        <div className="grid md:grid-cols-2 gap-8">
                          {/* Left Column - Image and Basic Info */}
                          <div className="space-y-6">
                            <div className="relative">
                              <Image
                                src={member.image || "/placeholder.svg"}
                                alt={member.name}
                                width={400}
                                height={400}
                                className="w-full h-80 object-cover rounded-lg border border-[#D2B997]/30"
                              />
                              <div className="absolute top-4 left-4">
                                <Badge className={cn("bg-gradient-to-r text-white border-0 font-depixel-small", roleColor)}>
                                  <IconComponent className="w-4 h-4 mr-2" />
                                  {member.role}
                                </Badge>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="text-center font-depixel-small">
                                <p className="text-[#D2B997]/80 leading-relaxed">{member.bio}</p>
                              </div>

                              {/* Contact Info */}
                              <div className="flex justify-center gap-3">
                                {member.email && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-[#D2B997] text-[#D2B997] hover:bg-[#D2B997]/10 bg-transparent"
                                    onClick={() => window.open(`mailto:${member.email}`, '_blank')}
                                  >
                                    <Mail className="w-4 h-4" />
                                  </Button>
                                )}
                                {member.linkedin && member.linkedin !== "#" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-[#D2B997] text-[#D2B997] hover:bg-[#D2B997]/10 bg-transparent"
                                    onClick={() => window.open(member.linkedin, '_blank')}
                                  >
                                    <Linkedin className="w-4 h-4" />
                                  </Button>
                                )}
                                {member.github && member.github !== "#" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-[#D2B997] text-[#D2B997] hover:bg-[#D2B997]/10 bg-transparent"
                                    onClick={() => window.open(member.github, '_blank')}
                                  >
                                    <Github className="w-4 h-4" />
                                  </Button>
                                )}
                                {member.twitter && member.twitter !== "#" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-[#D2B997] text-[#D2B997] hover:bg-[#D2B997]/10 bg-transparent"
                                    onClick={() => window.open(member.twitter, '_blank')}
                                  >
                                    <Twitter className="w-4 h-4" />
                                  </Button>
                                )}
                                {member.instagram && member.instagram !== "#" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-[#D2B997] text-[#D2B997] hover:bg-[#D2B997]/10 bg-transparent"
                                    onClick={() => window.open(member.instagram, '_blank')}
                                  >
                                    <Instagram className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right Column - Gamified Stats and Info */}
                          <div className="space-y-6">
                            {/* Role Section at Top */}
                            <div className="p-4 bg-gradient-to-r from-[#F8BBD9]/30 to-[#F8C471]/30 rounded-lg border border-[#F8BBD9]/30 text-center">
                              <h5 className="text-[#F8BBD9] font-semibold mb-2 flex items-center justify-center font-depixel-body">
                                <Zap className="w-4 h-4 mr-2" />
                                Role
                              </h5>
                              <p className="text-[#F8C471] font-bold text-lg font-depixel-small">{member.role}</p>
                            </div>

                            {/* Player Stats */}
                            <div className="p-6 bg-gradient-to-br from-[#2A2A2A]/50 to-[#3A3A3A]/50 rounded-lg border border-[#D2B997]/20">
                              <h4 className="text-xl font-bold text-white mb-4 flex items-center font-depixel-body">
                                <Gamepad2 className="w-5 h-5 mr-2 text-[#A8D8EA]" />
                                Player Stats
                              </h4>
                              <div className="space-y-4">
                                {Object.entries(member.stats).map(([key, value], index) => {
                                  const colors = [
                                    "from-[#F8BBD9] to-[#F8C471]",
                                    "from-[#A8D8EA] to-[#85C1E9]",
                                    "from-[#ABEBC6] to-[#82E0AA]",
                                    "from-[#F4D03F] to-[#F8C471]",
                                    "from-[#B8A7D9] to-[#D2B4DE]",
                                    "from-[#85C1E9] to-[#F8BBD9]"
                                  ];
                                  return (
                                    <StatBar
                                      key={key}
                                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                                      value={value}
                                      color={colors[index % colors.length]}
                                    />
                                  );
                                })}
                              </div>
                            </div>

                            {/* Game Stats - Only Coffee and Sleepless Nights */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-gradient-to-br from-[#F4D03F]/20 to-[#F8C471]/20 rounded-lg border border-[#F4D03F]/30 text-center">
                                <Coffee className="w-6 h-6 text-[#F4D03F] mx-auto mb-2" />
                                <div className="text-2xl font-bold text-[#F4D03F] font-futura">
                                  <NumberTicker value={member.coffeeConsumed} />
                                </div>
                                <div className="text-xs text-[#F8C471] font-depixel-small">Cups of Coffee</div>
                              </div>
                              <div className="p-4 bg-gradient-to-br from-[#F8BBD9]/20 to-[#B8A7D9]/20 rounded-lg border border-[#F8BBD9]/30 text-center">
                                <Brain className="w-6 h-6 text-[#F8BBD9] mx-auto mb-2" />
                                <div className="text-2xl font-bold text-[#F8BBD9] font-futura">
                                  <NumberTicker value={member.sleeplessNights} />
                                </div>
                                <div className="text-xs text-[#B8A7D9] font-depixel-small">Sleepless Nights</div>
                              </div>
                            </div>

                            {/* Fun Fact */}
                            <div className="p-4 bg-gradient-to-r from-[#ABEBC6]/20 to-[#82E0AA]/20 rounded-lg border border-[#ABEBC6]/30">
                              <h5 className="text-[#ABEBC6] font-semibold mb-2 font-depixel-body">🎯 Fun Fact</h5>
                              <p className="text-[#82E0AA] text-sm font-depixel-small">{member.funFact}</p>
                            </div>

                            {/* Favorite Quote */}
                            <div className="p-4 bg-gradient-to-r from-[#B8A7D9]/20 to-[#D2B4DE]/20 rounded-lg border border-[#B8A7D9]/30">
                              <h5 className="text-[#B8A7D9] font-semibold mb-2 font-depixel-body">💭 Favorite Quote</h5>
                              <p className="text-[#D2B4DE] text-sm italic font-depixel-small">"{member.favoriteQuote}"</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </FadeIn>
                )
              })}
            </div>
          ) : (
            <FadeIn>
              <div className="flex justify-center items-center min-h-[60vh]">
                <Card className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] border-[#D2B997]/30 p-12 text-center max-w-2xl mx-auto">
                  <CardContent className="p-0 space-y-8">
                    <div className="space-y-6">
                      <div className="relative">
                        <HyperText
                          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] bg-clip-text text-transparent font-futura"
                          text="COMING SOON"
                        />
                        <div className="absolute -inset-4 bg-gradient-to-r from-[#A8D8EA]/20 to-[#B8A7D9]/20 blur-xl rounded-full" />
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-[#D2B997] text-xl font-depixel-body">
                          Extended Team 
                        </p>
                        <p className="text-[#D2B997]/80 leading-relaxed max-w-lg mx-auto font-depixel-small">
                          We're putting together an incredible extended team to support our core committee. 
                          <br />Check your email now and get involved to make INQUIVESTA XII possible!
                        </p>
                      </div>

                      <div className="flex justify-center space-x-8 pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-[#A8D8EA] mb-2 font-futura">
                            <NumberTicker value={25} />+
                          </div>
                          <div className="text-[#85C1E9] text-sm font-depixel-small">Team Members</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-[#ABEBC6] mb-2 font-futura">
                            <NumberTicker value={100} />%
                          </div>
                          <div className="text-[#82E0AA] text-sm font-depixel-small">Dedication</div>
                        </div>
                      </div>

                      <div className="pt-8">
                        <div className="flex justify-center items-center space-x-3 text-[#B8A7D9]">
                          <Sparkles className="w-5 h-5 animate-pulse" />
                          <span className="font-depixel-small text-sm">Stay tuned for the Extended Committee reveal!</span>
                          <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2A2A2A]/80 border-t border-[#D2B997]/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Image src="/logo-full.svg" alt="INQUIVESTA XII" width={150} height={75} className="h-16 w-auto mb-4" />
              <p className="text-[#D2B997] text-sm font-depixel-small">IISER Kolkata's flagship annual science festival</p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 font-depixel-body">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  href="/"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  Home
                </Link>
                <Link
                  href="/sponsors"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  Sponsors
                </Link>
                <Link
                  href="/events"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  Events
                </Link>
                <Link
                  href="/gallery"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  Gallery
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 font-depixel-body">Contact</h3>
              <div className="space-y-2 text-sm font-depixel-small text-[#D2B997]">
                <p>IISER Kolkata</p>
                <p>Mohanpur, West Bengal</p>
                <p>Email: inquivesta@iiserkol.ac.in</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#D2B997]/30 mt-8 pt-8 text-center">
            {/* Social Media Links with Icons */}
            <div className="flex justify-center items-center space-x-6 mb-6">
              <Link 
                href="https://x.com/InquivestaXII?t=EXpyCAYhrVmUgL98ShBGdg&s=09" 
                className="flex flex-col items-center group transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-[#1DA1F2]/20 to-[#1DA1F2]/10 p-2 rounded-full border border-[#1DA1F2]/30 group-hover:border-[#1DA1F2] transition-all duration-300">
                  <Twitter className="w-4 h-4 text-[#1DA1F2] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-[#1DA1F2] text-xs font-depixel-small mt-1 group-hover:text-[#1DA1F2] transition-colors">X</span>
              </Link>

              <Link 
                href="https://www.instagram.com/inquivesta_iiserk/" 
                className="flex flex-col items-center group transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-[#E4405F]/20 to-[#E4405F]/10 p-2 rounded-full border border-[#E4405F]/30 group-hover:border-[#E4405F] transition-all duration-300">
                  <Instagram className="w-4 h-4 text-[#E4405F] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-[#E4405F] text-xs font-depixel-small mt-1 group-hover:text-[#E4405F] transition-colors">Instagram</span>
              </Link>

              <Link 
                href="https://www.facebook.com/inquivesta" 
                className="flex flex-col items-center group transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-[#1877F2]/20 to-[#1877F2]/10 p-2 rounded-full border border-[#1877F2]/30 group-hover:border-[#1877F2] transition-all duration-300">
                  <Facebook className="w-4 h-4 text-[#1877F2] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-[#1877F2] text-xs font-depixel-small mt-1 group-hover:text-[#1877F2] transition-colors">Facebook</span>
              </Link>

              <Link 
                href="https://www.youtube.com/@Inquivesta" 
                className="flex flex-col items-center group transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-[#FF0000]/20 to-[#FF0000]/10 p-2 rounded-full border border-[#FF0000]/30 group-hover:border-[#FF0000] transition-all duration-300">
                  <svg className="w-4 h-4 text-[#FF0000] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <span className="text-[#FF0000] text-xs font-depixel-small mt-1 group-hover:text-[#FF0000] transition-colors">YouTube</span>
              </Link>
            </div>
            <p className="text-[#D2B997] text-sm font-depixel-small mb-6">
              Designed with ❤️ by team inquivesta!
            </p>
            <p className="text-[#D2B997] text-sm font-depixel-small">
              © 2025 INQUIVESTA XII - IISER Kolkata. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
