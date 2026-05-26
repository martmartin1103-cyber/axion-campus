'use client'

import { useEffect, useState } from 'react'

// Stripe est recommandé : npm install stripe
// Les factures sont gérées via le portail client Stripe

type PaymentInfo = {
  offre: string
  prix: string
  renouvellement_auto: boolean
  stripe_customer_id?: string
  stripe_subscription_id?: string
  date_renouvellement?: string
  statut: string
}

const OFFRES_PRIX: Record<string, {nom:string; prix:string; prixMensuel:string; couleur:string}> = {
  pilote:  { nom:'Pilote',  prix:'0€/an',       prixMensuel:'0€/mois',      couleur:'#7C3AED' },
  starter: { nom:'Starter', prix:'490€/an',     prixMensuel:'40,83€/mois',  couleur:'#059669' },
  campus:  { nom:'Campus',  prix:'990€/an',     prixMensuel:'82,50€/mois',  couleur:'#0A66C2' },
  pro:     { nom:'Pro',     prix:'1 990€/an',   prixMensuel:'165,83€/mois', couleur:'#1a3c6e' },
}

const FAKE_INVOICES = [
  { id:'INV-2026-003', date:'2026-04-01', montant:'490,00 €', statut:'Payée', url:'#' },
  { id:'INV-2026-002', date:'2025-04-01', montant:'490,00 €', statut:'Payée', url:'#' },
  { id:'INV-2026-001', date:'2024-04-01', montant:'390,00 €', statut:'Payée', url:'#' },
]

function Toggle({ enabled, onChange }: { enabled:boolean; onChange:(v:boolean)=>void }) {
  return (
    <button onClick={()=>onChange(!enabled)} type="button"
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${enabled?'bg-green-500':'bg-slate-300'}`}>
      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${enabled?'translate-x-6':''}`}/>
    </button>
  )
}

export default function AdminPaiementPage() {
  const [info, setInfo]           = useState<PaymentInfo|null>(null)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    fetch('/api/admin/contrat')
      .then(r=>r.json())
      .then(d=>{
        if(d.id) setInfo({
          offre: d.offre||'starter',
          prix: OFFRES_PRIX[d.offre||'starter']?.prix || '490€/an',
          renouvellement_auto: d.renouvellement_auto ?? true,
          stripe_customer_id: d.stripe_customer_id,
          stripe_subscription_id: d.stripe_subscription_id,
          date_renouvellement: d.date_renouvellement,
          statut: d.statut||'actif',
        })
      })
      .catch(()=>{})
      .finally(()=>setLoading(false))
  }, [])

  const toggleRenouvellement = async (value: boolean) => {
    if (!info) return
    const prev = info.renouvellement_auto
    setInfo(i=>i?{...i,renouvellement_auto:value}:null)
    setSaving(true)
    try {
      const res = await fetch('/api/admin/contrat', {
        method:'PATCH', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ renouvellement_auto: value }),
      })
      if(!res.ok) throw new Error()
      setSaved(true); setTimeout(()=>setSaved(false), 2500)
    } catch { setInfo(i=>i?{...i,renouvellement_auto:prev}:null) }
    setSaving(false)
  }

  const openStripePortal = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/admin/stripe-portal', { method:'POST' })
      const d   = await res.json()
      if(d.url) window.open(d.url, '_blank')
      else alert('Portail Stripe non configuré. Contactez support@axion-campus.fr')
    } catch { alert('Erreur ouverture portail') }
    setPortalLoading(false)
  }

  if (loading) return <div className="animate-pulse space-y-4">{[...Array(3)].map((_,i)=><div key={i} className="h-32 bg-slate-100 rounded-2xl"/>)}</div>

  const offreInfo = OFFRES_PRIX[info?.offre||'starter']

  return (
    <div className="max-w-3xl space-y-6">

      {/* Recommandation Stripe */}
      <div className="bg-[#635BFF]/10 border border-[#635BFF]/30 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#635BFF] flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
        </div>
        <div>
          <p className="text-sm font-bold text-[#635BFF] mb-1">Paiements gérés par Stripe</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Axion Campus utilise <strong>Stripe</strong> pour la facturation récurrente et la gestion des paiements. 
            Toutes vos factures, moyens de paiement et informations de facturation sont accessibles depuis le portail client Stripe.
          </p>
        </div>
      </div>

      {/* Abonnement actuel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Abonnement actuel</h2>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${info?.statut==='actif'?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}`}>
            {info?.statut||'actif'}
          </span>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Offre souscrite</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor:offreInfo.couleur}}/>
                <p className="text-2xl font-black text-slate-900">Axion {offreInfo.nom}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Tarification</p>
              <p className="text-2xl font-black text-slate-900">{offreInfo.prix}</p>
              <p className="text-xs text-slate-400">{offreInfo.prixMensuel}</p>
            </div>
          </div>

          {/* Renouvellement auto */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Renouvellement automatique</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {info?.renouvellement_auto
                  ? `Votre abonnement se renouvelle automatiquement${info.date_renouvellement ? ` le ${new Date(info.date_renouvellement).toLocaleDateString('fr-FR')}` : ''}`
                  : 'Votre abonnement ne sera pas renouvelé automatiquement'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {saving && <svg className="animate-spin h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
              {saved && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>}
              <Toggle enabled={info?.renouvellement_auto??true} onChange={toggleRenouvellement}/>
            </div>
          </div>

          {!info?.renouvellement_auto && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 leading-relaxed">
              ⚠ Le renouvellement automatique est désactivé. Votre accès prendra fin à la date d'expiration du contrat. Vous pouvez le réactiver à tout moment.
            </div>
          )}

          {/* Passer à l'offre supérieure */}
          {info?.offre !== 'pro' && (
            <div className="mt-4 p-4 border border-dashed border-[#1a3c6e]/30 rounded-xl bg-blue-50/50 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#1a3c6e]">Passez à l'offre supérieure</p>
                <p className="text-xs text-slate-500">Plus de passes, plus de fonctionnalités, support prioritaire.</p>
              </div>
              <a href="mailto:commercial@axion-campus.fr?subject=Demande upgrade offre Axion Campus"
                className="shrink-0 bg-[#1a3c6e] hover:bg-[#15305a] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap">
                Nous contacter →
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Portail Stripe */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Moyens de paiement</h2>
          <p className="text-xs text-slate-400 mt-1">Gérez vos cartes et informations de facturation via Stripe</p>
        </div>
        <div className="px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Logos cartes */}
            {['visa','mc','amex'].map(c=>(
              <div key={c} className="w-12 h-8 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
                <span className="text-[10px] font-black text-slate-500 uppercase">{c==='mc'?'MC':c==='amex'?'AMEX':c.toUpperCase()}</span>
              </div>
            ))}
            <span className="text-xs text-slate-400">et autres</span>
          </div>
          <button onClick={openStripePortal} disabled={portalLoading}
            className="bg-[#635BFF] hover:bg-[#5147d8] disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
            {portalLoading ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
            Gérer le paiement
          </button>
        </div>
      </div>

      {/* Factures */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Factures</h2>
            <p className="text-xs text-slate-400 mt-1">Téléchargez vos factures en PDF</p>
          </div>
          <button onClick={openStripePortal}
            className="text-xs text-[#1a3c6e] hover:text-[#0A66C2] font-semibold transition-colors flex items-center gap-1">
            Toutes les factures <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {FAKE_INVOICES.map(inv=>(
            <div key={inv.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{inv.id}</p>
                  <p className="text-xs text-slate-400">{new Date(inv.date).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-800">{inv.montant}</span>
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">{inv.statut}</span>
                <a href={inv.url} onClick={e=>{e.preventDefault();openStripePortal()}}
                  className="flex items-center gap-1.5 text-xs text-[#1a3c6e] hover:text-[#0A66C2] font-medium transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                  PDF
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">
            Les factures réelles sont disponibles dans votre portail Stripe. Contactez{' '}
            <a href="mailto:facturation@axion-campus.fr" className="text-[#1a3c6e] hover:underline">facturation@axion-campus.fr</a>
            {' '}pour toute question.
          </p>
        </div>
      </div>
    </div>
  )
}
