'use client'

/**
 * Branche : feat/us5-us8-medium
 * Remplace : src/app/page.tsx  (version issue de la branche feat/us1-us4-landing)
 *
 * Seul changement vs version US1-US4 :
 * - Import de LearningOutcomes (US8)
 * - Insertion entre CurriculumSection et SocialProof
 *
 * Le reste du fichier est identique à la version précédente.
 * Si vous mergez les branches dans l'ordre, seul le diff ci-dessous s'applique.
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CurriculumSection from '@/components/CurriculumSection'
import LearningOutcomes  from '@/components/LearningOutcomes'   /* ← US8 */
import SocialProof       from '@/components/SocialProof'

/* ── Données hero ── */
const BULLETS = [
  { icon: '⚡', text: '10 questions · 3 minutes chrono' },
  { icon: '🎯', text: '5 dimensions IA évaluées simultanément' },
  { icon: '📜', text: 'Certificat PDF + partage LinkedIn instantané' },
]

function HexGrid() {
  const coords = [
    [220, 60], [270, 100], [270, 40], [170, 100], [220, 140],
    [170, 20], [320, 80], [170, 160], [270, 160],
  ]
  return (
    <svg className="absolute right-0 top-0 opacity-[0.06] pointer-events-none" width="380" height="220" viewBox="0 0 380 220">
      {coords.map(([cx, cy], i) => (
        <polygon key={i}
          points={`${cx},${cy-32} ${cx+28},${cy-16} ${cx+28},${cy+16} ${cx},${cy+32} ${cx-28},${cy+16} ${cx-28},${cy-16}`}
          fill="none" stroke="#7DD3FC"
          strokeWidth={i % 3 === 0 ? '1.5' : '0.8'}
          strokeOpacity={i % 2 === 0 ? '1' : '0.5'}
        />
      ))}
    </svg>
  )
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-black text-white leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>{value}</span>
      <span className="text-[11px] text-slate-500 mt-0.5 whitespace-nowrap">{label}</span>
    </div>
  )
}

export default function LandingPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const session = localStorage.getItem('axion_session')
    if (session) {
      try {
        const s = JSON.parse(session)
        if (s.passe_id) { router.replace('/diagnostic'); return }
      } catch {}
    }
  }, [router])

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ background: '#060f1e' }}>

      {/* ════════ HERO ════════ */}
      <section className="relative min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-5 pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none grid-bg"/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] rounded-full bg-[#0A66C2] opacity-[0.07] blur-[140px] pointer-events-none"/>
        <div className="absolute right-0 top-8 hidden lg:block"><HexGrid/></div>

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-[#0A66C2]/10 border border-[#0A66C2]/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] animate-pulse"/>
            <span className="text-xs text-[#7DD3FC] font-semibold tracking-widest uppercase">Certification IA Agentique · AXION Campus</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.02] mb-6 tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Certifiez votre{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A66C2] via-[#38BDF8] to-[#7DD3FC]">maturité IA</span>
              <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-[#0A66C2] to-[#7DD3FC] opacity-60"/>
            </span>
          </h1>

          <p className="text-slate-300 text-xl sm:text-2xl max-w-2xl leading-relaxed mb-10">
            3 minutes. Un score sur 1000. Un certificat reconnu par votre école.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-10">
            {BULLETS.map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                <span className="text-base">{b.icon}</span>{b.text}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <button onClick={() => router.push('/inscription')}
              className="group relative bg-[#0A66C2] hover:bg-[#0958a8] text-white font-bold px-8 py-4 rounded-2xl text-base transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#0A66C2]/30 flex items-center gap-2">
              Obtenir ma certification
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button onClick={() => document.getElementById('programme')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-slate-400 hover:text-white font-medium px-6 py-4 rounded-2xl border border-white/[0.1] hover:border-white/[0.25] transition-colors text-base flex items-center gap-2">
              Voir le programme
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60"><path d="M6 9l6 6 6-6"/></svg>
            </button>
          </div>

          <div className="flex items-center gap-8 sm:gap-12">
            <HeroStat value="5" label="dimensions IA"/>
            <div className="w-px h-8 bg-white/10"/>
            <HeroStat value="10" label="questions ciblées"/>
            <div className="w-px h-8 bg-white/10"/>
            <HeroStat value="1 000" label="points max"/>
            <div className="w-px h-8 bg-white/10 hidden sm:block"/>
            <div className="hidden sm:flex flex-col items-center">
              <div className="flex -space-x-2 mb-1">
                {['#0A66C2','#38BDF8','#818CF8','#34D399'].map((c, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-[#060f1e]" style={{ backgroundColor: c }}/>
                ))}
              </div>
              <span className="text-[11px] text-slate-500">247+ certifiés</span>
            </div>
          </div>
        </div>

        <button onClick={() => document.getElementById('programme')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600 hover:text-slate-400 transition-colors animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </button>
      </section>

      {/* ════════ CARTES ACTION ════════ */}
      <section className="px-5 py-12 max-w-3xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={() => router.push('/connexion')}
            className="group relative bg-[#0A66C2] hover:bg-[#0958a8] rounded-2xl p-7 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#0A66C2]/30">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12 12 0 01.665 6.479A12 12 0 0112 20.055a12 12 0 01-6.824-2.998 12 12 0 01.665-6.479L12 14z"/></svg>
            </div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Je suis étudiant</p>
            <h3 className="text-white text-lg font-bold mb-1.5">Passer le diagnostic</h3>
            <p className="text-white/60 text-sm leading-relaxed">Entrez votre code d'accès fourni par votre école.</p>
            <div className="absolute bottom-5 right-5 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </button>

          <button onClick={() => router.push('/admin')}
            className="group relative bg-[#0d1b2e] hover:bg-[#111f33] border border-slate-700 hover:border-[#0A66C2]/50 rounded-2xl p-7 text-left transition-all duration-300 hover:scale-[1.02]">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7DD3FC" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
            </div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Je suis administrateur</p>
            <h3 className="text-white text-lg font-bold mb-1.5">Accéder au dashboard</h3>
            <p className="text-slate-400 text-sm leading-relaxed">KPIs, résultats et satisfaction de votre promo.</p>
            <div className="absolute bottom-5 right-5 w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7DD3FC" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </button>
        </div>
      </section>

      {/* ════════ US3 — Programme ════════ */}
      <CurriculumSection/>

      {/* ════════ US8 — Learning Outcomes ════════ */}
      <LearningOutcomes/>

      {/* ════════ US4 — Social Proof ════════ */}
      <SocialProof/>

      {/* Lien tarifs */}
      <section className="py-8 text-center">
        <button onClick={() => router.push('/tarifs')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm mx-auto">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          Voir nos offres et tarifs pour établissements
        </button>
      </section>

      <footer className="text-center py-5 text-xs text-slate-600 border-t border-white/[0.04]">
        Certification privée AXION CAMPUS™ — Non reconnue par l'État
      </footer>
    </div>
  )
}
