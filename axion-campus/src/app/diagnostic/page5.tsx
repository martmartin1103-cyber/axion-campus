'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { QUESTIONS } from '@/data/questions'

const TOTAL = QUESTIONS.length

// ── Chrono persistant (lit le timestamp de demarrage depuis localStorage) ─────
function ChronoBanner({ onExpire }: { onExpire: () => void }) {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    const start  = parseInt(localStorage.getItem('axion_chrono_start') || '0', 10)
    const duree  = parseInt(localStorage.getItem('axion_chrono_duree') || '180', 10)
    if (!start) { setRemaining(duree); return }

    const calc = () => {
      const elapsed = Math.floor((Date.now() - start) / 1000)
      const left    = Math.max(0, duree - elapsed)
      setRemaining(left)
      if (left === 0) onExpire()
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [onExpire])

  if (remaining === null) return null

  const min    = Math.floor(remaining / 60).toString().padStart(2, '0')
  const sec    = (remaining % 60).toString().padStart(2, '0')
  const urgent = remaining <= 30
  const duree  = parseInt(localStorage.getItem('axion_chrono_duree') || '180', 10)
  const pct    = (remaining / duree) * 100

  return (
    <div className={`fixed top-14 left-0 right-0 z-40 flex items-center justify-center gap-3 py-2 text-sm font-medium transition-colors ${urgent ? 'bg-red-600 text-white' : 'bg-[#1a3c6e] text-white'}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
      <span>Temps restant :</span>
      <span className="font-black text-base font-mono">{min}:{sec}</span>
      <div className="w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${pct}%` }}/>
      </div>
      {urgent && <span className="animate-pulse font-bold">Depechezvous !</span>}
    </div>
  )
}

export default function DiagnosticPage() {
  const router = useRouter()
  const [current, setCurrent]       = useState(0)
  const [answers, setAnswers]       = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState<string | null>(null)

  const question  = QUESTIONS[current]
  const selected  = answers[question.id]
  const completed = Object.keys(answers).length
  const progress  = Math.round((completed / TOTAL) * 100)
  const isLast    = current === TOTAL - 1

  // Soumission automatique quand chrono expire
  const handleExpire = useCallback(() => {
    if (submitting) return
    // Sauvegarde ce qu on a et on redirige vers satisfaction quand meme
    const session = JSON.parse(localStorage.getItem('axion_session') || '{}')
    if (!session.passe_id) { router.push('/'); return }
    localStorage.setItem('axion_pending_answers', JSON.stringify(answers))
    router.push('/satisfaction')
  }, [answers, submitting, router])

  function selectOption(letter: string) {
    setAnswers(prev => ({ ...prev, [question.id]: letter }))
  }
  function goNext() { if (current < TOTAL - 1) setCurrent(c => c + 1) }
  function goPrev() { if (current > 0) setCurrent(c => c - 1) }

  function handleSubmit() {
    const session = JSON.parse(localStorage.getItem('axion_session') || '{}')
    if (!session.passe_id) { setError('Session expiree.'); return }
    setSubmitting(true)
    localStorage.setItem('axion_pending_answers', JSON.stringify(answers))
    router.push('/satisfaction')
  }

  return (
    <>
      <ChronoBanner onExpire={handleExpire}/>

      <main className="min-h-screen bg-white flex flex-col items-center px-4 pt-20 pb-10">

        <div className="w-full max-w-2xl mb-8">
          <h1 className="text-2xl font-semibold text-[#1a3c6e] mb-1">Diagnostic de maturite IA</h1>
          <p className="text-sm text-gray-500">Question {current + 1} sur {TOTAL}</p>
        </div>

        <div className="w-full max-w-2xl mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{completed} question{completed > 1 ? 's' : ''} completee{completed > 1 ? 's' : ''}</span>
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

        {error && <div className="w-full max-w-2xl mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

        <div className="w-full max-w-2xl flex items-center justify-between">
          <button onClick={goPrev} disabled={current === 0} className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#1a3c6e] border border-[#1a3c6e] hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            Precedent
          </button>
          {isLast ? (
            <button onClick={handleSubmit} disabled={!selected || submitting} className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-[#1a3c6e] text-white hover:bg-[#15305a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              {submitting ? 'Redirection...' : 'Terminer le test'}
            </button>
          ) : (
            <button onClick={goNext} disabled={!selected} className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-[#1a3c6e] text-white hover:bg-[#15305a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Suivant
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
