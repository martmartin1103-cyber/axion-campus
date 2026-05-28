/**
 * Branche : feat/us1-us4-landing
 * Remplace : src/app/layout.tsx
 *
 * Changements :
 * - Ajout de la police Syne (display/titres) via next/font/google
 * - DM Sans conservé pour le corps
 * - Variable CSS --font-syne exposée pour usage dans les composants
 */

import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import { Syne } from 'next/font/google'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar'

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Axion Campus — Certification IA Agentique',
  description: 'Évaluez votre maturité en IA agentique en 3 minutes. Score sur 1000, grade A–D, certificat PDF partageable sur LinkedIn. Plateforme de certification IA pour établissements d\'enseignement supérieur.',
  keywords: ['certification IA', 'IA agentique', 'maturité IA', 'certification école', 'LLM formation'],
  openGraph: {
    title: 'Axion Campus — Certification IA Agentique',
    description: '3 minutes · 5 dimensions IA · Certificat reconnu par votre école.',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Axion Campus — Certification IA Agentique',
    description: '3 minutes · Score /1000 · Grade A–D · LinkedIn share',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${syne.variable} ${dmSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-slate-50"
        style={{ fontFamily: 'var(--font-dm-sans), "DM Sans", sans-serif' }}
      >
        <Navbar/>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  )
}
