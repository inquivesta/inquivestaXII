"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Countdown component
const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-6 w-full max-w-2xl">
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.minutes, label: 'Mins' },
        { value: timeLeft.seconds, label: 'Secs' }
      ].map((item, i) => (
        <div key={i} className="countdown-box p-3 sm:p-4 rounded-xl flex flex-col items-center backdrop-blur-sm">
          <span className="text-2xl sm:text-4xl md:text-5xl font-[family-name:var(--font-futura)] font-bold text-white">
            {formatNumber(item.value)}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-neon-pink mt-1 font-[family-name:var(--font-depixel-small)]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

// Glass Card Component
const GlassCard = ({ 
  children, 
  className = "",
  hover = true 
}: { 
  children: React.ReactNode
  className?: string
  hover?: boolean 
}) => (
  <div className={cn(
    "glass-card p-6 rounded-xl transition-all duration-400",
    hover && "hover:border-retro-gold/40 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:-translate-y-1",
    className
  )}>
    {children}
  </div>
)

// Event Activity Card
const ActivityCard = ({ 
  icon, 
  title, 
  description, 
  color 
}: { 
  icon: string
  title: string
  description: string
  color: 'pink' | 'gold' | 'cyan' | 'purple'
}) => {
  const colorClasses = {
    pink: 'text-neon-pink',
    gold: 'text-retro-gold',
    cyan: 'text-neon-cyan',
    purple: 'text-neon-purple'
  }

  return (
    <GlassCard className="text-center group h-full flex flex-col justify-center">
      <div className={cn("text-4xl mb-4 group-hover:scale-110 transition-transform", colorClasses[color])}>
        <i className={`fas ${icon}`}></i>
      </div>
      <h3 className="text-xl font-bold font-[family-name:var(--font-futura)] text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-300 font-light leading-relaxed">{description}</p>
    </GlassCard>
  )
}

export default function MasqueradePage() {
  const [scrollY, setScrollY] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const starsRef = useRef<HTMLDivElement>(null)

  // Event date: Feb 6, 2026 at 6:00 PM
  const eventDate = new Date("Feb 6, 2026 18:00:00")

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      setNavScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)

    // Trigger content reveal after mount
    setTimeout(() => setShowContent(true), 300)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Google Font for Script */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet" />
      {/* FontAwesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <main className="relative min-h-screen bg-deep-bg text-white overflow-x-hidden selection:bg-retro-gold selection:text-black">
        
        {/* Background Elements */}
        <div className="haze" />
        <div className="retro-grid" />
        <div className="disco-overlay" />
        <div className="stars-container" ref={starsRef} id="stars" />

        {/* Navigation */}
        <nav className={cn(
          "fixed w-full z-50 top-0 left-0 py-1 px-4 transition-all duration-300",
          navScrolled && "bg-deep-bg/90 backdrop-blur-md shadow-lg"
        )}>
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="block w-28 md:w-36 hover:opacity-80 transition-opacity">
              <Image 
                src="/logo-full.svg" 
                alt="Inquivesta Logo" 
                width={144} 
                height={40}
                className="w-full h-auto drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
              />
            </Link>
            
            <div className="hidden md:flex space-x-8 text-sm font-[family-name:var(--font-futura)] tracking-widest uppercase items-center">
              <a href="#intro" className="hover:text-retro-gold transition-colors">The Story</a>
              <a href="#activities" className="hover:text-neon-pink transition-colors">Attractions</a>
              <a href="#details" className="hover:text-neon-cyan transition-colors">Intel</a>
              <Link href="/events" className="px-4 py-2 border border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-white transition-all rounded-sm shadow-[0_0_10px_rgba(255,0,127,0.3)]">
                All Events
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-2xl text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
          
          {/* Mobile Menu */}
          <div className={cn(
            "absolute top-full left-0 w-full bg-deep-bg/95 backdrop-blur-md border-b border-white/10 p-4 flex-col space-y-4 md:hidden text-center font-[family-name:var(--font-futura)] text-sm",
            mobileMenuOpen ? "flex" : "hidden"
          )}>
            <a href="#intro" className="block py-2 hover:text-retro-gold" onClick={() => setMobileMenuOpen(false)}>The Story</a>
            <a href="#activities" className="block py-2 hover:text-neon-pink" onClick={() => setMobileMenuOpen(false)}>Attractions</a>
            <a href="#details" className="block py-2 hover:text-neon-cyan" onClick={() => setMobileMenuOpen(false)}>Intel</a>
            <Link href="/events" className="block py-2 text-neon-pink" onClick={() => setMobileMenuOpen(false)}>All Events</Link>
          </div>
        </nav>

        {/* Hero / Intro Section */}
        <section id="intro" className="min-h-screen flex flex-col items-center justify-center relative px-4 pt-20 pb-12 overflow-hidden">
          
          {/* Masquerade Logo Background - fills entire hero */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: "url('/events/masquerade/masquerade logo final.jpg')" }}
          />
          {/* Hero gradient overlay - pinks, blues, purple/wine red */}
          <div 
            className="absolute inset-0 z-[1]"
            style={{ 
              background: 'radial-gradient(ellipse at center, rgba(74,4,24,0.3) 0%, rgba(26,10,58,0.5) 40%, rgba(10,20,40,0.7) 70%, rgba(0,0,0,0.9) 100%)' 
            }}
          />
          <div 
            className="absolute inset-0 z-[1]"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,0,127,0.1) 0%, transparent 50%, rgba(0,100,150,0.15) 100%)' 
            }}
          />
          {/* Top and bottom fade for seamless transition */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-transparent to-black/70" />
          
          {/* Narrative Text */}
          <div className={cn(
            "z-10 max-w-3xl mx-auto text-center space-y-4 transition-all duration-1000 delay-200",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <p className="text-neon-cyan font-[family-name:var(--font-futura)] tracking-[0.2em] text-lg md:text-xl uppercase opacity-80">
              Inquivesta XII Presents
            </p>
            
            <h1 className="text-7xl md:text-8xl lg:text-[10rem] font-script text-white mb-2 relative leading-tight drop-shadow-lg">
              <span className="gold-text">Masquerade</span>
            </h1>
            
            {/* Countdown Timer */}
            <div className="my-6">
              <p className="text-center text-[10px] md:text-xs font-[family-name:var(--font-futura)] tracking-[0.3em] uppercase text-neon-cyan mb-3 opacity-80">The Countdown Begins</p>
              <CountdownTimer targetDate={eventDate} />
            </div>
            
            <p className="text-base md:text-xl font-light tracking-widest text-gray-300">
              <span className="text-neon-pink">Retro</span> <span className="mx-2">•</span> Disco <span className="mx-2">•</span> <span className="text-neon-cyan">Romance</span>
            </p>
            
            <GlassCard hover={false} className="p-5 md:p-8 border-t border-b border-retro-gold/30 mt-6">
              <p className="text-xs md:text-base font-[family-name:var(--font-depixel-small)] tracking-wide text-gray-200 leading-relaxed italic">
                It is New Year&apos;s Eve, 1969. <br />
                The world stands on the edge of a new age. An age of machines, intelligence, and electric dreams. Whispers of an AI uprising stir in the cold December air, the future buzzing beneath the neon lights — uncertain and alive.
              </p>
              <div className="my-3 h-px bg-gradient-to-r from-transparent via-retro-gold to-transparent opacity-50" />
              <p className="text-xs md:text-base font-[family-name:var(--font-depixel-small)] tracking-wide text-gray-200 leading-relaxed">
                Within the gold and rose lit floor, a romantic crowd gathers. Disco beats echo in the hall, champagne sparkles, and secrets shimmer behind satin masks. 
                Every glance threatens to reveal. Confessions tremble on the edge of their tongues.
                Laughter mixes with the fear of what dawn might bring.
              </p>
              <p className="mt-4 font-script text-retro-gold text-xl md:text-2xl lg:text-3xl">
                When the clock strikes twelve, will you hold on or let go?
              </p>
            </GlassCard>
            
            <p className="text-sm md:text-lg font-[family-name:var(--font-depixel-small)] text-gray-100 mt-6">
              Join us for a masquerade where love, mystery, and the end of everything join together under one starlit roof. <br />
              <span className="text-neon-pink font-bold mt-2 block">Dress bold. Dance reckless. Tonight, the future begins.</span>
            </p>
          </div>

          {/* CTA */}
          <div className={cn(
            "mt-12 z-10 flex flex-col items-center transition-all duration-1000 delay-500",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <a href="#activities" className="group relative px-10 py-4 bg-transparent overflow-hidden rounded-full transition-all duration-300 inline-block">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-retro-gold to-wine-red opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 w-full h-full animate-pulse-glow rounded-full" />
              <span className="relative z-10 font-[family-name:var(--font-futura)] font-bold tracking-widest uppercase flex items-center gap-3 text-white text-sm md:text-base">
                Enter the Masquerade <i className="fas fa-mask group-hover:rotate-12 transition-transform"></i>
              </span>
            </a>
            <p className="text-xs font-[family-name:var(--font-depixel-small)] text-gray-500 mt-4 uppercase tracking-[0.2em] animate-pulse">
              Scroll to Discover the Night
            </p>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50">
            <i className="fas fa-chevron-down text-xl text-retro-gold"></i>
          </div>
        </section>

        {/* Event Cards / Activities Section */}
        <section id="activities" className="py-20 relative border-t border-white/10">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan rounded-full mix-blend-screen filter blur-[100px] opacity-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-pink rounded-full mix-blend-screen filter blur-[120px] opacity-10" />

          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-6xl font-script text-center mb-16">
              <span className="gold-text">The Night&apos;s Attractions</span>
            </h2>

            {/* Combined Image + Text Activity Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  img: '/events/masquerade/Couples_dream.png',
                  icon: 'fa-hourglass-half',
                  title: 'Speed Dating',
                  description: 'Join a time tight event, where every second counts.',
                  color: 'neon-pink',
                  textClass: 'text-neon-pink',
                  borderClass: 'border-neon-pink/30'
                },
                {
                  img: '/events/masquerade/blind_dating_card.jpg',
                  icon: 'fa-user-secret',
                  title: 'Blind Dates',
                  description: 'Is love truly blind? Chemistry can lead to unexpected reactions.',
                  color: 'retro-gold',
                  textClass: 'text-retro-gold',
                  borderClass: 'border-retro-gold/30'
                },
                {
                  img: '/events/masquerade/Bingo_card.jpg',
                  icon: 'fa-th',
                  title: 'Event Bingo',
                  description: 'Put your bets in and mingle with the ravishing crowd.',
                  color: 'neon-cyan',
                  textClass: 'text-neon-cyan',
                  borderClass: 'border-neon-cyan/30'
                },
                {
                  img: '/events/masquerade/peopledancing2.png',
                  icon: 'fa-music',
                  title: 'Disco Dance',
                  description: 'Take more chances, dance more dances.',
                  color: 'neon-purple',
                  textClass: 'text-neon-purple',
                  borderClass: 'border-neon-purple/30'
                }
              ].map((activity, i) => (
                <div key={i} className="group relative rounded-xl overflow-hidden bg-black/40 border border-white/10 hover:border-retro-gold/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                  {/* Image Section */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image 
                      src={activity.img} 
                      alt={activity.title}
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    {/* Icon Overlay */}
                    <div className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center ${activity.textClass} ${activity.borderClass}`}>
                      <i className={`fas ${activity.icon}`}></i>
                    </div>
                  </div>
                  {/* Text Section */}
                  <div className="p-5">
                    <h3 className={`text-lg font-[family-name:var(--font-futura)] tracking-[0.1em] uppercase ${activity.textClass} mb-2`}>
                      {activity.title}
                    </h3>
                    <p className="text-sm font-[family-name:var(--font-depixel-body)] text-gray-300 leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dress Code Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Visual */}
              <div className="w-full md:w-1/2 relative">
                <div className="relative aspect-square max-w-md mx-auto">
                  <Image 
                    src="/events/masquerade/DiscoHead_lady.png"
                    alt="Masquerade Theme"
                    fill
                    className="object-contain drop-shadow-[0_0_30px_rgba(255,0,127,0.3)]"
                  />
                </div>
              </div>
              
              {/* Content */}
              <div className="w-full md:w-1/2">
                <GlassCard className="p-8 transform md:rotate-2 hover:rotate-0 transition-transform duration-500 relative">
                  <div className="absolute -top-4 -right-4 text-6xl text-neon-pink opacity-50 animate-pulse">
                    <i className="fas fa-compact-disc animate-spin-slow"></i>
                  </div>
                  <div className="border border-white/10 p-6 rounded-xl bg-black/40 text-center">
                    <i className="fas fa-mask text-5xl text-neon-cyan mb-6"></i>
                    <h4 className="text-xl font-[family-name:var(--font-futura)] tracking-[0.1em] uppercase text-white mb-2">Dress Code</h4>
                    <p className="font-[family-name:var(--font-depixel-body)] text-gray-400 text-sm mb-4">
                      Retro-glam, 80's disco, or Classic Formal. <br /> 
                      <strong className="text-retro-gold">Dress bold. Dance reckless</strong>
                    </p>
                    <div className="h-0.5 w-16 bg-gradient-to-r from-neon-pink to-transparent mx-auto" />
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-3 justify-center">
                    <span className="px-4 py-1 border border-white/20 rounded-full text-xs uppercase tracking-widest text-neon-pink">#DiscoLove</span>
                    <span className="px-4 py-1 border border-white/20 rounded-full text-xs uppercase tracking-widest text-neon-cyan">#InquivestaXII</span>
                    <span className="px-4 py-1 border border-white/20 rounded-full text-xs uppercase tracking-widest text-neon-purple">#Retrofuturism</span>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </section>

        {/* The Dance Floor Awaits - Combined Section */}
        <section id="details" className="relative py-24 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <Image 
              src="/events/masquerade/Disco_dance_floor.png"
              alt="Dance Floor"
              fill
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-deep-bg via-black/80 to-deep-bg" />
          </div>
          
          <div className="relative z-10 container mx-auto px-4">
            {/* Section Title */}
            <div className="text-center mb-16">
              <h2 className="text-7xl md:text-6xl font-script gold-text mb-4">
                The Dance Floor Awaits
              </h2>
              <p className="text-lg md:text-xl font-[family-name:var(--font-depixel-small)] text-gray-300 max-w-2xl mx-auto">
                Under holographic disco balls, lose yourself in the rhythm. 
                The night is young, and the music never stops.
              </p>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
              {/* Time */}
              <GlassCard className="p-8 group text-center">
                <div className="w-14 h-14 mx-auto bg-neon-pink/20 rounded-full flex items-center justify-center mb-4 text-neon-pink group-hover:scale-110 transition-transform border border-neon-pink/30">
                  <i className="fas fa-clock text-xl"></i>
                </div>
                <h3 className="text-lg font-[family-name:var(--font-futura)] tracking-[0.1em] uppercase mb-2 text-white">When</h3>
                <p className="font-[family-name:var(--font-depixel-body)] text-gray-300">Feb 06, 2026</p>
                <p className="text-neon-cyan font-[family-name:var(--font-futura)] tracking-wider text-sm mt-1">06:00 PM - 08:30 PM</p>
              </GlassCard>

              {/* Location */}
              <GlassCard className="p-8 group text-center">
                <div className="w-14 h-14 mx-auto bg-neon-cyan/20 rounded-full flex items-center justify-center mb-4 text-neon-cyan group-hover:scale-110 transition-transform border border-neon-cyan/30">
                  <i className="fas fa-map-marker-alt text-xl"></i>
                </div>
                <h3 className="text-lg font-[family-name:var(--font-futura)] tracking-[0.1em] uppercase mb-2 text-white">Where</h3>
                <p className="font-[family-name:var(--font-depixel-body)] text-gray-300">LHC Backyard</p>
                <p className="text-gray-400 font-[family-name:var(--font-depixel-small)] text-sm mt-1">IISER Kolkata Campus</p>
              </GlassCard>

              {/* Entry */}
              <GlassCard className="p-8 group text-center">
                <div className="w-14 h-14 mx-auto bg-neon-purple/20 rounded-full flex items-center justify-center mb-4 text-neon-purple group-hover:scale-110 transition-transform border border-neon-purple/30">
                  <i className="fas fa-ticket-alt text-xl"></i>
                </div>
                <h3 className="text-lg font-[family-name:var(--font-futura)] tracking-[0.1em] uppercase mb-2 text-white">Entry</h3>
                <p className="font-[family-name:var(--font-depixel-body)] text-gray-300">Open to All</p>
                <Link href="/events" className="text-neon-pink font-[family-name:var(--font-futura)] tracking-wider mt-2 hover:underline text-sm inline-block">
                  Register Now →
                </Link>
              </GlassCard>
            </div>

            {/* Disco Ball Motif */}
            <div className="flex justify-center">
              <div className="relative w-24 h-24 md:w-32 md:h-32 animate-float">
                <Image 
                  src="/events/masquerade/Disco_Ball_spinning.jpg"
                  alt="Disco Ball"
                  fill
                  className="object-contain rounded-full animate-spin-slow"
                />
                <div className="absolute inset-0 rounded-full bg-retro-gold/20 blur-xl animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* Claim Your Invitation - Registration CTA Section */}
        <section id="register" className="relative py-24 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image 
              src="/events/masquerade/peopledancing3.png"
              alt="People Dancing"
              fill
              className="object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-deep-bg via-black/70 to-deep-bg" />
          </div>
          
          <div className="relative z-10 container mx-auto px-4 flex justify-center">
            <GlassCard hover={false} className="p-10 md:p-16 max-w-3xl w-full text-center border-retro-gold/20">
              <h2 className="text-4xl md:text-7xl font-script gold-text mb-6">
                Claim Your Invitation
              </h2>
              <p className="text-base md:text-xl font-[family-name:var(--font-depixel-small)] text-gray-300 max-w-2xl mx-auto mb-10">
                The future awaits those who are bold enough to sign their name.
              </p>
              
              <Link 
                href="/events/registration/masquerade" 
                className="group relative inline-flex items-center justify-center gap-4 px-16 py-6 bg-transparent overflow-hidden rounded-full transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 w-full h-full bg-retro-gold opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 w-full h-full animate-pulse-glow rounded-full" />
                <span className="relative z-10 font-[family-name:var(--font-futura)] font-bold tracking-[0.25em] uppercase text-black text-lg md:text-2xl">
                  Register Now
                </span>
              </Link>
            </GlassCard>
          </div>
        </section>

        {/* Footer / Ending Element */}
        <footer className="py-12 bg-black border-t border-retro-gold/20 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-10 blur-sm pointer-events-none"
            style={{ backgroundImage: "url('/events/masquerade/signoff_background.png')" }}
          />
          <div className="container mx-auto px-4 text-center relative z-10">
            
            <h2 className="text-5xl md:text-5xl font-[family-name:var(--font-futura)] text-white mb-4 uppercase tracking-[0.15em]">
              New Years Eve <span className="text-retro-gold">•</span> One Night Only
            </h2>
            <p className="text-5xl font-script text-neon-pink mb-8">Save The Date</p>
            
            <div className="flex justify-center space-x-6 mb-8 text-2xl">
              <a href="https://www.instagram.com/inquivesta_iiserk/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-retro-gold transition-colors">
              <i className="fab fa-instagram"></i>
              </a>
            </div>

            <div className="text-gray-500 text-xs">
              <p>&copy; 2026 Inquivesta XII. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Custom Styles */}
        <style jsx global>{`
          /* Custom Colors */
          :root {
            --neon-pink: #ff007f;
            --neon-cyan: #00f3ff;
            --neon-purple: #bc13fe;
            --retro-gold: #FFD700;
            --retro-silver: #C0C0C0;
            --wine-red: #4a0418;
            --deep-bg: #050214;
          }

          .bg-deep-bg { background-color: var(--deep-bg); }
          .text-neon-pink { color: var(--neon-pink); }
          .text-neon-cyan { color: var(--neon-cyan); }
          .text-neon-purple { color: var(--neon-purple); }
          .text-retro-gold { color: var(--retro-gold); }
          .text-wine-red { color: var(--wine-red); }
          .border-neon-pink { border-color: var(--neon-pink); }
          .border-retro-gold { border-color: var(--retro-gold); }
          .bg-neon-pink { background-color: var(--neon-pink); }
          .bg-retro-gold { background-color: var(--retro-gold); }
          .bg-wine-red { background-color: var(--wine-red); }
          .from-retro-gold { --tw-gradient-from: var(--retro-gold); }
          .to-wine-red { --tw-gradient-to: var(--wine-red); }
          .bg-neon-pink\\/20 { background-color: rgba(255, 0, 127, 0.2); }
          .bg-neon-cyan\\/20 { background-color: rgba(0, 243, 255, 0.2); }
          .bg-neon-purple\\/20 { background-color: rgba(188, 19, 254, 0.2); }
          .bg-retro-gold\\/20 { background-color: rgba(255, 215, 0, 0.2); }

          /* Font */
          .font-script {
            font-family: 'Great Vibes', cursive;
          }

          /* Custom Scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: var(--deep-bg); 
          }
          ::-webkit-scrollbar-thumb {
            background: var(--retro-gold); 
            border-radius: 4px;
          }

          /* Blur Haze */
          .haze {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            backdrop-filter: blur(2px);
            z-index: -3;
            pointer-events: none;
          }

          /* Animated Background Grid (Checkered Floor Perspective) */
          .retro-grid {
            position: fixed;
            bottom: -20%;
            left: -50%;
            width: 200%;
            height: 100%;
            background-image: 
              linear-gradient(rgba(188, 19, 254, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(188, 19, 254, 0.4) 1px, transparent 1px);
            background-size: 80px 80px;
            perspective: 300px;
            transform: rotateX(60deg);
            transform-style: preserve-3d;
            z-index: -2;
            opacity: 0.4;
            mask-image: linear-gradient(to top, black 40%, transparent 100%);
            -webkit-mask-image: linear-gradient(to top, black 40%, transparent 100%);
          }

          /* Disco Ball Effect Overlay */
          .disco-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 50% 50%, rgba(74, 4, 24, 0.2), transparent 70%);
            z-index: -1;
            pointer-events: none;
          }

          /* Stars */
          .stars-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
          }

          .star {
            position: absolute;
            background: var(--retro-gold);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--retro-gold);
            animation: twinkle var(--duration, 3s) ease-in-out infinite;
          }

          /* Dust Particles */
          .dust {
            position: absolute;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            animation: dust-float var(--dust-duration, 8s) ease-in-out infinite;
          }

          @keyframes dust-float {
            0%, 100% { 
              opacity: 0;
              transform: translateY(0) translateX(0);
            }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { 
              opacity: 0;
              transform: translateY(-100px) translateX(20px);
            }
          }

          /* Disco Ball Light Rays */
          .disco-rays {
            background: conic-gradient(
              from 0deg,
              transparent 0deg,
              rgba(255,215,0,0.3) 10deg,
              transparent 20deg,
              transparent 30deg,
              rgba(255,0,127,0.2) 40deg,
              transparent 50deg,
              transparent 60deg,
              rgba(0,243,255,0.2) 70deg,
              transparent 80deg,
              transparent 90deg,
              rgba(255,215,0,0.3) 100deg,
              transparent 110deg
            );
            animation: spin 8s linear infinite;
            border-radius: 50%;
            filter: blur(8px);
            transform: scale(2);
          }

          /* Ribbon Divider */
          .ribbon-divider::before,
          .ribbon-divider::after {
            content: '';
            position: absolute;
            width: 30px;
            height: 30px;
            background: var(--wine-red);
            opacity: 0.6;
          }
          .ribbon-divider::before {
            left: -15px;
            bottom: -15px;
            transform: rotate(45deg);
          }
          .ribbon-divider::after {
            right: -15px;
            bottom: -15px;
            transform: rotate(45deg);
          }

          @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }

          /* Text Effects */
          .gold-text {
            color: var(--retro-gold);
            text-shadow: 
              0 0 10px rgba(255, 215, 0, 0.5),
              0 0 20px rgba(255, 215, 0, 0.3),
              0 0 40px rgba(255, 215, 0, 0.2);
          }

          .neon-text {
            text-shadow: 
              0 0 5px var(--neon-pink),
              0 0 10px var(--neon-pink),
              0 0 20px var(--neon-pink),
              0 0 40px var(--neon-purple);
          }

          /* Glass Cards */
          .glass-card {
            background: rgba(20, 10, 30, 0.4);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
          }

          /* Countdown Box */
          .countdown-box {
            background: linear-gradient(135deg, rgba(255,0,127,0.1), rgba(188,19,254,0.1));
            border: 1px solid rgba(255,0,127,0.3);
          }

          /* Animations */
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }

          @keyframes pulse-glow {
            0%, 100% { opacity: 1; box-shadow: 0 0 20px var(--neon-pink); }
            50% { opacity: 0.8; box-shadow: 0 0 40px var(--neon-purple); }
          }

          .animate-pulse-glow {
            animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          .animate-spin-slow {
            animation: spin 12s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          /* Smooth scroll */
          html {
            scroll-behavior: smooth;
          }

          /* Cherry Blossom Cursor Effect */
          .cursor-particle {
            position: absolute;
            width: 20px;
            height: 20px;
            background-image: url('https://twemoji.maxcdn.com/v/latest/svg/1f338.svg');
            background-size: cover;
            pointer-events: none;
            animation: fade-out 2s forwards;
          }

          @keyframes fade-out {
            0% {
              opacity: 1;
              transform: scale(1);
            }
            100% {
              opacity: 0;
              transform: scale(0.5);
            }
          }
        `}</style>

        {/* Cherry Blossom Cursor Effect Script */}
        <script>
          {`
            let lastX = 0;
            let lastY = 0;

            document.addEventListener('mousemove', (e) => {
              const distance = Math.sqrt((e.pageX - lastX) ** 2 + (e.pageY - lastY) ** 2);

              // Only spawn particles if the mouse has moved a significant distance
              if (distance > 10) {
                const particle = document.createElement('div');
                particle.className = 'cursor-particle';

                // Randomize size and position offsets
                const size = Math.random() * 15 + 5; // Random size between 5px and 20px
                const offsetX = (Math.random() - 0.5) * 20; // Random offset between -10px and 10px
                const offsetY = (Math.random() - 0.5) * 20; // Random offset between -10px and 10px

                particle.style.width = \`\${size}px\`;
                particle.style.height = \`\${size}px\`;
                particle.style.left = \`\${e.pageX + offsetX}px\`;
                particle.style.top = \`\${e.pageY + offsetY}px\`;

                document.body.appendChild(particle);

                setTimeout(() => {
                  particle.remove();
                }, 2000);

                lastX = e.pageX;
                lastY = e.pageY;
              }
            });
          `}
        </script>
      </main>
    </>
  )
}
