import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()

    if (!code) {
      return NextResponse.json({ error: 'Code manquant' }, { status: 400 })
    }

    const sb = supabaseAdmin()

    const { data: passe, error } = await sb
      .from('passes')
      .select('id, ecole_id, utilise, ecoles(nom)')
      .eq('code', code.trim().toUpperCase())
      .single()

    if (error || !passe) {
      return NextResponse.json({ error: 'Code introuvable' }, { status: 404 })
    }

    if (passe.utilise) {
      return NextResponse.json({ error: 'Ce code a déjà été utilisé' }, { status: 400 })
    }

    return NextResponse.json({
      valid: true,
      passe_id: passe.id,
      ecole_id: passe.ecole_id,
      ecole_nom: (passe.ecoles as any)?.nom ?? 'École'
    })
  } catch (err) {
    console.error('validate-code error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}