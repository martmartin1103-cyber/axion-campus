'use client'

/**
 * US2 — Navbar responsive mobile
 * Branche : feat/us1-us4-landing
 * Remplace : src/components/Navbar.tsx
 *
 * Changements vs version précédente :
 * - Menu hamburger animé (3 barres → ×) sur mobile
 * - Drawer slide-in depuis le haut (mobile)
 * - Liens de navigation : Accueil | Programme | Certification | Tarifs | Admin
 * - Cibles tactiles ≥ 44px (accessibilité)
 * - Sticky avec backdrop-blur progressif au scroll
 * - Session étudiant : badge école + avatar + dropdown inchangés
 * - Police Syne pour le logo (cohérent avec page.tsx mis à jour)
 */

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

type SessionInfo = { nom_etudiant: string; ecole_nom: string; promo?: string }

const NO_NAV_PATHS = ['/tarifs']
const AUTH_PATHS   = ['/connexion', '/inscription', '/reconnexion']

const NAV_LINKS = [
  { label: 'Accueil',        href: '/' },
  { label: 'Programme',      href: '/#programme' },
  { label: 'Certification',  href: '/#certification' },
  { label: 'Tarifs',         href: '/tarifs' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router   = useRouter()

  const [session,    setSession]    = useState<SessionInfo | null>(null)
  const [dropOpen,   setDropOpen]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const menuRef  = useRef<HTMLDivElement>(null)
  const dropRef  = useRef<HTMLDivElement>(null)

  /* ── session ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem('axion_session')
      if (raw) {
        const p = JSON.parse(raw)
        if (p.nom_etudiant) setSession({ nom_etudiant: p.nom_etudiant, ecole_nom: p.ecole_nom ?? '', promo: p.promo })
        else setSession(null)
      } else setSession(null)
    } catch { setSession(null) }
  }, [pathname])

  /* ── fermer drawer/drop au clic extérieur ── */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
      if (dropRef.current  && !dropRef.current.contains(e.target as Node))  setDropOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  /* ── scroll detection ── */
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  /* ── fermer drawer au changement de route ── */
  useEffect(() => { setMenuOpen(false); setDropOpen(false) }, [pathname])

  const disconnect = () => {
    localStorage.removeItem('axion_session')
    localStorage.removeItem('axion_pending_answers')
    localStorage.removeItem('axion_chrono_start')
    localStorage.removeItem('axion_chrono_duree')
    setDropOpen(false)
    router.push('/')
  }

  const initials = session?.nom_etudiant
    ? session.nom_etudiant.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  /* ── pages sans navbar globale ── */
  if (NO_NAV_PATHS.some(p => pathname.startsWith(p))) return null
  if (pathname.startsWith('/admin')) return null

  const isAuthPage = AUTH_PATHS.includes(pathname)

  return (
    <>
      {/* ══════════════ BARRE PRINCIPALE ══════════════ */}
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 h-14
          transition-all duration-300
          ${scrolled
            ? 'bg-[#060f1e]/90 backdrop-blur-md border-b border-white/[0.06] shadow-lg shadow-black/30'
            : 'bg-transparent'}
        `}
      >
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-5 md:px-8">

          {/* Logo */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2.5 min-h-[44px] hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0A66C2] flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M7 1V13M1 4L13 10M13 4L1 10" stroke="white" strokeWidth="1" strokeOpacity="0.4"/>
              </svg>
            </div>
            <span
              className="text-white font-bold text-sm tracking-tight"
              style={{ fontFamily: "'Syne', 'DM Sans', sans-serif" }}
            >
              AXION CAMPUS™
            </span>
          </button>

          {/* ── DESKTOP : liens + CTA ── */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px]
                    ${pathname === link.href
                      ? 'text-white bg-white/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'}
                  `}
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}

          {/* ── DESKTOP droite : session OU CTA ── */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthPage ? (
              <button onClick={() => router.push('/')} className="text-xs text-slate-400 hover:text-white transition-colors min-h-[44px] px-3">
                Accueil →
              </button>
            ) : session?.nom_etudiant ? (
              /* dropdown session */
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen(o => !o)}
                  className="flex items-center gap-2.5 hover:bg-white/[0.06] rounded-xl px-3 py-2 transition-colors min-h-[44px]"
                >
                  <div className="hidden sm:flex items-center gap-1.5 bg-white/[0.08] rounded-full px-2.5 py-1">
                    <span className="text-xs font-medium text-slate-300 truncate max-w-[100px]">{session.ecole_nom}</span>
                    {session.promo && <span className="text-[10px] text-slate-500">· {session.promo}</span>}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-white">{initials}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-300 hidden sm:block max-w-[120px] truncate">{session.nom_etudiant}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`text-slate-500 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#0d1b2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-[fadeSlideDown_0.15s_ease]">
                    <div className="px-4 py-4 border-b border-white/[0.07] bg-white/[0.03]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-white">{initials}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{session.nom_etudiant}</p>
                          <p className="text-xs text-slate-400 truncate">{session.ecole_nom}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1.5">
                      {[
                        { icon: 'cert', label: 'Mes certifications', sub: 'Historique des tests' },
                        { icon: 'school', label: 'Établissement',    sub: session.ecole_nom },
                      ].map(item => (
                        <button key={item.label} onClick={() => setDropOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.05] transition-colors group min-h-[44px]">
                          <span className="text-slate-500 group-hover:text-[#7DD3FC] transition-colors">
                            {item.icon === 'cert'   && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}
                            {item.icon === 'school' && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 14l9-5-9-5-9 5 9 5z"/></svg>}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-slate-300 group-hover:text-white text-left">{item.label}</p>
                            <p className="text-xs text-slate-500 text-left">{item.sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-white/[0.07] py-1.5">
                      <button onClick={disconnect}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors group min-h-[44px]">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400/60 group-hover:text-red-400">
                          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                        </svg>
                        <p className="text-sm font-medium text-red-400/70 group-hover:text-red-400 text-left">Se déconnecter</p>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* CTA visiteur */
              <button onClick={() => router.push('/connexion')}
                className="bg-[#0A66C2] hover:bg-[#0958a8] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors min-h-[44px]">
                Passer le test →
              </button>
            )}
          </div>

          {/* ── MOBILE : hamburger ── */}
          <div className="flex md:hidden items-center gap-3" ref={menuRef}>
            {session?.nom_etudiant && (
              <div className="w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white">{initials}</span>
              </div>
            )}
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="flex flex-col justify-center items-center w-11 h-11 gap-[5px] rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <span className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-300 origin-center
                ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}/>
              <span className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-300
                ${menuOpen ? 'opacity-0 scale-x-0' : ''}`}/>
              <span className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-300 origin-center
                ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}/>
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════ DRAWER MOBILE ══════════════ */}
      <div className={`
        fixed inset-x-0 top-14 z-40 md:hidden
        bg-[#060f1e]/95 backdrop-blur-xl border-b border-white/[0.07]
        transition-all duration-300 ease-in-out overflow-hidden
        ${menuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="px-5 py-4 space-y-1">
          {NAV_LINKS.map(link => (
            <button
              key={link.href}
              onClick={() => router.push(link.href)}
              className={`
                w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-left
                transition-colors min-h-[44px]
                ${pathname === link.href
                  ? 'bg-[#0A66C2]/20 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'}
              `}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-white/[0.07]">
            {session?.nom_etudiant ? (
              <>
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-white">{session.nom_etudiant}</p>
                  <p className="text-xs text-slate-400">{session.ecole_nom}</p>
                </div>
                <button onClick={disconnect}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors min-h-[44px]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                  Se déconnecter
                </button>
              </>
            ) : (
              <button onClick={() => router.push('/connexion')}
                className="w-full bg-[#0A66C2] hover:bg-[#0958a8] text-white text-sm font-semibold px-4 py-3 rounded-xl transition-colors min-h-[44px]">
                Passer le test →
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
