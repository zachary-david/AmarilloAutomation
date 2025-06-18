
import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Amarillo Automation',
  description: 'Amarillo Automation provides simplified and programmable productivity for SMBs using smart platforms and accessible automation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
          strategy="beforeInteractive"
        />
        <Script 
          src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-[#0a1224] font-inter relative overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}