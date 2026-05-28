'use client'

/**
 * Landing Entreprises — src/app/pour-les-entreprises/page.tsx  (NOUVEAU)
 *
 * Cible  : DRH, Directeurs L&D, Chief of Staff, managers IA
 * Ton    : B2B direct, chiffré, ROI-first
 * Design : fond #0a0f1a (near-black), accent ambre/or #D4A843,
 *          typographie Syne pour titres, DM Sans corps,
 *          layout dense et professionnel
 */

import { useState } from 'react'
import Link from 'next/link'
import SiteFooter from '@/components/SiteFooter'

/* ── Problèmes résolus ── */
const PAIN_POINTS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
    ),
    title: 'Niveau IA inconnu',
    desc: 'Impossible de piloter une transformation IA sans savoir où vos équipes en sont vraiment.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4M12 16h.01"/>
      </svg>
    ),
    title: 'Formations à l\'aveugle',
    desc: 'Vous formez tout le monde au même niveau, sans identifier les gaps critiques.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    title: 'ROI non mesurable',
    desc: 'Les budgets formation IA sont engagés sans indicateur de performance objectif.',
  },
]

/* ── Features ── */
const FEATURES = [
  {
    accent: '#D4A843',
    title: 'Benchmark instantané par équipe',
    desc: 'Score moyen, grade médian, distribution des niveaux. Un tableau de bord RH/L&D prêt en 48h.',
    detail: 'Jusqu\'à 500 collaborateurs par session',
  },
  {
    accent: '#38BDF8',
    title: 'Rapport pédagogique actionnable',
    desc: 'Identification des gaps par dimension IA pour adapter précisément votre plan de formation.',
    detail: 'Export PDF + CSV des résultats',
  },
  {
    accent: '#34D399',
    title: 'Mesure du ROI formation',
    desc: 'Comparez les niveaux avant/après formation. Prouvez l\'impact de vos investissements L&D.',
    detail: 'Suivi de cohortes dans le temps',
  },
  {
    accent: '#818CF8',
    title: 'Déploiement en 24h',
    desc: 'Codes d\'accès individuels distribués par email. Zéro installation, compatible tous devices.',
    detail: 'Intégration Moodle / Canvas sur l\'offre Pro',
  },
]

/* ── Process ── */
const STEPS = [
  { n: '01', title: 'Commande',      desc: 'Souscription en ligne, choix du nombre de passes collaborateurs.' },
  { n: '02', title: 'Distribution',  desc: 'Codes d\'accès individuels envoyés par email ou intégrés à votre LMS.' },
  { n: '03', title: 'Diagnostic',    desc: 'Chaque collaborateur passe le test en 3 minutes, depuis n\'importe quel appareil.' },
  { n: '04', title: 'Analyse',       desc: 'Tableau de bord RH disponible immédiatement avec les KPIs de votre équipe.' },
]

/* ── Formulaire contact ── */
function ContactForm() {
  const [form, setForm]   = useState({ nom: '', email: '', societe: '', effectif: '', message: '' })
  const [sent, setSent]   = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/contact-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom: form.nom, email: form.email, ecole: form.societe, taille_ecole: form.effectif }),
      })
      setSent(true)
    } catch {}
    setLoading(false)
  }

  if (sent) return (
    <div className="text-center py-8">
      <div className="w-14 h-14 rounded-full bg-[#D4A843]/15 border border-[#D4A843]/30 flex items-center justify-center mx-auto mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <p className="text-white font-bold text-lg mb-1">Demande envoyée !</p>
      <p className="text-slate-400 text-sm">Notre équipe commerciale vous contacte sous 24h.</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div className="grid grid-cols-2 gap-3.5">
        {[
          { key: 'nom',     label: 'Nom & prénom', placeholder: 'Sophie Martin', col: 1 },
          { key: 'societe', label: 'Entreprise',   placeholder: 'Accenture, LVMH…',  col: 1 },
        ].map(f => (
          <div key={f.key}>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">{f.label}</label>
            <input value={form[f.key as keyof typeof form]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              placeholder={f.placeholder} required
              className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#D4A843]/50 transition-colors"/>
          </div>
        ))}
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Email professionnel</label>
        <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          placeholder="sophie@entreprise.fr" required
          className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#D4A843]/50 transition-colors"/>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Effectif à certifier</label>
        <select value={form.effectif} onChange={e => setForm(p => ({ ...p, effectif: e.target.value }))}
          className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4A843]/50 transition-colors appearance-none">
          <option value="" className="bg-[#0a0f1a]">Sélectionner…</option>
          {['< 20 personnes','20 – 100','100 – 500','500 – 2000','> 2000'].map(o => (
            <option key={o} value={o} className="bg-[#0a0f1a]">{o}</option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-[#D4A843] hover:bg-[#c49933] text-[#0a0f1a] font-bold py-3.5 rounded-xl text-sm transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-60">
        {loading ? 'Envoi…' : 'Demander une démo gratuite →'}
      </button>
      <p className="text-[11px] text-slate-600 text-center">Sans engagement · Réponse sous 24h</p>
    </form>
  )
}

export default function EntreprisesPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0f1a', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ════════ HERO ════════ */}
      <section className="relative px-6 pt-28 pb-20 overflow-hidden">
        {/* Halos */}
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[#D4A843] opacity-[0.04] blur-[120px] pointer-events-none"/>
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-[#0A66C2] opacity-[0.05] blur-[100px] pointer-events-none"/>
        {/* Grille */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(212,168,67,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,67,0.3) 1px,transparent 1px)', backgroundSize: '56px 56px' }}/>

        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            {/* Back */}
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm mb-8 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Retour à l'accueil
            </Link>

            <div className="inline-flex items-center gap-2 border border-[#D4A843]/30 bg-[#D4A843]/08 rounded-full px-4 py-1.5 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843] animate-pulse"/>
              <span className="text-xs text-[#D4A843] font-semibold tracking-widest uppercase">Pour les entreprises</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.04] mb-6 tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              Mesurez le niveau IA{' '}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #D4A843 0%, #F5C842 100%)' }}>
                réel de vos équipes.
              </span>
            </h1>

            <p className="text-slate-300 text-xl leading-relaxed mb-8 max-w-xl">
              Stop aux formations IA à l'aveugle. Diagnostiquez en 3 minutes,
              identifiez les gaps critiques, prouvez le ROI de vos investissements L&D.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <a href="#contact"
                className="bg-[#D4A843] hover:bg-[#c49933] text-[#0a0f1a] font-bold px-7 py-3.5 rounded-2xl text-sm transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#D4A843]/20 flex items-center gap-2">
                Demander une démo
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <Link href="/tarifs"
                className="text-slate-400 hover:text-white border border-white/[0.12] hover:border-white/[0.3] px-7 py-3.5 rounded-2xl text-sm transition-colors">
                Voir les tarifs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ PAIN POINTS ════════ */}
      <section className="px-6 py-14 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center mb-8">
            Les défis que vous rencontrez
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PAIN_POINTS.map((p, i) => (
              <div key={i} className="flex gap-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                <div className="w-9 h-9 rounded-lg bg-[#D4A843]/12 border border-[#D4A843]/20 flex items-center justify-center shrink-0 text-[#D4A843]">
                  {p.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-1">{p.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FEATURES ════════ */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
              Ce qu'Axion Campus vous apporte
            </h2>
            <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
              Des outils conçus pour les équipes RH, L&D et les managers de transformation IA.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i}
                className="bg-white/[0.025] border border-white/[0.07] rounded-2xl p-6 hover:border-white/[0.14] transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-base font-bold text-white leading-snug max-w-[220px]"
                    style={{ fontFamily: "'Syne', sans-serif" }}>{f.title}</h3>
                  <span className="text-[10px] font-semibold text-slate-600 border border-white/[0.07] rounded-full px-2.5 py-1 shrink-0 ml-3 whitespace-nowrap">
                    {f.detail}
                  </span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                <div className="mt-4 h-0.5 rounded-full w-8" style={{ backgroundColor: f.accent }}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ PROCESSUS ════════ */}
      <section className="px-6 py-16 border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-10 text-center" style={{ fontFamily: "'Syne', sans-serif" }}>
            En 4 étapes, de 0 à certifié
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s, i) => (
              <div key={i} className="relative">
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                  <span className="text-3xl font-black text-[#D4A843]/30 block mb-3"
                    style={{ fontFamily: "'Syne', sans-serif" }}>{s.n}</span>
                  <p className="text-sm font-bold text-white mb-2">{s.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-px bg-[#D4A843]/30"/>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FORMULAIRE CONTACT ════════ */}
      <section id="contact" className="px-6 py-16 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-black text-white mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
              Prenez rendez-vous<br/>
              <span className="text-[#D4A843]">avec notre équipe</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Nous vous présentons la plateforme, définissons le nombre de passes adapté à votre effectif et configurons votre accès sous 24h.
            </p>
            <div className="space-y-3">
              {[
                'Démo personnalisée 30 min',
                'Configuration sur-mesure',
                'Devis sous 48h',
                'Support dédié à l\'onboarding',
              ].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-[#D4A843]/15 border border-[#D4A843]/30 flex items-center justify-center shrink-0">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#D4A843" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-7">
            <ContactForm/>
          </div>
        </div>
      </section>

      <SiteFooter variant="dark"/>
    </div>
  )
}
