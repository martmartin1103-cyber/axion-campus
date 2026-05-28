'use client'

/**
 * US8 — LearningOutcomes
 * Branche : feat/us5-us8-medium
 * Fichier  : src/components/LearningOutcomes.tsx  (NOUVEAU)
 *
 * Section "Ce que vous saurez faire après la certification"
 * 6 outcomes rédigés en langage métier (pas technique), grille 2×3.
 * À insérer dans src/app/page.tsx entre CurriculumSection et SocialProof.
 */

import { useEffect, useRef, useState } from 'react'

const OUTCOMES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M12 12h.01M12 16h.01"/>
      </svg>
    ),
    accent: '#7DD3FC',
    titre: 'Auditer n\'importe quel processus',
    desc: 'Identifier en moins d\'une heure les tâches de votre organisation automatisables avec l\'IA.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    accent: '#34D399',
    titre: 'Défendre un ROI IA crédible',
    desc: 'Présenter à votre direction un business case chiffré et réaliste avant tout déploiement.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    accent: '#818CF8',
    titre: 'Naviguer dans la réglementation',
    desc: 'Comprendre l\'AI Act européen et savoir si vos usages IA relèvent des zones à risque.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="2" width="20" height="8" rx="2"/>
        <rect x="2" y="14" width="20" height="8" rx="2"/>
        <path d="M6 6h.01M6 18h.01"/>
      </svg>
    ),
    accent: '#38BDF8',
    titre: 'Piloter un agent IA en production',
    desc: 'Concevoir et superviser un workflow agentique sans compétences de développement.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    accent: '#FB923C',
    titre: 'Faire adopter l\'IA à vos équipes',
    desc: 'Déployer un outil IA sans résistance en co-construisant l\'adoption dès la phase de conception.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    accent: '#F472B6',
    titre: 'Valoriser votre expertise sur LinkedIn',
    desc: 'Partager un certificat numérique vérifiable qui distingue votre profil dans l\'écosystème IA.',
  },
]

/* ── Carte outcome ── */
function OutcomeCard({ outcome, index, visible }: {
  outcome: typeof OUTCOMES[0]; index: number; visible: boolean
}) {
  return (
    <div
      className={`
        group flex flex-col gap-4 p-6 rounded-2xl border
        bg-white/[0.025] border-white/[0.07]
        hover:border-white/[0.14] hover:-translate-y-0.5
        transition-all duration-300 cursor-default
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
      `}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Icône */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${outcome.accent}18`, color: outcome.accent }}
      >
        {outcome.icon}
      </div>

      {/* Contenu */}
      <div>
        <h3
          className="text-base font-bold text-white mb-2 leading-snug"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {outcome.titre}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          {outcome.desc}
        </p>
      </div>

      {/* Check discret */}
      <div className="mt-auto pt-3 border-t border-white/[0.05] flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${outcome.accent}25` }}
        >
          <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke={outcome.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-[11px] text-slate-600 font-medium uppercase tracking-widest">
          Compétence validée
        </span>
      </div>
    </div>
  )
}

export default function LearningOutcomes() {
  const ref     = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative py-24 px-4 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #060f1e 0%, #04091a 100%)' }}
    >
      {/* Halo gauche */}
      <div className="absolute left-0 top-1/3 w-[400px] h-[400px] bg-[#818CF8] opacity-[0.04] blur-[120px] pointer-events-none"/>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* En-tête */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#0A66C2]/10 border border-[#0A66C2]/25 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] animate-pulse"/>
            <span className="text-xs text-[#7DD3FC] font-semibold tracking-widest uppercase">
              Après votre certification
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
            style={{ fontFamily: "'Syne', 'DM Sans', sans-serif" }}
          >
            Vous serez capable de…
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Des compétences concrètes, mesurables, et immédiatement applicables dans votre organisation.
          </p>
        </div>

        {/* Grille 2×3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {OUTCOMES.map((o, i) => (
            <OutcomeCard key={i} outcome={o} index={i} visible={visible}/>
          ))}
        </div>

        {/* Badge final */}
        <div className="flex justify-center">
          <div
            className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl border"
            style={{ background: 'rgba(10,102,194,0.07)', borderColor: 'rgba(10,102,194,0.25)' }}
          >
            {/* Médaille SVG */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7DD3FC" strokeWidth="1.6">
              <circle cx="12" cy="8" r="6"/>
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
            </svg>
            <div>
              <p className="text-white font-bold text-sm leading-tight">
                Compétences reconnues par l'industrie IA
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                Certificat vérifiable · Score personnel · Partageable sur LinkedIn
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
