'use client'

import { useEffect, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AdFormat = 'leaderboard' | 'rectangle' | 'skyscraper' | 'mobile-banner'

export interface AdSlotProps {
  format:     AdFormat
  slot?:      string
  className?: string
  label?:     boolean
}

const AD_CONFIG: Record<AdFormat, { width: number; height: number; wrapCls: string }> = {
  leaderboard:     { width: 728, height: 90,  wrapCls: 'hidden md:flex' },
  rectangle:       { width: 300, height: 250, wrapCls: 'flex'           },
  skyscraper:      { width: 160, height: 600, wrapCls: 'hidden lg:flex' },
  'mobile-banner': { width: 320, height: 50,  wrapCls: 'flex md:hidden' },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdSlot({
  format,
  slot,
  className = '',
  label = true,
}: AdSlotProps) {
  const { width, height, wrapCls } = AD_CONFIG[format]
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID
  const slotId    = slot ?? process.env[`NEXT_PUBLIC_AD_SLOT_${format.toUpperCase().replace('-', '_')}`]
  const isProd    = process.env.NODE_ENV === 'production'

  const [consent, setConsent] = useState<string | null>(null)

  useEffect(() => {
    setConsent(localStorage.getItem('cookieConsent'))
  }, [])

  // Push ad to AdSense queue once mounted in production
  useEffect(() => {
    if (!isProd || !adsenseId || consent !== 'accepted') return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch { /* noop */ }
  }, [isProd, adsenseId, consent])

  // ── Production + consent + AdSense ID → real ad ────────────────────────
  if (isProd && adsenseId && consent === 'accepted') {
    return (
      <div className={`${wrapCls} flex-col items-center ${className}`}>
        {label && (
          <p className="text-[10px] text-muted/50 uppercase tracking-widest mb-1 select-none">
            Advertisement
          </p>
        )}
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width, height }}
          data-ad-client={adsenseId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    )
  }

  // ── No consent yet: soft placeholder ───────────────────────────────────
  if (isProd && consent === 'rejected') return null

  // ── Dev / no AdSense ID: placeholder ───────────────────────────────────
  return (
    <div className={`${wrapCls} flex-col items-center ${className}`} aria-hidden>
      {label && (
        <p className="text-[10px] text-muted/40 uppercase tracking-widest mb-1 select-none">
          Advertisement
        </p>
      )}
      <div
        className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface/40 text-muted/40 gap-1"
        style={{ width: Math.min(width, 728), maxWidth: '100%', height }}
      >
        <span className="text-lg select-none" aria-hidden>📢</span>
        <span className="text-xs">Ad Slot</span>
        <span className="text-[10px] font-mono">{width}×{height}</span>
      </div>
    </div>
  )
}
