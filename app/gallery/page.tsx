"use client"

import Image from "next/image"
import Link from "next/link"
import { FadeIn } from "@/components/ui/fade-in"
import { HyperText } from "@/components/ui/hyper-text"
import { ArrowLeft, Twitter, Instagram, Facebook } from "lucide-react"

const galleryImages = [
  "/gallery/1_image_2 (Medium).JPG",
  "/gallery/2_image_21.jpg",
  "/gallery/anicon (Medium).JPG",
  "/gallery/cultural_fun (Medium).JPG",
  "/gallery/image_1 (Medium).jpg",
  "/gallery/image_10 (Medium).JPG",
  "/gallery/image_11 (Medium).JPG",
  "/gallery/image_12 (Medium).JPG",
  "/gallery/image_13 (Medium).JPG",
  "/gallery/image_14 (Medium).JPG",
  "/gallery/image_15 (Medium).JPG",
  "/gallery/image_16 (Medium).JPG",
  "/gallery/image_17 (Medium).JPG",
  "/gallery/image_18.jpg",
  "/gallery/image_19.jpg",
  "/gallery/image_4 (Medium).JPG",
  "/gallery/image_5 (Medium).JPG",
  "/gallery/image_6 (Medium).JPG",
  "/gallery/image_8 (Medium).JPG",
  "/gallery/image_9 (Medium).JPG",
  "/gallery/lost (Medium).JPG",
  "/gallery/mundane (2).jpg",
  "/gallery/pronite_crowd (Medium).jpg",
  "/gallery/sceince_talks (Medium).JPG",
  "/gallery/science_event (Medium).JPG",
  "/gallery/stalls (Medium).JPG",
  "/gallery/z_fashion_walk (Medium).JPG",
]

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white border-8 border-[#D2B997]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#D2B997]/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-[#D2B997] hover:text-[#B8A7D9] transition-colors font-depixel-small"
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
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <HyperText
                className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#55CDFC] via-[#FFFFFF] to-[#F7A8B8] bg-clip-text text-transparent font-futura"
                text="GALLERY AND EVENT HIGHLIGHTS"
              />
              <p className="text-[#D2B997] text-lg font-depixel-small">MEMORIES IN MOTION</p>
            </div>
          </FadeIn>

          {/* Simple Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((imageUrl, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="group overflow-hidden rounded-2xl border-2 border-[#F8C471]/60 transition-all duration-300 hover:border-[#F8BBD9] hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#F8BBD9]/20">
                  <Image
                    src={imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2A2A2A]/80 border-t border-[#D2B997]/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Image src="/logo-full.svg" alt="INQUIVESTA XII" width={150} height={75} className="h-16 w-auto mb-4" />
              <p className="text-[#D2B997] text-sm font-mono">IISER Kolkata's flagship annual science festival</p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 font-mono">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  href="/"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-mono"
                >
                  Home
                </Link>
                <Link
                  href="/about_us"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-mono"
                >
                  About Us
                </Link>
                <Link
                  href="/events"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-mono"
                >
                  Events
                </Link>
                <Link
                  href="/sponsors"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-mono"
                >
                  Sponsors
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 font-mono">Events</h3>
              <div className="space-y-2">
                <Link
                  href="#competitions"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-mono"
                >
                  Competitions
                </Link>
                <Link
                  href="#workshops"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-mono"
                >
                  Workshops
                </Link>
                <Link
                  href="#pronite"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-mono"
                >
                  Pronite
                </Link>
                <Link
                  href="#exhibitions"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-mono"
                >
                  Exhibitions
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 font-mono">Contact</h3>
              <div className="space-y-2 text-sm font-mono text-[#D2B997]">
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
                <span className="text-[#1DA1F2] text-xs font-mono mt-1 group-hover:text-[#1DA1F2] transition-colors">X</span>
              </Link>

              <Link 
                href="https://www.instagram.com/inquivesta_iiserk/" 
                className="flex flex-col items-center group transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-[#E4405F]/20 to-[#E4405F]/10 p-2 rounded-full border border-[#E4405F]/30 group-hover:border-[#E4405F] transition-all duration-300">
                  <Instagram className="w-4 h-4 text-[#E4405F] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-[#E4405F] text-xs font-mono mt-1 group-hover:text-[#E4405F] transition-colors">Instagram</span>
              </Link>

              <Link 
                href="https://www.facebook.com/inquivesta" 
                className="flex flex-col items-center group transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-[#1877F2]/20 to-[#1877F2]/10 p-2 rounded-full border border-[#1877F2]/30 group-hover:border-[#1877F2] transition-all duration-300">
                  <Facebook className="w-4 h-4 text-[#1877F2] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-[#1877F2] text-xs font-mono mt-1 group-hover:text-[#1877F2] transition-colors">Facebook</span>
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
                <span className="text-[#FF0000] text-xs font-mono mt-1 group-hover:text-[#FF0000] transition-colors">YouTube</span>
              </Link>
            </div>
            <p className="text-[#D2B997] text-sm font-mono mb-6">
              Designed with ❤️ by team inquivesta!
            </p>
            <p className="text-[#D2B997] text-sm font-mono">
              © 2025 INQUIVESTA XII - IISER Kolkata. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
