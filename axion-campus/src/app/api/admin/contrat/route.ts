// ═══════════════════════════════════════════════════════════
// src/app/api/admin/contrat/route.ts
// GET   → récupère le contrat actif de l'école
// PATCH → met à jour renouvellement_auto
// ═══════════════════════════════════════════════════════════

export async function GET(req: NextRequest) {
   const { searchParams } = new URL(req.url)
   const ecole_id = searchParams.get('ecole_id') || ECOLE_ID_DEFAULT
   const sb = supabaseAdmin()
   const { data, error } = await sb
     .from('contrats')
     .select('*')
     .eq('ecole_id', ecole_id)
     .eq('statut', 'actif')
     .order('created_at', { ascending: false })
     .limit(1)
     .single()
   if (error || !data) return NextResponse.json({ error: 'Contrat introuvable' }, { status: 404 })
   return NextResponse.json(data)
 }

 export async function PATCH(req: NextRequest) {
   const { searchParams } = new URL(req.url)
   const ecole_id = searchParams.get('ecole_id') || ECOLE_ID_DEFAULT
   const { renouvellement_auto } = await req.json()
   const sb = supabaseAdmin()
   const { error } = await sb
     .from('contrats')
     .update({ renouvellement_auto })
     .eq('ecole_id', ecole_id)
     .eq('statut', 'actif')
   if (error) return NextResponse.json({ error: error.message }, { status: 500 })
   return NextResponse.json({ success: true })
 }