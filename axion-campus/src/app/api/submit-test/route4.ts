import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      passe_id,
      ecole_id,
      nom_etudiant,
      promo,
      reponses
    } = body

    // Vérification minimale
    if (!passe_id || !ecole_id || !reponses) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      )
    }

    // Mock scoring
    const global = 700
    const grade = 'B'

    const session_id = randomUUID()
    const cert_uid = `AX-${Date.now()}`

    return NextResponse.json({
      session_id,
      cert_uid,
      global,
      grade,
      nom_etudiant,
      promo
    })

  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
  


}