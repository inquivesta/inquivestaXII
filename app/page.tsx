"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Calendar, Users, Trophy, Camera, Twitter, Instagram, Facebook } from "lucide-react"
import { NumberTicker } from "@/components/ui/number-ticker"
import { Marquee } from "@/components/ui/marquee"
import { HyperText } from "@/components/ui/hyper-text"
import { TextReveal } from "@/components/ui/text-reveal"
import { FadeIn } from "@/components/ui/fade-in"
import { InstallBanner } from "@/components/InstallBanner"
import { id } from "date-fns/locale"

const DATE_FEST = "Feb 06 2026"
const DATE_ANN = "Sep 15 2025"

const sponsors = {
  current: [
    {
      id: "YourCompany",
      name: "Your Company",
      tagline: "Sponsor Us Now!",
      logo: "/sponsors/you.png",
      status: "current",
    }
  ],
  past: [
    {
      id: "ccd",
      name: "Cafe Coffee Day",
      tagline: "Past Sponsor",
      logo: "/sponsors/CafeCoffeeDay.png",
      status: "current",
    },
    {
      id: "BaskinRobbins",
      name: "Baskin Robbins",
      tagline: "Former Partner",
      logo: "/sponsors/BaskinRobins.png",
      status: "past",
    },
    {
      id: "BookMyShow",
      name: "Book My Show",
      tagline: "Past Sponsor",
      logo: "/sponsors/BookMyShow.png",
      status: "past",
    },
    {
      id: "WowMomo",
      name: "Wow Momo",
      tagline: "Former Partner",
      logo: "/sponsors/Wow_momo.png",
      status: "past",
    },
    {
      id: "canon",
      name: "Canon",
      tagline: "Past Sponsor",
      logo: "/sponsors/Canon.png",
      status: "past",
    },
    {
      id: "SBI",
      name: "State Bank of India",
      tagline: "Title Sponsor",
      logo: "/sponsors/SBI.png",
      status: "past",
    },
    {
      id: "DKMS",
      name: "DKMS",
      tagline: "Past Sponsor",
      logo: "/sponsors/DKMS.png",
      status: "past",
    },
    {
      id: "Dominos",
      name: "Dominos Pizza",
      tagline: "Past Sponsor",
      logo: "/sponsors/DominosPizza.png",
      status: "past",
    },
    {
      id: "Nissan",
      name: "Nissan",
      tagline: "Past Sponsor",
      logo: "/sponsors/Nissan.png",
      status: "past",
    },
    {
      id: "ebay",
      name: "eBay",
      tagline: "Past Sponsor",
      logo: "/sponsors/ebay.png",
      status: "past",
    },
    {
      id: "Firefox",
      name: "Firefox",
      tagline: "Digital Partner",
      logo: "/sponsors/Firefox.png",
      status: "past",
    },
    {
      id: "HP",
      name: "HP",
      tagline: "Past Sponsor",
      logo: "/sponsors/HP.png",
      status: "past",
    },
    {
      id: "godrej",
      name: "Godrej",
      tagline: "Sustainable Living Advocate",
      logo: "/sponsors/Godrej.png",
      status: "past",
    },
    {
      id: "jet_airways",
      name: "Jet Airways",
      tagline: "Past Sponsor",
      logo: "/sponsors/JetAirways.png",
      status: "past",
    },
    {
      id: "krafton",
      name: "Krafton",
      tagline: "Gaming for a Better Tomorrow",
      logo: "/sponsors/Krafton.png",
      status: "past",
    }
  ],
}

const allSponsors = [...sponsors.current, ...sponsors.past]

const galleryImages = [
  "/gallery/1_image_2 (Medium).JPG",
  "/gallery/image_1 (Medium).jpg",
  "/gallery/image_6 (Medium).JPG",
  "/gallery/image_7 (Medium).JPG",
  "/gallery/image_4 (Medium).JPG",
  "/gallery/image_5 (Medium).JPG",
]

export default function InquivestaLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [showCountdown, setShowCountdown] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const annDate = new Date(DATE_ANN).getTime()
      const festDate = new Date(DATE_FEST).getTime()

      if (now < annDate) {
        setShowCountdown(false)
        return
      }

      setShowCountdown(true)
      const difference = festDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white border-8 border-[#D2B997]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#D2B997]/30">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center justify-left pl-4">
            <Image src="/ball_a.png" alt="INQUIVESTA XII" width={60} height={60} className="h-10 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 pr-4">
            <Link href="#home" className="text-[#B8A7D9] hover:text-[#D2B997] transition-colors font-depixel-small">
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
            {/* <Link href="#schedule" className="text-[#B8A7D9] hover:text-[#D2B997] transition-colors font-depixel-body">
              Schedule
            </Link> */}
            <Link href="/about_us" className="text-[#B8A7D9] hover:text-[#D2B997] transition-colors font-depixel-small">
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
              <Link href="#home" className="text-[#B8A7D9] hover:text-[#D2B997] transition-colors font-depixel-small">
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
              {/* <Link href="#schedule" className="text-[#B8A7D9] hover:text-[#D2B997] transition-colors font-depixel-body">
                Schedule
              </Link> */}
              <Link href="/about_us" className="text-[#B8A7D9] hover:text-[#D2B997] transition-colors font-depixel-small">
                About Us
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2A2A2A]/50 to-[#3A3A3A]/50" />
        <div className="absolute inset-0">
          <video
        src="/images/hero.mp4"
        loop
        autoPlay
        muted
        className="absolute inset-0 object-cover object-center opacity-70 w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center space-y-8 px-4">
          <div className="mb-4 leading-10">
            <Image
              src="/logo.png"
              alt="INQUIVESTA XII"
              width={400}
              height={200}
              className="mx-auto h-32 md:h-48 w-auto"
            />
          </div>

          <div className="text-xl md:text-2xl font-depixel-body text-[#D2B997]">
            {!showCountdown ? (
              <div className="text-3xl md:text-4xl font-bold text-[#F4D03F] animate-pulse font-depixel-Body">COMING SOON</div>
            ) : (
              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                <div className="bg-[#2A2A2A]/70 rounded-lg p-4 border border-[#D2B997]/30">
                  <div className="text-2xl md:text-3xl font-bold text-[#A8D8EA] font-futura">{timeLeft.days}</div>
                  <div className="text-xs text-[#D2B997] font-depixel-small">DAYS</div>
                </div>
                <div className="bg-[#2A2A2A]/70 rounded-lg p-4 border border-[#D2B997]/30">
                  <div className="text-2xl md:text-3xl font-bold text-[#A8D8EA] font-futura">{timeLeft.hours}</div>
                  <div className="text-xs text-[#D2B997] font-depixel-small">HOURS</div>
                </div>
                <div className="bg-[#2A2A2A]/70 rounded-lg p-4 border border-[#D2B997]/30">
                  <div className="text-2xl md:text-3xl font-bold text-[#A8D8EA] font-futura">{timeLeft.minutes}</div>
                  <div className="text-xs text-[#D2B997] font-depixel-small">MINS</div>
                </div>
                <div className="bg-[#2A2A2A]/70 rounded-lg p-4 border border-[#D2B997]/30">
                  <div className="text-2xl md:text-3xl font-bold text-[#A8D8EA] font-futura">{timeLeft.seconds}</div>
                  <div className="text-xs text-[#D2B997] font-depixel-small">SECS</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/coming_soon">
              <Button className="bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body px-8 py-3">
                Register Now
              </Button>
            </Link>
            <Link href="#about">
              <Button
                variant="outline"
                className="border-[#D2B997] text-[#D2B997] hover:bg-[#D2B997]/10 font-depixel-body px-8 py-3 bg-transparent"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <FadeIn>
            <div className="text-center mb-12 font-futura">
              <HyperText
                className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#B8A7D9] to-[#A8D8EA] bg-clip-text text-transparent font-futura"
                text="INQUIVESTA XII"
              />
                <p className="text-[#D2B997] text-base font-depixel-body">BE LIMITLESS. BE INQUISITIVE.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn delay={0.2}>
              <div className="space-y-6 font-depixel-small">
                <TextReveal text="INQUIVESTA XII is IISER Kolkata's flagship annual science festival that brings together brilliant minds to celebrate science, innovation, and creativity." />
                <TextReveal
                  delay={0.2}
                  text="This year's retro futurism theme celebrates the golden age of scientific imagination while showcasing cutting-edge research and innovation."
                />
                <TextReveal
                  delay={0.3}
                  text="Join us for an extraordinary journey through time and space, where vintage futurism meets modern science. Experience thrilling competitions, engaging workshops, and unforgettable performances."
                />

                <div className="flex items-center space-x-4 text-[#D2B997]">
                  <Calendar className="w-5 h-5" />
                    <span className="font-depixel-body">February 6th, 7th, 8th 2026`</span>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#B8A7D9]/20 to-[#A8D8EA]/20 rounded-lg blur-xl" />
                <Image
                  src="/images/about-us-image.png"
                  alt="INQUIVESTA Event"
                  width={600}
                  height={400}
                  className="relative rounded-lg border border-[#D2B997]/30"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      {/* Statistics Section */}
      <section className="py-20 px-4 bg-[#2A2A2A]/30">
        <div className="container mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <HyperText
                className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#F4D03F] to-[#F8C471] bg-clip-text text-transparent font-futura"
                text="INQUIVESTA BY NUMBERS"
              />
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={0.2}>
              <div className="text-center p-8 bg-gradient-to-b from-[#2A2A2A]/50 to-[#3A3A3A]/50 rounded-lg border border-[#D2B997]/30">
                <Users className="w-12 h-12 text-[#A8D8EA] mx-auto mb-4" />
                <div className="text-4xl md:text-5xl font-bold text-[#A8D8EA] mb-2">
                  <NumberTicker value={7000} />+
                </div>
                <div className="text-[#D2B997] font-depixel-body">Footfalls</div>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="text-center p-8 bg-gradient-to-b from-[#2A2A2A]/50 to-[#3A3A3A]/50 rounded-lg border border-[#D2B997]/30">
                <Trophy className="w-12 h-12 text-[#F4D03F] mx-auto mb-4" />
                <div className="text-4xl md:text-5xl font-bold text-[#F4D03F] mb-2">
                  <NumberTicker value={20} />+
                </div>
                <div className="text-[#D2B997] font-depixel-body">Events & Competitions</div>
              </div>
            </FadeIn>

            <FadeIn delay={0.6}>
              <div className="text-center p-8 bg-gradient-to-b from-[#2A2A2A]/50 to-[#3A3A3A]/50 rounded-lg border border-[#D2B997]/30">
                <Calendar className="w-12 h-12 text-[#ABEBC6] mx-auto mb-4" />
                <div className="text-4xl md:text-5xl font-bold text-[#ABEBC6] mb-2">
                  <NumberTicker value={50} />+
                </div>
                <div className="text-[#D2B997] font-depixel-body">College Outreach</div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section id="sponsors" className="py-20 px-4">
        <div className="container mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <HyperText
                className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#ABEBC6] to-[#A8D8EA] bg-clip-text text-transparent font-futura"
                text="OUR PAST SPONSORS"
              />
            </div>
          </FadeIn>

          <div className="relative">
            <Marquee className="py-8" pauseOnHover>
              {allSponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="mx-8 p-6 bg-gradient-to-b from-[#2A2A2A]/50 to-[#1A1A1A]/50 rounded-lg border border-[#D2B997]/30 min-w-[200px]"
                >
                  <Image
                    src={sponsor.logo || "/placeholder.svg"}
                    alt={sponsor.name}
                    width={120}
                    height={80}
                    className="mx-auto mb-4 h-16 w-auto"
                  />
                  <div className="text-center">
                    <h3 className="text-white font-semibold mb-1">{sponsor.name}</h3>
                    {sponsor.tagline !== "NA" && <p className="text-[#D2B997] text-sm font-depixel-small">{sponsor.tagline}</p>}
                  </div>
                </div>
              ))}
            </Marquee>
          </div>

          <div className="text-center mt-12">
            <Link href="/sponsors">
              <Button className="bg-gradient-to-r from-[#ABEBC6] to-[#A8D8EA] hover:from-[#98E5B5] hover:to-[#7FB3D3] text-[#1A1A1A] font-depixel-body px-8 py-3 text-lg">
                Sponsor Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 bg-[#2A2A2A]/30">
        <div className="container mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <HyperText
                className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#F8BBD9] to-[#B8A7D9] bg-clip-text text-transparent font-futura"
                text="GALLERY"
              />
              <p className="text-[#D2B997] text-lg font-depixel-body">MEMORIES IN MOTION</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="relative group overflow-hidden rounded-lg border border-[#D2B997]/30">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Gallery Image ${index + 1}`}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="w-6 h-6 text-[#A8D8EA]" />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/gallery">
              <Button className="bg-gradient-to-r from-[#F8BBD9] to-[#F8C471] hover:from-[#F5A3C7] hover:to-[#F7DC6F] text-[#1A1A1A] font-depixel-body px-8 py-3 text-lg">
                View More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2A2A2A]/80 border-t border-[#D2B997]/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Image src="/logo-full.svg" alt="INQUIVESTA XII" width={150} height={75} className="h-16 w-auto mb-4" />
              <p className="text-[#D2B997] text-sm font-depixel-small">IISER Kolkata's flagship annual science festival</p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 font-depixel-body">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  href="#home"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  Home
                </Link>
                <Link
                  href="/about_us"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  About Us
                </Link>
                <Link
                  href="/events"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  Events
                </Link>
                <Link
                  href="#sponsors"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  Sponsors
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 font-depixel-body">Events</h3>
              <div className="space-y-2">
                <Link
                  href="#competitions"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  Competitions
                </Link>
                <Link
                  href="#workshops"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  Workshops
                </Link>
                <Link
                  href="#pronite"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  Pronite
                </Link>
                <Link
                  href="#exhibitions"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  Exhibitions
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

      {/* Install Banner */}
      <InstallBanner />
    </div>
  )
}
