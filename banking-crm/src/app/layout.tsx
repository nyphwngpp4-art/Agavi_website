import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import './globals.css'

export const metadata: Metadata = {
  title: 'Banking Prospect CRM',
  description: 'Corporate banking prospect management and outreach tracking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Sidebar />
        <div className="pl-56 transition-all duration-200">
          <Header />
          <main className="min-h-[calc(100vh-3.5rem)] p-6">
            {children}
          </main>
        </div>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1A1A1A',
              border: '1px solid #2A2A2A',
              color: '#EDEDED',
            },
          }}
        />
      </body>
    </html>
  )
}
