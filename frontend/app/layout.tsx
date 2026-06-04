import type { Metadata } from 'next'
<<<<<<< HEAD
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Certiva - Consulta de Certificados',
  description: 'Consulta y descarga certificados por numero de documento',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/logo.jpg',
        type: 'image/jpeg',
      },
    ],
    apple: '/logo.jpg',
=======
import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Certiva | Consulta de certificados',
  description: 'Consulta y descarga certificados digitales por numero de documento.',
  applicationName: 'Certiva',
  icons: {
    icon: [
      {
        url: '/icon.png',
        type: 'image/jpeg',
      },
    ],
    apple: '/brand/logo.png',
>>>>>>> 48f20a8978bd39c67f533567afe29fd0f5f071c7
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className={`${geist.className} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
