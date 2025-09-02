import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Inquivesta XII',
    short_name: 'Inquivesta XII',
    description: "Inquivesta XII! IISER Kolkata's annual socio-cultural fest.",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/ball_a.jpg',
        sizes: 'any',
        type: 'image/jpeg',
      },
    ],
  }
}