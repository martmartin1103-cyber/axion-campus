import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * US5 — POST /api/contact-demo
 * Branche : feat/us5-us8-medium
 * Fichier  : src/app/api/contact-demo/route.ts  (NOUVEAU)
 *
 * Reçoit : { prenom, email, ecole, taille_ecole? }
 * Insère dans la table `leads` (voir migration SQL ci-dessous)
 * Retourne : { success: true, id } ou { error: string }
 *
 * ── Migration Supabase à exécuter dans l'éditeur SQL ──────────────
 * CREATE TABLE IF NOT EXISTS leads (
 *   id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   prenom      text NOT NULL,
 *   email       text NOT NULL,
 *   ecole       text NOT NULL,
 *   taille_ecole text,
 *   source      text DEFAULT 'landing_modal',
 *   created_at  timestamptz DEFAULT now(),
 *   statut      text DEFAULT 'nouveau'   -- nouveau | contacté | converti
 * );
 * CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
 * CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);
 *
 * -- RLS : accessible uniquement via service_role (pas d'accès anon)
 * ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "service_role only" ON leads
 *   USING (auth.role() = 'service_role');
 * ─────────────────────────────────────────────────────────────────
 */

/* ── Validation email basique ── */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

/* ── Vérification email jetable (domaines courants) ── */
const DISPOSABLE_DOMAINS = [
  'mailinator.com', 'guerrillamail.com', 'tempmail.com',
  'throwaway.email', 'yopmail.com', 'trashmail.com',
]
function isDisposable(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase() ?? ''
  return DISPOSABLE_DOMAINS.includes(domain)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prenom, email, ecole, taille_ecole } = body

    /* ── Validation champs requis ── */
    const errors: Record<string, string> = {}

    if (!prenom?.trim() || prenom.trim().length < 2) {
      errors.prenom = 'Le prénom doit contenir au moins 2 caractères.'
    }
    if (!email?.trim() || !isValidEmail(email)) {
      errors.email = 'Adresse email invalide.'
    } else if (isDisposable(email)) {
      errors.email = 'Merci d\'utiliser votre email professionnel ou scolaire.'
    }
    if (!ecole?.trim() || ecole.trim().length < 2) {
      errors.ecole = 'Le nom de l\'établissement est requis.'
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 })
    }

    const sb = supabaseAdmin()

    /* ── Vérifier si le lead existe déjà (doublon email) ── */
    const { data: existing } = await sb
      .from('leads')
      .select('id, statut')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()

    if (existing) {
      /* Lead déjà enregistré — on renvoie succès silencieux (pas de spam) */
      return NextResponse.json({ success: true, already_registered: true })
    }

    /* ── Insertion ── */
    const { data, error } = await sb
      .from('leads')
      .insert({
        prenom:      prenom.trim(),
        email:       email.trim().toLowerCase(),
        ecole:       ecole.trim(),
        taille_ecole: taille_ecole?.trim() ?? null,
        source:      'landing_modal',
        statut:      'nouveau',
      })
      .select('id')
      .single()

    if (error) {
      console.error('[contact-demo] Supabase error:', error.message)
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement. Veuillez réessayer.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 })

  } catch (err) {
    console.error('[contact-demo] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Erreur serveur inattendue.' },
      { status: 500 }
    )
  }
}

/* ── GET : non supporté ── */
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
