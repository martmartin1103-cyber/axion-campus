'use client'

/**
 * Landing Indépendants — src/app/pour-moi/page.tsx  (NOUVEAU)
 *
 * Cible  : freelances, consultants, développeurs, managers qui veulent
 *          valoriser leur expertise IA personnellement
 * Ton    : humain, direct, chaleureux, confiant — pas corporate
 * Design : fond blanc cassé #FEFCF9, accent corail/terracotta #E8593A,
 *          typographie Syne + DM Sans, espaces généreux, layout léger
 */

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SiteFooter from '@/components/SiteFooter'

/* ── Profils qui se reconnaissent ── */
const WHO = [
  { emoji: '💼', label: 'Consultant indépendant' },
  { emoji: '🧑‍💻', label: 'Développeur / Tech lead' },
  { emoji: '📊', label: 'Manager & chef de projet' },
  { emoji: '🎓', label: 'Étudiant en reconversion' },
  { emoji: '✍️', label: 'Créateur de contenu IA' },
  { emoji: '🚀', label: 'Entrepreneur / Fondateur' },
]

/* ── Ce que vous obtenez ── */
const OUTCOMES = [
  {
    accent: '#E8593A',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    title: 'Un certificat à votre nom',
    desc: 'PDF téléchargeable, identifiant unique vérifiable. Pas un badge générique — votre résultat personnel.',
  },
  {
    accent: '#0A66C2',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
    title: 'Ajout direct sur LinkedIn',
    desc: 'Via le bouton officiel LinkedIn. Votre certification apparaît dans votre section "Licences & certifications".',
  },
  {
    accent: '#34D399',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Score précis sur 5 dimensions',
    desc: 'Pas une note globale floue — un diagnostic détaillé qui vous indique exactement où progresser.',
  },
  {
    accent: '#818CF8',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: 'Résultats immédiats et actionnables',
    desc: 'En 3 minutes, vous savez ce que vous maîtrisez, ce qui manque, et quoi travailler en priorité.',
  },
]

/* ── FAQ ── */
const FAQ = [
  {
    q: 'Faut-il un code d\'accès pour passer le test ?',
    a: 'Oui, le diagnostic est actuellement accessible via un code fourni par un établissement ou une entreprise partenaire. Si vous êtes indépendant, demandez un code individuel via le formulaire ci-dessous.',
  },
  {
    q: 'Combien de temps dure le diagnostic ?',
    a: '3 minutes exactement. Un chronomètre démarre dès que vous cliquez sur "Démarrer". 10 questions à choix unique, réparties sur 5 dimensions.',
  },
  {
    q: 'Mon certificat sera-t-il reconnu par un employeur ?',
    a: 'Axion Campus est une certification privée, non reconnue par l\'État. Elle constitue néanmoins une preuve objective de vos connaissances, valorisable sur LinkedIn et dans un CV.',
  },
  {
    q: 'Puis-je repasser le test si je veux m\'améliorer ?',
    a: 'Chaque code d\'accès est à usage unique. Pour passer à nouveau, vous aurez besoin d\'un nouveau code. Contactez-nous pour obtenir un accès supplémentaire.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors">
        <span className="text-sm font-semibold text-slate-800">{q}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`text-slate-400 shrink-0 ml-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-4 bg-white">
          {a}
        </div>
      )}
    </div>
  )
}

/* ── Formulaire demande accès individuel ── */
function IndepForm() {
  const [email, setEmail]   = useState('')
  const [nom, setNom]       = useState('')
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/contact-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom: nom, email, ecole: 'Indépendant', taille_ecole: 'individuel' }),
      })
      setSent(true)
    } catch {}
    setLoading(false)
  }

  if (sent) return (
    <div className="text-center py-6">
      <div className="w-12 h-12 rounded-full bg-[#E8593A]/10 border border-[#E8593A]/20 flex items-center justify-center mx-auto mb-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8593A" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <p className="font-bold text-slate-900 text-sm mb-1">Demande reçue !</p>
      <p className="text-slate-500 text-sm">Vous recevrez votre code d'accès par email dans les 24h.</p>
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-1.5">Prénom & nom</label>
        <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Alex Dupont" required
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8593A]/20 focus:border-[#E8593A]/40 transition-all bg-white"/>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-1.5">Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="alex@email.com" required
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8593A]/20 focus:border-[#E8593A]/40 transition-all bg-white"/>
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-[#E8593A] hover:bg-[#d44a2b] text-white font-bold py-3 rounded-xl text-sm transition-all hover:scale-[1.01] disabled:opacity-60">
        {loading ? 'Envoi…' : 'Recevoir mon code d\'accès →'}
      </button>
      <p className="text-[11px] text-slate-400 text-center">Code gratuit · Aucun engagement</p>
    </form>
  )
}

export default function IndependantsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FEFCF9', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ════════ HERO ════════ */}
      <section className="relative px-6 pt-28 pb-16 overflow-hidden">
        {/* Halos doux */}
        <div className="absolute top-0 right-0 w-[400px] h-[350px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(232,89,58,0.07) 0%, transparent 70%)' }}/>
        <div className="absolute bottom-0 left-0 w-[350px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(10,102,194,0.05) 0%, transparent 70%)' }}/>

        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm mb-8 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Retour à l'accueil
          </Link>

          <div className="inline-flex items-center gap-2 bg-[#E8593A]/10 border border-[#E8593A]/20 rounded-full px-4 py-1.5 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8593A]"/>
            <span className="text-xs text-[#E8593A] font-semibold tracking-wider uppercase">Pour vous, personnellement</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl font-black text-slate-900 leading-[1.05] mb-6 tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}>
                Prouvez que vous{' '}
                <span className="relative">
                  <span className="text-transparent bg-clip-text"
                    style={{ backgroundImage: 'linear-gradient(135deg, #E8593A 0%, #F5823A 100%)' }}>
                    maîtrisez l'IA.
                  </span>
                </span>
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Pas de cours magistral, pas de formation de 3 jours.
                3 minutes, un diagnostic honnête, un certificat que vous pouvez montrer.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => router.push('/inscription')}
                  className="bg-[#E8593A] hover:bg-[#d44a2b] text-white font-bold px-7 py-3.5 rounded-2xl text-sm transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#E8593A]/20 flex items-center gap-2">
                  Démarrer mon diagnostic
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
                <a href="#acces"
                  className="text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 px-7 py-3.5 rounded-2xl text-sm transition-colors text-center">
                  Pas encore de code ?
                </a>
              </div>
            </div>

            {/* Score preview */}
            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Exemple de résultat</p>
              <div className="flex items-start gap-5 mb-6">
                <div className="text-center">
                  <span className="text-5xl font-black text-slate-900 leading-none block"
                    style={{ fontFamily: "'Syne', sans-serif" }}>742</span>
                  <span className="text-xs text-slate-400">/1000</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#0A66C2] flex items-center justify-center text-white text-2xl font-black">
                  B+
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { d: 'Maturité IA', v: 81 },
                  { d: 'Agentic Usage', v: 68 },
                  { d: 'Gouvernance', v: 74 },
                  { d: 'ROI Thinking', v: 79 },
                  { d: 'Transformation', v: 65 },
                ].map(row => (
                  <div key={row.d} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-28 shrink-0">{row.d}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#0A66C2] to-[#38BDF8]"
                        style={{ width: `${row.v}%` }}/>
                    </div>
                    <span className="text-xs font-semibold text-slate-600 w-8 text-right">{row.v}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ QUI EST CONCERNÉ ════════ */}
      <section className="px-6 py-14 border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-7">Fait pour vous si vous êtes…</p>
          <div className="flex flex-wrap justify-center gap-3">
            {WHO.map(w => (
              <div key={w.label}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                <span>{w.emoji}</span>
                {w.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CE QUE VOUS OBTENEZ ════════ */}
      <section className="px-6 py-16 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-10 text-center"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            Ce que vous obtenez en 3 minutes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {OUTCOMES.map((o, i) => (
              <div key={i}
                className="flex gap-4 p-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all bg-white group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${o.accent}12`, color: o.accent }}>
                  {o.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 mb-1.5">{o.title}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{o.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA CENTRAL ════════ */}
      <section className="px-6 py-16">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
            Prêt à vous tester ?
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            3 minutes montre en main. Résultats immédiats.
            Votre niveau IA, enfin objectivé.
          </p>
          <button onClick={() => router.push('/inscription')}
            className="bg-[#E8593A] hover:bg-[#d44a2b] text-white font-bold px-10 py-4 rounded-2xl text-base transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#E8593A]/20 flex items-center gap-2 mx-auto">
            Démarrer maintenant — c'est gratuit
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <p className="text-xs text-slate-400 mt-3">Besoin d'un code d'accès ? <a href="#acces" className="text-[#E8593A] hover:underline">Demandez-en un gratuitement</a></p>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section className="px-6 py-14 border-t border-slate-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-8 text-center" style={{ fontFamily: "'Syne', sans-serif" }}>
            Questions fréquentes
          </h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => <FAQItem key={i} q={f.q} a={f.a}/>)}
          </div>
        </div>
      </section>

      {/* ════════ FORMULAIRE ACCÈS INDIVIDUEL ════════ */}
      <section id="acces" className="px-6 py-14 bg-[#FEFCF9] border-t border-slate-100">
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-[#E8593A]/10 flex items-center justify-center mb-5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8593A" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
              </svg>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1.5" style={{ fontFamily: "'Syne', sans-serif" }}>
              Obtenez votre accès individuel
            </h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Pas d'école ni d'entreprise partenaire ? Demandez un code personnel, vous le recevrez sous 24h.
            </p>
            <IndepForm/>
          </div>
        </div>
      </section>

      <SiteFooter variant="light"/>
    </div>
  )
}
