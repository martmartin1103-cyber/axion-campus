'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'

// ── Types ────────────────────────────────────────────────────────────────────

type Etudiant = {
  id: string
  nom: string
  promo: string
  score_global: number
  grade: string
  score_d1: number
  score_d2: number
  score_d3: number
  score_d4: number
  score_d5: number
  cert_uid: string
  date: string | null
}

type KPIs = {
  total: number
  score_moyen: number
  taux_passage: number
  grade_moyen: string
}

type Stats = {
  kpis: KPIs
  etudiants: Etudiant[]
  distribution: Record<string, number>
}

// ── Constantes ───────────────────────────────────────────────────────────────

const ADMIN_KEY = 'EFREI-ADMIN-2026'
const ECOLE_ID  = '' // laisser vide = toutes écoles, ou mettre l'UUID Efrei

const GRADE_COLORS: Record<string, string> = {
  A:   '#0A66C2',
  'B+':'#2E86DE',
  B:   '#54A0FF',
  C:   '#F5A623',
  D:   '#E74C3C',
}

const DIM_LABELS = ['Maturité IA', 'Agentic', 'Gouvernance', 'ROI', 'Transform.']

// ── Composant barre mini ─────────────────────────────────────────────────────

function MiniBar({ value, color = '#0A66C2' }: { value: number; color?: string }) {
  const pct = Math.round(value / 10) // score /1000 → %
  return (
    <div className="flex items-center gap-1.5 w-full">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] text-slate-400 w-6 text-right">{pct}%</span>
    </div>
  )
}

// ── Badge grade ───────────────────────────────────────────────────────────────

function GradeBadge({ grade }: { grade: string }) {
  const bg: Record<string, string> = {
    A: 'bg-blue-600 text-white',
    'B+': 'bg-blue-400 text-white',
    B: 'bg-sky-400 text-white',
    C: 'bg-amber-400 text-white',
    D: 'bg-red-400 text-white',
  }
  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold ${bg[grade] ?? 'bg-slate-200 text-slate-600'}`}>
      {grade}
    </span>
  )
}

// ── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, icon,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="w-11 h-11 rounded-xl bg-[#EEF4FC] flex items-center justify-center shrink-0 text-[#0A66C2]">
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

// ── Tooltip recharts custom ───────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3">
      <p className="text-sm font-bold text-slate-800">Grade {label}</p>
      <p className="text-xs text-slate-500">{payload[0].value} étudiant{payload[0].value > 1 ? 's' : ''}</p>
    </div>
  )
}

// ── Page login ────────────────────────────────────────────────────────────────

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === ADMIN_KEY) {
      localStorage.setItem('admin_key', ADMIN_KEY)
      onSuccess()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f4fa] flex items-center justify-center px-4">
      <div
        className={`bg-white rounded-3xl shadow-xl border border-slate-200 p-10 w-full max-w-sm transition-transform ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}
        style={{ animationName: shake ? 'shake' : 'none' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#1a3c6e] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-bold text-[#1a3c6e] tracking-tight">AXION CAMPUS</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-1">Accès administration</h1>
        <p className="text-sm text-slate-400 mb-8">Tableau de bord réservé aux responsables pédagogiques.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5">
              Clé d'accès
            </label>
            <input
              type="password"
              value={input}
              onChange={e => { setInput(e.target.value); setError(false) }}
              placeholder="••••••••••••••••"
              className={`w-full border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 transition-all ${
                error
                  ? 'border-red-300 focus:ring-red-200 bg-red-50'
                  : 'border-slate-200 focus:ring-blue-100'
              }`}
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-500 mt-1.5">Clé incorrecte. Contactez votre administrateur.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#1a3c6e] hover:bg-[#15305a] text-white py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            Accéder au dashboard →
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{ transform: translateX(0) }
          20%{ transform: translateX(-8px) }
          40%{ transform: translateX(8px) }
          60%{ transform: translateX(-6px) }
          80%{ transform: translateX(6px) }
        }
      `}</style>
    </div>
  )
}

// ── Dashboard principal ───────────────────────────────────────────────────────

function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<'score_global' | 'date' | 'nom'>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = ECOLE_ID
        ? `/api/admin/stats?ecole_id=${ECOLE_ID}`
        : `/api/admin/stats`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      setStats(await res.json())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const logout = () => {
    localStorage.removeItem('admin_key')
    window.location.reload()
  }

  // Filtrage + tri
  const filteredEtudiants = (stats?.etudiants ?? [])
    .filter(e => e.nom.toLowerCase().includes(search.toLowerCase()) || e.promo.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let av: any, bv: any
      if (sortKey === 'score_global') { av = a.score_global; bv = b.score_global }
      else if (sortKey === 'date')    { av = a.date ?? ''; bv = b.date ?? '' }
      else                            { av = a.nom; bv = b.nom }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const chartData = stats
    ? ['A', 'B+', 'B', 'C', 'D'].map(g => ({ grade: g, count: stats.distribution[g] ?? 0 }))
    : []

  return (
    <div className="min-h-screen bg-[#f0f4fa]">
      {/* Topbar admin */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#1a3c6e] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-bold text-[#1a3c6e]">AXION CAMPUS</span>
          <span className="text-slate-300 text-sm">·</span>
          <span className="text-sm text-slate-500 font-medium">Administration</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0A66C2] border border-slate-200 rounded-lg px-3 py-1.5 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
            </svg>
            Actualiser
          </button>
          <button
            onClick={logout}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors px-3 py-1.5"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10 space-y-10">

        {/* Titre */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="text-slate-400 text-sm mt-1">
            Vue d'ensemble des certifications — {stats?.kpis.total ?? '…'} résultat{(stats?.kpis.total ?? 0) > 1 ? 's' : ''}
          </p>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
            Erreur de chargement : {error}
          </div>
        )}

        {/* KPI Cards */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 h-28 animate-pulse">
                <div className="w-11 h-11 bg-slate-100 rounded-xl mb-3"/>
                <div className="w-16 h-4 bg-slate-100 rounded mb-2"/>
                <div className="w-10 h-7 bg-slate-200 rounded"/>
              </div>
            ))}
          </div>
        ) : stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Étudiants certifiés"
              value={stats.kpis.total}
              sub="sessions complétées"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
              }
            />
            <KpiCard
              label="Score moyen"
              value={`${stats.kpis.score_moyen}`}
              sub="points sur 1000"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              }
            />
            <KpiCard
              label="Taux de passage"
              value={`${stats.kpis.taux_passage}%`}
              sub="grade ≥ B (score ≥ 650)"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              }
            />
            <KpiCard
              label="Grade moyen"
              value={stats.kpis.grade_moyen}
              sub="médiane de promotion"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="6"/>
                  <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
              }
            />
          </div>
        )}

        {/* Graphique + tableau côte à côte */}
        {!loading && stats && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* BarChart distribution grades */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-1">Distribution des grades</h2>
              <p className="text-xs text-slate-400 mb-6">Répartition par niveau obtenu</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barSize={32} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                  <XAxis
                    dataKey="grade"
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip/>} cursor={{ fill: '#f8fafc' }}/>
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry) => (
                      <Cell key={entry.grade} fill={GRADE_COLORS[entry.grade] ?? '#94a3b8'}/>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Légende */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                {['A', 'B+', 'B', 'C', 'D'].map(g => (
                  <div key={g} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: GRADE_COLORS[g] }}/>
                    <span className="text-xs text-slate-500">{g} — {stats.distribution[g] ?? 0}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tableau étudiants */}
            <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {/* Header tableau */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Résultats détaillés</h2>
                  <p className="text-xs text-slate-400">{filteredEtudiants.length} étudiant{filteredEtudiants.length > 1 ? 's' : ''}</p>
                </div>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Rechercher…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-8 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 w-48"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {[
                        { key: 'nom',          label: 'Nom' },
                        { key: 'score_global', label: 'Score' },
                        { key: null,           label: 'Grade' },
                        { key: null,           label: 'Dimensions' },
                        { key: 'date',         label: 'Date' },
                      ].map((col, i) => (
                        <th
                          key={i}
                          onClick={() => col.key && toggleSort(col.key as any)}
                          className={`text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide ${col.key ? 'cursor-pointer hover:text-slate-700 select-none' : ''}`}
                        >
                          <span className="flex items-center gap-1">
                            {col.label}
                            {col.key && sortKey === col.key && (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                {sortDir === 'desc'
                                  ? <path d="M12 5v14M5 12l7 7 7-7"/>
                                  : <path d="M12 19V5M5 12l7-7 7 7"/>}
                              </svg>
                            )}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEtudiants.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-16 text-slate-300 text-sm">
                          Aucun résultat trouvé
                        </td>
                      </tr>
                    ) : filteredEtudiants.map((e, i) => (
                      <tr
                        key={e.id}
                        className={`border-b border-slate-50 hover:bg-slate-50 transition-colors duration-100 ${i % 2 === 0 ? '' : 'bg-[#fafbfc]'}`}
                      >
                        {/* Nom + promo */}
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-slate-800 truncate max-w-[140px]">{e.nom}</p>
                          {e.promo && <p className="text-xs text-slate-400">{e.promo}</p>}
                        </td>

                        {/* Score */}
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-slate-800">{e.score_global}</span>
                          <span className="text-slate-400 text-xs">/1000</span>
                        </td>

                        {/* Grade badge */}
                        <td className="px-5 py-3.5">
                          <GradeBadge grade={e.grade}/>
                        </td>

                        {/* 5 mini barres dimensions */}
                        <td className="px-5 py-3.5 min-w-[160px]">
                          <div className="space-y-1">
                            {[e.score_d1, e.score_d2, e.score_d3, e.score_d4, e.score_d5].map((s, di) => (
                              <div key={di} className="flex items-center gap-1.5">
                                <span className="text-[9px] text-slate-300 w-14 truncate">{DIM_LABELS[di]}</span>
                                <MiniBar value={s} color={GRADE_COLORS[e.grade] ?? '#0A66C2'}/>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                          {e.date
                            ? new Date(e.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && stats && stats.kpis.total === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">Aucune certification enregistrée</h3>
            <p className="text-sm text-slate-400">Les résultats apparaîtront ici dès que des étudiants auront passé le test.</p>
          </div>
        )}
      </main>
    </div>
  )
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    setAuthed(localStorage.getItem('admin_key') === ADMIN_KEY)
  }, [])

  // Évite le flash côté serveur
  if (authed === null) return null

  return authed
    ? <Dashboard/>
    : <LoginScreen onSuccess={() => setAuthed(true)}/>
}
