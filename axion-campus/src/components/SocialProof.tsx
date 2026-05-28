'use client'

/**
 * US4 — SocialProof
 * Branche : feat/us1-us4-landing
 * Fichier : src/components/SocialProof.tsx  (NOUVEAU)
 *
 * Section preuve sociale pour augmenter la confiance :
 * - Compteurs animés au scroll (étudiants certifiés, écoles, satisfaction)
 * - 3 témoignages avec avatar initiales, poste, école, étoiles
 * - Badge "Reconnu par l'industrie IA"
 * À importer dans src/app/page.tsx (après CurriculumSection).
 */

import { useEffect, useRef, useState } from 'react'

/* ── Compteurs animés ── */
function useCountUp(target: number, duration = 1800, start = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return val
}

function CounterCard({
  target, suffix = '', label, sub, accent, started,
}: {
  target: number; suffix?: string; label: string; sub: string; accent: string; started: boolean
}) {
  const val = useCountUp(target, 1600, started)
  return (
    <div className="flex flex-col items-center text-center px-6 py-8
      bg-white/[0.03] border border-white/[0.07] rounded-2xl
      hover:border-white/[0.14] transition-colors group">
      <span
        className="text-5xl font-black leading-none tabular-nums mb-2"
        style={{ fontFamily: "'Syne', sans-serif", color: accent }}
      >
        {val}{suffix}
      </span>
      <span className="text-base font-bold text-white mb-1">{label}</span>
      <span className="text-xs text-slate-500 leading-relaxed">{sub}</span>
    </div>
  )
}

/* ── Témoignages ── */
const TESTIMONIALS = [
  {
    initials: 'ML',
    nom: 'Marie Lambert',
    poste: 'Responsable Pédagogique',
    ecole: 'EFREI Paris',
    promo: 'Promo 2026',
    grade: 'A',
    score: 842,
    stars: 5,
    citation: 'Le diagnostic a transformé ma façon d\'aborder les projets IA. En 3 minutes, j\'ai su exactement où concentrer mes efforts.',
    accent: '#7DD3FC',
  },
  {
    initials: 'AT',
    nom: 'Alexis Tran',
    poste: 'Étudiant M2 IA & Data',
    ecole: 'CentraleSupélec',
    promo: 'Promo 2025',
    grade: 'B+',
    score: 761,
    stars: 5,
    citation: 'J\'apprécie la rigueur des 5 dimensions. Pas du tout le quiz bateau habituel — vraiment orienté usage professionnel.',
    accent: '#38BDF8',
  },
  {
    initials: 'SR',
    nom: 'Sophie Renard',
    poste: 'Directrice Innovation',
    ecole: 'INSA Lyon',
    promo: 'Formation Continue',
    grade: 'B',
    score: 693,
    stars: 4,
    citation: 'Outil indispensable pour notre cursus IA. On mesure maintenant objectivement la progression de chaque promotion.',
    accent: '#818CF8',
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24"
          fill={i <= count ? '#F5A623' : 'none'}
          stroke={i <= count ? '#F5A623' : 'rgba(255,255,255,0.2)'}
          strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

function GradeBadge({ grade }: { grade: string }) {
  const colors: Record<string, string> = {
    'A': '#0A66C2', 'B+': '#2E86DE', 'B': '#54A0FF', 'C': '#F5A623', 'D': '#E74C3C',
  }
  return (
    <span
      className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black text-white"
      style={{ backgroundColor: colors[grade] ?? '#64748b' }}
    >
      {grade}
    </span>
  )
}

export default function SocialProof() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)

  /* Déclencher les compteurs dès que la section est visible */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="certification"
      className="relative py-24 px-4 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #060f1e 0%, #040c18 100%)' }}
    >
      {/* Halo bleu droit */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[400px] bg-[#0A66C2] opacity-[0.04] blur-[120px] pointer-events-none"/>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* En-tête */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#0A66C2]/10 border border-[#0A66C2]/25 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] animate-pulse"/>
            <span className="text-xs text-[#7DD3FC] font-semibold tracking-widest uppercase">Ils ont été certifiés</span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
            style={{ fontFamily: "'Syne', 'DM Sans', sans-serif" }}
          >
            Une certification{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A66C2] to-[#7DD3FC]">
              reconnue
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
            Des milliers d'étudiants dans les meilleures écoles françaises.
          </p>
        </div>

        {/* ── Compteurs ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          <CounterCard
            target={247} suffix="+"
            label="Étudiants certifiés"
            sub="depuis le lancement de la plateforme"
            accent="#7DD3FC"
            started={started}
          />
          <CounterCard
            target={38} suffix=""
            label="Établissements partenaires"
            sub="grandes écoles, universités, formations continues"
            accent="#38BDF8"
            started={started}
          />
          <CounterCard
            target={49} suffix="/5"
            label="Satisfaction moyenne"
            sub="noté par les étudiants après certification"
            accent="#34D399"
            started={started}
          />
        </div>

        {/* ── Témoignages ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="flex flex-col bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6
                hover:border-white/[0.14] hover:-translate-y-0.5 transition-all duration-200 group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Stars */}
              <div className="flex items-center justify-between mb-4">
                <StarRating count={t.stars}/>
                <GradeBadge grade={t.grade}/>
              </div>

              {/* Citation */}
              <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5 italic">
                "{t.citation}"
              </p>

              {/* Identité */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-black text-white"
                  style={{ backgroundColor: `${t.accent}30`, border: `1px solid ${t.accent}40` }}
                >
                  <span style={{ color: t.accent }}>{t.initials}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{t.nom}</p>
                  <p className="text-xs text-slate-400 truncate">{t.poste} · {t.ecole}</p>
                </div>
                <div className="ml-auto text-right shrink-0">
                  <p className="text-xs text-slate-500 tabular-nums">{t.score}/1000</p>
                  <p className="text-[10px] text-slate-600">{t.promo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Badge industrie ── */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 border border-white/[0.08] rounded-2xl px-6 py-4 bg-white/[0.02]">
            <div className="flex -space-x-2">
              {['ML', 'AT', 'SR'].map((ini, i) => (
                <div key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#060f1e] flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: ['#0A66C2', '#38BDF8', '#818CF8'][i] }}>
                  {ini}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Certifié par <span className="text-[#7DD3FC]">AXION CAMPUS™</span>
              </p>
              <p className="text-xs text-slate-400">Reconnu par l'industrie IA · Partageable sur LinkedIn</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7DD3FC" strokeWidth="1.8" className="ml-2 shrink-0 opacity-60">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
