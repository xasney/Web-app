import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'DevCloud - Cloud Development Platform',
  description: 'Collaborate on code, manage files, and host VMs in one place',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
