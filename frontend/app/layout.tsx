import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MLMS - Mall Leasing Management System',
  description: 'Mall Leasing Management System - Philippines Edition',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
