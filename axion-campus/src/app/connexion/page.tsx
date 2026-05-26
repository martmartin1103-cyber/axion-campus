'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ConnexionChoixPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#f0f4fa] flex flex-col items-center justify-center px-4 py-12">

      {/* Back */}
      <button onClick={() => router.push('/')} className="self-start mb-8 ml-4 md:ml-0 flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors max-w-2xl w-full">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Retour
      </button>

      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#1a3c6e] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            </div>
            <span className="text-sm font-bold text-[#1a3c6e] tracking-tight">AXION CAMPUS</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3">Espace etudiant</h1>
          <p className="text-slate-500 text-base">Etes-vous en train de passer le test pour la premiere fois ?</p>
        </div>

        {/* Deux cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Premiere connexion */}
          <button
            onClick={() => router.push('/inscription')}
            className="group bg-white border-2 border-[#1a3c6e] hover:bg-[#1a3c6e] rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-xl hover:shadow-[#1a3c6e]/20 hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#EEF4FC] group-hover:bg-white/15 flex items-center justify-center mb-5 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a3c6e" strokeWidth="1.8" className="group-hover:stroke-white transition-colors">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </div>
            <span className="text-xs font-semibold text-[#1a3c6e] group-hover:text-blue-200 uppercase tracking-widest block mb-2 transition-colors">Premiere fois</span>
            <h2 className="text-xl font-bold text-slate-900 group-hover:text-white mb-2 transition-colors">Creer mon compte</h2>
            <p className="text-slate-500 group-hover:text-blue-100 text-sm leading-relaxed transition-colors">
              Entrez votre code d acces fourni par votre ecole et completez votre inscription.
            </p>
            <div className="mt-6 flex items-center gap-1.5 text-[#1a3c6e] group-hover:text-white text-xs font-medium transition-colors">
              Commencer <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </button>

          {/* Deja un compte */}
          <button
            onClick={() => router.push('/reconnexion')}
            className="group bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center mb-5 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
              </svg>
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Deja inscrit</span>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Me reconnecter</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              J ai deja passe le test. Je veux retrouver mes resultats et mon certificat.
            </p>
            <div className="mt-6 flex items-center gap-1.5 text-slate-500 group-hover:text-slate-700 text-xs font-medium transition-colors">
              Voir mes resultats <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">Certification privee AXION CAMPUS — Non reconnue par l Etat</p>
      </div>
    </div>
  )
}
