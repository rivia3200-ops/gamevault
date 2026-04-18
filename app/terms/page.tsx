import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | GameVault',
  description: 'GameVault Terms of Service — rules and guidelines for using our free online games platform.',
}

const LAST_UPDATED = 'January 1, 2025'

const TOC = [
  { id: 'acceptance',       label: '1. Acceptance of Terms'       },
  { id: 'service',          label: '2. Description of Service'    },
  { id: 'intellectual',     label: '3. Intellectual Property'     },
  { id: 'acceptable-use',   label: '4. Acceptable Use'            },
  { id: 'third-party',      label: '5. Third-Party Content'       },
  { id: 'advertisements',   label: '6. Advertisements'            },
  { id: 'disclaimers',      label: '7. Disclaimers'               },
  { id: 'liability',        label: '8. Limitation of Liability'   },
  { id: 'changes',          label: '9. Changes to Terms'          },
  { id: 'contact',          label: '10. Contact'                  },
]

export default function TermsPage() {
  return (
    <div className="px-4 md:px-6 py-10 max-w-3xl mx-auto w-full">

      {/* Header */}
      <h1 className="font-display font-bold text-3xl md:text-4xl text-primary mb-2">
        Terms of Service
      </h1>
      <p className="text-muted text-sm mb-8">Last updated: {LAST_UPDATED}</p>

      {/* Table of Contents */}
      <nav aria-label="Table of contents" className="mb-10 p-5 rounded-xl bg-surface border border-border/60">
        <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Contents</p>
        <ol className="space-y-1.5">
          {TOC.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} className="text-sm text-accent hover:underline">
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-10 text-secondary text-sm leading-relaxed">

        {/* 1 */}
        <section id="acceptance">
          <h2 className="font-display font-bold text-xl text-accent mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using <strong className="text-primary">GameVault</strong> ("we," "us," "our," or the "Site"),
            you agree to be bound by these Terms of Service ("Terms"). Please read them carefully.
          </p>
          <p className="mt-3">
            If you do not agree to all of these Terms, you may not access or use the Site. Your continued use of
            GameVault after any changes to these Terms constitutes your acceptance of those changes.
          </p>
          <p className="mt-3">
            These Terms apply to all visitors, users, and others who access or use the Site. By using the Site,
            you represent that you are at least 13 years of age (or 16 in certain EU countries).
          </p>
        </section>

        {/* 2 */}
        <section id="service">
          <h2 className="font-display font-bold text-xl text-accent mb-3">2. Description of Service</h2>
          <p>
            GameVault is a free online gaming platform that provides access to browser-based games sourced from
            third-party developers and platforms. We offer:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1.5 pl-2">
            <li>A curated library of free-to-play HTML5 browser games.</li>
            <li>Game discovery features including search, categories, and recommendations.</li>
            <li>Community features such as game ratings and likes (stored locally in your browser).</li>
            <li>No account registration is required to use any feature of the Site.</li>
          </ul>
          <p className="mt-3">
            We reserve the right to modify, suspend, or discontinue any part of the Service at any time without
            prior notice or liability. We do not guarantee the continuous availability of any specific game.
          </p>
        </section>

        {/* 3 */}
        <section id="intellectual">
          <h2 className="font-display font-bold text-xl text-accent mb-3">3. Intellectual Property</h2>
          <h3 className="font-semibold text-primary mb-2">GameVault Content</h3>
          <p>
            The GameVault website, including its design, layout, text, graphics, logos, icons, and overall
            appearance, is owned by GameVault and protected by applicable intellectual property laws. You may
            not reproduce, distribute, or create derivative works without our express written permission.
          </p>
          <h3 className="font-semibold text-primary mt-4 mb-2">Third-Party Games</h3>
          <p>
            All games available on GameVault are the property of their respective developers and publishers.
            GameVault does not claim ownership of any games, game assets, game names, or associated trademarks.
            We operate as an aggregation and discovery platform only.
          </p>
          <h3 className="font-semibold text-primary mt-4 mb-2">User Content</h3>
          <p>
            GameVault does not collect or store user-generated content. Ratings and likes are stored solely in
            your browser&apos;s localStorage and are never transmitted to our servers.
          </p>
        </section>

        {/* 4 */}
        <section id="acceptable-use">
          <h2 className="font-display font-bold text-xl text-accent mb-3">4. Acceptable Use</h2>
          <p>You agree not to use GameVault to:</p>
          <ul className="list-disc list-inside mt-3 space-y-1.5 pl-2">
            <li>Violate any applicable local, national, or international law or regulation.</li>
            <li>Attempt to circumvent, disable, or interfere with security-related features of the Site.</li>
            <li>Use automated tools (bots, scrapers, crawlers) to access the Site in a way that imposes an
                unreasonable or disproportionate load on our infrastructure.</li>
            <li>Introduce viruses, trojan horses, worms, or other malicious or harmful material.</li>
            <li>Transmit unsolicited commercial communications or spam.</li>
            <li>Impersonate GameVault or any person or entity in a misleading or deceptive manner.</li>
            <li>Attempt to reverse-engineer, decompile, or disassemble any part of the Site or its games.</li>
          </ul>
          <p className="mt-3">
            We reserve the right to terminate or restrict your access to the Site if we reasonably believe you
            have violated these Terms.
          </p>
        </section>

        {/* 5 */}
        <section id="third-party">
          <h2 className="font-display font-bold text-xl text-accent mb-3">5. Third-Party Content</h2>
          <p>
            Games on GameVault are provided by third-party developers and platforms, including but not limited to
            GamePix. When you play a game, you are interacting directly with third-party servers and content.
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1.5 pl-2">
            <li>
              GameVault is not responsible for the content, quality, accuracy, or availability of any
              third-party game.
            </li>
            <li>
              Third-party games may have their own terms of service and privacy policies. We encourage you
              to review them before playing.
            </li>
            <li>
              Links to external websites are provided for convenience only. We do not endorse or assume
              responsibility for any content on third-party websites.
            </li>
            <li>
              We reserve the right to remove access to any third-party game at any time without notice.
            </li>
          </ul>
        </section>

        {/* 6 */}
        <section id="advertisements">
          <h2 className="font-display font-bold text-xl text-accent mb-3">6. Advertisements</h2>
          <p>
            GameVault is supported by advertising. We use <strong className="text-primary">Google AdSense</strong> to
            display advertisements on the Site. By using GameVault, you agree to the display of advertisements.
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1.5 pl-2">
            <li>Advertisements are served by Google AdSense and are subject to Google&apos;s policies.</li>
            <li>Personalised ads are only served after you have given explicit cookie consent.</li>
            <li>
              We are not responsible for the content of advertisements, nor do we endorse the products or
              services advertised.
            </li>
            <li>
              You may opt out of personalised advertising at any time via our Cookie Banner or at{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                google.com/settings/ads
              </a>.
            </li>
          </ul>
        </section>

        {/* 7 */}
        <section id="disclaimers">
          <h2 className="font-display font-bold text-xl text-accent mb-3">7. Disclaimers</h2>
          <div className="p-4 rounded-xl bg-surface border border-border/60 space-y-3">
            <p>
              <strong className="text-primary">No warranty:</strong> GameVault is provided on an "as is" and
              "as available" basis without any warranties of any kind, either express or implied, including
              but not limited to implied warranties of merchantability, fitness for a particular purpose,
              or non-infringement.
            </p>
            <p>
              <strong className="text-primary">No guarantee of accuracy:</strong> We do not warrant that the
              Site will be uninterrupted, error-free, or free of viruses or other harmful components. Game
              descriptions and metadata are provided by third parties and may not always be accurate.
            </p>
            <p>
              <strong className="text-primary">No responsibility for game outcomes:</strong> We make no
              representations about the suitability or appropriateness of any game for any user. Play games
              at your own discretion.
            </p>
          </div>
        </section>

        {/* 8 */}
        <section id="liability">
          <h2 className="font-display font-bold text-xl text-accent mb-3">8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, GameVault and its operators shall not be liable
            for any indirect, incidental, special, consequential, or punitive damages, including but not
            limited to:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1.5 pl-2">
            <li>Loss of profits, data, goodwill, or other intangible losses.</li>
            <li>Damages resulting from your access to or inability to access the Site.</li>
            <li>Damages resulting from any third-party content, games, or advertisements on the Site.</li>
            <li>Unauthorised access to or alteration of your data or transmissions.</li>
          </ul>
          <p className="mt-3">
            In jurisdictions that do not allow the exclusion or limitation of liability for consequential or
            incidental damages, our liability is limited to the maximum extent permitted by law.
          </p>
        </section>

        {/* 9 */}
        <section id="changes">
          <h2 className="font-display font-bold text-xl text-accent mb-3">9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. When we make material changes, we will
            update the "Last updated" date at the top of this page.
          </p>
          <p className="mt-3">
            Your continued use of GameVault after any changes to these Terms constitutes your acceptance
            of the new Terms. If you do not agree to the modified Terms, you must stop using the Site.
          </p>
          <p className="mt-3">
            We encourage you to review these Terms periodically to stay informed of any updates.
          </p>
        </section>

        {/* 10 */}
        <section id="contact">
          <h2 className="font-display font-bold text-xl text-accent mb-3">10. Contact</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="mt-3 p-4 rounded-xl bg-surface border border-border/60">
            <p className="font-semibold text-primary">GameVault Legal</p>
            <p className="mt-1">
              Email:{' '}
              <a href="mailto:legal@gamevault.com" className="text-accent hover:underline">
                legal@gamevault.com
              </a>
            </p>
            <p className="text-muted text-xs mt-2">We aim to respond to all legal inquiries within 30 days.</p>
          </div>
        </section>

      </div>

      {/* Footer nav */}
      <div className="mt-12 pt-6 border-t border-border/40 flex gap-4 text-xs text-muted">
        <Link href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link>
        <Link href="/about" className="text-accent hover:underline">About Us</Link>
        <Link href="/" className="text-accent hover:underline">← Back to Games</Link>
      </div>
    </div>
  )
}
