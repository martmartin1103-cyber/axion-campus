'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const MESSAGES = [
  '',
  'Très insatisfait · Beaucoup de points à améliorer',
  'Insatisfait · L\'expérience n\'a pas répondu aux attentes',
  'Neutre · L\'expérience était correcte',
  'Satisfait · Bonne expérience globale',
  'Très satisfait · Expérience excellente !',
]

export default function SatisfactionPage() {
  const router = useRouter()
  const [rating, setRating]     = useState(0)
  const [hovered, setHovered]   = useState(0)
  const [comment, setComment]   = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [ready, setReady]       = useState(false)

  useEffect(() => {
    // Vérifier qu'on a bien des réponses en attente
    const answers = localStorage.getItem('axion_pending_answers')
    const session = localStorage.getItem('axion_session')
    if (!answers || !session) {
      router.replace('/')
      return
    }
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

      const session = JSON.parse(raw)
      const reponses = JSON.parse(answers)

      const res = await fetch('/api/submit-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passe_id:     session.passe_id,
          ecole_id:     session.ecole_id,
          nom_etudiant: session.nom_etudiant,
          promo:        session.promo ?? '',
          reponses,
          satisfaction: rating,
          satisfaction_comment: comment.trim() || null,
        }),
      })

      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d?.error ?? 'Erreur lors de la soumission')
      }

      const data = await res.json()

      // Nettoyer les réponses en attente
      localStorage.removeItem('axion_pending_answers')

      router.push(`/resultats?session_id=${data.session_id}&cert_uid=${data.cert_uid}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setSubmitting(false)
    }
  }

  if (!ready) return null

  return (
    <main className="min-h-screen bg-[#f0f4fa] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10 w-full max-w-lg">

        {/* Icône */}
        <div className="w-14 h-14 rounded-2xl bg-[#EEF4FC] flex items-center justify-center mb-6">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="1.8">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-1">Votre avis compte</h1>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Avant de découvrir vos résultats, partagez votre expérience avec cette évaluation.
          Cela prend 10 secondes.
        </p>

        {/* Étoiles */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Satisfaction globale *
          </p>
          <div
            className="flex gap-2 mb-2"
            onMouseLeave={() => setHovered(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                className="transition-transform duration-150 hover:scale-110 focus:outline-none"
                aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
              >
                <svg
                  width="40" height="40" viewBox="0 0 24 24"
                  fill={star <= active ? '#F5A623' : 'none'}
                  stroke={star <= active ? '#F5A623' : '#CBD5E1'}
                  strokeWidth="1.5"
                  className="transition-all duration-150"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </button>
            ))}
          </div>
          <p className={`text-xs transition-all duration-200 ${active ? 'text-[#0A66C2]' : 'text-transparent'}`}>
            {MESSAGES[active]}
          </p>
        </div>

        {/* Commentaire optionnel */}
        <div className="mb-8">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
            Commentaire (optionnel)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ce que vous avez apprécié, ce qui pourrait être amélioré…"
            rows={3}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-slate-700 placeholder-slate-300"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Bouton */}
        <button
          onClick={handleSubmit}
          disabled={!rating || submitting}
          className="w-full bg-[#1a3c6e] hover:bg-[#15305a] disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Envoi en cours…
            </>
          ) : (
            'Voir mes résultats →'
          )}
        </button>

        {!rating && (
          <p className="text-xs text-center text-slate-400 mt-3">
            Sélectionnez une note pour continuer
          </p>
        )}
      </div>
    </main>
  )
}
