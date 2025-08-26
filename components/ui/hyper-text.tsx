"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface HyperTextProps {
  text: string
  className?: string
  animateOnLoad?: boolean
}

export function HyperText({ text, className, animateOnLoad = true }: HyperTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isAnimating, setIsAnimating] = useState(false)

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"

  useEffect(() => {
    if (!animateOnLoad) return

    setIsAnimating(true)
    let iteration = 0

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index]
            }
            return alphabet[Math.floor(Math.random() * alphabet.length)]
          })
          .join(""),
      )

      if (iteration >= text.length) {
        clearInterval(interval)
        setIsAnimating(false)
      }

      iteration += 1 / 3
    }, 30)

    return () => clearInterval(interval)
  }, [text, animateOnLoad, alphabet])

  return (
    <span className={cn("font-mono tracking-wide", className)}>
      {displayText}
    </span>
  )
}
