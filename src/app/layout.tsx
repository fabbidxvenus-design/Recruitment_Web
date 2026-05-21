import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fabbi Careers',
  description: 'Fabbi recruitment website'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
