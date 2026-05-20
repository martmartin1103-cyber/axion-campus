import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const session_id = searchParams.get('session_id')
  if (!session_id) return NextResponse.json({ error: 'session_id manquant' }, { status: 400 })

  const sb = supabaseAdmin()
  const { data, error } = await sb
    .from('resultats')
    .select('*, sessions(nom_etudiant, promo, ecole_id, finished_at)')
    .eq('session_id', session_id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Résultats introuvables' }, { status: 404 })
  return NextResponse.json(data)
}