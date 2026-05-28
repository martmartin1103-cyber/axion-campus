'use client'

/**
 * US3 — CurriculumSection
 * Branche : feat/us1-us4-landing
 * Fichier : src/components/CurriculumSection.tsx  (NOUVEAU)
 *
 * Ce composant présente les 5 dimensions du diagnostic Axion Campus
 * de façon scannale : onglets, compétences clés, durée, badge de certification.
 * À importer dans src/app/page.tsx (section #programme).
 */

import { useState } from 'react'

const DIMS = [
  {
    id: 'D1',
    code: 'D1',
    label: 'Maturité IA',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 2a9 9 0 0 1 9 9c0 3.6-2.1 6.7-5.2 8.2L12 22l-3.8-2.8C5.1 17.7 3 14.6 3 11a9 9 0 0 1 9-9z"/>
        <path d="M9 11l2 2 4-4"/>
      </svg>
    ),
    accent: '#7DD3FC',
    duree: '~18 min',
    description: 'Évaluez votre compréhension des fondations conceptuelles de l\'IA moderne.',
    competences: [
      'Comprendre le fonctionnement d\'un LLM (prédiction de tokens)',
      'Identifier les limites réelles de l\'IA en contexte pro',
      'Distinguer IA générative, discriminative et agentique',
      'Évaluer la fiabilité d\'une réponse IA (hallucination vs fait)',
    ],
  },
  {
    id: 'D2',
    code: 'D2',
    label: 'Agentic Usage',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="2" width="20" height="8" rx="2"/>
        <rect x="2" y="14" width="20" height="8" rx="2"/>
        <path d="M6 6h.01M6 18h.01"/>
      </svg>
    ),
    accent: '#38BDF8',
    duree: '~18 min',
    description: 'Maîtrisez la conception et l\'utilisation d\'agents IA autonomes sur des tâches réelles.',
    competences: [
      'Distinguer chatbot et agent IA autonome',
      'Concevoir un workflow agentique pour une tâche répétitive',
      'Choisir les bons outils (function calling, RAG, MCP)',
      'Documenter un processus avant automatisation',
    ],
  },
  {
    id: 'D3',
    code: 'D3',
    label: 'Gouvernance IA',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    accent: '#818CF8',
    duree: '~18 min',
    description: 'Naviguez dans le cadre réglementaire IA EU et mettez en place une supervision efficace.',
    competences: [
      'Comprendre les niveaux de risque de l\'AI Act européen',
      'Mettre en place un Human-in-the-loop opérationnel',
      'Identifier les obligations légales pour son secteur',
      'Construire une charte d\'usage IA pour son équipe',
    ],
  },
  {
    id: 'D4',
    code: 'D4',
    label: 'ROI Thinking',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    accent: '#34D399',
    duree: '~18 min',
    description: 'Calculez et défendez un business case IA crédible face à votre direction.',
    competences: [
      'Mesurer le coût actuel d\'une tâche (temps, erreurs, charge)',
      'Modéliser un ROI conservateur avant déploiement',
      'Équilibrer gain de vitesse et impact qualité',
      'Présenter un ROI IA à un CODIR',
    ],
  },
  {
    id: 'D5',
    code: 'D5',
    label: 'Transformation',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/>
      </svg>
    ),
    accent: '#FB923C',
    duree: '~18 min',
    description: 'Pilotez l\'adoption humaine de l\'IA dans votre organisation sans friction.',
    competences: [
      'Anticiper et gérer la résistance au changement IA',
      'Co-construire l\'adoption avec les équipes dès le départ',
      'Déployer un outil IA sans créer de dette organisationnelle',
      'Mesurer l\'adoption réelle vs l\'adoption déclarée',
    ],
  },
]

export default function CurriculumSection() {
  const [activeId, setActiveId] = useState('D1')
  const active = DIMS.find(d => d.id === activeId) ?? DIMS[0]

  return (
    <section
      id="programme"
      className="relative py-24 px-4 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #060f1e 0%, #080e1a 50%, #060f1e 100%)' }}
    >
      {/* Ligne décorative gauche */}
      <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-[#0A66C2]/30 to-transparent"/>

      {/* Grille de fond */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'linear-gradient(#7DD3FC 1px,transparent 1px),linear-gradient(90deg,#7DD3FC 1px,transparent 1px)', backgroundSize: '48px 48px' }}/>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* En-tête */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#0A66C2]/10 border border-[#0A66C2]/25 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] animate-pulse"/>
            <span className="text-xs text-[#7DD3FC] font-semibold tracking-widest uppercase">5 dimensions évaluées</span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
            style={{ fontFamily: "'Syne', 'DM Sans', sans-serif" }}
          >
            Le programme du{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A66C2] to-[#7DD3FC]">
              diagnostic
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            10 questions. 3 minutes. 5 dimensions de maturité IA évaluées simultanément.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Onglets verticaux ── */}
          <div className="flex flex-row lg:flex-col gap-2 lg:w-56 shrink-0 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {DIMS.map(dim => (
              <button
                key={dim.id}
                onClick={() => setActiveId(dim.id)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-left whitespace-nowrap lg:whitespace-normal
                  transition-all duration-200 border shrink-0
                  ${activeId === dim.id
                    ? 'bg-[#0A66C2]/20 border-[#0A66C2]/50 text-white shadow-lg shadow-[#0A66C2]/10'
                    : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.06]'}
                `}
              >
                <span
                  className="shrink-0 transition-colors"
                  style={{ color: activeId === dim.id ? dim.accent : 'currentColor' }}
                >
                  {dim.icon}
                </span>
                <div className="hidden lg:block">
                  <span className="text-xs font-bold opacity-50 block">{dim.code}</span>
                  <span className="text-sm font-semibold">{dim.label}</span>
                </div>
                <span className="lg:hidden text-sm font-semibold">{dim.code} — {dim.label}</span>
              </button>
            ))}
          </div>

          {/* ── Panneau actif ── */}
          <div
            key={active.id}
            className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-7 lg:p-10
              animate-[fadeIn_0.25s_ease]"
          >
            {/* Header panneau */}
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${active.accent}18`, color: active.accent }}
                  >
                    {active.icon}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-500 tracking-widest uppercase block">{active.code}</span>
                    <h3
                      className="text-2xl font-black text-white"
                      style={{ fontFamily: "'Syne', sans-serif", color: active.accent }}
                    >
                      {active.label}
                    </h3>
                  </div>
                </div>
                <p className="text-slate-400 leading-relaxed text-sm max-w-lg">{active.description}</p>
              </div>
              <div
                className="shrink-0 flex flex-col items-center justify-center rounded-2xl px-5 py-3 text-center border"
                style={{ backgroundColor: `${active.accent}10`, borderColor: `${active.accent}30` }}
              >
                <span className="text-xs text-slate-400 uppercase tracking-widest">Durée</span>
                <span className="text-lg font-black text-white mt-0.5">{active.duree}</span>
              </div>
            </div>

            {/* Compétences */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                Compétences évaluées
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {active.competences.map((comp, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.025] border border-white/[0.05]
                      hover:border-white/[0.1] transition-colors group"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: `${active.accent}20` }}
                    >
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke={active.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-sm text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                      {comp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Barre de progression dimensionnelle */}
            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">Progression</span>
                <div className="flex gap-1.5 flex-1">
                  {DIMS.map(d => (
                    <div
                      key={d.id}
                      className="h-1 rounded-full flex-1 transition-all duration-300 cursor-pointer"
                      style={{ backgroundColor: d.id === activeId ? active.accent : 'rgba(255,255,255,0.1)' }}
                      onClick={() => setActiveId(d.id)}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500 tabular-nums">
                  {DIMS.findIndex(d => d.id === activeId) + 1}/{DIMS.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Badge certification */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-4 bg-gradient-to-r from-[#0A66C2]/10 to-[#7DD3FC]/5
            border border-[#0A66C2]/30 rounded-2xl px-8 py-5">
            <div className="w-12 h-12 rounded-xl bg-[#0A66C2]/20 border border-[#0A66C2]/40 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7DD3FC" strokeWidth="1.8">
                <circle cx="12" cy="8" r="6"/>
                <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Certification AXION CAMPUS™</p>
              <p className="text-slate-400 text-xs mt-0.5">Score /1000 · Grade A–D · Certificat PDF + partage LinkedIn</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
