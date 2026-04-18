import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllGames } from '@/lib/games'

export const metadata: Metadata = {
  title: 'About GameVault',
  description: 'Learn about GameVault — a free browser gaming platform with 1,000+ HTML5 games. No downloads, no logins, just play.',
}

export default function AboutPage() {
  const totalGames = getAllGames().length

  return (
    <div className="px-4 md:px-6 py-10 max-w-3xl mx-auto w-full">

      {/* Header */}
      <h1 className="font-display font-bold text-3xl md:text-4xl text-primary mb-4">
        About GameVault
      </h1>
      <p className="text-secondary text-base leading-relaxed mb-10">
        GameVault is a free online gaming platform built for one purpose: get you into a great game
        in under 10 seconds, no friction.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {[
          { value: `${totalGames}+`, label: 'Games' },
          { value: '0',             label: 'Downloads Required' },
          { value: '0',             label: 'Accounts Needed' },
        ].map(({ value, label }) => (
          <div key={label} className="p-4 rounded-xl bg-surface border border-border/60 text-center">
            <p className="font-display font-bold text-2xl md:text-3xl text-accent">{value}</p>
            <p className="text-xs text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-10 text-secondary text-sm leading-relaxed">

        {/* Mission */}
        <section>
          <h2 className="font-display font-bold text-xl text-primary mb-3">Our Mission</h2>
          <p>
            We believe great games should be instantly accessible to everyone. GameVault aggregates
            the best free HTML5 browser games from talented developers around the world, organises
            them into a clean browsing experience, and gets out of the way.
          </p>
          <p className="mt-3">
            No paywalls. No mandatory sign-ups. No app store. Just open your browser and play.
          </p>
        </section>

        {/* How it works */}
        <section>
          <h2 className="font-display font-bold text-xl text-primary mb-3">How It Works</h2>
          <div className="space-y-3">
            {[
              {
                step: '01',
                title: 'Browse or Search',
                desc:  'Explore games by category, sort by popularity or rating, or use instant search to find exactly what you\'re looking for.',
              },
              {
                step: '02',
                title: 'Click and Play',
                desc:  'Games load directly in your browser via HTML5. No plugins, no downloads, no waiting — just click and play.',
              },
              {
                step: '03',
                title: 'Rate and Save',
                desc:  'Rate games with stars, like your favourites, and they\'ll be remembered in your browser for next time.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 p-4 rounded-xl bg-surface border border-border/60">
                <span className="font-display font-bold text-2xl text-accent/30 flex-shrink-0 w-8">{step}</span>
                <div>
                  <p className="font-semibold text-primary mb-0.5">{title}</p>
                  <p className="text-xs text-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Game sources */}
        <section>
          <h2 className="font-display font-bold text-xl text-primary mb-3">Game Providers</h2>
          <p>
            Games on GameVault are sourced from trusted third-party platforms and independent developers.
            Our primary game partner is <strong className="text-primary">GamePix</strong>, a leading HTML5
            game platform with thousands of titles across all genres.
          </p>
          <p className="mt-3">
            All games are browser-native HTML5 experiences — meaning they run entirely in your browser
            with no external software required. Game content, including saves and scores within a game,
            is managed entirely by the game provider.
          </p>
        </section>

        {/* Privacy */}
        <section>
          <h2 className="font-display font-bold text-xl text-primary mb-3">Privacy First</h2>
          <p>
            We don&apos;t require accounts, so we don&apos;t collect personal information. Your game ratings,
            likes, and search history are stored only in your browser&apos;s local storage — never on our
            servers.
          </p>
          <p className="mt-3">
            We use Google Analytics (anonymised) and Google AdSense (consent-gated) to keep the lights on.
            You can opt out of non-essential cookies at any time via the cookie banner.
          </p>
          <p className="mt-3">
            Read our full{' '}
            <Link href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link>
            {' '}for details.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="font-display font-bold text-xl text-primary mb-3">Contact & Feedback</h2>
          <p>
            Have a game suggestion, found a broken game, or have a question? We&apos;d love to hear from you.
          </p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {[
              {
                icon:  '📧',
                title: 'General Enquiries',
                email: 'hello@gamevault.com',
                href:  'mailto:hello@gamevault.com',
              },
              {
                icon:  '🔒',
                title: 'Privacy & Legal',
                email: 'privacy@gamevault.com',
                href:  'mailto:privacy@gamevault.com',
              },
              {
                icon:  '🐛',
                title: 'Report a Bug',
                email: 'bugs@gamevault.com',
                href:  'mailto:bugs@gamevault.com',
              },
              {
                icon:  '🎮',
                title: 'Game Submissions',
                email: 'games@gamevault.com',
                href:  'mailto:games@gamevault.com',
              },
            ].map(({ icon, title, email, href }) => (
              <a
                key={email}
                href={href}
                className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-border/60 hover:border-accent/40 transition-colors group"
              >
                <span className="text-xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="font-semibold text-primary text-xs mb-0.5">{title}</p>
                  <p className="text-accent text-xs group-hover:underline">{email}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

      </div>

      {/* Footer nav */}
      <div className="mt-12 pt-6 border-t border-border/40 flex gap-4 text-xs text-muted">
        <Link href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link>
        <Link href="/terms" className="text-accent hover:underline">Terms of Service</Link>
        <Link href="/" className="text-accent hover:underline">← Back to Games</Link>
      </div>
    </div>
  )
}
