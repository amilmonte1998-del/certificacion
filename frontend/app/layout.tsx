import type { Metadata } from 'next'
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
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
