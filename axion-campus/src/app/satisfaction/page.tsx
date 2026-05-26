'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QUESTIONS } from '@/data/questions'

const MESSAGES = ['', 'Très insatisfait', 'Insatisfait', 'Neutre', 'Satisfait', 'Très satisfait !']

// ── Pop-up félicitations ──────────────────────────────────────────────────────
function SuccessPopup({ certUid, sessionId, onClose }: { certUid: string; sessionId: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-10 w-full max-w-lg text-center animate-[popIn_0.4s_ease]">

        {/* Confettis SVG */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#7DD3FC] flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          {/* Points décoratifs */}
          {[0,45,90,135,180,225,270,315].map((deg, i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full" style={{
              backgroundColor: ['#0A66C2','#F5A623','#7DD3FC','#22c55e','#f43f5e','#a855f7','#F5A623','#0A66C2'][i],
              top: `${50 + 42 * Math.sin((deg * Math.PI) / 180)}%`,
              left: `${50 + 42 * Math.cos((deg * Math.PI) / 180)}%`,
              transform: 'translate(-50%,-50%)',
            }}/>
          ))}
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-3">Félicitations ! 🎉</h1>
        <p className="text-slate-600 text-base leading-relaxed mb-6">
          Votre test a été soumis avec succès. Vos résultats et votre certificat sont maintenant disponibles.
        </p>

        {/* Infos certificate */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left mb-6 space-y-3">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
            <span className="font-semibold">Certificat ID :</span>
            <span className="font-mono text-[#0A66C2] font-bold">{certUid}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" className="shrink-0 mt-0.5"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
            Téléchargez votre certificat PDF depuis la page de résultats. Il est également transmis automatiquement à votre établissement.
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" className="shrink-0 mt-0.5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
            Partagez votre certification sur LinkedIn pour valoriser votre profil IA.
          </div>
        </div>

        <button onClick={onClose} className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white py-4 rounded-2xl text-base font-bold transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-200">
          Voir mes résultats →
        </button>
      </div>

      <style>{`
        @keyframes popIn {
          0%  { transform: scale(0.85); opacity: 0 }
          60% { transform: scale(1.03) }
          100%{ transform: scale(1); opacity: 1 }
        }
      `}</style>
    </div>
  )
}

// ── Page satisfaction ──────────────────────────────────────────────────────────
export default function SatisfactionPage() {
  const router = useRouter()
  const [rating, setRating]       = useState(0)
  const [hovered, setHovered]     = useState(0)
  const [comment, setComment]     = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [ready, setReady]         = useState(false)
  const [popup, setPopup]         = useState<{ certUid: string; sessionId: string } | null>(null)

  useEffect(() => {
    const answers = localStorage.getItem('axion_pending_answers')
    const session = localStorage.getItem('axion_session')
    if (!answers || !session) { router.replace('/'); return }
    setReady(true)
  }, [router])

  const active = hovered || rating

  async function handleSubmit() {
    if (!rating) return
    setSubmitting(true)
    setError(null)
    try {
      const raw     = localStorage.getItem('axion_session')
      const answers = localStorage.getItem('axion_pending_answers')
      if (!raw || !answers) throw new Error('Session expirée')
      const session  = JSON.parse(raw)
      const reponses = JSON.parse(answers)

      const res = await fetch('/api/submit-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passe_id: session.passe_id, ecole_id: session.ecole_id,
          nom_etudiant: session.nom_etudiant, promo: session.promo ?? '',
          reponses, satisfaction: rating,
          satisfaction_comment: comment.trim() || null,
        }),
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d?.error ?? 'Erreur de soumission') }
      const data = await res.json()

      // Nettoyer les données temporaires
      localStorage.removeItem('axion_pending_answers')
      localStorage.removeItem('axion_chrono_start')
      localStorage.removeItem('axion_chrono_duree')

      // Afficher la popup de félicitations
      setPopup({ certUid: data.cert_uid, sessionId: data.session_id })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setSubmitting(false)
    }
  }

  if (!ready) return null

  return (
    <>
      {popup && (
        <SuccessPopup
          certUid={popup.certUid}
          sessionId={popup.sessionId}
          onClose={() => router.push(`/resultats?session_id=${popup.sessionId}&cert_uid=${popup.certUid}`)}
        />
      )}

      <main className="min-h-screen bg-[#f0f4fa] flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10 w-full max-w-lg">

          <div className="w-14 h-14 rounded-2xl bg-[#EEF4FC] flex items-center justify-center mb-6">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="1.8">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Votre avis compte</h1>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Dernière étape ! Partagez votre ressenti sur cette évaluation avant de découvrir vos résultats.
          </p>

          {/* Étoiles */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Satisfaction globale *</p>
            <div className="flex gap-2 mb-2" onMouseLeave={() => setHovered(0)}>
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHovered(star)}
                  className="transition-transform duration-150 hover:scale-110 focus:outline-none" aria-label={`${star} étoile${star > 1 ? 's' : ''}`}>
                  <svg width="40" height="40" viewBox="0 0 24 24"
                    fill={star <= active ? '#F5A623' : 'none'}
                    stroke={star <= active ? '#F5A623' : '#CBD5E1'}
                    strokeWidth="1.5" className="transition-all duration-150">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </button>
              ))}
            </div>
            <p className={`text-xs transition-all duration-200 ${active ? 'text-[#0A66C2]' : 'text-transparent'}`}>{MESSAGES[active]}</p>
          </div>

          {/* Commentaire */}
          <div className="mb-8">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Commentaire (optionnel)</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)}
              placeholder="Ce que vous avez apprécié, ce qui pourrait être amélioré…"
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-slate-700 placeholder-slate-300"/>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm mb-4">{error}</div>}

          <button onClick={handleSubmit} disabled={!rating || submitting}
            className="w-full bg-[#1a3c6e] hover:bg-[#15305a] disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            {submitting ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Envoi en cours…</>
            ) : 'Soumettre et voir mes résultats →'}
          </button>
          {!rating && <p className="text-xs text-center text-slate-400 mt-3">Sélectionnez une note pour continuer</p>}
        </div>
      </main>
    </>
  )
}
