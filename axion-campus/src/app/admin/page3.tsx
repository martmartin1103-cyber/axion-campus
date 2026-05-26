'use client'

import { useCallback, useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const ECOLE_ID = ''

type KPIs  = { total: number; score_moyen: number; taux_passage: number; grade_moyen: string; satisfaction_moy?: number }
type Etudiant = { id:string; nom:string; promo:string; score_global:number; grade:string; score_d1:number; score_d2:number; score_d3:number; score_d4:number; score_d5:number; cert_uid:string; date:string|null }
type Stats = { kpis:KPIs; etudiants:Etudiant[]; distribution:Record<string,number> }
type EcoleInfo = { nom:string; couleur_principale:string; banniere_url?:string }

const GRADE_COLORS: Record<string,string> = { A:'#0A66C2','B+':'#2E86DE',B:'#54A0FF',C:'#F5A623',D:'#E74C3C' }
const DIM_LABELS = ['Maturité IA','Agentic','Gouvernance','ROI','Transform.']

function MiniBar({ value, color='#0A66C2' }: { value:number; color?:string }) {
  const pct = Math.round(value/10)
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width:`${pct}%`, backgroundColor:color }}/>
      </div>
      <span className="text-[10px] text-slate-400 w-5 text-right">{pct}%</span>
    </div>
  )
}

function GradeBadge({ grade }: { grade:string }) {
  const bg: Record<string,string> = { A:'bg-blue-600 text-white','B+':'bg-blue-400 text-white',B:'bg-sky-400 text-white',C:'bg-amber-400 text-white',D:'bg-red-400 text-white' }
  return <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold ${bg[grade]||'bg-slate-200 text-slate-600'}`}>{grade}</span>
}

function KpiCard({ label, value, sub, icon, color }: { label:string; value:string|number; sub?:string; icon:React.ReactNode; color:string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor:`${color}18`, color }}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-900 leading-none">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active||!payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3">
      <p className="text-sm font-bold text-slate-800">Grade {label}</p>
      <p className="text-xs text-slate-500">{payload[0].value} étudiant{payload[0].value>1?'s':''}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats]   = useState<Stats|null>(null)
  const [ecole, setEcole]   = useState<EcoleInfo|null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState<string|null>(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<'score_global'|'date'|'nom'>('date')
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc')

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const url = ECOLE_ID ? `/api/admin/stats?ecole_id=${ECOLE_ID}` : `/api/admin/stats`
      const [statsRes, ecoleRes] = await Promise.all([
        fetch(url),
        fetch(`/api/admin/ecole${ECOLE_ID?`?ecole_id=${ECOLE_ID}`:''}`)
      ])
      if (!statsRes.ok) throw new Error(`Erreur ${statsRes.status}`)
      setStats(await statsRes.json())
      if (ecoleRes.ok) setEcole(await ecoleRes.json())
    } catch(e:any) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const couleur = ecole?.couleur_principale || '#1a3c6e'
  const bgBanniere = ecole?.banniere_url

  const filtered = (stats?.etudiants??[])
    .filter(e => e.nom.toLowerCase().includes(search.toLowerCase())||e.promo.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => {
      let av:any, bv:any
      if (sortKey==='score_global'){av=a.score_global;bv=b.score_global}
      else if (sortKey==='date'){av=a.date??'';bv=b.date??''}
      else{av=a.nom;bv=b.nom}
      if(av<bv) return sortDir==='asc'?-1:1
      if(av>bv) return sortDir==='asc'?1:-1
      return 0
    })

  const toggleSort = (key:typeof sortKey) => {
    if(sortKey===key) setSortDir(d=>d==='asc'?'desc':'asc')
    else{setSortKey(key);setSortDir('desc')}
  }

  const chartData = stats
    ? ['A','B+','B','C','D'].map(g=>({grade:g,count:stats.distribution[g]??0}))
    : []

  return (
    <div className="space-y-6">

      {/* Bannière personnalisée */}
      <div className="relative rounded-3xl overflow-hidden h-44 shadow-lg">
        {bgBanniere ? (
          <img src={bgBanniere} alt="banniere" className="w-full h-full object-cover"/>
        ) : (
          /* Bannière générée CSS avec la couleur de l'école */
          <div className="w-full h-full relative" style={{ background: `linear-gradient(135deg, ${couleur} 0%, ${couleur}cc 40%, #0A66C2 100%)` }}>
            {/* Grille décorative */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage:`linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)`,
              backgroundSize:'32px 32px'
            }}/>
            {/* Hexagones décoratifs */}
            <svg className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10" width="180" height="160" viewBox="0 0 180 160">
              {[[90,40],[40,80],[140,80],[90,120],[40,40],[140,40]].map(([cx,cy],i)=>(
                <polygon key={i} points={`${cx},${cy-28} ${cx+24},${cy-14} ${cx+24},${cy+14} ${cx},${cy+28} ${cx-24},${cy+14} ${cx-24},${cy-14}`} fill="none" stroke="white" strokeWidth="1.5"/>
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col justify-center px-10">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">Espace administration</p>
              <h1 className="text-3xl font-black text-white">{ecole?.nom || 'Tableau de bord'}</h1>
              <p className="text-white/70 text-sm mt-1">Plateforme de certification IA Agentique</p>
            </div>
          </div>
        )}
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">Erreur : {error}</div>}

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_,i)=>(
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 h-28 animate-pulse">
              <div className="w-11 h-11 bg-slate-100 rounded-xl mb-3"/><div className="w-16 h-3 bg-slate-100 rounded mb-2"/><div className="w-10 h-6 bg-slate-200 rounded"/>
            </div>
          ))}
        </div>
      ) : stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard color={couleur} label="Certifiés" value={stats.kpis.total} sub="sessions complétées"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>}/>
          <KpiCard color={couleur} label="Score moyen" value={stats.kpis.score_moyen} sub="points / 1000"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}/>
          <KpiCard color={couleur} label="Taux de passage" value={`${stats.kpis.taux_passage}%`} sub="grade ≥ B"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}/>
          <KpiCard color={couleur} label="Grade moyen" value={stats.kpis.grade_moyen} sub="médiane promo"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>}/>
        </div>
      )}

      {/* Graphique + Tableau */}
      {!loading && stats && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-1">Distribution des grades</h2>
            <p className="text-xs text-slate-400 mb-6">Répartition par niveau</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={30} margin={{top:4,right:4,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                <XAxis dataKey="grade" tick={{fontSize:12,fontWeight:600,fill:'#64748b'}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false} allowDecimals={false}/>
                <Tooltip content={<CustomTooltip/>} cursor={{fill:'#f8fafc'}}/>
                <Bar dataKey="count" radius={[6,6,0,0]}>
                  {chartData.map(entry=><Cell key={entry.grade} fill={GRADE_COLORS[entry.grade]??'#94a3b8'}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-3 gap-y-2 mt-4">
              {['A','B+','B','C','D'].map(g=>(
                <div key={g} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{backgroundColor:GRADE_COLORS[g]}}/>
                  <span className="text-xs text-slate-500">{g} — {stats.distribution[g]??0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tableau */}
          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Résultats détaillés</h2>
                <p className="text-xs text-slate-400">{filtered.length} étudiant{filtered.length>1?'s':''}</p>
              </div>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input type="text" placeholder="Rechercher…" value={search} onChange={e=>setSearch(e.target.value)}
                  className="pl-8 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 w-44"/>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {[{k:'nom',l:'Nom'},{k:'score_global',l:'Score'},{k:null,l:'Grade'},{k:null,l:'Dimensions'},{k:'date',l:'Date'}].map((col,i)=>(
                      <th key={i} onClick={()=>col.k&&toggleSort(col.k as any)}
                        className={`text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide ${col.k?'cursor-pointer hover:text-slate-700 select-none':''}`}>
                        <span className="flex items-center gap-1">
                          {col.l}
                          {col.k&&sortKey===col.k&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">{sortDir==='desc'?<path d="M12 5v14M5 12l7 7 7-7"/>:<path d="M12 19V5M5 12l7-7 7 7"/>}</svg>}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length===0?(
                    <tr><td colSpan={5} className="text-center py-12 text-slate-300 text-sm">Aucun résultat</td></tr>
                  ):filtered.map((e,i)=>(
                    <tr key={e.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i%2===0?'':'bg-[#fafbfc]'}`}>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-slate-800 truncate max-w-[130px]">{e.nom}</p>
                        {e.promo&&<p className="text-xs text-slate-400">{e.promo}</p>}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-slate-800">{e.score_global}</span>
                        <span className="text-slate-400 text-xs">/1000</span>
                      </td>
                      <td className="px-5 py-3.5"><GradeBadge grade={e.grade}/></td>
                      <td className="px-5 py-3.5 min-w-[155px]">
                        <div className="space-y-1">
                          {[e.score_d1,e.score_d2,e.score_d3,e.score_d4,e.score_d5].map((s,di)=>(
                            <div key={di} className="flex items-center gap-1.5">
                              <span className="text-[9px] text-slate-300 w-14 truncate">{DIM_LABELS[di]}</span>
                              <MiniBar value={s} color={GRADE_COLORS[e.grade]??couleur}/>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                        {e.date?new Date(e.date).toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'}):'—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
