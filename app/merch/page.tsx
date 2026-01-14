"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingCart, RotateCcw, Sparkles, ZoomIn, Ruler, X } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import { FadeIn } from "@/components/ui/fade-in"

interface MerchItem {
  id: number
  name: string
  description: string
  price: string
  originalPrice: string
  frontImage: string
  backImage: string
  color: string
  features: string[]
  tagline: string
}

const merchItems: MerchItem[] = [
  {
    id: 1,
    name: "Blast Off T-Shirt",
    description: "INQ XII Official Merchandise",
    price: "₹499",
    originalPrice: "₹599",
    frontImage: "/merch/1.png",
    backImage: "/merch/2.png",
    color: "linear-gradient(135deg, #1a1a2e 0%, #2d3047 30%, #4a5568 70%, #718096 100%)",
    features: ["Unisex Fit, 100% Cotton, 180 GSM", "Limited Edition"],
    tagline: "Be Limitless",
  },
  {
    id: 2,
    name: "Circuitree T-Shirt",
    description: "INQ XII Official Merchandise",
    price: "₹499",
    originalPrice: "₹599",
    frontImage: "/merch/3.png",
    backImage: "/merch/4.png",
    color: "linear-gradient(135deg, #103830 0%, #1e5b4f 30%, #2f7c6c 70%, #4ea48f 100%)",
    features: ["Unisex Fit, 100% Cotton, 180 GSM", "Exclusive Print"],
    tagline: "Be Limitless",
  },
  {
    id: 3,
    name: "Skyline Sweatshirt",
    description: "INQ XII Stylish Festival Sweatshirt",
    price: "₹749",
    originalPrice: "₹799",
    frontImage: "/merch/6.png",
    backImage: "/merch/5.png",
    color: "linear-gradient(135deg, #0f2537 0%, #1e3f52 30%, #2d5a6e 70%, #4a7a91 100%)",
    features: ["Unisex Fit, 100% Cotton, 280 GSM", "Limited Stock"],
    tagline: "Be Inquisitive",
  },
  {
    id: 4,
    name: "Caffeine Sweatshirt",
    description: "INQ XII Stylish Festival Sweatshirt",
    price: "₹749",
    originalPrice: "₹799",
    frontImage: "/merch/8.png",
    backImage: "/merch/7.png",
    color: "linear-gradient(135deg, #3d1416 0%, #5a1f22 30%, #7a2b2f 70%, #a8484d 100%)",
    features: ["Unisex Fit, 100% Cotton, 280 GSM", "Exclusive Design"],
    tagline: "Be Inquisitive",
  },
]

export default function MerchPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({})
  const [isClient, setIsClient] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [showSizeChart, setShowSizeChart] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        prevSlide()
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        nextSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % merchItems.length)
    setFlippedCards({})
    setZoomLevel(1)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + merchItems.length) % merchItems.length)
    setFlippedCards({})
    setZoomLevel(1)
  }

  const toggleFlip = (id: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.3 : 1))
  }

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const deltaX = touchStart.x - touchEnd.x
    const deltaY = touchStart.y - touchEnd.y
    const minSwipeDistance = 50

    // Check if horizontal or vertical swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          nextSlide()
        } else {
          prevSlide()
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) {
          nextSlide()
        } else {
          prevSlide()
        }
      }
    }
  }

  const currentItem = merchItems[currentSlide]

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#D2B997]/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 text-[#D2B997] hover:text-[#B8A7D9] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-depixel-small">Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="INQUIVESTA XII" width={60} height={60} className="h-10 w-auto" />
          </div>
        </div>
      </header>

      {/* Main Slider Section */}
      <main className="relative h-screen w-screen pt-20">
        {/* Size Chart Button - Fixed Top Right */}
        <Button
          onClick={() => setShowSizeChart(true)}
          className="fixed top-24 right-4 md:right-8 z-40 bg-gradient-to-r from-[#D2B997] to-[#B8A7D9] hover:from-[#B8A7D9] hover:to-[#D2B997] text-[#1A1A1A] font-depixel-small px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm shadow-lg hover:shadow-2xl transition-all hover:scale-105"
        >
          <Ruler className="w-4 h-4 mr-1 md:mr-2" />
          Size Chart
        </Button>

        {/* Main Slide */}
        {isClient && (
          <div
            className="relative h-full w-full transition-all duration-1000 ease-in-out overflow-hidden"
            style={{ background: currentItem.color }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Product Image Container with flip */}
            <div 
              className="absolute top-[calc(4rem-10px)] md:top-auto md:bottom-0 left-1/2 md:left-auto md:right-[calc(10.5%-25px)] lg:right-[calc(13.5%-10px)] -translate-x-1/2 md:translate-x-0 h-[50vh] md:h-[75vh] lg:h-[85vh] w-[80vw] md:w-[50vw] lg:w-[45vw] perspective-1000 z-10"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div
                className="relative h-full w-full transition-all duration-700 cursor-pointer"
                style={{
                  transform: `scale(${zoomLevel})`,
                }}
                onClick={() => toggleFlip(currentItem.id)}
              >
                {/* Front */}
                <div 
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    flippedCards[currentItem.id] ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <Image
                    src={currentItem.frontImage}
                    alt={`${currentItem.name} Front`}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
                {/* Back */}
                <div 
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    flippedCards[currentItem.id] ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={currentItem.backImage}
                    alt={`${currentItem.name} Back`}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>

              {/* Interactive Badges */}
              {isHovering && (
                <div className="absolute top-4 right-4 flex flex-col gap-2 animate-fadeIn">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleZoom()
                    }}
                    className="bg-white/20 backdrop-blur-md p-2 md:p-3 rounded-full hover:bg-white/30 transition-all"
                  >
                    <ZoomIn className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFlip(currentItem.id)
                    }}
                    className="bg-white/20 backdrop-blur-md p-2 md:p-3 rounded-full hover:bg-white/30 transition-all"
                  >
                    <RotateCcw className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </button>
                </div>
              )}
            </div>

            {/* Text Content */}
            <div className="absolute left-[5%] md:left-[8%] bottom-[5%] md:top-auto md:bottom-[10%] lg:bottom-[12%] z-10 max-w-[90vw] md:max-w-md lg:max-w-lg md:mr-8">
              <FadeIn>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-none mb-1 md:mb-2 font-futura drop-shadow-lg">
                  {currentItem.tagline.split(' ')[0]}
                </h2>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-none mb-4 md:mb-6 font-futura drop-shadow-lg">
                  {currentItem.tagline.split(' ').slice(1).join(' ')}
                </h2>
                
                <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 max-h-[40vh] md:max-h-[45vh] overflow-y-auto scrollbar-hide">
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-white mb-1 md:mb-2 font-depixel-body">
                    {currentItem.name}
                  </p>
                  <p className="text-sm md:text-base lg:text-lg text-white/80 mb-3 md:mb-4 font-depixel-small">
                    {currentItem.description}
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
                    {currentItem.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-white/70 font-depixel-small text-xs md:text-sm">
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#F4D03F] rounded-full mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-row items-center justify-between gap-3 pt-3 md:pt-4 border-t border-white/20">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#d9d7e0] font-futura diagonal-strikethrough" style={{ textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>
                          {currentItem.originalPrice}
                        </p>
                        <span className="bg-gradient-to-r from-[#F4D03F] to-[#e6b43d] text-black text-[10px] md:text-xs font-bold px-2 py-1 rounded-full font-depixel-small">
                          PRE-FEST SALE
                        </span>
                      </div>
                      <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#e7b63d] font-futura leading-none">
                        {currentItem.price}
                      </p>
                    </div>
                    <Link href="/merch/buy">
                      <Button className="bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body px-4 py-4 md:px-6 md:py-6 text-sm md:text-base lg:text-lg shadow-lg hover:shadow-2xl transition-all hover:scale-105">
                        <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                        Buy Now
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Click to Flip Indicator */}
                <div className="hidden md:flex items-center gap-2 text-white/60 text-sm font-depixel-small animate-bounce mt-3">
                  <RotateCcw className="w-4 h-4" />
                  <span>Click product to flip</span>
                </div>
              </FadeIn>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-2 md:left-4 lg:left-8 top-[calc(50%-10px)] md:top-1/2 -translate-y-1/2 text-white hover:text-[#D2B997] transition-all z-20 bg-white/10 backdrop-blur-md p-2 md:p-3 rounded-full hover:bg-white/20 hover:scale-110"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6 md:w-10 md:h-10 lg:w-12 lg:h-12" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 md:right-4 lg:right-8 top-[calc(50%-10px)] md:top-1/2 -translate-y-1/2 text-white hover:text-[#D2B997] transition-all z-20 bg-white/10 backdrop-blur-md p-2 md:p-3 rounded-full hover:bg-white/20 hover:scale-110"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6 md:w-10 md:h-10 lg:w-12 lg:h-12" />
            </button>
          </div>
        )}

        {/* Progress Indicator (Dots) */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {merchItems.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index)
                setFlippedCards({})
                setZoomLevel(1)
              }}
              className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index ? "w-8 md:w-10 bg-white shadow-lg" : "w-2 md:w-2.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </main>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div 
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowSizeChart(false)}
        >
          <div 
            className="relative bg-[#1A1A1A] border-2 border-[#D2B997] rounded-2xl p-4 md:p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowSizeChart(false)}
              className="absolute top-4 right-4 text-[#D2B997] hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-[#D2B997] mb-4 md:mb-6 font-futura text-center">
              Size Chart
            </h2>

            {/* Size Chart Images */}
            <div className="space-y-4 md:space-y-6">
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-[#D2B997]/30">
                <Image
                  src="/merch/size/img1.png"
                  alt="Size Chart 1"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-[#D2B997]/30">
                <Image
                  src="/merch/size/img2.png"
                  alt="Size Chart 2"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Info Text */}
            <p className="text-white/60 text-sm text-center mt-4 font-depixel-small">
              Please refer to the size chart above for accurate measurements
            </p>
          </div>
        </div>
      )}

      {/* Custom CSS for 3D flip effect and animations */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        /* Diagonal strikethrough effect */
        .diagonal-strikethrough {
          position: relative;
          display: inline-block;
        }
        
        .diagonal-strikethrough::after {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 100%;
          height: 3px;
          background-color: #ef4444;
          transform: translateY(-50%) rotate(-15deg);
          transform-origin: center;
        }
        
        /* Hide scrollbar but keep functionality */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
        
        @keyframes flip {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(180deg);
          }
        }
        
        .animate-flip {
          animation: flip 0.7s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
