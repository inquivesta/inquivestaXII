import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

// Custom font definitions
const futuraDisplay = localFont({
  src: '../public/fonts/Futura Display.ttf',
  variable: '--font-futura',
  display: 'swap',
})

const dePixelHalbfett = localFont({
  src: '../public/fonts/DePixelHalbfett.ttf',
  variable: '--font-depixel-body',
  display: 'swap',
})

const dePixelBreit = localFont({
  src: '../public/fonts/DePixelBreit.ttf',
  variable: '--font-depixel-small',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Inquivesta XII',
  description: "Inquivesta XII! IISER Kolkata's annual socio-cultural fest.",
  generator: 'Manish Behera!!!',
  icons: {
    icon: '/ball.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${futuraDisplay.variable} ${dePixelHalbfett.variable} ${dePixelBreit.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
