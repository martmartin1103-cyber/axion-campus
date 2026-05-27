import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Portail Stripe non configuré. Contactez support@axion-campus.fr' },
    { status: 503 }
  )
}
