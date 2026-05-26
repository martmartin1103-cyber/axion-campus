'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { QUESTIONS } from '@/data/questions'

const TOTAL        = QUESTIONS.length
const DUREE_TOTALE = 180 // secondes

// ── Bandeau chrono ────────────────────────────────────────────────────────────
function ChronoBanner({ remaining }: { remaining: number }) {
  const urgent = remaining <= 30
  const duree  = DUREE_TOTALE
  const pct    = (remaining / duree) * 100
  const min    = Math.floor(remaining / 60).toString().padStart(2, '0')
  const sec    = (remaining % 60).toString().padStart(2, '0')

  return (
    <div className={`fixed top-14 left-0 right-0 z-40 flex items-center justify-center gap-3 py-2 text-sm font-medium transition-all duration-500 ${urgent ? 'bg-red-600' : 'bg-[#1a3c6e]'} text-white shadow-md`}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
      <span className="text-xs opacity-80">Temps restant :</span>
      <span className={`font-black font-mono text-base ${urgent ? 'animate-pulse' : ''}`}>{min}:{sec}</span>
      <div className="w-28 h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${urgent ? 'bg-red-200' : 'bg-white'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {urgent && <span className="text-xs font-bold animate-pulse">Finissez vite !</span>}
    </div>
  )
}

// ── Recap réponses (lecture seule quand temps écoulé) ─────────────────────────
function RecapAnswers({
  answers,
  onContinue,
}: {
  answers: Record<string, string>
  onContinue: () => void
}) {
  return (
    <main className="min-h-screen bg-[#f0f4fa] px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Alerte temps écoulé */}
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-start gap-3 mb-8">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
          </svg>
          <div>
            <p className="text-sm font-bold text-red-700">Temps écoulé !</p>
            <p className="text-xs text-red-600 mt-0.5 leading-relaxed">
              Les 3 minutes sont écoulées. Voici un récapitulatif de vos réponses sélectionnées.
              Elles ne peuvent plus être modifiées. Cliquez sur Continuer pour donner votre avis puis soumettre vos résultats.
            </p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Récapitulatif de vos réponses</h1>
        <p className="text-sm text-slate-500 mb-8">
          {Object.keys(answers).length} / {TOTAL} questions répondues
        </p>

        <div className="space-y-4 mb-10">
          {QUESTIONS.map((q, i) => {
            const chosen = answers[q.id]
            const chosenOpt = q.options.find(o => o.charAt(0) === chosen)
            return (
              <div key={q.id} className={`bg-white rounded-2xl border p-5 ${chosen ? 'border-slate-200' : 'border-red-200 bg-red-50/30'}`}>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 mb-3 leading-relaxed">{q.question}</p>
                    {chosen ? (
                      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a3c6e" strokeWidth="2.5" className="shrink-0 mt-0.5">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        <span className="text-sm text-[#1a3c6e] font-medium">{chosenOpt}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        <span className="text-sm text-red-600 italic">Non répondue</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={onContinue}
          className="w-full bg-[#1a3c6e] hover:bg-[#15305a] text-white py-4 rounded-2xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          Continuer — Donner mon avis et soumettre
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </main>
  )
}

// ── Page principale diagnostic ────────────────────────────────────────────────
export default function DiagnosticPage() {
  const router  = useRouter()
  const startRef = useRef<number>(0)

  const [current, setCurrent]         = useState(0)
  const [answers, setAnswers]         = useState<Record<string, string>>({})
  const [remaining, setRemaining]     = useState(DUREE_TOTALE)
  const [expired, setExpired]         = useState(false)
  const [showRecap, setShowRecap]     = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [error, setError]             = useState<string | null>(null)

  // ── Démarrage et tick du chrono ─────────────────────────────────────────────
  useEffect(() => {
    // Lire le timestamp de départ depuis localStorage (posé par /inscription)
    const stored = parseInt(localStorage.getItem('axion_chrono_start') || '0', 10)
    const duree  = parseInt(localStorage.getItem('axion_chrono_duree') || String(DUREE_TOTALE), 10)
    startRef.current = stored || Date.now()
    if (!stored) localStorage.setItem('axion_chrono_start', String(startRef.current))

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000)
      const left    = Math.max(0, duree - elapsed)
      setRemaining(left)
      if (left === 0) setExpired(true)
    }

    tick() // tick immédiat
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Quand le temps expire → afficher le récap sans pouvoir modifier
  useEffect(() => {
    if (expired && !showRecap) setShowRecap(true)
  }, [expired, showRecap])

  // ── Actions ─────────────────────────────────────────────────────────────────
  const selectOption = (letter: string) => {
    if (expired) return // Bloquer après expiration
    setAnswers(prev => ({ ...prev, [QUESTIONS[current].id]: letter }))
  }

  const goNext = () => { if (current < TOTAL - 1) setCurrent(c => c + 1) }
  const goPrev = () => { if (current > 0) setCurrent(c => c - 1) }

  const handleSubmit = useCallback(() => {
    const session = JSON.parse(localStorage.getItem('axion_session') || '{}')
    if (!session.passe_id) { setError('Session expirée.'); return }
    setSubmitting(true)
    localStorage.setItem('axion_pending_answers', JSON.stringify(answers))
    router.push('/satisfaction')
  }, [answers, router])

  // ── Vue récap (temps écoulé) ─────────────────────────────────────────────────
  if (showRecap) {
    return <RecapAnswers answers={answers} onContinue={handleSubmit}/>
  }

  const question  = QUESTIONS[current]
  const selected  = answers[question.id]
  const completed = Object.keys(answers).length
  const progress  = Math.round((completed / TOTAL) * 100)
  const isLast    = current === TOTAL - 1

  return (
    <>
      <ChronoBanner remaining={remaining}/>

      <main className="min-h-screen bg-white flex flex-col items-center px-4 pt-20 pb-10">

        <div className="w-full max-w-2xl mb-8">
          <h1 className="text-2xl font-semibold text-[#1a3c6e] mb-1">Diagnostic de maturité IA</h1>
          <p className="text-sm text-gray-500">Question {current + 1} sur {TOTAL}</p>
        </div>

        <div className="w-full max-w-2xl mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{completed} question{completed > 1 ? 's' : ''} complétée{completed > 1 ? 's' : ''}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-[#1a3c6e] h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}/>
          </div>
        </div>

        <div className="w-full max-w-2xl mb-4">
          <span className="inline-block text-xs font-medium bg-blue-50 text-[#1a3c6e] border border-blue-200 rounded-full px-3 py-1">
            D{question.dimension} — {question.dim_label}
          </span>
        </div>

        <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-sm p-8 mb-6">
          <p className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">{question.question}</p>
          <fieldset className="space-y-3">
            {question.options.map(opt => {
              const letter     = opt.charAt(0)
              const isSelected = selected === letter
              return (
                <label key={letter} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-150 ${isSelected ? 'border-[#1a3c6e] bg-blue-50 text-[#1a3c6e]' : 'border-gray-200 hover:border-[#1a3c6e] hover:bg-gray-50 text-gray-700'}`}>
                  <input type="radio" name={question.id} value={letter} checked={isSelected} onChange={() => selectOption(letter)} className="mt-0.5 accent-[#1a3c6e] shrink-0"/>
                  <span className="text-sm leading-relaxed">{opt}</span>
                </label>
              )
            })}
          </fieldset>
        </div>

        {error && (
          <div className="w-full max-w-2xl mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}

        <div className="w-full max-w-2xl flex items-center justify-between">
          <button onClick={goPrev} disabled={current === 0} className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#1a3c6e] border border-[#1a3c6e] hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            ← Précédent
          </button>
          {isLast ? (
            <button onClick={handleSubmit} disabled={!selected || submitting} className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-[#1a3c6e] text-white hover:bg-[#15305a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              {submitting ? 'Redirection…' : 'Terminer le test →'}
            </button>
          ) : (
            <button onClick={goNext} disabled={!selected} className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-[#1a3c6e] text-white hover:bg-[#15305a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Suivant →
            </button>
          )}
        </div>

        <div className="flex gap-1.5 mt-8">
          {QUESTIONS.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all duration-150 ${i === current ? 'bg-[#1a3c6e] w-4' : answers[QUESTIONS[i].id] ? 'bg-blue-300' : 'bg-gray-200'}`} aria-label={`Question ${i + 1}`}/>
          ))}
        </div>
      </main>
    </>
  )
}
