import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Inquivesta XII - IISER Kolkata',
    short_name: 'Inquivesta XII',
    description: "Inquivesta XII! IISER Kolkata's annual socio-cultural fest. BE LIMITLESS. BE INQUISITIVE.",
    start_url: '/',
    display: 'standalone',
    background_color: '#1A1A1A',
    theme_color: '#D2B997',
    orientation: 'portrait',
    scope: '/',
    lang: 'en',
    categories: ['education', 'entertainment', 'events'],
    icons: [
      {
        src: '/ball.jpg',
        sizes: 'any',
        type: 'image/jpeg',
        purpose: 'maskable'
      },
      {
        src: '/ball_a.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/ball_a.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/logo.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    screenshots: [
      {
        src: '/images/about-us-image.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Inquivesta XII - Science Festival'
      }
    ]
  }
}
