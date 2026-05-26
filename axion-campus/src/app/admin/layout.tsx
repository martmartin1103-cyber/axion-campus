'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const ADMIN_KEY   = 'EFREI-ADMIN-2026'
const ECOLE_ID    = ''

type EcoleInfo = {
  nom: string
  couleur_principale: string
  logo_url?: string
  banniere_url?: string
}

const NAV_ITEMS = [
  { href: '/admin',            icon: 'grid',    label: 'Dashboard' },
  { href: '/admin/profil',     icon: 'building', label: 'Mon établissement' },
  { href: '/admin/contrat',    icon: 'file',    label: 'Contrat & offre' },
  { href: '/admin/paiement',   icon: 'credit',  label: 'Paiement & facturation' },
]

function NavIcon({ type, active }: { type: string; active: boolean }) {
  const color = active ? 'currentColor' : '#94a3b8'
  const w = 18
  if (type === 'grid')     return <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
  if (type === 'building') return <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="1"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
  if (type === 'file')     return <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  if (type === 'credit')   return <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
  return null
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [authed, setAuthed]     = useState<boolean | null>(null)
  const [ecole, setEcole]       = useState<EcoleInfo | null>(null)
  const [sideOpen, setSideOpen] = useState(true)
  const [input, setInput]       = useState('')
  const [loginErr, setLoginErr] = useState(false)
  const [shake, setShake]       = useState(false)

  useEffect(() => {
    setAuthed(localStorage.getItem('admin_key') === ADMIN_KEY)
  }, [])

  useEffect(() => {
    if (!authed) return
    // Charger les infos école
    fetch(`/api/admin/ecole${ECOLE_ID ? `?ecole_id=${ECOLE_ID}` : ''}`)
      .then(r => r.json())
      .then(d => { if (d.nom) setEcole(d) })
      .catch(() => {})
  }, [authed])

  const logout = () => {
    localStorage.removeItem('admin_key')
    setAuthed(false)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === ADMIN_KEY) {
      localStorage.setItem('admin_key', ADMIN_KEY)
      setAuthed(true)
    } else {
      setLoginErr(true); setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  if (authed === null) return null

  // ── Écran login ──────────────────────────────────────────────────────────────
  if (!authed) return (
    <div className="min-h-screen bg-[#f0f4fa] flex items-center justify-center px-4">
      <div className={`bg-white rounded-3xl shadow-xl border border-slate-200 p-10 w-full max-w-sm ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}>
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#1a3c6e] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-sm font-bold text-[#1a3c6e]">AXION CAMPUS</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Administration</h1>
        <p className="text-sm text-slate-400 mb-8">Accès réservé aux responsables pédagogiques.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Clé d'accès</label>
            <input type="password" value={input} onChange={e=>{setInput(e.target.value);setLoginErr(false)}} placeholder="••••••••••••••" autoFocus
              className={`w-full border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 transition-all ${loginErr ? 'border-red-300 focus:ring-red-200 bg-red-50' : 'border-slate-200 focus:ring-blue-100'}`}/>
            {loginErr && <p className="text-xs text-red-500 mt-1.5">Clé incorrecte.</p>}
          </div>
          <button type="submit" className="w-full bg-[#1a3c6e] hover:bg-[#15305a] text-white py-3 rounded-xl text-sm font-semibold transition-colors">
            Accéder au dashboard →
          </button>
        </form>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`}</style>
    </div>
  )

  const couleur = ecole?.couleur_principale || '#1a3c6e'

  // ── Layout admin authentifié ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f0f4fa] flex">

      {/* Sidebar */}
      <aside className={`${sideOpen ? 'w-56' : 'w-16'} shrink-0 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen transition-all duration-300 z-30`}>

        {/* Logo + toggle */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
          {sideOpen && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: couleur }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              </div>
              <span className="text-xs font-bold truncate" style={{ color: couleur }}>AXION CAMPUS</span>
            </div>
          )}
          <button onClick={() => setSideOpen(o => !o)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sideOpen ? <path d="M19 12H5M12 5l-7 7 7 7"/> : <path d="M5 12h14M12 5l7 7-7 7"/>}
            </svg>
          </button>
        </div>

        {/* École nom */}
        {sideOpen && ecole && (
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Établissement</p>
            <p className="text-xs font-bold text-slate-800 truncate">{ecole.nom}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href
            return (
              <button key={item.href} onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left ${active ? 'text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                style={active ? { backgroundColor: couleur } : {}}>
                <span className="shrink-0"><NavIcon type={item.icon} active={active}/></span>
                {sideOpen && <span className="text-xs font-semibold truncate">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Déconnexion */}
        <div className="px-2 py-3 border-t border-slate-100">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            {sideOpen && <span className="text-xs font-semibold">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              {NAV_ITEMS.find(n => n.href === pathname)?.label || 'Administration'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: couleur }}>
              {ecole?.nom?.charAt(0) || 'A'}
            </div>
            {ecole && <span className="text-xs text-slate-500 hidden sm:block">{ecole.nom}</span>}
          </div>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
