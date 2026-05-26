import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const nom  = searchParams.get('nom')?.trim()
  const code = searchParams.get('code')?.trim().toUpperCase()

  if (!nom || !code) {
    return NextResponse.json({ error: 'Parametres manquants' }, { status: 400 })
  }

  const sb = supabaseAdmin()

  // Trouver la passe associee au code
  const { data: passe } = await sb
    .from('passes')
    .select('id, ecole_id')
    .eq('code', code)
    .single()

  if (!passe) {
    return NextResponse.json({ error: 'Code introuvable' }, { status: 404 })
  }

  // Trouver la session correspondante (nom approx + passe_id)
  const { data: session } = await sb
    .from('sessions')
    .select('id, nom_etudiant')
    .eq('passe_id', passe.id)
    .ilike('nom_etudiant', `%${nom.split(' ')[0]}%`)
    .order('finished_at', { ascending: false })
    .limit(1)
    .single()

  if (!session) {
    return NextResponse.json({ error: 'Aucune session trouvee' }, { status: 404 })
  }

  // Trouver le resultat associe
  const { data: resultat } = await sb
    .from('resultats')
    .select('id, cert_uid')
    .eq('session_id', session.id)
    .single()

  if (!resultat) {
    return NextResponse.json({ error: 'Resultats introuvables' }, { status: 404 })
  }

  return NextResponse.json({
    session_id: session.id,
    cert_uid:   resultat.cert_uid,
    nom:        session.nom_etudiant,
  })
}
