"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Download, Smartphone } from 'lucide-react'
import { useInstallPWA } from '@/hooks/useInstallPWA'

export function InstallBanner() {
  const { installApp, canInstall, isInstalled } = useInstallPWA()
  const [showBanner, setShowBanner] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  useEffect(() => {
    // Check if user has already dismissed the banner
    const dismissed = localStorage.getItem('install-banner-dismissed')
    if (dismissed) {
      setBannerDismissed(true)
      return
    }

    // Show banner after a short delay if installable and not installed
    const timer = setTimeout(() => {
      if (canInstall && !isInstalled && !bannerDismissed) {
        setShowBanner(true)
      }
    }, 3000) // Show after 3 seconds

    return () => clearTimeout(timer)
  }, [canInstall, isInstalled, bannerDismissed])

  const handleInstall = async () => {
    const success = await installApp()
    if (success) {
      setShowBanner(false)
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
    setBannerDismissed(true)
    localStorage.setItem('install-banner-dismissed', 'true')
  }

  if (!showBanner || !canInstall || isInstalled) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-gradient-to-r from-[#2A2A2A] to-[#3A3A3A] border border-[#D2B997] rounded-lg p-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] p-2 rounded-lg">
              <Smartphone className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm font-depixel-body">Install Inquivesta XII</h3>
              <p className="text-[#D2B997] text-xs font-depixel-small">Get the app for offline access!</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-[#D2B997] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={handleInstall}
            className="flex-1 bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] hover:from-[#7FB3D3] hover:to-[#9A8BC7] text-[#1A1A1A] text-xs font-depixel-small"
          >
            <Download className="w-4 h-4 mr-1" />
            Install
          </Button>
          <Button
            onClick={handleDismiss}
            variant="outline"
            className="border-[#D2B997] text-[#D2B997] hover:bg-[#D2B997]/10 text-xs font-depixel-small bg-transparent"
          >
            Not Now
          </Button>
        </div>
      </div>
    </div>
  )
}
