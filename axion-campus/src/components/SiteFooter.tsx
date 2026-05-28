'use client'

/**
 * SiteFooter — Footer légal complet
 * Fichier : src/components/SiteFooter.tsx  (NOUVEAU)
 *
 * Réutilisable sur toutes les pages.
 * Variante claire (variant="light") ou sombre (variant="dark", défaut).
 */

import Link from 'next/link'

const YEAR = new Date().getFullYear()

const LINKS_PRODUCT = [
  { label: 'Pour les écoles',        href: '/pour-les-ecoles' },
  { label: 'Pour les entreprises',   href: '/pour-les-entreprises' },
  { label: 'Pour les indépendants',  href: '/pour-moi' },
  { label: 'Tarifs',                 href: '/tarifs' },
  { label: 'Programme & dimensions', href: '/pour-les-ecoles#programme' },
]

const LINKS_PLATEFORME = [
  { label: 'Passer le diagnostic',  href: '/connexion' },
  { label: 'Espace étudiant',       href: '/connexion' },
  { label: 'Dashboard admin',       href: '/admin' },
  { label: 'Retrouver mes résultats', href: '/reconnexion' },
]

const LINKS_LEGAL = [
  { label: 'Conditions générales d\'utilisation', href: '/legal/cgu' },
  { label: 'Politique de confidentialité',        href: '/legal/confidentialite' },
  { label: 'Politique des cookies',               href: '/legal/cookies' },
  { label: 'Mentions légales',                    href: '/legal/mentions' },
  { label: 'RGPD & données personnelles',         href: '/legal/rgpd' },
]

function FooterCol({ title, links, variant }: {
  title: string
  links: { label: string; href: string }[]
  variant: 'dark' | 'light'
}) {
  const titleColor = variant === 'dark' ? 'text-white/90' : 'text-slate-800'
  const linkColor  = variant === 'dark'
    ? 'text-slate-400 hover:text-white'
    : 'text-slate-500 hover:text-slate-900'

  return (
    <div>
      <p className={`text-xs font-bold uppercase tracking-[0.12em] mb-4 ${titleColor}`}>
        {title}
      </p>
      <ul className="space-y-2.5">
        {links.map(l => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={`text-sm transition-colors duration-150 ${linkColor}`}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function SiteFooter({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const bg         = variant === 'dark'  ? 'bg-[#040810]'   : 'bg-slate-50'
  const border     = variant === 'dark'  ? 'border-white/[0.06]' : 'border-slate-200'
  const logoColor  = variant === 'dark'  ? 'bg-[#0A66C2]'   : 'bg-[#0A66C2]'
  const brandText  = variant === 'dark'  ? 'text-white'      : 'text-slate-900'
  const tagline    = variant === 'dark'  ? 'text-slate-500'  : 'text-slate-400'
  const divider    = variant === 'dark'  ? 'border-white/[0.06]' : 'border-slate-200'
  const copyText   = variant === 'dark'  ? 'text-slate-600'  : 'text-slate-400'
  const legalLink  = variant === 'dark'
    ? 'text-slate-600 hover:text-slate-400'
    : 'text-slate-400 hover:text-slate-600'
  const badge      = variant === 'dark'
    ? 'bg-white/[0.05] text-slate-400 border-white/[0.07]'
    : 'bg-slate-100 text-slate-500 border-slate-200'

  return (
    <footer className={`${bg} border-t ${border}`}>

      {/* ── Corps ── */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Colonne marque */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className={`w-8 h-8 rounded-lg ${logoColor} flex items-center justify-center shrink-0`}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M7 1V13M1 4L13 10M13 4L1 10" stroke="white" strokeWidth="1" strokeOpacity="0.4"/>
                </svg>
              </div>
              <span className={`text-sm font-bold tracking-tight ${brandText}`}
                style={{ fontFamily: "'Syne', sans-serif" }}>
                AXION CAMPUS™
              </span>
            </Link>
            <p className={`text-sm leading-relaxed mb-5 ${tagline}`}>
              La plateforme de certification en IA agentique pour les écoles, les entreprises et les professionnels indépendants.
            </p>
            {/* Badge discret */}
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full border ${badge}`}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Certification privée · non reconnue par l'État
            </span>
          </div>

          {/* Colonnes liens */}
          <FooterCol title="Offres"      links={LINKS_PRODUCT}    variant={variant}/>
          <FooterCol title="Plateforme"  links={LINKS_PLATEFORME} variant={variant}/>
          <FooterCol title="Légal"       links={LINKS_LEGAL}      variant={variant}/>
        </div>
      </div>

      {/* ── Barre de fond ── */}
      <div className={`border-t ${divider} max-w-7xl mx-auto px-6 py-5`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

          {/* Copyright */}
          <p className={`text-xs ${copyText}`}>
            © {YEAR} AXION CAMPUS™ — Tous droits réservés.
            <span className="ml-2 opacity-60">SIREN : en cours d'immatriculation</span>
          </p>

          {/* Liens légaux rapides */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {[
              { label: 'CGU',           href: '/legal/cgu' },
              { label: 'Confidentialité', href: '/legal/confidentialite' },
              { label: 'Cookies',       href: '/legal/cookies' },
              { label: 'Contact',       href: 'mailto:contact@axion-campus.fr' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className={`text-xs transition-colors ${legalLink}`}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Avertissement légal complet */}
        <p className={`text-[11px] leading-relaxed mt-3 ${copyText} opacity-60 max-w-4xl`}>
          AXION CAMPUS™ est une certification privée à visée professionnelle et pédagogique.
          Elle n'est pas reconnue par l'État français, ni par le Ministère de l'Éducation Nationale,
          ni par France Compétences. Les résultats obtenus n'ouvrent pas droit à une validation
          d'acquis d'expérience (VAE) officielle. Les données personnelles collectées sont traitées
          conformément au RGPD (Règlement UE 2016/679) et à la loi Informatique et Libertés.
          Hébergement : Vercel Inc., 340 Pine Street, San Francisco, CA 94104, USA.
          Données stockées sur Supabase (AWS eu-west-3, Paris).
        </p>
      </div>
    </footer>
  )
}
