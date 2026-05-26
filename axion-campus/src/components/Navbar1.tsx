'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type SessionInfo = {
  nom_etudiant: string
  ecole_nom: string
  promo?: string
}

export default function Navbar() {
  const pathname = usePathname()
  const [session, setSession] = useState<SessionInfo | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('axion_session')
      if (raw) {
        const parsed = JSON.parse(raw)
        setSession({
          nom_etudiant: parsed.nom_etudiant ?? '',
          ecole_nom: parsed.ecole_nom ?? '',
          promo: parsed.promo ?? '',
        })
      }
    } catch {
      // pas de session stockée
    }
  }, [pathname])

  // Initiales pour l'avatar
  const initials = session?.nom_etudiant
    ? session.nom_etudiant
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  return (
    <nav className="w-full h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Logo / marque */}
      <div className="flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg bg-[#1a3c6e] flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M7 1V13M1 4L13 10M13 4L1 10" stroke="white" strokeWidth="1" strokeOpacity="0.5"/>
          </svg>
        </span>
        <span className="text-sm font-semibold text-[#1a3c6e] tracking-tight">
          AXION CAMPUS
        </span>
      </div>

      {/* Infos session */}
      {session && session.nom_etudiant ? (
        <div className="flex items-center gap-3">
          {/* Badge école */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-slate-400">
              <path d="M6 1L11 3.5V6C11 8.76 8.76 11 6 11C3.24 11 1 8.76 1 6V3.5L6 1Z"
                stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium text-slate-600">
              {session.ecole_nom}
            </span>
            {session.promo && (
              <span className="text-xs text-slate-400">
                · {session.promo}
              </span>
            )}
          </div>

          {/* Avatar + nom */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1a3c6e] flex items-center justify-center">
              <span className="text-xs font-semibold text-white">
                {initials}
              </span>
            </div>
            <span className="text-sm font-medium text-slate-700 hidden sm:block">
              {session.nom_etudiant}
            </span>
          </div>
        </div>
      ) : (
        // Pas de session = page d'accueil, rien à afficher à droite
        <div />
      )}
    </nav>
  )
}
