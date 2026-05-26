'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// ── Etapes ──────────────────────────────────────────────────────────────────
type Step = 'identite' | 'consignes' | 'pret'

// ── Chrono ───────────────────────────────────────────────────────────────────
const DUREE_SECONDES = 180 // 3 minutes

function Chrono({ onExpire }: { onExpire: () => void }) {
  const [remaining, setRemaining] = useState(DUREE_SECONDES)

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(id); onExpire(); return 0 }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [onExpire])

  const min = Math.floor(remaining / 60).toString().padStart(2, '0')
  const sec = (remaining % 60).toString().padStart(2, '0')
  const pct = (remaining / DUREE_SECONDES) * 100
  const urgent = remaining <= 30

  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-colors ${urgent ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={urgent ? '#dc2626' : '#0A66C2'} strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
      <span className={`text-sm font-mono font-bold ${urgent ? 'text-red-600' : 'text-[#0A66C2]'}`}>{min}:{sec}</span>
      <div className="w-20 h-1.5 bg-white rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${urgent ? 'bg-red-500' : 'bg-[#0A66C2]'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ── Checkbox item ─────────────────────────────────────────────────────────────
function CheckItem({ id, label, checked, onChange, required }: {
  id: string; label: React.ReactNode; checked: boolean; onChange: (v: boolean) => void; required?: boolean
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
      <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-150 ${checked ? 'bg-[#1a3c6e] border-[#1a3c6e]' : 'border-slate-300 group-hover:border-[#1a3c6e]'}`}>
        {checked && (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)}/>
      <span className="text-sm text-slate-700 leading-relaxed">{label}{required && <span className="text-red-500 ml-1">*</span>}</span>
    </label>
  )
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function InscriptionPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('identite')

  // Etape 1
  const [code, setCode]   = useState('')
  const [nom, setNom]     = useState('')
  const [promo, setPromo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Etape 2 — consignes
  const [checks, setChecks] = useState({
    duree:       false,
    seul:        false,
    triche:      false,
    rgpd:        false,
    cgu:         false,
    majeur:      false,
  })
  const allChecked = Object.values(checks).every(Boolean)

  // Etape 3 — pret + chrono actif sur diagnostic
  const [chronoStarted, setChronoStarted] = useState(false)

  // Valider identite
  const handleIdentite = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res  = await fetch('/api/validate-code', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Code invalide'); setLoading(false); return }
      localStorage.setItem('axion_session', JSON.stringify({
        passe_id: data.passe_id, ecole_id: data.ecole_id,
        ecole_nom: data.ecole_nom, nom_etudiant: nom, promo,
      }))
      setStep('consignes')
    } catch { setError('Erreur reseau. Reessayez.') }
    setLoading(false)
  }

  // Demarrer le test
  const handleStart = useCallback(() => {
    localStorage.setItem('axion_chrono_start', Date.now().toString())
    localStorage.setItem('axion_chrono_duree', DUREE_SECONDES.toString())
    router.push('/diagnostic')
  }, [router])

  // Chrono expire avant demarrage
  const handlePreExpire = useCallback(() => {
    router.push('/')
  }, [router])

  // ── ETAPE 1 : identite ──────────────────────────────────────────────────────
  if (step === 'identite') return (
    <div className="min-h-screen bg-[#f0f4fa] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <button onClick={() => router.push('/connexion')} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 mb-8 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Retour
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#1a3c6e] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            </div>
            <span className="text-sm font-bold text-[#1a3c6e]">AXION CAMPUS</span>
          </div>

          {/* Indicateur etape */}
          <div className="flex items-center gap-2 mb-6">
            {['Identite', 'Consignes', 'Debut'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-[#1a3c6e] text-white' : 'bg-slate-100 text-slate-400'}`}>{i + 1}</div>
                <span className={`text-xs ${i === 0 ? 'text-[#1a3c6e] font-medium' : 'text-slate-400'}`}>{s}</span>
                {i < 2 && <div className="w-8 h-px bg-slate-200"/>}
              </div>
            ))}
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Votre identite</h1>
          <p className="text-sm text-slate-400 mb-8">Renseignez votre code d acces et vos informations personnelles.</p>

          <form onSubmit={handleIdentite} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Code d acces *</label>
              <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="EFREI-2026-DEMO1" required className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"/>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Prenom et Nom *</label>
              <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Marie Lambert" required className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"/>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Promotion</label>
              <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="Promo 2026" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"/>
            </div>
            {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">{error}</div>}
            <button type="submit" disabled={loading} className="w-full bg-[#1a3c6e] hover:bg-[#15305a] disabled:opacity-60 text-white py-3.5 rounded-xl text-sm font-semibold transition-colors">
              {loading ? 'Verification...' : 'Continuer vers les consignes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )

  // ── ETAPE 2 : consignes ─────────────────────────────────────────────────────
  if (step === 'consignes') return (
    <div className="min-h-screen bg-[#f0f4fa] px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setStep('identite')} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 mb-8 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Retour
        </button>

        {/* Indicateur etape */}
        <div className="flex items-center gap-2 mb-8">
          {['Identite', 'Consignes', 'Debut'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i <= 1 ? 'bg-[#1a3c6e] text-white' : 'bg-slate-100 text-slate-400'}`}>
                {i === 0 ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> : i + 1}
              </div>
              <span className={`text-xs ${i <= 1 ? 'text-[#1a3c6e] font-medium' : 'text-slate-400'}`}>{s}</span>
              {i < 2 && <div className="w-8 h-px bg-slate-200"/>}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

          {/* Hero consignes */}
          <div className="bg-gradient-to-r from-[#1a3c6e] to-[#0A66C2] px-8 py-8 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M12 12h.01M12 16h.01"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">Consignes du test</h1>
                <p className="text-blue-100 text-sm">Lisez attentivement avant de commencer</p>
              </div>
            </div>

            {/* KPIs rapides */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { icon: '❓', val: '10', label: 'Questions' },
                { icon: '⏱️', val: '3 min', label: 'Duree limite' },
                { icon: '🏆', val: '5', label: 'Dimensions' },
              ].map(k => (
                <div key={k.label} className="bg-white/10 rounded-xl px-4 py-3 text-center">
                  <div className="text-xl mb-1">{k.icon}</div>
                  <div className="text-lg font-black">{k.val}</div>
                  <div className="text-xs text-blue-200">{k.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-8 py-8 space-y-8">

            {/* Placeholder video */}
            <div>
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Introduction (video a venir)</h2>
              <div className="w-full aspect-video bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-400">
                <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
                <p className="text-sm font-medium">Video d introduction</p>
                <p className="text-xs">Bientot disponible</p>
              </div>
            </div>

            {/* Deroulement */}
            <div>
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Deroulement de l epreuve</h2>
              <div className="space-y-3">
                {[
                  { n: '01', title: 'Format', desc: '10 questions a choix unique (QCM), reparties sur 5 dimensions de maturite IA.' },
                  { n: '02', title: 'Duree', desc: 'Vous disposez de 3 minutes au total. Le chronometre demarre des que vous cliquez sur Demarrer.' },
                  { n: '03', title: 'Navigation', desc: 'Vous pouvez revenir sur vos reponses precedentes a tout moment avant la soumission.' },
                  { n: '04', title: 'Resultats', desc: 'Un score sur 1000, un grade (A a D) et un certificat numerique sont delivres immediatement.' },
                  { n: '05', title: 'Unicite', desc: 'Chaque code d acces est a usage unique. Tout passage est definitif et enregistre.' },
                ].map(item => (
                  <div key={item.n} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-black text-[#0A66C2] mt-0.5 shrink-0 w-6">{item.n}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Anti-triche */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" className="shrink-0 mt-0.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/>
                </svg>
                <div>
                  <p className="text-sm font-bold text-amber-800 mb-2">Regles anti-triche et integrite academique</p>
                  <ul className="text-xs text-amber-700 space-y-1 leading-relaxed">
                    <li>• Le test doit etre passe individuellement, sans aide exterieure (humaine ou IA).</li>
                    <li>• Toute tentative de fraude entraine l annulation du certificat et une notification a l etablissement.</li>
                    <li>• Vos reponses, adresse IP et horodatage sont enregistres a des fins de verification.</li>
                    <li>• L utilisation d outils d IA (ChatGPT, Copilot...) pendant le test est strictement interdite.</li>
                    <li>• Axion Campus se reserve le droit de revoquer tout certificat obtenu frauduleusement.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Conditions legales + cases a cocher */}
            <div>
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Acceptation et consentements</h2>
              <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <CheckItem
                  id="duree" checked={checks.duree} onChange={v => setChecks(c => ({ ...c, duree: v }))} required
                  label="Je comprends que le test dure 3 minutes et que le chronometre est irreversible une fois lance."
                />
                <CheckItem
                  id="seul" checked={checks.seul} onChange={v => setChecks(c => ({ ...c, seul: v }))} required
                  label="Je m engage a repondre seul(e), sans consulter de ressources externes, de documents ou d outils numeriques."
                />
                <CheckItem
                  id="triche" checked={checks.triche} onChange={v => setChecks(c => ({ ...c, triche: v }))} required
                  label={<>Je reconnais avoir lu et accepter la <span className="text-[#1a3c6e] font-medium">charte d integrite academique</span> et la politique anti-fraude d Axion Campus.</>}
                />
                <div className="border-t border-slate-200 pt-4 mt-2 space-y-4">
                  <CheckItem
                    id="rgpd" checked={checks.rgpd} onChange={v => setChecks(c => ({ ...c, rgpd: v }))} required
                    label={<>J accepte la <span className="text-[#1a3c6e] font-medium">politique de confidentialite (RGPD)</span>. Mes donnees (nom, reponses, score) sont traitees par Axion Campus pour la delivrance du certificat et la communication avec mon etablissement.</>}
                  />
                  <CheckItem
                    id="cgu" checked={checks.cgu} onChange={v => setChecks(c => ({ ...c, cgu: v }))} required
                    label={<>J accepte les <span className="text-[#1a3c6e] font-medium">Conditions Generales d Utilisation</span> d Axion Campus, incluant les regles d usage du certificat et les limitations de responsabilite.</>}
                  />
                  <CheckItem
                    id="majeur" checked={checks.majeur} onChange={v => setChecks(c => ({ ...c, majeur: v }))} required
                    label="Je certifie etre majeur(e) ou agir sous responsabilite de mon etablissement d enseignement."
                  />
                </div>
              </div>
              {!allChecked && (
                <p className="text-xs text-slate-400 mt-2 ml-1">Toutes les cases marquees * sont obligatoires pour continuer.</p>
              )}
            </div>

            <button
              onClick={() => { if (allChecked) setStep('pret') }}
              disabled={!allChecked}
              className="w-full bg-[#1a3c6e] hover:bg-[#15305a] disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl text-sm font-bold transition-colors"
            >
              J accepte et je suis pret(e) a commencer
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // ── ETAPE 3 : pret + bouton demarrer ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f0f4fa] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10 w-full max-w-md text-center">

        {/* Indicateur etape */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['Identite', 'Consignes', 'Debut'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#1a3c6e] text-white flex items-center justify-center text-xs font-bold">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span className="text-xs text-[#1a3c6e] font-medium">{s}</span>
              {i < 2 && <div className="w-8 h-px bg-[#1a3c6e]/30"/>}
            </div>
          ))}
        </div>

        {/* Icone pret */}
        <div className="w-20 h-20 rounded-2xl bg-[#EEF4FC] flex items-center justify-center mx-auto mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="1.6">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-2">Pret(e) a commencer ?</h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs mx-auto">
          Le chronometre de <strong>3 minutes</strong> demarre immediatement apres votre clic.
          Vous ne pouvez pas mettre en pause.
        </p>

        {/* Rappel regles */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-8 text-left space-y-2">
          {['10 questions a choix unique', '3 minutes, chrono irreversible', 'Seul(e), sans aide exterieure', 'Code usage unique — pas de second essai'].map(r => (
            <div key={r} className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0A66C2] shrink-0"/>
              {r}
            </div>
          ))}
        </div>

        {chronoStarted ? (
          <Chrono onExpire={handlePreExpire}/>
        ) : (
          <button
            onClick={() => { setChronoStarted(true); setTimeout(handleStart, 100) }}
            className="w-full bg-[#1a3c6e] hover:bg-[#15305a] text-white py-4 rounded-xl text-base font-black transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#1a3c6e]/25 flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Demarrer le test
          </button>
        )}
      </div>
    </div>
  )
}
