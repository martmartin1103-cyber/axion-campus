import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const ECOLE_ID_DEFAULT = process.env.NEXT_PUBLIC_DEFAULT_ECOLE_ID || ''

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const ecole_id = searchParams.get('ecole_id') || ECOLE_ID_DEFAULT
  if (!ecole_id) return NextResponse.json({ error: 'ecole_id manquant' }, { status: 400 })
  const sb = supabaseAdmin()
  const { data, error } = await sb
    .from('contrats').select('*').eq('ecole_id', ecole_id)
    .eq('statut', 'actif').order('created_at', { ascending: false }).limit(1).single()
  if (error || !data) return NextResponse.json({
    id: null, offre: 'starter', date_souscription: null, date_renouvellement: null,
    date_fin: null, renouvellement_auto: true, statut: 'actif', nb_passes_total: 30,
    contact_axion: 'support@axion-campus.fr', stripe_customer_id: null, stripe_subscription_id: null,
  })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const ecole_id = searchParams.get('ecole_id') || ECOLE_ID_DEFAULT
  if (!ecole_id) return NextResponse.json({ error: 'ecole_id manquant' }, { status: 400 })
  const body = await req.json()
  const allowed = ['renouvellement_auto', 'offre', 'statut']
  const updates: Record<string, unknown> = {}
  for (const k of allowed) { if (k in body) updates[k] = body[k] }
  const sb = supabaseAdmin()
  const { error } = await sb.from('contrats').update(updates).eq('ecole_id', ecole_id).eq('statut', 'actif')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
