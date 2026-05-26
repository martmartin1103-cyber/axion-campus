'use client'

import { useEffect, useState } from 'react'

type EcoleForm = {
  nom: string
  adresse: string
  ville: string
  code_postal: string
  fiche_rncp: string
  contact_referent: string
  contact_referent_secondaire: string
  telephone: string
  site_web: string
  couleur_principale: string
  banniere_url: string
}

const EMPTY: EcoleForm = {
  nom:'', adresse:'', ville:'', code_postal:'', fiche_rncp:'',
  contact_referent:'', contact_referent_secondaire:'',
  telephone:'', site_web:'', couleur_principale:'#1a3c6e', banniere_url:''
}

const PALETTE = ['#1a3c6e','#0A66C2','#7C3AED','#059669','#DC2626','#D97706','#0F172A','#374151']

function Field({ label, name, value, onChange, type='text', placeholder='' }: {
  label:string; name:string; value:string; onChange:(n:string,v:string)=>void; type?:string; placeholder?:string
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e=>onChange(name,e.target.value)} placeholder={placeholder}
        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"/>
    </div>
  )
}

export default function AdminProfilPage() {
  const [form, setForm]       = useState<EcoleForm>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState<string|null>(null)

  useEffect(() => {
    fetch('/api/admin/ecole')
      .then(r=>r.json())
      .then(d=>{ if(d) setForm({...EMPTY,...d}) })
      .catch(()=>{})
      .finally(()=>setLoading(false))
  }, [])

  const set = (name: string, value: string) => setForm(f=>({...f,[name]:value}))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError(null); setSaved(false)
    try {
      const res = await fetch('/api/admin/ecole', {
        method:'PATCH', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form),
      })
      if(!res.ok) throw new Error('Erreur sauvegarde')
      setSaved(true); setTimeout(()=>setSaved(false), 3000)
    } catch(e:any) { setError(e.message) }
    setSaving(false)
  }

  if (loading) return <div className="animate-pulse h-10 bg-slate-100 rounded-xl"/>

  return (
    <div className="max-w-3xl space-y-6">

      {/* Preview couleur */}
      <div className="rounded-2xl h-24 relative overflow-hidden shadow-sm" style={{background:`linear-gradient(135deg,${form.couleur_principale} 0%,${form.couleur_principale}99 100%)`}}>
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)',backgroundSize:'24px 24px'}}/>
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <p className="text-white/60 text-xs uppercase tracking-widest">Aperçu couleur établissement</p>
            <p className="text-white text-xl font-black">{form.nom || 'Nom établissement'}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Informations générales */}
        <div className="px-8 py-6 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 mb-5">Informations générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Field label="Nom de l'établissement *" name="nom" value={form.nom} onChange={set} placeholder="EFREI Paris"/>
            </div>
            <Field label="Fiche RNCP / UAI" name="fiche_rncp" value={form.fiche_rncp} onChange={set} placeholder="0931428N"/>
            <Field label="Téléphone" name="telephone" value={form.telephone} onChange={set} placeholder="+33 1 23 45 67 89"/>
            <div className="md:col-span-2">
              <Field label="Adresse" name="adresse" value={form.adresse} onChange={set} placeholder="30 avenue de la République"/>
            </div>
            <Field label="Ville" name="ville" value={form.ville} onChange={set} placeholder="Villejuif"/>
            <Field label="Code postal" name="code_postal" value={form.code_postal} onChange={set} placeholder="94800"/>
            <div className="md:col-span-2">
              <Field label="Site web" name="site_web" value={form.site_web} onChange={set} placeholder="https://www.efrei.fr" type="url"/>
            </div>
          </div>
        </div>

        {/* Contacts */}
        <div className="px-8 py-6 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 mb-5">Contacts du contrat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Email référent principal *" name="contact_referent" value={form.contact_referent} onChange={set} placeholder="directeur@efrei.fr" type="email"/>
            <Field label="Email référent secondaire" name="contact_referent_secondaire" value={form.contact_referent_secondaire} onChange={set} placeholder="scolarite@efrei.fr" type="email"/>
          </div>
        </div>

        {/* Personnalisation */}
        <div className="px-8 py-6 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 mb-1">Personnalisation visuelle</h2>
          <p className="text-xs text-slate-400 mb-5">La couleur principale personnalise votre espace admin.</p>

          {/* Couleur principale */}
          <div className="mb-5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Couleur principale</label>
            <div className="flex items-center gap-3 flex-wrap">
              {PALETTE.map(c=>(
                <button key={c} type="button" onClick={()=>set('couleur_principale',c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${form.couleur_principale===c?'border-slate-900 scale-110':'border-transparent hover:scale-105'}`}
                  style={{backgroundColor:c}}/>
              ))}
              <div className="flex items-center gap-2 ml-2">
                <input type="color" value={form.couleur_principale} onChange={e=>set('couleur_principale',e.target.value)}
                  className="w-8 h-8 rounded-full border border-slate-200 cursor-pointer p-0.5"/>
                <span className="text-xs text-slate-400 font-mono">{form.couleur_principale}</span>
              </div>
            </div>
          </div>

          {/* URL bannière */}
          <Field label="URL image bannière (optionnel)" name="banniere_url" value={form.banniere_url} onChange={set} placeholder="https://cdn.efrei.fr/banniere-admin.jpg" type="url"/>
          <p className="text-xs text-slate-400 mt-1.5">Recommandé : 1200×300px. Si vide, une bannière aux couleurs de l'école est générée automatiquement.</p>
        </div>

        {/* Actions */}
        <div className="px-8 py-5 bg-slate-50 flex items-center justify-between gap-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {saved && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
              Enregistré avec succès
            </div>
          )}
          {!error && !saved && <div/>}
          <button type="submit" disabled={saving}
            className="bg-[#1a3c6e] hover:bg-[#15305a] disabled:opacity-60 text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
            {saving ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Enregistrement…</> : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  )
}
