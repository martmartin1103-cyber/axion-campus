'use client'

import { useEffect, useState } from 'react'

const OFFRES: Record<string, { nom: string; desc: string; prix: string; passes: number; couleur: string; badge?: string }> = {
  pilote:  { nom:'Pilote',    desc:'Offre temporaire pour les écoles partenaires fondatrices',      prix:'Gratuit',  passes:10,  couleur:'#7C3AED', badge:'Offre pilote' },
  starter: { nom:'Starter',   desc:'Idéal pour débuter la certification IA dans votre établissement', prix:'490€/an', passes:30,  couleur:'#059669' },
  campus:  { nom:'Campus',    desc:'Pour les formations de taille intermédiaire',                    prix:'990€/an', passes:100, couleur:'#0A66C2' },
  pro:     { nom:'Pro',       desc:'Pour les grandes écoles et universités',                          prix:'1 990€/an',passes:300,couleur:'#1a3c6e', badge:'Populaire' },
}

type Contrat = {
  id: string
  offre: string
  date_souscription: string
  date_renouvellement: string
  date_fin: string
  renouvellement_auto: boolean
  statut: string
  nb_passes_total: number
  contact_axion: string
  stripe_subscription_id?: string
}

type Stats = { nb_utilises: number }

function InfoRow({ label, value, mono=false }: { label:string; value:string; mono?:boolean }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-semibold text-slate-900 text-right max-w-[60%] ${mono?'font-mono':''}`}>{value}</span>
    </div>
  )
}

function DateBadge({ date, label }: { date:string; label:string }) {
  const d = new Date(date)
  const now = new Date()
  const diffDays = Math.ceil((d.getTime()-now.getTime())/(1000*60*60*24))
  const urgent = diffDays < 30 && diffDays > 0
  const expired = diffDays <= 0
  return (
    <div className={`rounded-xl p-4 border ${expired?'bg-red-50 border-red-200':urgent?'bg-amber-50 border-amber-200':'bg-slate-50 border-slate-200'}`}>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-base font-bold ${expired?'text-red-600':urgent?'text-amber-700':'text-slate-900'}`}>
        {d.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}
      </p>
      {urgent && <p className="text-xs text-amber-600 mt-1 font-medium">⚠ Dans {diffDays} jours</p>}
      {expired && <p className="text-xs text-red-600 mt-1 font-medium">Expiré</p>}
    </div>
  )
}

export default function AdminContratPage() {
  const [contrat, setContrat]   = useState<Contrat|null>(null)
  const [stats, setStats]       = useState<Stats|null>(null)
  const [ecole, setEcole]       = useState<{nom:string;contact_referent:string;adresse:string;fiche_rncp:string}|null>(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/contrat').then(r=>r.json()),
      fetch('/api/admin/stats').then(r=>r.json()),
      fetch('/api/admin/ecole').then(r=>r.json()),
    ]).then(([c,s,e])=>{
      if(c.id) setContrat(c)
      if(s.kpis) setStats({nb_utilises:s.kpis.total})
      if(e.nom) setEcole(e)
    }).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  if (loading) return <div className="animate-pulse space-y-4">{[...Array(3)].map((_,i)=><div key={i} className="h-24 bg-slate-100 rounded-2xl"/>)}</div>

  const offre = OFFRES[contrat?.offre||'starter']
  const utilisees = stats?.nb_utilises || 0
  const total = contrat?.nb_passes_total || offre.passes
  const pctPassses = Math.min(100, Math.round((utilisees/total)*100))

  return (
    <div className="max-w-4xl space-y-6">

      {/* Badge offre active */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden shadow-lg" style={{background:`linear-gradient(135deg,${offre.couleur} 0%,${offre.couleur}cc 100%)`}}>
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)',backgroundSize:'28px 28px'}}/>
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              {offre.badge && <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">{offre.badge}</span>}
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${contrat?.statut==='actif'?'bg-green-400/30 text-green-100':'bg-red-400/30 text-red-100'}`}>
                {contrat?.statut||'actif'}
              </span>
            </div>
            <h1 className="text-3xl font-black mb-1">Offre {offre.nom}</h1>
            <p className="text-white/70 text-sm">{offre.desc}</p>
          </div>
          <div className="text-right shrink-0 ml-6">
            <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Tarif</p>
            <p className="text-2xl font-black">{offre.prix}</p>
          </div>
        </div>

        {/* Barre passes */}
        <div className="relative mt-6">
          <div className="flex items-center justify-between text-xs text-white/70 mb-2">
            <span>Passes utilisées</span>
            <span className="font-bold text-white">{utilisees} / {total}</span>
          </div>
          <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-700" style={{width:`${pctPassses}%`}}/>
          </div>
          {pctPassses >= 80 && (
            <p className="text-xs text-white/80 mt-2">⚠ {total-utilisees} passes restantes — pensez à renouveler</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Informations contrat */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Détails du contrat</h2>
          </div>
          <div className="px-6 py-2">
            <InfoRow label="Établissement" value={ecole?.nom||'—'}/>
            <InfoRow label="Référence RNCP/UAI" value={ecole?.fiche_rncp||'—'} mono/>
            <InfoRow label="Adresse" value={ecole?.adresse||'—'}/>
            <InfoRow label="Référent contrat" value={ecole?.contact_referent||'—'}/>
            <InfoRow label="Contact Axion Campus" value={contrat?.contact_axion||'support@axion-campus.fr'}/>
            <InfoRow label="Offre souscrite" value={`Axion ${offre.nom}`}/>
            <InfoRow label="Passes incluses" value={`${total} codes d'accès`}/>
            <InfoRow label="Passes utilisées" value={`${utilisees} (${pctPassses}%)`}/>
            {contrat?.stripe_subscription_id && (
              <InfoRow label="Réf. abonnement" value={contrat.stripe_subscription_id} mono/>
            )}
          </div>
        </div>

        {/* Dates + renouvellement */}
        <div className="space-y-4">
          {contrat && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <DateBadge date={contrat.date_souscription} label="Souscription"/>
                <DateBadge date={contrat.date_renouvellement} label="Renouvellement"/>
                <DateBadge date={contrat.date_fin} label="Fin de contrat"/>
              </div>
            </>
          )}

          {/* Toutes les offres */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Nos offres</h3>
            <div className="space-y-3">
              {Object.entries(OFFRES).map(([key,o])=>{
                const active = contrat?.offre===key
                return (
                  <div key={key} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${active?'border-[#1a3c6e] bg-blue-50':'border-slate-100 hover:border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor:o.couleur}}/>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{o.nom}</p>
                        <p className="text-xs text-slate-400">{o.passes} passes · {o.prix}</p>
                      </div>
                    </div>
                    {active ? (
                      <span className="text-xs font-bold text-[#1a3c6e] bg-blue-100 px-2.5 py-1 rounded-full">Actif</span>
                    ) : (
                      <a href="mailto:commercial@axion-campus.fr?subject=Demande upgrade offre"
                        className="text-xs text-slate-400 hover:text-[#1a3c6e] font-medium transition-colors">Passer →</a>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
