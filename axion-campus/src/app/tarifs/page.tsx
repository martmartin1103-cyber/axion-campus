'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

// ── Compte à rebours pilote ───────────────────────────────────────────────────
const PILOT_DEADLINE = new Date('2026-06-25T23:59:59').getTime()

function useCountdown() {
  const [t, setT] = useState({ d:0, h:0, m:0, s:0 })
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, PILOT_DEADLINE - Date.now())
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

// ── Feature check/cross ───────────────────────────────────────────────────────
function Check({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5 ${ok ? 'bg-[#0A66C2]/15 text-[#0A66C2]' : 'bg-slate-100 text-slate-300'}`}>
        {ok ? '✓' : '×'}
      </span>
      <span className={`text-sm leading-relaxed ${ok ? 'text-slate-700' : 'text-slate-400'}`}>{text}</span>
    </div>
  )
}

// ── Digit animé pour le compte à rebours ─────────────────────────────────────
function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-14 h-14 bg-white/10 backdrop-blur rounded-xl border border-white/20 flex items-center justify-center overflow-hidden">
        <span className="text-2xl font-black text-white tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] text-white/50 uppercase tracking-widest mt-1.5">{label}</span>
    </div>
  )
}

// ── Plans data ────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'starter',
    nom: 'Starter',
    tagline: 'Tester sans risque',
    prix_annuel: 490,
    prix_mensuel: 49,
    passes: 30,
    couleur: '#059669',
    populaire: false,
    features: [
      { ok: true,  t: '30 codes d\'accès étudiants' },
      { ok: true,  t: '5 dimensions de maturité IA' },
      { ok: true,  t: 'Certificats PDF personnalisés' },
      { ok: true,  t: 'Dashboard admin de base' },
      { ok: true,  t: 'Export CSV des résultats' },
      { ok: false, t: 'Dashboard analytics avancé' },
      { ok: false, t: 'Personnalisation des questions' },
      { ok: false, t: 'API d\'intégration SI' },
      { ok: false, t: 'Support prioritaire dédié' },
      { ok: false, t: 'Rapport pédagogique automatisé' },
    ],
    cta: 'Démarrer sur Starter',
    ctaSub: 'Sans engagement, résiliable à tout moment',
  },
  {
    id: 'campus',
    nom: 'Campus',
    tagline: 'L\'essentiel pour votre promo',
    prix_annuel: 990,
    prix_mensuel: 99,
    passes: 120,
    couleur: '#0A66C2',
    populaire: true,
    features: [
      { ok: true,  t: '120 codes d\'accès étudiants' },
      { ok: true,  t: '5 dimensions de maturité IA' },
      { ok: true,  t: 'Certificats PDF personnalisés' },
      { ok: true,  t: 'Dashboard analytics avancé' },
      { ok: true,  t: 'Export CSV + rapport PDF promo' },
      { ok: true,  t: 'Satisfaction étudiants intégrée' },
      { ok: true,  t: 'Partage LinkedIn certifications' },
      { ok: false, t: 'Personnalisation des questions' },
      { ok: false, t: 'API d\'intégration SI' },
      { ok: false, t: 'Support prioritaire dédié' },
    ],
    cta: 'Choisir Campus',
    ctaSub: 'Le choix de 80% des écoles partenaires',
  },
  {
    id: 'pro',
    nom: 'Pro',
    tagline: 'Pour les grandes institutions',
    prix_annuel: 2490,
    prix_mensuel: 249,
    passes: 500,
    couleur: '#1a3c6e',
    populaire: false,
    features: [
      { ok: true,  t: '500 codes d\'accès étudiants' },
      { ok: true,  t: '5 dimensions de maturité IA' },
      { ok: true,  t: 'Certificats PDF personnalisés' },
      { ok: true,  t: 'Dashboard analytics avancé' },
      { ok: true,  t: 'Export CSV + rapport PDF promo' },
      { ok: true,  t: 'Satisfaction étudiants intégrée' },
      { ok: true,  t: 'Partage LinkedIn certifications' },
      { ok: true,  t: 'Personnalisation partielle des questions' },
      { ok: true,  t: 'API d\'intégration SI (Moodle, Canvas…)' },
      { ok: true,  t: 'Customer Success dédié + SLA 24h' },
    ],
    cta: 'Passer en Pro',
    ctaSub: 'Devis personnalisé disponible sur demande',
  },
]

const COMPARAISON = [
  { feature: 'Codes d\'accès étudiants', starter: '30', campus: '120', pro: '500' },
  { feature: 'Dimensions IA évaluées', starter: '5', campus: '5', pro: '5' },
  { feature: 'Certificats PDF', starter: '✓', campus: '✓', pro: '✓' },
  { feature: 'Dashboard admin', starter: 'Basique', campus: 'Avancé', pro: 'Avancé +' },
  { feature: 'Export résultats', starter: 'CSV', campus: 'CSV + PDF', pro: 'CSV + PDF + API' },
  { feature: 'Analytics promotion', starter: '—', campus: '✓', pro: '✓' },
  { feature: 'Satisfaction étudiants', starter: '—', campus: '✓', pro: '✓' },
  { feature: 'Personnalisation questions', starter: '—', campus: '—', pro: 'Partielle' },
  { feature: 'Intégration LMS (Moodle…)', starter: '—', campus: '—', pro: '✓' },
  { feature: 'Support', starter: 'Email J+3', campus: 'Email J+1', pro: 'CS dédié SLA 24h' },
  { feature: 'Renouvellement auto', starter: '✓', campus: '✓', pro: '✓' },
  { feature: 'Accès multi-promotions', starter: '—', campus: '✓', pro: '✓' },
]

// ── Page principale ───────────────────────────────────────────────────────────
export default function PricingPage() {
  const router   = useRouter()
  const [annuel, setAnnuel] = useState(true)
  const countdown = useCountdown()
  const pilotRef  = useRef<HTMLDivElement>(null)

  const scrollToPilot = () => pilotRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  return (
    <div className="min-h-screen bg-[#f8fafc]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet"/>

      {/* ── NAV ── */}
      <nav className="bg-white/80 backdrop-blur border-b border-slate-200 px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
        <button onClick={() => router.push('/')} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1a3c6e] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-sm font-bold text-[#1a3c6e]">AXION CAMPUS™</span>
        </button>
        <div className="flex items-center gap-4">
          <button onClick={scrollToPilot} className="text-sm font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse"/>
            Offre Pilote — {countdown.d}j {countdown.h}h restants
          </button>
          <a href="mailto:commercial@axion-campus.fr" className="bg-[#1a3c6e] hover:bg-[#15305a] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            Nous contacter
          </a>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative px-6 pt-20 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'linear-gradient(#1a3c6e 1px,transparent 1px),linear-gradient(90deg,#1a3c6e 1px,transparent 1px)',backgroundSize:'48px 48px'}}/>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#0A66C2] opacity-[0.06] blur-[100px]"/>

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#EEF4FC] border border-[#0A66C2]/20 rounded-full px-4 py-1.5 mb-8">
            <span className="text-xs font-semibold text-[#0A66C2] uppercase tracking-wider">Tarification transparente</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.05] mb-6" style={{fontFamily:"'DM Serif Display', serif"}}>
            Certifiez votre promo{' '}
            <span className="text-[#0A66C2] italic">en IA</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-xl mx-auto mb-10">
            Des plans conçus pour les établissements d'enseignement supérieur, de la petite formation aux grandes universités.
          </p>

          {/* Toggle annuel/mensuel */}
          <div className="inline-flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
            <button onClick={() => setAnnuel(false)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${!annuel ? 'bg-[#1a3c6e] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              Mensuel
            </button>
            <button onClick={() => setAnnuel(true)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${annuel ? 'bg-[#1a3c6e] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              Annuel
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${annuel ? 'bg-green-400 text-white' : 'bg-green-100 text-green-700'}`}>−20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── CARDS PLANS ── */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <div key={plan.id}
              className={`relative bg-white rounded-3xl border shadow-sm flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                plan.populaire
                  ? 'border-[#0A66C2] shadow-[#0A66C2]/10 shadow-lg ring-2 ring-[#0A66C2]/20'
                  : 'border-slate-200'
              }`}>

              {plan.populaire && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0A66C2] text-white text-xs font-black px-4 py-1.5 rounded-full shadow-md uppercase tracking-widest whitespace-nowrap">
                  ⭐ Le plus choisi
                </div>
              )}

              {/* Header plan */}
              <div className={`px-7 pt-8 pb-6 rounded-t-3xl ${plan.populaire ? 'bg-gradient-to-b from-[#EEF4FC] to-white' : ''}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: plan.couleur}}/>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{plan.nom}</span>
                </div>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">{plan.tagline}</p>

                {/* Prix */}
                <div className="mb-2">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black text-slate-900">
                      {annuel
                        ? `${plan.prix_annuel.toLocaleString('fr-FR')}€`
                        : `${plan.prix_mensuel}€`}
                    </span>
                    <span className="text-slate-400 text-sm mb-2">{annuel ? '/an' : '/mois'}</span>
                  </div>
                  {annuel && (
                    <p className="text-xs text-green-600 font-semibold">
                      Soit {plan.prix_mensuel}€/mois · Économisez {Math.round(plan.prix_mensuel * 12 - plan.prix_annuel)}€/an
                    </p>
                  )}
                </div>

                {/* Passes */}
                <div className="inline-flex items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1.5 mt-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z"/></svg>
                  <span className="text-xs font-semibold text-slate-600">{plan.passes} étudiants inclus</span>
                </div>
              </div>

              {/* CTA */}
              <div className="px-7 pb-6">
                <a href={`mailto:commercial@axion-campus.fr?subject=Souscription Axion ${plan.nom}&body=Bonjour, je souhaite souscrire à l'offre ${plan.nom} (${annuel?'annuel':'mensuel'}).`}
                  className={`block w-full text-center py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                    plan.populaire
                      ? 'bg-[#0A66C2] hover:bg-[#004182] text-white shadow-lg shadow-[#0A66C2]/25 hover:shadow-xl hover:shadow-[#0A66C2]/30 hover:scale-[1.02]'
                      : 'bg-slate-900 hover:bg-slate-800 text-white hover:scale-[1.01]'
                  }`}>
                  {plan.cta}
                </a>
                <p className="text-[11px] text-slate-400 text-center mt-2">{plan.ctaSub}</p>
              </div>

              {/* Séparateur */}
              <div className="mx-7 border-t border-slate-100 mb-5"/>

              {/* Features */}
              <div className="px-7 pb-8 space-y-3 flex-1">
                {plan.features.map((f, i) => <Check key={i} ok={f.ok} text={f.t}/>)}
              </div>
            </div>
          ))}
        </div>

        {/* Note enterprise */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Vous avez <strong className="text-slate-600">+500 étudiants</strong> ou plusieurs campus ?{' '}
            <a href="mailto:commercial@axion-campus.fr?subject=Offre Enterprise Axion Campus" className="text-[#0A66C2] font-semibold hover:underline">
              Demandez un devis Enterprise →
            </a>
          </p>
        </div>
      </section>

      {/* ── OFFRE PILOTE ── */}
      <section ref={pilotRef} className="px-6 py-8 mb-16 max-w-4xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          {/* Fond violet dramatique */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4C1D95] via-[#7C3AED] to-[#6D28D9]"/>
          <div className="absolute inset-0 opacity-10" style={{backgroundImage:'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)',backgroundSize:'32px 32px'}}/>
          {/* Halo décoratif */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"/>

          <div className="relative px-10 py-12 md:flex items-center justify-between gap-8">
            <div className="flex-1 mb-8 md:mb-0">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 mb-5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"/>
                <span className="text-xs font-bold text-white uppercase tracking-widest">Offre spéciale — Places limitées</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight" style={{fontFamily:"'DM Serif Display', serif"}}>
                Pack Pilote
                <span className="text-amber-300 italic"> Fondateur</span>
              </h2>
              <p className="text-purple-200 text-base leading-relaxed mb-6 max-w-lg">
                Rejoignez les <strong className="text-white">8 premières écoles fondatrices</strong> et accédez à la plateforme complète à tarif préférentiel. Cette offre expire définitivement dans :
              </p>

              {/* Compte à rebours */}
              <div className="flex items-center gap-3 mb-8">
                <Digit value={countdown.d} label="jours"/>
                <span className="text-white/50 text-2xl font-black mb-4">:</span>
                <Digit value={countdown.h} label="heures"/>
                <span className="text-white/50 text-2xl font-black mb-4">:</span>
                <Digit value={countdown.m} label="min"/>
                <span className="text-white/50 text-2xl font-black mb-4">:</span>
                <Digit value={countdown.s} label="sec"/>
              </div>

              {/* Ce qui est inclus */}
              <div className="grid grid-cols-2 gap-2 mb-8">
                {[
                  '50 passes étudiants offerts',
                  'Accès Campus complet 6 mois',
                  'Onboarding 1-on-1 avec l\'équipe',
                  'Co-construction des futures features',
                  'Tarif préférentiel garanti à vie',
                  'Votre logo sur notre site partenaire',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#FBBF24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <span className="text-sm text-purple-100">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte prix pilote */}
            <div className="shrink-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center w-full md:w-72">
              <p className="text-purple-200 text-xs font-semibold uppercase tracking-widest mb-2">Tarif pilote exclusif</p>

              {/* Prix barré */}
              <div className="mb-1">
                <span className="text-purple-300/60 line-through text-xl">990€/an</span>
              </div>
              <div className="text-5xl font-black text-white mb-1">0€</div>
              <p className="text-amber-300 font-bold text-sm mb-1">6 mois offerts</p>
              <p className="text-purple-200 text-xs mb-8 leading-relaxed">
                Puis tarif Campus préférentiel <strong className="text-white">690€/an</strong> garanti à vie pour les fondateurs
              </p>

              {/* Places restantes */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-purple-200 mb-1.5">
                  <span>Places restantes</span>
                  <span className="font-bold text-amber-300">3 / 8</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{width:'62.5%'}}/>
                </div>
                <p className="text-xs text-purple-300 mt-1.5">5 écoles ont déjà rejoint le programme</p>
              </div>

              <a href="mailto:commercial@axion-campus.fr?subject=Candidature Offre Pilote Fondateur Axion Campus&body=Bonjour, je souhaite candidater à l'offre Pilote Fondateur d'Axion Campus.%0A%0AMon établissement : %0ANom : %0AEmail : %0ANombre d'étudiants visés : "
                className="block w-full bg-amber-400 hover:bg-amber-300 text-[#4C1D95] font-black py-4 rounded-xl text-sm transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-400/30 mb-3">
                Je candidate au programme →
              </a>
              <p className="text-purple-300 text-[11px] leading-relaxed">
                Sélection sous 48h · Aucun engagement · Annulable à tout moment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TABLEAU COMPARATIF ── */}
      <section className="px-6 py-16 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3" style={{fontFamily:"'DM Serif Display', serif"}}>Comparaison détaillée</h2>
            <p className="text-slate-500">Toutes les fonctionnalités plan par plan</p>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200">
              <div className="px-6 py-4"/>
              {['Starter', 'Campus', 'Pro'].map((plan, i) => (
                <div key={plan} className={`px-6 py-4 text-center border-l border-slate-200 ${i===1?'bg-[#EEF4FC]':''}`}>
                  <p className="text-sm font-black text-slate-900">{plan}</p>
                  <p className="text-xs text-slate-400">{[490,990,2490][i]}€/an</p>
                </div>
              ))}
            </div>

            {/* Lignes */}
            {COMPARAISON.map((row, i) => (
              <div key={i} className={`grid grid-cols-4 border-b border-slate-100 last:border-0 ${i%2===0?'bg-white':'bg-slate-50/50'}`}>
                <div className="px-6 py-3.5 flex items-center">
                  <span className="text-sm text-slate-700">{row.feature}</span>
                </div>
                {[row.starter, row.campus, row.pro].map((val, j) => (
                  <div key={j} className={`px-6 py-3.5 text-center flex items-center justify-center border-l border-slate-100 ${j===1?'bg-[#EEF4FC]/50':''}`}>
                    {val === '✓' ? (
                      <span className="w-6 h-6 rounded-full bg-[#0A66C2] flex items-center justify-center">
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    ) : val === '—' ? (
                      <span className="text-slate-300 text-lg">—</span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-700">{val}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {/* Footer CTA */}
            <div className="grid grid-cols-4 bg-slate-50 border-t border-slate-200">
              <div className="px-6 py-5"/>
              {PLANS.map((plan, i) => (
                <div key={plan.id} className={`px-4 py-5 border-l border-slate-200 ${i===1?'bg-[#EEF4FC]':''}`}>
                  <a href={`mailto:commercial@axion-campus.fr?subject=Souscription Axion ${plan.nom}`}
                    className={`block text-center py-2.5 rounded-xl text-xs font-bold transition-all ${i===1?'bg-[#0A66C2] text-white hover:bg-[#004182]':'bg-slate-900 text-white hover:bg-slate-700'}`}>
                    {plan.cta.split(' ').slice(0,2).join(' ')} →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ RAPIDE ── */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-black text-slate-900 text-center mb-10" style={{fontFamily:"'DM Serif Display', serif"}}>Questions fréquentes</h2>
        <div className="space-y-4">
          {[
            { q:"Comment fonctionnent les passes ?", a:"Chaque pass est un code d'accès unique remis à un étudiant. Une fois utilisé pour passer le test, il ne peut plus être réutilisé. Vous pouvez en acheter des packs supplémentaires à tout moment." },
            { q:"Puis-je changer de plan en cours d'année ?", a:"Oui, vous pouvez passer à un plan supérieur à tout moment. La différence est proratisée. Le passage à un plan inférieur s'effectue au renouvellement suivant." },
            { q:"Qu'est-ce que le certificat Axion Campus ?", a:"C'est un certificat numérique PDF avec identifiant unique, partageable sur LinkedIn via le système officiel d'ajout de certification. Il n'est pas reconnu par l'État, mais valorise la maîtrise des enjeux IA." },
            { q:"Y a-t-il un engagement de durée ?", a:"Les plans annuels sont prépayés sans engagement de renouvellement (désactivable depuis votre dashboard). Les plans mensuels sont résiliables à tout moment." },
            { q:"Comment intégrer Axion à notre LMS ?", a:"L'intégration Moodle, Canvas ou tout autre LMS est disponible sur l'offre Pro via notre API. Contactez notre équipe pour un accompagnement dédié." },
          ].map((item, i) => (
            <details key={i} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-slate-50 transition-colors">
                <span className="text-sm font-semibold text-slate-800">{item.q}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 transition-transform group-open:rotate-180 shrink-0 ml-4">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </summary>
              <div className="px-6 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-4">{item.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="px-6 py-16 bg-[#060f1e] text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'linear-gradient(#4a90d9 1px,transparent 1px),linear-gradient(90deg,#4a90d9 1px,transparent 1px)',backgroundSize:'48px 48px'}}/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#0A66C2] opacity-[0.08] blur-[100px]"/>
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-4xl font-black text-white mb-4" style={{fontFamily:"'DM Serif Display', serif"}}>
            Prêt à certifier votre promo en IA ?
          </h2>
          <p className="text-slate-400 mb-10 leading-relaxed">
            Rejoignez les établissements qui préparent leurs étudiants aux enjeux IA de demain.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="mailto:commercial@axion-campus.fr?subject=Demande démo Axion Campus"
              className="bg-[#0A66C2] hover:bg-[#004182] text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#0A66C2]/30">
              Demander une démo gratuite →
            </a>
            <button onClick={scrollToPilot}
              className="border border-[#7C3AED]/50 hover:border-[#7C3AED] text-[#A78BFA] hover:text-[#C4B5FD] font-semibold px-8 py-4 rounded-2xl text-sm transition-all">
              Voir l'offre Pilote ⚡
            </button>
          </div>
          <p className="text-slate-600 text-xs mt-8">
            Certification privée AXION CAMPUS™ · Non reconnue par l'État · contact@axion-campus.fr
          </p>
        </div>
      </section>
    </div>
  )
}
