import { MetadataRoute } from 'next'

/**
 * US6 — Sitemap dynamique
 * Branche : feat/us5-us8-medium
 * Fichier  : src/app/sitemap.ts  (NOUVEAU)
 *
 * Next.js génère automatiquement /sitemap.xml au build.
 * Les URL dynamiques (résultats, sessions) sont exclues volontairement.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://axion-campus.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tarifs`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/connexion`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/inscription`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/reconnexion`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ]
}
