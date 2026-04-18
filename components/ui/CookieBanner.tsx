'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Analytics } from '@/lib/analytics'

const STORAGE_KEY      = 'cookieConsent'
const STORAGE_DATE_KEY = 'cookieConsentDate'

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  disabled = false,
  id,
}: {
  checked:   boolean
  onChange?: (v: boolean) => void
  disabled?: boolean
  id:        string
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      id={id}
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={[
        'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent',
        'transition-colors duration-200 ease-in-out focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-accent/70',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        checked ? 'bg-accent' : 'bg-border',
      ].join(' ')}
    >
      <span
        className={[
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm',
          'transform transition duration-200 ease-in-out',
          checked ? 'translate-x-5' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CookieBanner() {
  const [mounted,     setMounted]     = useState(false)
  const [consent,     setConsent]     = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Granular toggles (default on for non-essential too, user can turn off)
  const [adsToggle,       setAdsToggle]       = useState(true)
  const [analyticsToggle, setAnalyticsToggle] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setConsent(stored)
    setMounted(true)
  }, [])

  if (!mounted || consent !== null) return null

  const persist = (value: 'accepted' | 'rejected') => {
    localStorage.setItem(STORAGE_KEY,      value)
    localStorage.setItem(STORAGE_DATE_KEY, new Date().toISOString())
    setConsent(value)
    Analytics.cookieConsent(value === 'accepted')
  }

  const handleAcceptAll = () => persist('accepted')
  const handleRejectAll = () => persist('rejected')

  const handleSavePrefs = () => {
    // Treat as accepted only if at least ads or analytics are on
    persist(adsToggle || analyticsToggle ? 'accepted' : 'rejected')
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-[60] animate-slide-up"
    >
      <div className="bg-surface/98 backdrop-blur-md border-t border-border/60 shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">

          {/* ── Simple view ─────────────────────────────────────────── */}
          {!showDetails && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="text-2xl flex-shrink-0 select-none" aria-hidden>🍪</span>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-primary font-medium">
                  We use cookies to personalise ads and analyse traffic.
                </p>
                <p className="text-xs text-secondary mt-0.5">
                  By clicking &ldquo;Accept All&rdquo; you agree to our{' '}
                  <Link href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link>
                  {' '}and use of cookies.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover border border-border/60 transition-all"
                >
                  Customize
                </button>
                <button
                  type="button"
                  onClick={handleRejectAll}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-secondary hover:text-primary border border-border/60 hover:border-accent/40 transition-all"
                >
                  Reject Non-Essential
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-accent text-white hover:bg-accent-hover active:scale-95 transition-all shadow-accent"
                >
                  Accept All
                </button>
              </div>
            </div>
          )}

          {/* ── Detailed view ─────────────────────────────────────── */}
          {showDetails && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-base text-primary">Cookie Preferences</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-muted hover:text-secondary text-sm"
                  aria-label="Back to simple view"
                >
                  ← Back
                </button>
              </div>

              <div className="space-y-3">
                {/* Essential */}
                <div className="flex items-start justify-between gap-4 p-3 rounded-xl bg-surface-hover border border-border/40">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-primary">✅ Essential Cookies</p>
                      <span className="text-2xs bg-success/15 text-success border border-success/30 px-1.5 py-0.5 rounded">Always on</span>
                    </div>
                    <p className="text-xs text-muted">Required for the website to function properly. Cannot be disabled.</p>
                  </div>
                  <Toggle id="essential" checked disabled />
                </div>

                {/* Advertising */}
                <div className="flex items-start justify-between gap-4 p-3 rounded-xl bg-surface-hover border border-border/40">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-primary mb-0.5">📢 Advertising Cookies</p>
                    <p className="text-xs text-muted">Allow personalised ads via Google AdSense based on your browsing.</p>
                  </div>
                  <Toggle id="ads" checked={adsToggle} onChange={setAdsToggle} />
                </div>

                {/* Analytics */}
                <div className="flex items-start justify-between gap-4 p-3 rounded-xl bg-surface-hover border border-border/40">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-primary mb-0.5">📊 Analytics Cookies</p>
                    <p className="text-xs text-muted">Help us understand how visitors use the site (Google Analytics — anonymised).</p>
                  </div>
                  <Toggle id="analytics" checked={analyticsToggle} onChange={setAnalyticsToggle} />
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleRejectAll}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border border-border/60 text-secondary hover:text-primary hover:border-accent/40 transition-all"
                >
                  Reject All
                </button>
                <button
                  type="button"
                  onClick={handleSavePrefs}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold bg-accent text-white hover:bg-accent-hover active:scale-95 transition-all"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
