import Link from 'next/link'
import categoriesData  from '@/data/categories.json'
import type { Category } from '@/lib/types'
import RandomGameButton from '@/components/ui/RandomGameButton'

const topCategories = (categoriesData as Category[]).slice(0, 6)

const year = new Date().getFullYear()

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer role="contentinfo" className="mt-auto border-t border-border/60 bg-surface/50">

      {/* ── Main grid ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">

          {/* Column 1 — Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3" aria-label="GameVault Home">
              <span className="text-2xl select-none" aria-hidden>🎮</span>
              <span className="font-display font-bold text-xl text-primary">
                Game<span className="text-gradient-accent">Vault</span>
              </span>
            </Link>
            <p className="text-sm text-secondary leading-relaxed mb-5">
              Your home for free online games. No download, no subscription — just instant fun.
            </p>
            <p className="text-xs text-muted">
              &copy; {year} GameVault. All rights reserved.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2 mt-4">
              {[
                { label: 'Twitter / X', href: '#', icon: '𝕏'  },
                { label: 'YouTube',     href: '#', icon: '▶'  },
                { label: 'TikTok',      href: '#', icon: '♪'  },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-border/80 text-secondary hover:text-primary hover:border-accent/50 hover:bg-surface-hover transition-all duration-150 text-sm"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Games */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
              Games
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              <li>
                <Link href="/popular" className="text-sm text-secondary hover:text-primary transition-colors">
                  🔥 Popular Games
                </Link>
              </li>
              <li>
                <Link href="/new-games" className="text-sm text-secondary hover:text-primary transition-colors">
                  ⚡ New Games
                </Link>
              </li>
              <li>
                <RandomGameButton className="text-sm text-secondary hover:text-primary transition-colors text-left">
                  🎲 Random Game
                </RandomGameButton>
              </li>
              <li>
                <Link href="/" className="text-sm text-secondary hover:text-primary transition-colors">
                  📂 All Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 — Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
              Info
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              <li>
                <Link href="/blog" className="text-sm text-secondary hover:text-primary transition-colors">
                  📝 Blog
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-secondary hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-secondary hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@gamevault.com"
                  className="text-sm text-secondary hover:text-primary transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 — Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
              Categories
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {topCategories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-secondary hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span aria-hidden>{cat.icon}</span>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────────── */}
      <div className="border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted text-center sm:text-left">
            Made for gamers, by gamers 🎮 · All games are property of their respective owners.{' '}
            Games provided by{' '}
            <a href="https://www.gamepix.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors underline underline-offset-2">
              GamePix
            </a>.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-xs text-muted hover:text-secondary transition-colors">
              Privacy
            </Link>
            <span className="text-muted/30" aria-hidden>·</span>
            <Link href="/terms" className="text-xs text-muted hover:text-secondary transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>

    </footer>
  )
}
