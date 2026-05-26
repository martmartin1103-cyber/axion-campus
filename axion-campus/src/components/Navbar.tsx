'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

type SessionInfo = {
  nom_etudiant: string
  ecole_nom: string
  promo?: string
}

const HIDE_SESSION_PATHS = ['/', '/admin', '/connexion']

export default function Navbar() {
  const pathname  = usePathname()
  const router    = useRouter()
  const [session, setSession] = useState<SessionInfo | null>(null)
  const [open, setOpen]       = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (HIDE_SESSION_PATHS.includes(pathname)) { setSession(null); return }
    try {
      const raw = localStorage.getItem('axion_session')
      if (raw) {
        const parsed = JSON.parse(raw)
        setSession({ nom_etudiant: parsed.nom_etudiant ?? '', ecole_nom: parsed.ecole_nom ?? '', promo: parsed.promo ?? '' })
      }
    } catch { /* pas de session */ }
  }, [pathname])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const disconnect = () => {
    localStorage.removeItem('axion_session')
    setOpen(false)
    router.push('/')
  }

  const initials = session?.nom_etudiant
    ? session.nom_etudiant.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  if (HIDE_SESSION_PATHS.includes(pathname)) return null

  return (
    <nav className="w-full h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50">
      <button onClick={() => router.push('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span className="w-7 h-7 rounded-lg bg-[#1a3c6e] flex items-center justify-center">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className="text-sm font-bold text-[#1a3c6e] tracking-tight">AXION CAMPUS</span>
      </button>

      {session?.nom_etudiant ? (
        <div className="relative" ref={menuRef}>
          <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2.5 hover:bg-slate-50 rounded-xl px-3 py-1.5 transition-colors">
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 rounded-full px-2.5 py-1">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="text-slate-400">
                <path d="M6 1L11 3.5V6C11 8.76 8.76 11 6 11C3.24 11 1 8.76 1 6V3.5L6 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs font-medium text-slate-600">{session.ecole_nom}</span>
              {session.promo && <span className="text-xs text-slate-400">· {session.promo}</span>}
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1a3c6e] flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">{initials}</span>
            </div>
            <span className="text-sm font-medium text-slate-700 hidden sm:block max-w-[140px] truncate">{session.nom_etudiant}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1a3c6e] flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-white">{initials}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{session.nom_etudiant}</p>
                    <p className="text-xs text-slate-400 truncate">{session.ecole_nom}</p>
                  </div>
                </div>
              </div>

              <div className="py-1.5">
                <MenuBtn icon="user" label="Mon profil" sub={session.promo || 'Etudiant'} onClick={() => setOpen(false)}/>
                <MenuBtn icon="clipboard" label="Mes certifications" sub="Historique des tests" onClick={() => setOpen(false)}/>
                <MenuBtn icon="school" label="Etablissement" sub={session.ecole_nom} onClick={() => setOpen(false)}/>
              </div>

              <div className="border-t border-slate-100 py-1.5">
                <button onClick={disconnect} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 transition-colors group">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400 group-hover:text-red-500">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-500">Se deconnecter</p>
                    <p className="text-xs text-slate-400">Retour a l accueil</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : <div />}
    </nav>
  )
}

function MenuBtn({ icon, label, sub, onClick }: { icon: string; label: string; sub: string; onClick: () => void }) {
  const icons: Record<string, React.ReactNode> = {
    user: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/></svg>,
    clipboard: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
    school: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12 12 0 01.665 6.479A12 12 0 0112 20.055a12 12 0 01-6.824-2.998 12 12 0 01.665-6.479L12 14z"/></svg>,
  }
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors group">
      <span className="text-slate-400 group-hover:text-[#1a3c6e] transition-colors">{icons[icon]}</span>
      <div>
        <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{label}</p>
        <p className="text-xs text-slate-400">{sub}</p>
      </div>
    </button>
  )
}
