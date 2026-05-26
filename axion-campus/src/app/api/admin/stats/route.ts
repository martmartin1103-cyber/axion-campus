import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const ecole_id = searchParams.get('ecole_id')

  const sb = supabaseAdmin()

  // Requête principale : tous les résultats (+ sessions jointes)
  let query = sb
    .from('resultats')
    .select(`
      id,
      score_global,
      grade,
      score_d1,
      score_d2,
      score_d3,
      score_d4,
      score_d5,
      cert_uid,
      session_id,
      sessions (
        nom_etudiant,
        promo,
        finished_at,
        ecole_id
      )
    `)
    .order('sessions(finished_at)', { ascending: false })

  if (ecole_id) {
    query = query.eq('ecole_id', ecole_id)
  }

  const { data: rows, error } = await query

  if (error) {
    console.error('admin/stats error:', error)
    return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 })
  }

  if (!rows || rows.length === 0) {
    return NextResponse.json({
      kpis: { total: 0, score_moyen: 0, taux_passage: 0, grade_moyen: '-' },
      etudiants: [],
      distribution: { A: 0, 'B+': 0, B: 0, C: 0, D: 0 },
    })
  }

  // ── KPIs ────────────────────────────────────────────────────────────────────
  const total = rows.length
  const score_moyen = Math.round(rows.reduce((s, r) => s + (r.score_global ?? 0), 0) / total)

  // Taux de passage = % ayant grade A, B+, ou B (score >= 650)
  const passes = rows.filter(r => ['A', 'B+', 'B'].includes(r.grade ?? '')).length
  const taux_passage = Math.round((passes / total) * 100)

  // Grade moyen : calcul pondéré A=5, B+=4, B=3, C=2, D=1
  const gradeVal: Record<string, number> = { A: 5, 'B+': 4, B: 3, C: 2, D: 1 }
  const gradeAvgNum = rows.reduce((s, r) => s + (gradeVal[r.grade ?? 'D'] ?? 1), 0) / total
  const gradeAvgStr =
    gradeAvgNum >= 4.5 ? 'A' :
    gradeAvgNum >= 3.5 ? 'B+' :
    gradeAvgNum >= 2.5 ? 'B' :
    gradeAvgNum >= 1.5 ? 'C' : 'D'

  // ── Distribution grades ──────────────────────────────────────────────────────
  const distribution: Record<string, number> = { A: 0, 'B+': 0, B: 0, C: 0, D: 0 }
  for (const r of rows) {
    const g = r.grade ?? 'D'
    if (g in distribution) distribution[g]++
  }

  // ── Tableau étudiants ────────────────────────────────────────────────────────
  const etudiants = rows.map(r => ({
    id: r.id,
    nom: (r.sessions as any)?.nom_etudiant ?? '—',
    promo: (r.sessions as any)?.promo ?? '',
    score_global: r.score_global,
    grade: r.grade,
    score_d1: r.score_d1,
    score_d2: r.score_d2,
    score_d3: r.score_d3,
    score_d4: r.score_d4,
    score_d5: r.score_d5,
    cert_uid: r.cert_uid,
    date: (r.sessions as any)?.finished_at ?? null,
  }))

  return NextResponse.json({
    kpis: { total, score_moyen, taux_passage, grade_moyen: gradeAvgStr },
    etudiants,
    distribution,
  })
}
