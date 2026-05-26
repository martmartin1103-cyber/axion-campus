import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { QUESTIONS } from '@/data/questions'
import { randomUUID } from 'crypto'

function calcScore(reponses: Record<string, string>) {
  const byDim: Record<number, { correct: number; total: number }> = {}

  for (const q of QUESTIONS) {
    if (!byDim[q.dimension]) byDim[q.dimension] = { correct: 0, total: 0 }
    byDim[q.dimension].total += q.points
    if (reponses[q.id] === q.correct) byDim[q.dimension].correct += q.points
  }

  const scores = [1, 2, 3, 4, 5].map(d => {
    const dim = byDim[d] || { correct: 0, total: 200 }
    return Math.round((dim.correct / dim.total) * 1000)
  })

  const global = Math.round(scores.reduce((s, v) => s + v, 0) / 5)

  const grade = (s: number) =>
    s >= 850 ? 'A' : s >= 750 ? 'B+' : s >= 650 ? 'B' : s >= 500 ? 'C' : 'D'

  return {
    d1: scores[0],
    d2: scores[1],
    d3: scores[2],
    d4: scores[3],
    d5: scores[4],
    global,
    grade: grade(global),
  }
}

// Export nommé POST — obligatoire avec Next.js App Router
export async function POST(req: NextRequest) {
  try {
    const { passe_id, ecole_id, nom_etudiant, promo, reponses } = await req.json()

    if (!passe_id || !ecole_id || !nom_etudiant || !reponses) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    const sb = supabaseAdmin()

    // 1. Créer la session
    const { data: session, error: sessErr } = await sb
      .from('sessions')
      .insert({
        passe_id,
        ecole_id,
        nom_etudiant,
        promo,
        reponses,
        statut: 'termine',
        finished_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (sessErr) throw sessErr

    // 2. Calculer et enregistrer les résultats
    const scores = calcScore(reponses)
    const cert_uid = randomUUID().slice(0, 8).toUpperCase()

    const { error: resErr } = await sb.from('resultats').insert({
      session_id: session.id,
      ecole_id,
      score_global: scores.global,
      grade: scores.grade,
      score_d1: scores.d1,
      score_d2: scores.d2,
      score_d3: scores.d3,
      score_d4: scores.d4,
      score_d5: scores.d5,
      cert_uid,
    })

    if (resErr) throw resErr

    // 3. Marquer la passe comme utilisée
    await sb.from('passes').update({ utilise: true }).eq('id', passe_id)

    return NextResponse.json({
      session_id: session.id,
      cert_uid,
      score_global: scores.global,
      grade: scores.grade,
      score_d1: scores.d1,
      score_d2: scores.d2,
      score_d3: scores.d3,
      score_d4: scores.d4,
      score_d5: scores.d5,
    })
  } catch (err) {
    console.error('submit-test error:', err)
    return NextResponse.json({ error: 'Erreur lors de la soumission' }, { status: 500 })
  }
}
