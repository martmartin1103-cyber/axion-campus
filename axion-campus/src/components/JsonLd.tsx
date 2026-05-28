/**
 * US6 — JSON-LD Schema.org Course
 * Branche : feat/us5-us8-medium
 * Fichier  : src/components/JsonLd.tsx  (NOUVEAU)
 *
 * À importer dans src/app/layout.tsx :
 *   import JsonLd from '@/components/JsonLd'
 *   // puis dans <body> :
 *   <JsonLd />
 *
 * Génère le schema Course + EducationalOrganization pour Google.
 * Améliore l'apparition dans les résultats enrichis (rich snippets).
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://axion-campus.vercel.app'

export default function JsonLd() {
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Certification IA Agentique — AXION Campus',
    description: 'Évaluez votre maturité en IA agentique en 3 minutes. Score sur 1000, grade A–D sur 5 dimensions : Maturité IA, Agentic Usage, Gouvernance, ROI Thinking et Transformation.',
    url: BASE_URL,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'AXION Campus',
      url: BASE_URL,
      sameAs: [],
    },
    educationalLevel: 'ProfessionalDevelopment',
    courseMode: 'online',
    timeRequired: 'PT3M',
    inLanguage: 'fr',
    teaches: [
      'Maturité IA et LLM',
      'Usage des agents IA autonomes',
      'Gouvernance IA et AI Act européen',
      'ROI et business case IA',
      'Transformation organisationnelle IA',
    ],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      description: 'Accès via code fourni par l\'établissement partenaire.',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseSchedule: {
        '@type': 'Schedule',
        duration: 'PT3M',
        repeatFrequency: 'P1D',
      },
    },
  }

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AXION Campus',
    url: BASE_URL,
    description: 'Plateforme de certification en IA agentique pour établissements d\'enseignement supérieur.',
    foundingDate: '2024',
    areaServed: 'FR',
    knowsAbout: [
      'Intelligence Artificielle', 'IA Agentique', 'LLM', 'Certification IA', 'Formation IA',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
    </>
  )
}
