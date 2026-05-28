import { MetadataRoute } from 'next'

/**
 * US6 — Robots.txt
 * Branche : feat/us5-us8-medium
 * Fichier  : src/app/robots.ts  (NOUVEAU)
 *
 * Next.js génère automatiquement /robots.txt.
 * On bloque les routes API, admin, résultats et pages de session.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://axion-campus.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin',
          '/admin/',
          '/diagnostic',
          '/satisfaction',
          '/resultats',
          '/_next/',
        ],
      },
      /* Bloquer les crawlers d'IA agressifs */
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'Claude-Web'],
        disallow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
