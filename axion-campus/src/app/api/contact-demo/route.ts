import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'
import { render } from '@react-email/render'
import CodeAccesEmail from '@/emails/CodeAccesEmail'

/**
 * src/app/api/contact-demo/route.ts  — VERSION AVEC EMAIL RESEND
 *
 * Remplace la version précédente (insertion Supabase seule).
 *
 * Ce que fait cette route :
 * 1. Valide les champs (prenom, email, ecole)
 * 2. Vérifie le doublon email dans Supabase
 * 3. Génère un code d'accès unique ex: INDEP-A3F7-2026
 * 4. Insère le lead + code dans la table `leads`
 * 5. Envoie l'email au visiteur via Resend avec le template React
 * 6. Retourne { success: true }
 *
 * Variables d'environnement requises (.env.local + Vercel) :
 *   RESEND_API_KEY=re_xxxxxxxxxx
 *   NEXT_PUBLIC_SITE_URL=https://axion-campus.vercel.app
 *   CONTACT_EMAIL=contact@axion-campus.fr   (copie interne, optionnel)
 *
 * Migration Supabase (ajout colonne code_acces) :
 *   ALTER TABLE leads ADD COLUMN IF NOT EXISTS code_acces text;
 *   ALTER TABLE leads ADD COLUMN IF NOT EXISTS email_sent_at timestamptz;
 */

/* ── Utilitaires ── */

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

const DISPOSABLE = [
  'mailinator.com','guerrillamail.com','tempmail.com',
  'throwaway.email','yopmail.com','trashmail.com',
]
function isDisposable(email: string): boolean {
  return DISPOSABLE.includes(email.split('@')[1]?.toLowerCase() ?? '')
}

/**
 * Génère un code d'accès unique format : INDEP-XXXX-YYYY
 * XXXX = 4 chars alphanumériques aléatoires (majuscules)
 * YYYY = année en cours
 */
function generateCode(): string {
  const chars   = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sans I, O, 0, 1
  const random  = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  const year    = new Date().getFullYear()
  return `INDEP-${random}-${year}`
}

/* ── Handler ── */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prenom, email, ecole, taille_ecole } = body

    /* 1. Validation */
    const errors: Record<string, string> = {}
    if (!prenom?.trim() || prenom.trim().length < 2) errors.prenom = 'Prénom invalide.'
    if (!email?.trim() || !isValidEmail(email))       errors.email  = 'Email invalide.'
    else if (isDisposable(email))                     errors.email  = 'Utilisez votre email pro ou perso.'
    if (!ecole?.trim() || ecole.trim().length < 2)    errors.ecole  = 'Établissement requis.'
    if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 })

    const emailClean = email.trim().toLowerCase()
    const prenomClean = prenom.trim()

    const sb = supabaseAdmin()

    /* 2. Doublon */
    const { data: existing } = await sb
      .from('leads')
      .select('id, code_acces')
      .eq('email', emailClean)
      .maybeSingle()

    if (existing) {
      /* Si le lead existe déjà et a déjà un code, on peut renvoyer l'email */
      if (existing.code_acces) {
        await sendEmail(prenomClean, emailClean, existing.code_acces)
      }
      /* Toujours retourner succès côté client (anti-énumération) */
      return NextResponse.json({ success: true, already_registered: true })
    }

    /* 3. Générer le code */
    const codeAcces = generateCode()

    /* 4. Insérer dans Supabase */
    const { error: insertError } = await sb.from('leads').insert({
      prenom:       prenomClean,
      email:        emailClean,
      ecole:        ecole.trim(),
      taille_ecole: taille_ecole?.trim() ?? null,
      source:       body.source ?? 'landing_modal',
      statut:       'nouveau',
      code_acces:   codeAcces,
    })
    if (insertError) {
      console.error('[contact-demo] Supabase insert error:', insertError.message)
      return NextResponse.json({ error: 'Erreur enregistrement.' }, { status: 500 })
    }

    /* 5. Envoyer l'email */
    await sendEmail(prenomClean, emailClean, codeAcces)

    /* Marquer email_sent_at */
    await sb.from('leads')
      .update({ email_sent_at: new Date().toISOString() })
      .eq('email', emailClean)

    return NextResponse.json({ success: true }, { status: 201 })

  } catch (err) {
    console.error('[contact-demo] Unexpected error:', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

/* ── Envoi email via Resend ── */

async function sendEmail(prenom: string, emailDest: string, codeAcces: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[contact-demo] RESEND_API_KEY manquant — email non envoyé')
    return
  }

  const resend   = new Resend(apiKey)
  const baseUrl  = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://axion-campus.vercel.app'
  const lienTest = `${baseUrl}/inscription`

  /* Rendu HTML du template React */
  const html = await render(
    CodeAccesEmail({ prenom, email: emailDest, codeAcces, lienTest }) as React.ReactElement
  )

  const { error } = await resend.emails.send({
    /*
     * Pendant les tests, utilisez l'adresse Resend sandbox :
     *   from: 'AXION CAMPUS <onboarding@resend.dev>'
     *
     * En production, après vérification de votre domaine :
     *   from: 'AXION CAMPUS <contact@axion-campus.fr>'
     */
    from:    'AXION CAMPUS <onboarding@resend.dev>',
    to:      [emailDest],
    subject: `${prenom}, votre code d'accès AXION CAMPUS est prêt ✓`,
    html,

    /*
     * Copie interne (optionnel) :
     * bcc: [process.env.CONTACT_EMAIL ?? ''].filter(Boolean),
     */
  })

  if (error) {
    console.error('[contact-demo] Resend error:', error)
    /* On ne throw pas — l'insert Supabase a réussi, l'email peut être renvoyé manuellement */
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
