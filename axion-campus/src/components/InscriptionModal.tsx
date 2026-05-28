'use client'

/**
 * US5 — InscriptionModal + FloatingCTA
 * Branche : feat/us5-us8-medium
 * Fichier  : src/components/InscriptionModal.tsx  (NOUVEAU)
 *
 * Exports :
 *   - InscriptionModal : modal d'inscription (3 champs, validation, succès)
 *   - FloatingCTA      : bouton persistant bas-droite, ouvre la modal
 *
 * Usage dans src/app/layout.tsx :
 *   import { FloatingCTA } from '@/components/InscriptionModal'
 *   // puis dans <body> avant </body> :
 *   <FloatingCTA />
 *
 * Usage inline dans n'importe quelle page :
 *   import { InscriptionModal } from '@/components/InscriptionModal'
 *   const [open, setOpen] = useState(false)
 *   <button onClick={() => setOpen(true)}>CTA</button>
 *   <InscriptionModal open={open} onClose={() => setOpen(false)} />
 */

import { useEffect, useRef, useState } from 'react'

/* ── Types ── */
interface FormData {
  prenom: string
  email: string
  ecole: string
  taille_ecole: string
}

interface FormErrors {
  prenom?: string
  email?: string
  ecole?: string
}

type ModalState = 'idle' | 'loading' | 'success' | 'error'

/* ── Validation en temps réel ── */
function validateField(name: keyof FormData, value: string): string | undefined {
  switch (name) {
    case 'prenom':
      if (!value.trim()) return 'Champ requis.'
      if (value.trim().length < 2) return 'Au moins 2 caractères.'
      return undefined
    case 'email':
      if (!value.trim()) return 'Champ requis.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) return 'Email invalide.'
      return undefined
    case 'ecole':
      if (!value.trim()) return 'Champ requis.'
      if (value.trim().length < 2) return 'Au moins 2 caractères.'
      return undefined
    default:
      return undefined
  }
}

/* ── Champ de formulaire ── */
function Field({
  label, name, type = 'text', placeholder, value, error, touched,
  onChange, onBlur,
}: {
  label: string; name: keyof FormData; type?: string; placeholder: string
  value: string; error?: string; touched: boolean
  onChange: (n: keyof FormData, v: string) => void
  onBlur: (n: keyof FormData) => void
}) {
  const hasError = touched && !!error
  const isValid  = touched && !error && value.trim().length > 0

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(name, e.target.value)}
          onBlur={() => onBlur(name)}
          autoComplete={name === 'email' ? 'email' : name === 'prenom' ? 'given-name' : 'organization'}
          className={`
            w-full rounded-xl px-4 py-3 text-sm bg-white/[0.06] border
            text-white placeholder-slate-600
            focus:outline-none focus:ring-2 transition-all duration-150
            ${hasError
              ? 'border-red-500/60 focus:ring-red-500/20 bg-red-500/[0.05]'
              : isValid
              ? 'border-[#0A66C2]/60 focus:ring-[#0A66C2]/20'
              : 'border-white/[0.1] focus:ring-[#0A66C2]/20 focus:border-[#0A66C2]/40'}
          `}
        />
        {/* Icône statut */}
        {touched && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {hasError
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            }
          </div>
        )}
      </div>
      {hasError && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          {error}
        </p>
      )}
    </div>
  )
}

/* ── Sélect taille école ── */
const TAILLES = [
  { value: '',             label: 'Taille de l\'établissement (optionnel)' },
  { value: '<100',         label: '< 100 étudiants' },
  { value: '100-500',      label: '100 – 500 étudiants' },
  { value: '500-2000',     label: '500 – 2 000 étudiants' },
  { value: '2000-10000',   label: '2 000 – 10 000 étudiants' },
  { value: '>10000',       label: '> 10 000 étudiants' },
]

/* ════════════════════════════════════════════════
   COMPOSANT PRINCIPAL — InscriptionModal
   ════════════════════════════════════════════════ */
export function InscriptionModal({
  open, onClose,
}: {
  open: boolean; onClose: () => void
}) {
  const [form, setForm] = useState<FormData>({
    prenom: '', email: '', ecole: '', taille_ecole: '',
  })
  const [errors,  setErrors]  = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [state,   setState]   = useState<ModalState>('idle')
  const [apiError, setApiError] = useState('')

  const firstFieldRef = useRef<HTMLDivElement>(null)

  /* Focus trap & scroll lock */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => {
        const input = firstFieldRef.current?.querySelector('input')
        input?.focus()
      }, 100)
    } else {
      document.body.style.overflow = ''
      /* Reset form à la fermeture */
      setTimeout(() => {
        setForm({ prenom: '', email: '', ecole: '', taille_ecole: '' })
        setErrors({}); setTouched({}); setState('idle'); setApiError('')
      }, 300)
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  /* Fermer sur Escape */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [open, onClose])

  const handleChange = (name: keyof FormData, value: string) => {
    setForm(f => ({ ...f, [name]: value }))
    if (touched[name]) {
      setErrors(e => ({ ...e, [name]: validateField(name, value) }))
    }
  }

  const handleBlur = (name: keyof FormData) => {
    setTouched(t => ({ ...t, [name]: true }))
    setErrors(e => ({ ...e, [name]: validateField(name, form[name]) }))
  }

  const isFormValid = !validateField('prenom', form.prenom)
    && !validateField('email', form.email)
    && !validateField('ecole', form.ecole)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    /* Toucher tous les champs pour afficher les erreurs */
    const allTouched = { prenom: true, email: true, ecole: true }
    setTouched(allTouched)
    setErrors({
      prenom: validateField('prenom', form.prenom),
      email:  validateField('email',  form.email),
      ecole:  validateField('ecole',  form.ecole),
    })
    if (!isFormValid) return

    setState('loading')
    setApiError('')

    try {
      const res = await fetch('/api/contact-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok && res.status !== 422) {
        setApiError(data.error ?? 'Une erreur est survenue.')
        setState('error')
        return
      }
      if (data.errors) {
        setErrors(data.errors)
        setState('idle')
        return
      }
      setState('success')
    } catch {
      setApiError('Impossible de contacter le serveur. Vérifiez votre connexion.')
      setState('error')
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      role="dialog" aria-modal="true" aria-label="Inscription Axion Campus"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panneau */}
      <div className={`
        relative w-full max-w-md bg-[#0a1628] border border-white/[0.1]
        rounded-3xl shadow-2xl shadow-black/60 overflow-hidden
        transition-all duration-300
        ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        animate-[modalIn_0.25s_cubic-bezier(0.34,1.56,0.64,1)]
      `}>

        {/* Halo décoratif */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#0A66C2] opacity-[0.12] blur-3xl pointer-events-none"/>

        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 border-b border-white/[0.06]">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-[#0A66C2] flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-xs font-bold text-[#7DD3FC] tracking-widest uppercase">Axion Campus™</span>
              </div>
              <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                Démarrer ma certification
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Votre établissement sera contacté sous 24h.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/[0.06] mt-1"
              aria-label="Fermer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Corps */}
        <div className="relative px-8 py-6">
          {/* ── État succès ── */}
          {state === 'success' ? (
            <div className="text-center py-8 animate-[fadeIn_0.4s_ease]">
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3 className="text-xl font-black text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                Demande enregistrée !
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Merci <strong className="text-white">{form.prenom}</strong> ! Notre équipe vous contactera à <strong className="text-[#7DD3FC]">{form.email}</strong> dans les 24h pour paramétrer votre accès.
              </p>
              <button
                onClick={onClose}
                className="bg-[#0A66C2] hover:bg-[#0958a8] text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
              >
                Fermer
              </button>
            </div>
          ) : (
            /* ── Formulaire ── */
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div ref={firstFieldRef}>
                <Field
                  label="Prénom *" name="prenom" placeholder="Marie"
                  value={form.prenom} error={errors.prenom}
                  touched={!!touched.prenom}
                  onChange={handleChange} onBlur={handleBlur}
                />
              </div>
              <Field
                label="Email professionnel ou scolaire *" name="email" type="email"
                placeholder="marie@mon-ecole.fr"
                value={form.email} error={errors.email}
                touched={!!touched.email}
                onChange={handleChange} onBlur={handleBlur}
              />
              <Field
                label="Établissement *" name="ecole"
                placeholder="EFREI Paris, HEC, Université de Lyon…"
                value={form.ecole} error={errors.ecole}
                touched={!!touched.ecole}
                onChange={handleChange} onBlur={handleBlur}
              />

              {/* Sélect taille (optionnel) */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                  Taille de l'établissement
                </label>
                <select
                  value={form.taille_ecole}
                  onChange={e => setForm(f => ({ ...f, taille_ecole: e.target.value }))}
                  className="w-full rounded-xl px-4 py-3 text-sm bg-white/[0.06] border border-white/[0.1]
                    text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2]/40
                    transition-all appearance-none"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                >
                  {TAILLES.map(t => (
                    <option key={t.value} value={t.value} className="bg-[#0a1628]">{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Erreur API */}
              {(state === 'error' && apiError) && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-sm text-red-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                  {apiError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={state === 'loading'}
                className={`
                  w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200
                  flex items-center justify-center gap-2
                  ${isFormValid
                    ? 'bg-[#0A66C2] hover:bg-[#0958a8] text-white hover:scale-[1.01] hover:shadow-lg hover:shadow-[#0A66C2]/25'
                    : 'bg-white/[0.06] text-slate-500 cursor-not-allowed'}
                  disabled:opacity-60 disabled:cursor-not-allowed
                `}
              >
                {state === 'loading' ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    Obtenir ma certification
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer RGPD */}
        {state !== 'success' && (
          <div className="px-8 pb-6 text-center">
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Vos données sont traitées conformément à notre{' '}
              <a href="#" className="text-slate-500 hover:text-slate-400 underline underline-offset-2 transition-colors">
                politique de confidentialité
              </a>
              . Aucun spam, désinscription à tout moment.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

/* ════════════════════════════════════════════════
   FLOATING CTA — bouton persistant bas-droite
   À placer dans layout.tsx pour toutes les pages
   ════════════════════════════════════════════════ */
export function FloatingCTA() {
  const [open,    setOpen]    = useState(false)
  const [visible, setVisible] = useState(false)

  /* Apparaît après 3s ou 300px de scroll */
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000)
    const onScroll = () => { if (window.scrollY > 300) setVisible(true) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll) }
  }, [])

  /* Masquer sur les pages qui ne sont pas la landing */
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    if (path.startsWith('/admin') || path.startsWith('/diagnostic') || path.startsWith('/resultats') || path.startsWith('/satisfaction')) {
      return null
    }
  }

  return (
    <>
      <div className={`
        fixed bottom-6 right-6 z-50 transition-all duration-500
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}>
        <button
          onClick={() => setOpen(true)}
          className="group flex items-center gap-2.5 bg-[#0A66C2] hover:bg-[#0958a8]
            text-white font-semibold px-5 py-3 rounded-2xl shadow-xl shadow-[#0A66C2]/30
            transition-all duration-200 hover:scale-[1.04] hover:shadow-2xl hover:shadow-[#0A66C2]/40
            text-sm whitespace-nowrap"
          aria-label="Démarrer ma certification"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="6"/>
            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
          </svg>
          <span>Démarrer ma certification</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            className="transition-transform group-hover:translate-x-0.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
      <InscriptionModal open={open} onClose={() => setOpen(false)}/>
    </>
  )
}
