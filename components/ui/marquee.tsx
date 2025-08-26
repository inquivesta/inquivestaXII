"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface MarqueeProps {
  children: ReactNode
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  speed?: "slow" | "normal" | "fast"
}

export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = false,
  speed = "normal",
}: MarqueeProps) {
  const speedClass = {
    slow: "animate-marquee-slow",
    normal: "animate-marquee",
    fast: "animate-marquee-fast",
  }

  return (
    <div className={cn("group flex overflow-hidden", className)}>
      <div
        className={cn(
          "flex shrink-0 justify-around min-w-full gap-4",
          speedClass[speed],
          reverse && "animate-reverse",
          pauseOnHover && "group-hover:pause",
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "flex shrink-0 justify-around min-w-full gap-4",
          speedClass[speed],
          reverse && "animate-reverse",
          pauseOnHover && "group-hover:pause",
        )}
      >
        {children}
      </div>
    </div>
  )
}
