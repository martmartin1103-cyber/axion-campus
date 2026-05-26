'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ConnexionPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [nom, setNom] = useState('')
  const [promo, setPromo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Code invalide')
        setLoading(false)
        return
      }

      localStorage.setItem('axion_session', JSON.stringify({
        passe_id:    data.passe_id,
        ecole_id:    data.ecole_id,
        ecole_nom:   data.ecole_nom,
        nom_etudiant: nom,
        promo,
      }))

      router.push('/diagnostic')
    } catch {
      setError('Erreur de connexion. Réessaie.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f4fa] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Back */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 mb-8 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Retour à l'accueil
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#1a3c6e] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-bold text-[#1a3c6e]">AXION CAMPUS™</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Espace étudiant</h1>
          <p className="text-sm text-slate-400 mb-8">
            Entrez le code fourni par votre établissement pour démarrer l'évaluation.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                Code d'accès *
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="EFREI-2026-DEMO1"
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                Prénom et Nom *
              </label>
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Marie Lambert"
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                Promotion
              </label>
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="Promo 2026"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a3c6e] hover:bg-[#15305a] disabled:opacity-60 text-white py-3.5 rounded-xl text-sm font-semibold transition-colors mt-2"
            >
              {loading ? 'Vérification…' : 'Commencer le diagnostic →'}
            </button>
          </form>

          <p className="text-xs text-center text-slate-400 mt-6">
            Certification privée AXION — Non reconnue par l'État
          </p>
        </div>
      </div>
    </div>
  )
}
