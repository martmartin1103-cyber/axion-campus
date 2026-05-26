// ═══════════════════════════════════════════════════════════
// src/app/api/admin/ecole/route.ts
// GET  → récupère les infos école
// PATCH → met à jour les infos école
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const ECOLE_ID_DEFAULT = process.env.NEXT_PUBLIC_DEFAULT_ECOLE_ID || ''

async function getEcoleId(req: NextRequest): Promise<string> {
  const { searchParams } = new URL(req.url)
  return searchParams.get('ecole_id') || ECOLE_ID_DEFAULT
}

export async function GET(req: NextRequest) {
  const ecole_id = await getEcoleId(req)
  if (!ecole_id) return NextResponse.json({ error: 'ecole_id manquant' }, { status: 400 })

  const sb = supabaseAdmin()
  const { data, error } = await sb
    .from('ecoles')
    .select('id,nom,email,adresse,ville,code_postal,fiche_rncp,contact_referent,contact_referent_secondaire,telephone,site_web,couleur_principale,logo_url,banniere_url')
    .eq('id', ecole_id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'École introuvable' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const ecole_id = await getEcoleId(req)
  if (!ecole_id) return NextResponse.json({ error: 'ecole_id manquant' }, { status: 400 })

  const body = await req.json()
  const allowed = ['nom','adresse','ville','code_postal','fiche_rncp','contact_referent','contact_referent_secondaire','telephone','site_web','couleur_principale','banniere_url','logo_url']
  const updates: Record<string,unknown> = {}
  for (const k of allowed) { if (k in body) updates[k] = body[k] }

  const sb = supabaseAdmin()
  const { error } = await sb.from('ecoles').update(updates).eq('id', ecole_id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}