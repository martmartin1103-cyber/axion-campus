'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ReconnexionPage() {
  const router = useRouter()
  const [nom, setNom]     = useState('')
  const [code, setCode]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // On revalide le code pour retrouver ecole_id et verifier coherence
      const res  = await fetch('/api/validate-code', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()

      if (!res.ok) {
        // Code deja utilise = etudiant existant → on cherche sa session
        if (data.error?.includes('deja ete utilise') || res.status === 400) {
          // Chercher la session par nom + ecole via API dediee
          const res2 = await fetch(`/api/find-session?nom=${encodeURIComponent(nom)}&code=${encodeURIComponent(code)}`)
          const d2   = await res2.json()
          if (!res2.ok || !d2.session_id) {
            setError('Aucun resultat trouve pour ce nom et ce code. Verifiez vos informations.')
            setLoading(false)
            return
          }
          router.push(`/resultats?session_id=${d2.session_id}&cert_uid=${d2.cert_uid}`)
          return
        }
        setError(data.error || 'Erreur de verification')
        setLoading(false)
        return
      }

      // Code pas encore utilise : cet etudiant n a pas encore passe le test
      setError('Ce code n a pas encore ete utilise. Si c est votre premiere connexion, cliquez sur "Creer mon compte".')
    } catch {
      setError('Erreur reseau. Reessayez.')
    }
    setLoading(false)
  }

  return (
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

          <div className="w-14 h-14 rounded-2xl bg-[#EEF4FC] flex items-center justify-center mb-6">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="1.8">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Retrouver mes resultats</h1>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">
            Entrez votre prenom + nom et le code d acces que vous avez utilise lors de votre passage.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Prenom et Nom *</label>
              <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Marie Lambert" required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"/>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Code d acces *</label>
              <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="EFREI-2026-DEMO1" required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"/>
            </div>

            {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm leading-relaxed">{error}</div>}

            <button type="submit" disabled={loading}
              className="w-full bg-[#1a3c6e] hover:bg-[#15305a] disabled:opacity-60 text-white py-3.5 rounded-xl text-sm font-semibold transition-colors">
              {loading ? 'Recherche en cours...' : 'Retrouver mes resultats'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 leading-relaxed">
              Vos resultats sont retrouves grace a votre nom et code d acces. Si vous avez un doute, contactez votre etablissement.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
