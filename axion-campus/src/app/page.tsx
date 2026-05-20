'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
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
        body: JSON.stringify({ code })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Code invalide')
        setLoading(false)
        return
      }

      localStorage.setItem('axion_session', JSON.stringify({
        passe_id: data.passe_id,
        ecole_id: data.ecole_id,
        ecole_nom: data.ecole_nom,
        nom_etudiant: nom,
        promo
      }))

      router.push('/diagnostic')
    } catch (err) {
      setError('Erreur de connexion. Réessaie.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4">

        <h1 className="text-2xl font-bold text-center">
          AXION CAMPUS™
        </h1>

        <p className="text-center text-sm text-gray-500">
          Certification IA Agentique
        </p>

        {/* CODE */}
        <div>
          <label className="text-sm font-medium">Code d'accès *</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="EFREI-2026-DEMO1"
            required
            className="w-full border rounded-xl px-4 py-3 text-sm uppercase"
          />
        </div>

        {/* NOM */}
        <div>
          <label className="text-sm font-medium">Prénom et Nom *</label>
          <input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Marie Lambert"
            required
            className="w-full border rounded-xl px-4 py-3 text-sm"
          />
        </div>

        {/* PROMO */}
        <div>
          <label className="text-sm font-medium">Promotion</label>
          <input
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            placeholder="Promo 2026"
            className="w-full border rounded-xl px-4 py-3 text-sm"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl"
        >
          {loading ? 'Vérification...' : 'Commencer le diagnostic →'}
        </button>

        <p className="text-xs text-center text-gray-400">
          Certification privée AXION — Non reconnue par l'État
        </p>

      </form>
    </div>
  )
}