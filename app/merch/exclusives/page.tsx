"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCcw, ShoppingCart, ZoomIn, X } from "lucide-react"
import { FadeIn } from "@/components/ui/fade-in"

interface MerchItem {
  id: number
  name: string
  description: string
  price: string
  frontImage: string
  backImage?: string
  features: string[]
  isComingSoon?: boolean
}

const merchItems: MerchItem[] = [
  {
    id: 1,
    name: "Blast Off T-Shirt",
    description: "Featuring IISER K Emblem & Inquivesta Insignia",
    price: "₹599",
    frontImage: "/merch/1.png",
    backImage: "/merch/exclusive/black_back_mock.png",
    features: ["Unisex Fit", "100% Cotton", "Limited Edition"],
  },
  {
    id: 2,
    name: "Circuitree T-Shirt",
    description: "Featuring IISER K Emblem & Inquivesta Insignia",
    price: "₹599",
    frontImage: "/merch/3.png",
    backImage: "/merch/exclusive/green_back_mock.png",
    features: ["Unisex Fit", "100% Cotton", "Exclusive Print"],
  },
  {
    id: 3,
    name: "Skyline Sweatshirt",
    description: "Featuring IISER K Emblem & Inquivesta Insignia",
    price: "₹799",
    frontImage: "/merch/exclusive/blue_back_mock.png",
    backImage: "/merch/exclusive/blue_front_mock.png",
    features: ["Unisex Fit", "100% Cotton", "Premium Quality"],
  },
  {
    id: 4,
    name: "Caffeine Sweatshirt",
    description: "Featuring IISER K Emblem & Inquivesta Insignia",
    price: "₹799",
    frontImage: "/merch/exclusive/coffee_back_mock.png",
    backImage: "/merch/exclusive/coffee_front_mock.png",
    features: ["Unisex Fit", "100% Cotton", "Cozy Comfort"],
  },
  {
    id: 5,
    name: "Genius's mug",
    description: "Premium ceramic mug with custom design",
    price: "₹289",
    frontImage: "/merch/exclusive/mug.jpeg",
    features: ["Ceramic", "Dishwasher Safe", "Microwave Safe"],
  },
  {
    id: 6,
    name: "Inquisitive Cap",
    description: "Adjustable cap with embroidered design",
    price: "₹279",
    frontImage: "/merch/exclusive/cap.jpeg",
    features: ["Adjustable Fit", "Embroidered", "UV Protected"],
  },
  {
    id: 7,
    name: "Limitless Sipper",
    description: "Insulated stainless steel coffee mug",
    price: "₹549",
    frontImage: "/merch/exclusive/cofee_sipper.jpeg",
    features: ["Insulated", "Stainless Steel", "Leak Proof"],
  },
  {
    id: 8,
    name: "Tote Bag",
    description: "Perfect for alumni and merchandise collection",
    price: "Coming Soon",
    frontImage: "/merch/exclusive/tote_bag.png",
    isComingSoon: true,
    features: ["Eco-Friendly", "Spacious", "Durable"],
  },
]

interface ProductCardProps {
  item: MerchItem
  onExpandClick: (item: MerchItem) => void
}

function ProductCard({ item, onExpandClick }: ProductCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  return (
    <div
      className="relative group h-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Card Container */}
      <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-2xl overflow-hidden border border-[#D2B997]/30 hover:border-[#D2B997] transition-all duration-300 h-full flex flex-col shadow-lg hover:shadow-2xl group-hover:shadow-[#D2B997]/20">
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-[#404040] to-[#2a2a2a] overflow-hidden">
          {/* Front Image */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              isFlipped ? "opacity-0" : "opacity-100"
            }`}
            style={{
              transform: `scale(${zoomLevel})`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <Image
              src={item.frontImage}
              alt={`${item.name} Front`}
              fill
              className="object-cover"
            />
          </div>

          {/* Back Image */}
          {item.backImage && (
            <div
              className={`absolute inset-0 transition-opacity duration-700 ${
                isFlipped ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={item.backImage}
                alt={`${item.name} Back`}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Coming Soon Overlay */}
          {item.isComingSoon && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="text-center">
                <p className="text-white text-2xl md:text-3xl font-bold font-depixel-body">
                  Coming Soon
                </p>
                <p className="text-white/60 text-sm mt-2 font-depixel-small">
                  Stay tuned for this exclusive item
                </p>
              </div>
            </div>
          )}

          {/* Interactive Badges */}
          {(isHovering || true) && !item.isComingSoon && (
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 animate-fadeIn md:opacity-0 md:group-hover:opacity-100 md:transition-opacity">
              {item.backImage && (
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 transition-all hover:scale-110 shadow-lg"
                >
                  <RotateCcw className="w-5 h-5 text-white" />
                </button>
              )}
              <button
                onClick={() => {
                  setZoomLevel(zoomLevel === 1 ? 1.3 : 1)
                }}
                className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 transition-all hover:scale-110 shadow-lg"
              >
                <ZoomIn className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Title and Description */}
          <div className="mb-3 flex-grow">
            <h3 className="text-lg md:text-xl font-bold text-white font-depixel-body mb-1">
              {item.name}
            </h3>
            <p className="text-xs md:text-sm text-white/70 font-depixel-small line-clamp-2">
              {item.description}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-1 mb-3 py-2 border-t border-white/10">
            {item.features.slice(0, 2).map((feature, idx) => (
              <div key={idx} className="flex items-center text-white/60 font-depixel-small text-xs">
                <div className="w-1 h-1 bg-[#D2B997] rounded-full mr-2" />
                {feature}
              </div>
            ))}
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
            <p className="text-2xl font-bold text-[#e7b63d] font-futura">
              {item.price}
            </p>
            {!item.isComingSoon && (
              <Button
                onClick={() => onExpandClick(item)}
                className="bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body px-3 py-2 text-xs shadow-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Buy
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ExpandedViewProps {
  item: MerchItem
  onClose: () => void
}

function ExpandedProductView({ item, onClose }: ExpandedViewProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-[#1A1A1A] border-2 border-[#D2B997] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#D2B997] hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative bg-black">
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              isFlipped ? "opacity-0" : "opacity-100"
            }`}
            style={{
              transform: `scale(${zoomLevel})`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <Image
              src={item.frontImage}
              alt={`${item.name} Front`}
              fill
              className="object-contain p-4"
            />
          </div>

          {item.backImage && (
            <div
              className={`absolute inset-0 transition-opacity duration-700 ${
                isFlipped ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={item.backImage}
                alt={`${item.name} Back`}
                fill
                className="object-contain p-4"
              />
            </div>
          )}

          {/* Controls Overlay */}
          <div className="absolute top-4 left-4 flex gap-2">
            {item.backImage && (
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition-all hover:scale-110 shadow-lg"
              >
                <RotateCcw className="w-5 h-5 text-white" />
              </button>
            )}
            <button
              onClick={() => setZoomLevel(zoomLevel === 1 ? 1.5 : 1)}
              className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition-all hover:scale-110 shadow-lg"
            >
              <ZoomIn className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-depixel-body">
              {item.name}
            </h2>
            <p className="text-white/70 text-lg mb-6 font-depixel-small">
              {item.description}
            </p>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#D2B997] mb-3 font-depixel-body">
                Features
              </h3>
              <ul className="space-y-2">
                {item.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-white/80 font-depixel-small">
                    <div className="w-2 h-2 bg-[#D2B997] rounded-full mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="border-t border-white/20 pt-6">
            <p className="text-5xl font-bold text-[#e7b63d] mb-4 font-futura">
              {item.price}
            </p>
            <Link href="/merch/exclusives/buy">
              <Button className="w-full bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body px-6 py-4 text-lg shadow-lg hover:shadow-2xl transition-all hover:scale-105">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Buy Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MerchExclusivesPage() {
  const [expandedItem, setExpandedItem] = useState<MerchItem | null>(null)

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

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 md:px-6 lg:px-8">
        <FadeIn>
          {/* Title Section */}
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#D2B997] mb-3 font-futura">
              Exclusive Merch Collection
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-depixel-small">
              Premium merchandise featuring the IISER K emblem and Inquivesta insignia! Now available for international delivery!!!
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {merchItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onExpandClick={setExpandedItem}
              />
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-16 bg-gradient-to-r from-[#D2B997]/10 to-[#B8A7D9]/10 border border-[#D2B997]/30 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-[#D2B997] mb-4 font-futura">
              About This Collection
            </h3>
            <p className="text-white/80 text-lg font-depixel-small leading-relaxed">
              Our exclusive merchandise is designed for those who want to carry a piece of IISER K and Inquivesta
              worldwide. Each item proudly features both the IISER K emblem and the Inquivesta insignia, celebrating the
              spirit of inquiry and academic excellence. Available for international delivery.
            </p>
          </div>
        </FadeIn>
      </main>

      {/* Expanded Product Modal */}
      {expandedItem && (
        <ExpandedProductView
          item={expandedItem}
          onClose={() => setExpandedItem(null)}
        />
      )}

      {/* Custom CSS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
