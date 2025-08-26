"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface NumberTickerProps {
  value: number
  direction?: "up" | "down"
  delay?: number
  className?: string
}

export function NumberTicker({ value, direction = "up", delay = 0, className }: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(direction === "down" ? value : 0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const startAnimation = () => {
      const startValue = direction === "down" ? value : 0
      const endValue = direction === "down" ? 0 : value
      const duration = 2000
      const steps = 60
      const stepValue = (endValue - startValue) / steps
      const stepDuration = duration / steps

      let currentStep = 0

      intervalRef.current = setInterval(() => {
        currentStep++
        const newValue = startValue + stepValue * currentStep

        if (currentStep >= steps) {
          setDisplayValue(endValue)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
        } else {
          setDisplayValue(Math.round(newValue))
        }
      }, stepDuration)
    }

    const timer = setTimeout(startAnimation, delay)

    return () => {
      clearTimeout(timer)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [value, direction, delay])

  return <span className={cn("tabular-nums", className)}>{(displayValue ?? 0).toLocaleString()}</span>
}
