'use client'

/**
 * Page d'accueil hub — src/app/page.tsx
 * Remplace l'ancienne landing école
 *
 * Design : fond blanc/gris très clair #F7F8FA, typographie éditoriale Syne,
 * espacements généreux, ton épuré et reposant.
 * Oriente chaque visiteur vers son profil en 3 secondes.
 * Footer légal complet via SiteFooter.
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SiteFooter from '@/components/SiteFooter'

/* ── Profils audience ── */
const PROFILES = [
  {
    id: 'ecoles',
    href: '/pour-les-ecoles',
    emoji: '🎓',
    badge: 'Établissements',
    title: 'Vous dirigez une école ou une université',
    desc: 'Certifiez vos promotions en IA agentique. Dashboard de suivi, passes étudiants, rapport PDF de promotion.',
    cta: 'Découvrir l\'offre écoles',
    accent: '#0A66C2',
    bg: 'from-[#EEF4FC] to-white',
    border: 'border-[#0A66C2]/20 hover:border-[#0A66C2]/50',
    ctaStyle: 'bg-[#0A66C2] text-white hover:bg-[#0958a8]',
  },
  {
    id: 'entreprises',
    href: '/pour-les-entreprises',
    emoji: '🏢',
    badge: 'Entreprises',
    title: 'Vous formez vos collaborateurs à l\'IA',
    desc: 'Mesurez le niveau IA réel de vos équipes. ROI immédiat, benchmark interne, rapport RH/L&D.',
    cta: 'Découvrir l\'offre entreprises',
    accent: '#D4A843',
    bg: 'from-[#FDF8EE] to-white',
    border: 'border-[#D4A843]/25 hover:border-[#D4A843]/60',
    ctaStyle: 'bg-[#D4A843] text-white hover:bg-[#c49933]',
  },
  {
    id: 'independants',
    href: '/pour-moi',
    emoji: '🙋',
    badge: 'Indépendants & Pro',
    title: 'Vous voulez valoriser votre expertise IA',
    desc: 'Obtenez un certificat personnel partageable sur LinkedIn. Évaluez-vous en 3 minutes, progressez.',
    cta: 'Démarrer mon diagnostic',
    accent: '#E8593A',
    bg: 'from-[#FEF2EE] to-white',
    border: 'border-[#E8593A]/20 hover:border-[#E8593A]/50',
    ctaStyle: 'bg-[#E8593A] text-white hover:bg-[#d44a2b]',
  },
]

/* ── Stats ── */
const STATS = [
  { value: '247+', label: 'certifiés' },
  { value: '38',   label: 'établissements' },
  { value: '5',    label: 'dimensions IA' },
  { value: '3 min',label: 'pour évaluer' },
]

export default function HomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const s = JSON.parse(localStorage.getItem('axion_session') ?? '{}')
      if (s.passe_id) router.replace('/diagnostic')
    } catch {}
  }, [router])

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F8FA', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ══════════════════════════════════════════════
          HERO — épuré, aéré, au-dessus du fold
          ══════════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 overflow-hidden">

        {/* Fond très subtil */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(10,102,194,0.06) 0%, transparent 70%)',
          }}
        />

        {/* Ligne décorative top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-[#0A66C2]/40 to-transparent"/>

        <div className="relative max-w-3xl mx-auto">

          {/* Label */}
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A66C2]"/>
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
              Plateforme de certification IA
            </span>
          </div>

          {/* H1 */}
          <h1
            className="text-5xl sm:text-6xl font-black text-slate-900 leading-[1.06] mb-6 tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            La certification IA{' '}
            <br className="hidden sm:block"/>
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #0A66C2 0%, #38BDF8 100%)' }}
            >
              qui compte vraiment.
            </span>
          </h1>

          {/* Sous-titre */}
          <p className="text-slate-500 text-xl max-w-xl mx-auto leading-relaxed mb-10">
            Évaluez votre maturité en IA agentique en 3 minutes.
            Score sur 1000, grade A–D, certificat vérifiable.
          </p>

          {/* Stats horizontales légères */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-14">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <span
                  className="text-2xl font-black text-slate-900"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {s.value}
                </span>
                <span className="text-xs text-slate-400 mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3 CARTES PROFIL
          ══════════════════════════════════════════════ */}
      <section className="px-6 pb-20 max-w-5xl mx-auto w-full">
        <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-[0.15em] mb-8">
          Choisissez votre profil
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROFILES.map(p => (
            <div
              key={p.id}
              className={`
                group relative flex flex-col bg-gradient-to-b ${p.bg}
                border rounded-3xl p-7 ${p.border}
                transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer
              `}
              onClick={() => router.push(p.href)}
            >
              {/* Badge + emoji */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 border border-slate-200 bg-white rounded-full px-2.5 py-1">
                  {p.badge}
                </span>
                <span className="text-2xl">{p.emoji}</span>
              </div>

              {/* Titre */}
              <h2
                className="text-base font-bold text-slate-900 mb-3 leading-snug"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {p.title}
              </h2>

              {/* Description */}
              <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-6">
                {p.desc}
              </p>

              {/* CTA */}
              <button
                className={`
                  w-full py-2.5 rounded-xl text-sm font-semibold
                  transition-all duration-150 ${p.ctaStyle}
                  flex items-center justify-center gap-2 group-hover:gap-3
                `}
              >
                {p.cta}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MINI-SECTION CONFIANCE
          ══════════════════════════════════════════════ */}
      <section className="border-t border-slate-200 bg-white px-6 py-12">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">

          <div className="text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Pourquoi Axion Campus ?</p>
            <h3
              className="text-xl font-black text-slate-900"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Le seul diagnostic IA orienté compétences métier.
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 shrink-0">
            {[
              { icon: '⚡', label: '3 min' },
              { icon: '🎯', label: '5 dimensions' },
              { icon: '📜', label: 'Certificat PDF' },
              { icon: '🔗', label: 'LinkedIn ready' },
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <span className="text-xl mb-1">{f.icon}</span>
                <span className="text-xs font-semibold text-slate-500">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION DÉJÀ CERTIFIÉ
          ══════════════════════════════════════════════ */}
      <section className="px-6 py-10 max-w-5xl mx-auto w-full">
        <div className="bg-white border border-slate-200 rounded-2xl px-7 py-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-0.5">Vous avez déjà passé le diagnostic ?</p>
            <p className="text-sm text-slate-400">Retrouvez vos résultats et votre certificat en un clic.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => router.push('/reconnexion')}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors">
              Mes résultats
            </button>
            <button onClick={() => router.push('/admin')}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0A66C2] border border-[#0A66C2]/30 hover:bg-[#EEF4FC] transition-colors">
              Dashboard admin →
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER LÉGAL
          ══════════════════════════════════════════════ */}
      <div className="mt-auto">
        <SiteFooter variant="light"/>
      </div>
    </div>
  )
}
