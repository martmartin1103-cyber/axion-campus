'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const session = localStorage.getItem('axion_session')
    if (session) {
      try { const s = JSON.parse(session); if (s.passe_id) { router.replace('/diagnostic'); return } } catch {}
    }
  }, [router])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#060f1e] flex flex-col overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:`linear-gradient(#4a90d9 1px,transparent 1px),linear-gradient(90deg,#4a90d9 1px,transparent 1px)`,backgroundSize:'48px 48px'}}/>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-[#0A66C2] opacity-[0.07] blur-[120px] pointer-events-none"/>

      {/* Navbar avec lien Tarifs */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0A66C2] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 1V13M1 4L13 10M13 4L1 10" stroke="white" strokeWidth="1" strokeOpacity="0.4"/></svg>
          </div>
          <span className="text-white font-bold text-sm tracking-tight">AXION CAMPUS™</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => router.push('/tarifs')}
            className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-2">
            Tarifs
          </button>
          <button onClick={() => router.push('/admin')}
            className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg px-4 py-2 transition-all duration-200">
            Espace admin →
          </button>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center pb-20">
        <div className="inline-flex items-center gap-2 bg-[#0A66C2]/10 border border-[#0A66C2]/30 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] animate-pulse"/>
          <span className="text-xs text-[#7DD3FC] font-medium tracking-wide">Certification IA Agentique — Axion Campus</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.05] mb-6 max-w-3xl">
          Évaluez votre{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A66C2] to-[#7DD3FC]">
            maturité IA
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl leading-relaxed mb-14">
          10 questions. 5 dimensions. Un score sur 1000 et un certificat reconnu par votre école.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
          <button onClick={() => router.push('/connexion')}
            className="group relative bg-[#0A66C2] hover:bg-[#0958a8] rounded-2xl p-8 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#0A66C2]/30">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
            </div>
            <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-2">Je suis étudiant</p>
            <h2 className="text-white text-xl font-bold mb-2">Passer le diagnostic</h2>
            <p className="text-white/60 text-sm leading-relaxed">Entrez votre code d'accès fourni par votre école.</p>
            <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </button>

          <button onClick={() => router.push('/admin')}
            className="group relative bg-[#0d1b2e] hover:bg-[#111f33] border border-slate-700 hover:border-[#0A66C2]/50 rounded-2xl p-8 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/30">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7DD3FC" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
            </div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-2">Je suis administrateur</p>
            <h2 className="text-white text-xl font-bold mb-2">Accéder au dashboard</h2>
            <p className="text-slate-400 text-sm leading-relaxed">Visualisez les KPIs et résultats de votre promotion.</p>
            <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7DD3FC" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </button>
        </div>

        {/* Lien vers les tarifs */}
        <button onClick={() => router.push('/tarifs')}
          className="mt-10 flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          Voir nos offres et tarifs pour établissements
        </button>

        <div className="flex items-center gap-8 mt-10 text-slate-500">
          {[{n:'5',label:'dimensions'},{n:'10',label:'questions'},{n:'1000',label:'points max'}].map(item=>(
            <div key={item.label} className="text-center">
              <p className="text-2xl font-black text-white">{item.n}</p>
              <p className="text-xs mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 text-center py-4 text-xs text-slate-600">
        Certification privée AXION CAMPUS™ — Non reconnue par l'État
      </footer>
    </div>
  )
}
