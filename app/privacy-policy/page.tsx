import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | GameVault',
  description: 'GameVault privacy policy — how we collect, use and protect your data. Includes Google AdSense, Analytics, and GDPR/CCPA information.',
}

const LAST_UPDATED = 'January 1, 2025'

const TOC = [
  { id: 'introduction',       label: '1. Introduction'                   },
  { id: 'information',        label: '2. Information We Collect'         },
  { id: 'cookies',            label: '3. How We Use Cookies'             },
  { id: 'advertising',        label: '4. Google AdSense & Advertising'   },
  { id: 'analytics',          label: '5. Google Analytics'               },
  { id: 'third-party-games',  label: '6. Third-Party Game Providers'     },
  { id: 'data-retention',     label: '7. Data Retention'                 },
  { id: 'your-rights',        label: '8. Your Rights (GDPR / CCPA)'      },
  { id: 'children',           label: "9. Children's Privacy"             },
  { id: 'contact',            label: '10. Contact Us'                    },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="px-4 md:px-6 py-10 max-w-3xl mx-auto w-full">

      {/* Header */}
      <h1 className="font-display font-bold text-3xl md:text-4xl text-primary mb-2">
        Privacy Policy
      </h1>
      <p className="text-muted text-sm mb-8">Last updated: {LAST_UPDATED}</p>

      {/* Table of Contents */}
      <nav aria-label="Table of contents" className="mb-10 p-5 rounded-xl bg-surface border border-border/60">
        <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Contents</p>
        <ol className="space-y-1.5">
          {TOC.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="text-sm text-accent hover:underline"
              >
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-10 text-secondary text-sm leading-relaxed">

        {/* 1 */}
        <section id="introduction">
          <h2 className="font-display font-bold text-xl text-accent mb-3">1. Introduction</h2>
          <p>
            Welcome to <strong className="text-primary">GameVault</strong> ("we," "us," or "our"). This Privacy Policy
            explains how we collect, use, and protect information when you visit our website at gamevault.vercel.app
            (the "Site"). This policy covers all pages and services available on the Site.
          </p>
          <p className="mt-3">
            By using GameVault, you agree to the collection and use of information in accordance with this policy.
            If you do not agree, please discontinue use of the Site.
          </p>
        </section>

        {/* 2 */}
        <section id="information">
          <h2 className="font-display font-bold text-xl text-accent mb-3">2. Information We Collect</h2>
          <h3 className="font-semibold text-primary mb-2">Automatically Collected Information</h3>
          <p>When you visit our Site, we automatically collect certain information, including:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
            <li>IP address (anonymised)</li>
            <li>Browser type and version</li>
            <li>Device type and operating system</li>
            <li>Pages visited and time spent on each page</li>
            <li>Referring URL (the page you came from)</li>
            <li>Date and time of your visit</li>
          </ul>
          <h3 className="font-semibold text-primary mt-4 mb-2">Cookies & Local Storage</h3>
          <p>We use browser cookies and localStorage to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
            <li>Remember your cookie consent preference</li>
            <li>Save your game ratings and liked games</li>
            <li>Store recent search history (locally in your browser)</li>
            <li>Serve and measure advertising (via Google AdSense)</li>
            <li>Analyse site traffic (via Google Analytics)</li>
          </ul>
          <h3 className="font-semibold text-primary mt-4 mb-2">What We Do NOT Collect</h3>
          <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
            <li>Names, email addresses, or passwords (no accounts are required)</li>
            <li>Payment information</li>
            <li>Precise geolocation</li>
          </ul>
        </section>

        {/* 3 */}
        <section id="cookies">
          <h2 className="font-display font-bold text-xl text-accent mb-3">3. How We Use Cookies</h2>
          <div className="space-y-4">
            {[
              {
                name: 'Essential Cookies',
                desc: 'Required for basic site functionality such as navigation and page rendering. These cannot be disabled.',
              },
              {
                name: 'Analytics Cookies',
                desc: 'Used by Google Analytics (GA4) to collect anonymised, aggregated data about how visitors use our site. IP anonymisation is enabled.',
              },
              {
                name: 'Advertising Cookies',
                desc: 'Used by Google AdSense to serve personalised or contextual advertisements. These cookies track your interests across sites to show relevant ads.',
              },
              {
                name: 'Preference Cookies (localStorage)',
                desc: 'Stored locally in your browser only. Includes game ratings, liked games, recent searches, and your cookie consent choice. Never sent to our servers.',
              },
            ].map(({ name, desc }) => (
              <div key={name} className="p-3 rounded-lg bg-surface border border-border/40">
                <p className="font-semibold text-primary mb-1">{name}</p>
                <p>{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4">
            You can manage or disable cookies via our <strong className="text-primary">Cookie Banner</strong> or
            through your browser settings. Note that disabling certain cookies may affect site functionality.
          </p>
        </section>

        {/* 4 */}
        <section id="advertising">
          <h2 className="font-display font-bold text-xl text-accent mb-3">4. Google AdSense &amp; Advertising</h2>
          <p>
            We use <strong className="text-primary">Google AdSense</strong> to display advertisements on our Site.
            Google AdSense uses cookies (including the DoubleClick cookie) to serve ads based on your prior visits
            to this and other websites.
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1 pl-2">
            <li>Google may use this data to personalise the ads you see.</li>
            <li>
              You can opt out of personalised advertising at:{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                google.com/settings/ads
              </a>
            </li>
            <li>
              View Google&apos;s Privacy Policy:{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                policies.google.com/privacy
              </a>
            </li>
            <li>We comply with all Google AdSense programme policies.</li>
            <li>Advertising cookies are only set after you give consent via our Cookie Banner.</li>
          </ul>
        </section>

        {/* 5 */}
        <section id="analytics">
          <h2 className="font-display font-bold text-xl text-accent mb-3">5. Google Analytics</h2>
          <p>
            We use <strong className="text-primary">Google Analytics 4 (GA4)</strong> to understand how visitors
            interact with our Site. All data collected is anonymised and aggregated.
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1 pl-2">
            <li>IP anonymisation is enabled — your full IP address is never stored.</li>
            <li>Data retention is set to 14 months.</li>
            <li>We do not use GA4 data for advertising targeting.</li>
            <li>
              You can opt out using the{' '}
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                Google Analytics Opt-out Browser Add-on
              </a>.
            </li>
            <li>Analytics cookies are only set after you give consent.</li>
          </ul>
        </section>

        {/* 6 */}
        <section id="third-party-games">
          <h2 className="font-display font-bold text-xl text-accent mb-3">6. Third-Party Game Providers</h2>
          <p>
            Games on GameVault are provided by third-party developers and platforms (such as GamePix). When you
            play a game, the game content is loaded from the provider&apos;s servers, and you may interact directly
            with those servers.
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1 pl-2">
            <li>We are not responsible for the privacy practices of third-party game providers.</li>
            <li>Third-party providers may set their own cookies during gameplay.</li>
            <li>
              GamePix privacy policy:{' '}
              <a href="https://www.gamepix.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                gamepix.com/privacy
              </a>
            </li>
          </ul>
        </section>

        {/* 7 */}
        <section id="data-retention">
          <h2 className="font-display font-bold text-xl text-accent mb-3">7. Data Retention</h2>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Analytics data: 14 months (Google Analytics default setting).</li>
            <li>Cookie consent preference: stored in your browser until you clear it.</li>
            <li>Game preferences (ratings, likes, recent searches): stored locally in your browser only.</li>
            <li>We do not store any personal data on our own servers.</li>
          </ul>
        </section>

        {/* 8 */}
        <section id="your-rights">
          <h2 className="font-display font-bold text-xl text-accent mb-3">8. Your Rights (GDPR / CCPA)</h2>
          <h3 className="font-semibold text-primary mb-2">EU / UK Residents (GDPR)</h3>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Right to know what personal data is processed about you.</li>
            <li>Right to opt out of advertising and analytics cookies (use our Cookie Banner).</li>
            <li>Right to request deletion of any data we hold about you.</li>
            <li>Right to lodge a complaint with your national supervisory authority.</li>
          </ul>
          <h3 className="font-semibold text-primary mt-4 mb-2">California Residents (CCPA)</h3>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Right to know what personal information is collected and how it is used.</li>
            <li>Right to opt out of the sale of personal information (we do not sell personal information).</li>
            <li>Right to non-discrimination for exercising your privacy rights.</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:privacy@gamevault.com" className="text-accent hover:underline">privacy@gamevault.com</a>.
          </p>
        </section>

        {/* 9 */}
        <section id="children">
          <h2 className="font-display font-bold text-xl text-accent mb-3">9. Children&apos;s Privacy</h2>
          <p>
            GameVault is intended for users aged 13 and older. We do not knowingly collect personal information
            from children under the age of 13 (or 16 in certain EU countries).
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1 pl-2">
            <li>We comply with the Children&apos;s Online Privacy Protection Act (COPPA).</li>
            <li>If you are a parent and believe your child has provided us with personal data, please contact us immediately.</li>
            <li>We will promptly delete any such information upon request.</li>
          </ul>
        </section>

        {/* 10 */}
        <section id="contact">
          <h2 className="font-display font-bold text-xl text-accent mb-3">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
          </p>
          <div className="mt-3 p-4 rounded-xl bg-surface border border-border/60">
            <p className="font-semibold text-primary">GameVault Privacy Team</p>
            <p className="mt-1">
              Email:{' '}
              <a href="mailto:privacy@gamevault.com" className="text-accent hover:underline">
                privacy@gamevault.com
              </a>
            </p>
            <p className="text-muted text-xs mt-2">We aim to respond to all privacy requests within 30 days.</p>
          </div>
        </section>

      </div>

      {/* Footer nav */}
      <div className="mt-12 pt-6 border-t border-border/40 flex gap-4 text-xs text-muted">
        <Link href="/terms" className="text-accent hover:underline">Terms of Service</Link>
        <Link href="/about" className="text-accent hover:underline">About Us</Link>
        <Link href="/" className="text-accent hover:underline">← Back to Games</Link>
      </div>
    </div>
  )
}
