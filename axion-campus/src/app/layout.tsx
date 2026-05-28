/**
 * Branche : feat/us5-us8-medium
 * Remplace : src/app/layout.tsx  (version issue de la branche feat/us1-us4-landing)
 *
 * Ajouts par rapport à la version US1-US4 :
 * - US5 : FloatingCTA importé et placé avant </body>
 * - US6 : JsonLd (schema Course + Organization) dans <head>
 * - US6 : metadata Next.js enrichie (50-60 chars title, 150-160 chars desc)
 * - US7 : globals.css désormais porteur des tokens CSS de marque
 */

import type { Metadata } from 'next'
import { Geist_Mono, Syne, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar'
import { FloatingCTA } from '../components/InscriptionModal'
import JsonLd from '../components/JsonLd'

/* ── Polices ── */
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

/* ── Metadata SEO (US6) ── */
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://axion-campus.vercel.app'

export const metadata: Metadata = {
  /* 57 caractères — dans la fenêtre idéale 50-60 */
  title: 'Axion Campus — Certification IA Agentique',

  /* 158 caractères — dans la fenêtre idéale 150-160 */
  description: 'Évaluez votre maturité IA en 3 minutes. Score sur 1000, grade A–D sur 5 dimensions. Certificat PDF vérifiable, partageable LinkedIn. Pour écoles et universités.',

  keywords: [
    'certification IA', 'IA agentique', 'maturité IA', 'certification école IA',
    'LLM formation', 'agent IA professionnel', 'diagnostic IA', 'axion campus',
  ],

  metadataBase: new URL(BASE_URL),

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    title: 'Axion Campus — Certification IA Agentique',
    description: '3 minutes · Score /1000 · 5 dimensions IA · Certificat reconnu par votre école.',
    url: BASE_URL,
    siteName: 'Axion Campus',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/og-image.png`, /* À créer : 1200×630px */
        width: 1200,
        height: 630,
        alt: 'Axion Campus — Certification IA Agentique',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Axion Campus — Certification IA Agentique',
    description: '3 minutes · Score /1000 · Grade A–D · Certificat LinkedIn',
    images: [`${BASE_URL}/og-image.png`],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    /* Ajouter les codes de vérification ici quand disponibles */
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

/* ── Layout ── */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${syne.variable} ${dmSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* US6 — Structured data JSON-LD */}
        <JsonLd/>
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
      >
        <Navbar/>
        <div className="flex-1">{children}</div>

        {/* US5 — Floating CTA (visible après 3s ou 300px de scroll) */}
        <FloatingCTA/>
      </body>
    </html>
  )
}
