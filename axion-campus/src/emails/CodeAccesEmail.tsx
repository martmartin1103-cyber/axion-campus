/**
 * src/emails/CodeAccesEmail.tsx
 *
 * Template React Email envoyé à l'indépendant
 * après sa demande sur /pour-moi.
 *
 * Prévisualisation locale :
 *   npx email dev   (ouvre http://localhost:3000)
 */

import {
  Body, Button, Container, Head, Heading,
  Hr, Html, Img, Link, Preview, Section,
  Text, Font,
} from '@react-email/components'

interface CodeAccesEmailProps {
  prenom:     string
  email:      string
  codeAcces:  string   // ex: "INDEP-A3F7-2026"
  lienTest:   string   // ex: "https://axion-campus.vercel.app/inscription"
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://axion-campus.vercel.app'

export default function CodeAccesEmail({
  prenom    = 'Alex',
  email     = 'alex@email.com',
  codeAcces = 'INDEP-XXXX-0000',
  lienTest  = `${BASE_URL}/inscription`,
}: CodeAccesEmailProps) {
  return (
    <Html lang="fr" dir="ltr">
      <Head>
        <Font
          fontFamily="DM Sans"
          fallbackFontFamily="Helvetica"
          webFont={{ url: 'https://fonts.gstatic.com/s/dmsans/v15/rP2Hp2ywxg089UriCZa4ET-DNl0.woff2', format: 'woff2' }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="DM Sans"
          fallbackFontFamily="Helvetica"
          webFont={{ url: 'https://fonts.gstatic.com/s/dmsans/v15/rP2Hp2ywxg089UriCZa4GT-DNl0.woff2', format: 'woff2' }}
          fontWeight={600}
          fontStyle="normal"
        />
      </Head>

      {/* Texte de prévisualisation (affiché dans la liste d'emails) */}
      <Preview>
        {prenom}, votre code d'accès AXION CAMPUS est prêt — passez votre diagnostic en 3 min !
      </Preview>

      <Body style={main}>
        <Container style={container}>

          {/* ── Header ── */}
          <Section style={header}>
            <table width="100%" cellPadding="0" cellSpacing="0">
              <tr>
                <td style={logoCell}>
                  {/* Hexagone SVG inline (pas besoin d'image hébergée) */}
                  <table cellPadding="0" cellSpacing="0">
                    <tr>
                      <td style={logoIcon}>
                        <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
                          <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                          <path d="M7 1V13M1 4L13 10M13 4L1 10" stroke="white" strokeWidth="1" strokeOpacity="0.5"/>
                        </svg>
                      </td>
                      <td style={logoText}>AXION CAMPUS™</td>
                    </tr>
                  </table>
                </td>
                <td style={headerTagline}>Certification IA Agentique</td>
              </tr>
            </table>
          </Section>

          {/* ── Hero ── */}
          <Section style={hero}>
            <Text style={heroLabel}>Votre accès est prêt</Text>
            <Heading style={heroTitle}>
              Bonjour {prenom} 👋
            </Heading>
            <Text style={heroSubtitle}>
              Merci pour votre demande. Voici votre code d'accès personnel
              pour passer le diagnostic de maturité IA Axion Campus.
            </Text>
          </Section>

          {/* ── Code ── */}
          <Section style={codeSection}>
            <Text style={codeLabel}>VOTRE CODE D'ACCÈS</Text>
            <Text style={codeBox}>{codeAcces}</Text>
            <Text style={codeHint}>
              Ce code est à usage unique · Valable 30 jours
            </Text>
          </Section>

          {/* ── CTA ── */}
          <Section style={ctaSection}>
            <Button href={lienTest} style={ctaButton}>
              Démarrer mon diagnostic →
            </Button>
            <Text style={ctaOr}>Ou copiez ce lien dans votre navigateur :</Text>
            <Link href={lienTest} style={ctaLink}>{lienTest}</Link>
          </Section>

          <Hr style={divider}/>

          {/* ── Ce qui vous attend ── */}
          <Section style={infoSection}>
            <Heading as="h2" style={infoTitle}>Ce que vous allez obtenir</Heading>
            <table width="100%" cellPadding="0" cellSpacing="0">
              {[
                { icon: '⚡', label: '3 minutes chrono',          desc: 'Le diagnostic démarre dès que vous cliquez — pas de pause possible.' },
                { icon: '🎯', label: '5 dimensions évaluées',     desc: 'Maturité IA · Agentic Usage · Gouvernance · ROI · Transformation.' },
                { icon: '📊', label: 'Score personnel /1000',     desc: 'Grade A, B+, B, C ou D avec détail par dimension.' },
                { icon: '📜', label: 'Certificat PDF à votre nom', desc: 'Téléchargeable et partageable directement sur LinkedIn.' },
              ].map(row => (
                <tr key={row.label}>
                  <td style={featureIcon}>{row.icon}</td>
                  <td style={featureContent}>
                    <Text style={featureLabel}>{row.label}</Text>
                    <Text style={featureDesc}>{row.desc}</Text>
                  </td>
                </tr>
              ))}
            </table>
          </Section>

          <Hr style={divider}/>

          {/* ── Footer ── */}
          <Section style={footerSection}>
            <Text style={footerText}>
              Cet email a été envoyé à <strong>{email}</strong> suite à votre
              demande sur{' '}
              <Link href={`${BASE_URL}/pour-moi`} style={footerLink}>
                axion-campus.fr
              </Link>
              .
            </Text>
            <Text style={footerLegal}>
              AXION CAMPUS™ est une certification privée non reconnue par l'État.
              Vos données sont traitées conformément au RGPD.{' '}
              <Link href={`${BASE_URL}/legal/confidentialite`} style={footerLink}>
                Politique de confidentialité
              </Link>
              {' · '}
              <Link href="mailto:contact@axion-campus.fr" style={footerLink}>
                Nous contacter
              </Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

/* ── Styles inline ── */

const main: React.CSSProperties = {
  backgroundColor: '#F7F8FA',
  fontFamily: "'DM Sans', Helvetica, Arial, sans-serif",
}

const container: React.CSSProperties = {
  maxWidth: '560px',
  margin: '40px auto',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid #E2E8F0',
}

const header: React.CSSProperties = {
  backgroundColor: '#060f1e',
  padding: '20px 28px',
}

const logoCell: React.CSSProperties = {
  verticalAlign: 'middle',
}

const logoIcon: React.CSSProperties = {
  backgroundColor: '#0A66C2',
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  textAlign: 'center',
  verticalAlign: 'middle',
  paddingTop: '6px',
}

const logoText: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '0.04em',
  paddingLeft: '10px',
  verticalAlign: 'middle',
}

const headerTagline: React.CSSProperties = {
  color: 'rgba(255,255,255,0.35)',
  fontSize: '11px',
  textAlign: 'right',
  verticalAlign: 'middle',
}

const hero: React.CSSProperties = {
  padding: '32px 28px 24px',
  backgroundColor: '#060f1e',
}

const heroLabel: React.CSSProperties = {
  color: '#7DD3FC',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  margin: '0 0 8px',
}

const heroTitle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 800,
  lineHeight: '1.2',
  margin: '0 0 12px',
}

const heroSubtitle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.65)',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
}

const codeSection: React.CSSProperties = {
  padding: '28px',
  backgroundColor: '#060f1e',
  textAlign: 'center',
}

const codeLabel: React.CSSProperties = {
  color: 'rgba(255,255,255,0.4)',
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  margin: '0 0 12px',
}

const codeBox: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: 'rgba(10, 102, 194, 0.15)',
  border: '1px solid rgba(10, 102, 194, 0.4)',
  borderRadius: '12px',
  color: '#7DD3FC',
  fontSize: '28px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  fontFamily: 'monospace',
  padding: '14px 28px',
  margin: '0 0 10px',
}

const codeHint: React.CSSProperties = {
  color: 'rgba(255,255,255,0.3)',
  fontSize: '12px',
  margin: '0',
}

const ctaSection: React.CSSProperties = {
  padding: '24px 28px 28px',
  backgroundColor: '#060f1e',
  textAlign: 'center',
}

const ctaButton: React.CSSProperties = {
  backgroundColor: '#0A66C2',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 700,
  padding: '14px 32px',
  borderRadius: '12px',
  textDecoration: 'none',
  display: 'inline-block',
}

const ctaOr: React.CSSProperties = {
  color: 'rgba(255,255,255,0.3)',
  fontSize: '12px',
  margin: '16px 0 4px',
}

const ctaLink: React.CSSProperties = {
  color: '#7DD3FC',
  fontSize: '12px',
  wordBreak: 'break-all',
}

const divider: React.CSSProperties = {
  borderColor: '#E2E8F0',
  margin: '0',
}

const infoSection: React.CSSProperties = {
  padding: '28px',
}

const infoTitle: React.CSSProperties = {
  color: '#0F172A',
  fontSize: '16px',
  fontWeight: 700,
  margin: '0 0 20px',
}

const featureIcon: React.CSSProperties = {
  fontSize: '20px',
  width: '36px',
  verticalAlign: 'top',
  paddingTop: '2px',
  paddingBottom: '14px',
}

const featureContent: React.CSSProperties = {
  verticalAlign: 'top',
  paddingBottom: '14px',
}

const featureLabel: React.CSSProperties = {
  color: '#0F172A',
  fontSize: '14px',
  fontWeight: 600,
  margin: '0 0 2px',
}

const featureDesc: React.CSSProperties = {
  color: '#64748B',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '0',
}

const footerSection: React.CSSProperties = {
  padding: '20px 28px 24px',
  backgroundColor: '#F8FAFC',
}

const footerText: React.CSSProperties = {
  color: '#94A3B8',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0 0 8px',
}

const footerLegal: React.CSSProperties = {
  color: '#94A3B8',
  fontSize: '11px',
  lineHeight: '1.6',
  margin: '0',
}

const footerLink: React.CSSProperties = {
  color: '#0A66C2',
  textDecoration: 'underline',
}
