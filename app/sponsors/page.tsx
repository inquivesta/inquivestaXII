"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/ui/fade-in"
import { HyperText } from "@/components/ui/hyper-text"
import { ArrowLeft, Menu, X, Twitter, Instagram, Facebook, Download, Mail } from "lucide-react"

export default function SponsorsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
            <Link href="/sponsors" className="text-[#D2B997] font-depixel-small font-bold">
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
          <button className="md:hidden text-[#D2B997] pr-4" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
              <Link href="/sponsors" className="text-[#D2B997] font-depixel-small font-bold">
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
              <Link href="/about_us" className="text-[#B8A7D9] hover:text-[#D2B997] transition-colors font-depixel-small">
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
                className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#F8BBD9] to-[#F8C471] bg-clip-text text-transparent font-futura"
                text="OUR PREVIOUS SPONSORS"
              />
              <p className="text-[#D2B997] text-lg font-depixel-body">PARTNERS IN SUCCESS</p>
            </div>
          </FadeIn>

          {/* Description and CTA Section */}
          <FadeIn delay={0.2}>
            <div className="text-center mb-12 max-w-4xl mx-auto">
              <p className="text-[#B8A7D9] text-lg md:text-xl leading-relaxed mb-8 font-depixel-small">
                Reach <span className="text-[#F8C471] font-bold">20,000+</span> on-ground audience and 
                <span className="text-[#F8BBD9] font-bold"> 500,000+</span> eyes on our social media platforms. 
                Connect with us to collaborate and be part of IISER Kolkata's flagship science festival.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                <Link href="/Inquivesta XII (S).pdf" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-gradient-to-r from-[#F8BBD9] to-[#F8C471] hover:from-[#F5A3C7] hover:to-[#F7DC6F] text-[#1A1A1A] font-depixel-body px-3 py-1.5 text-xs md:text-sm flex items-center space-x-1.5 w-full sm:w-auto max-w-xs">
                    <Download className="w-3 h-3 md:w-4 md:h-4" />
                    <span>Download Sponsor Brochure</span>
                  </Button>
                </Link>
                <Link href="mailto:inquivesta@iiserkol.ac.in">
                  <Button className="bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body px-3 py-1.5 text-xs md:text-sm flex items-center space-x-1.5 w-full sm:w-auto max-w-xs">
                    <Mail className="w-3 h-3 md:w-4 md:h-4" />
                    <span>Contact Us</span>
                  </Button>
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Sponsors Image */}
          <FadeIn delay={0.4}>
            <div className="flex justify-center">
              <div className="max-w-4xl w-full">
                <Image
                  src="/spon_all.png"
                  alt="All Previous Sponsors"
                  width={1200}
                  height={1600}
                  className="w-full h-auto rounded-2xl border-2 border-[#F8C471]/60 shadow-2xl shadow-[#F8BBD9]/20"
                  priority
                />
              </div>
            </div>
          </FadeIn>
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
                                <span className="text-[#3b5998] text-xs font-depixel-small mt-1 group-hover:text-[#3b5998] transition-colors">Facebook</span>
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