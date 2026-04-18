'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { Game } from '@/lib/types'
import { formatPlayCount, formatRating, getStarRating } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'
import { Analytics } from '@/lib/analytics'

// ─── Props ────────────────────────────────────────────────────────────────────

interface GamePlayerProps {
  game: Game
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function FullscreenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  )
}

function ExitFullscreenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
    </svg>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function FlagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  )
}

// ─── Star Rating Component ────────────────────────────────────────────────────

function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
}: {
  value: number
  onChange?: (v: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const [hover, setHover] = useState(0)
  const starSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg'
  const display  = hover || value

  return (
    <div
      className={`flex items-center gap-0.5 ${readonly ? '' : 'cursor-pointer'}`}
      onMouseLeave={() => !readonly && setHover(0)}
      role={readonly ? undefined : 'radiogroup'}
      aria-label={readonly ? `Rating: ${value} out of 5` : 'Rate this game'}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = display >= star
        const half   = !filled && display >= star - 0.5

        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onMouseEnter={() => !readonly && setHover(star)}
            onClick={() => !readonly && onChange?.(star)}
            aria-label={readonly ? undefined : `Rate ${star} star${star !== 1 ? 's' : ''}`}
            className={[
              starSize,
              'leading-none select-none transition-transform duration-100',
              !readonly && 'hover:scale-110 active:scale-95',
              readonly && 'cursor-default',
            ].filter(Boolean).join(' ')}
          >
            <span className={filled ? 'text-warning' : half ? 'text-warning/60' : 'text-muted'}>
              {filled ? '★' : half ? '⯨' : '☆'}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Controls Key Badge ───────────────────────────────────────────────────────

function KeyBadge({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-1.5 rounded border border-border bg-surface-hover text-xs font-mono text-secondary shadow-inner">
      {children}
    </kbd>
  )
}

function parseControlString(ctrl: string): React.ReactNode[] {
  // Split on common delimiters, render bracketed terms as key badges
  const parts = ctrl.split(/(\[[^\]]+\]|[A-Z]{2,}(?:\+[A-Z]+)*|\bWASD\b|\bArrow\b)/g)
  return parts.map((part, i) => {
    const clean = part.replace(/^\[|\]$/g, '')
    if (part.startsWith('[') && part.endsWith(']')) {
      return <KeyBadge key={i}>{clean}</KeyBadge>
    }
    if (/^(WASD|SPACE|ESC|ENTER|CTRL|SHIFT|ALT)$/i.test(part)) {
      return <KeyBadge key={i}>{part.toUpperCase()}</KeyBadge>
    }
    return <span key={i}>{part}</span>
  })
}

// ─── Report Modal ─────────────────────────────────────────────────────────────

const REPORT_REASONS = [
  'Game not loading',
  'Audio/visual issues',
  'Inappropriate content',
  'Wrong category',
  'Broken controls',
  'Other',
]

function ReportModal({
  gameName,
  onClose,
  onSubmit,
}: {
  gameName: string
  onClose: () => void
  onSubmit: (reason: string) => void
}) {
  const [selected, setSelected] = useState('')
  const [other,    setOther]    = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    onSubmit(selected === 'Other' && other ? other : selected)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal
      aria-labelledby="report-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm bg-surface rounded-2xl border border-border p-6 shadow-2xl animate-scale-in">
        <h2 id="report-title" className="font-display font-bold text-lg text-primary mb-1">
          Report an Issue
        </h2>
        <p className="text-sm text-muted mb-5">{gameName}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {REPORT_REASONS.map((r) => (
            <label key={r} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="reason"
                value={r}
                checked={selected === r}
                onChange={() => setSelected(r)}
                className="accent-accent w-4 h-4"
              />
              <span className="text-sm text-secondary group-hover:text-primary transition-colors">
                {r}
              </span>
            </label>
          ))}

          {selected === 'Other' && (
            <textarea
              rows={2}
              value={other}
              onChange={(e) => setOther(e.target.value)}
              placeholder="Describe the issue…"
              maxLength={200}
              className="input resize-none mt-1 text-sm"
            />
          )}

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selected}
              className="btn btn-primary btn-sm flex-1 disabled:opacity-40"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Tab type ─────────────────────────────────────────────────────────────────

type Tab = 'about' | 'howto' | 'controls'

// ─── GamePlayer ───────────────────────────────────────────────────────────────

export default function GamePlayer({ game }: GamePlayerProps) {
  const { show: showToast } = useToast()

  // ── Iframe / loading state ─────────────────────────────────────────────────
  const iframeRef          = useRef<HTMLIFrameElement>(null)
  const wrapperRef         = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded]   = useState(false)
  const [errored, setErrored] = useState(false)

  // ── Track game play on mount ───────────────────────────────────────────────
  useEffect(() => {
    Analytics.gamePlay(game.slug, game.title, game.category)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Fullscreen ─────────────────────────────────────────────────────────────
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  const toggleFullscreen = useCallback(async () => {
    const el = wrapperRef.current
    if (!el) return
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen()
        Analytics.gameFullscreen(game.slug)
      } else {
        await document.exitFullscreen()
      }
    } catch {
      showToast('Fullscreen not supported', 'warning')
    }
  }, [game.slug, showToast])

  // ── Like (localStorage) ────────────────────────────────────────────────────
  const LIKE_KEY          = `gv_like_${game.id}`
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    setLiked(localStorage.getItem(LIKE_KEY) === '1')
  }, [LIKE_KEY])

  const toggleLike = useCallback(() => {
    const next = !liked
    setLiked(next)
    Analytics.gameLike(game.slug, next)
    if (next) {
      localStorage.setItem(LIKE_KEY, '1')
      showToast('Added to favourites ♥', 'success')
    } else {
      localStorage.removeItem(LIKE_KEY)
      showToast('Removed from favourites', 'info')
    }
  }, [liked, LIKE_KEY, game.slug, showToast])

  // ── Share ──────────────────────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    const url = window.location.href
    Analytics.gameShare(game.slug)
    if (navigator.share) {
      try {
        await navigator.share({ title: game.title, url })
        return
      } catch { /* user cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(url)
      showToast('Link copied to clipboard!', 'success')
    } catch {
      showToast('Could not copy link', 'error')
    }
  }, [game.slug, game.title, showToast])

  // ── User rating ────────────────────────────────────────────────────────────
  const RATE_KEY             = `gv_rate_${game.id}`
  const [userRating, setUserRating] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem(RATE_KEY)
    if (stored) setUserRating(Number(stored))
  }, [RATE_KEY])

  const handleRate = useCallback((stars: number) => {
    setUserRating(stars)
    localStorage.setItem(RATE_KEY, String(stars))
    Analytics.gameRating(game.slug, stars)
    showToast(`You rated this game ${stars} star${stars !== 1 ? 's' : ''}!`, 'success')
  }, [RATE_KEY, game.slug, showToast])

  // ── Report modal ───────────────────────────────────────────────────────────
  const [reportOpen, setReportOpen] = useState(false)

  const handleReport = useCallback((reason: string) => {
    setReportOpen(false)
    Analytics.gameReport(game.slug)
    showToast('Report submitted. Thanks!', 'success')
    console.info('[GameVault] Report:', game.id, reason)
  }, [game.id, game.slug, showToast])

  // ── Tab ────────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<Tab>('about')

  // ── Computed ───────────────────────────────────────────────────────────────
  const aspectPct = ((game.height ?? 450) / (game.width ?? 800)) * 100
  const stars     = getStarRating(game.rating)
  const hasControls = !!(game.controls?.keyboard || game.controls?.mouse || game.controls?.touch)

  return (
    <>
      {/* ── Player wrapper ─────────────────────────────────────────────── */}
      <div
        ref={wrapperRef}
        className={[
          'relative w-full bg-black overflow-hidden',
          isFullscreen ? 'rounded-none' : 'rounded-xl border border-border/60',
        ].join(' ')}
        style={{ paddingBottom: isFullscreen ? '0' : `${aspectPct}%` }}
      >
        {/* Loading overlay */}
        {!loaded && !errored && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface z-10">
            <div className="w-12 h-12 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
            <p className="text-sm text-secondary animate-pulse">Loading {game.title}…</p>
          </div>
        )}

        {/* Error state */}
        {errored && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface z-10 text-center px-4">
            <span className="text-5xl select-none">😵</span>
            <p className="text-primary font-semibold">Game failed to load</p>
            <p className="text-sm text-muted max-w-xs">
              This game may not load in all browsers. Try refreshing or use a different browser.
            </p>
            <button
              onClick={() => { setErrored(false); setLoaded(false) }}
              className="btn btn-secondary btn-sm gap-2"
            >
              <RefreshIcon /> Retry
            </button>
          </div>
        )}

        {/* Iframe */}
        {!errored && (
          <iframe
            ref={iframeRef}
            src={game.embedUrl}
            title={game.title}
            allow="fullscreen; gamepad; accelerometer; autoplay; clipboard-read; clipboard-write; pointer-lock"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock allow-top-navigation-by-user-activation"
            loading="eager"
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            className={[
              'absolute inset-0 w-full h-full border-none transition-opacity duration-300',
              isFullscreen ? 'h-screen' : '',
              loaded ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          />
        )}

        {/* Control bar (bottom overlay) */}
        <div
          className={[
            'absolute bottom-0 left-0 right-0 z-20',
            'flex items-center justify-between gap-2 px-3 py-2',
            'bg-gradient-to-t from-black/80 to-transparent',
            'opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200',
            isFullscreen && 'fixed',
          ].filter(Boolean).join(' ')}
        >
          <span className="text-xs font-semibold text-white/80 truncate">{game.title}</span>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Reload */}
            <button
              onClick={() => { setLoaded(false); setErrored(false); if (iframeRef.current) { const s = iframeRef.current.src; iframeRef.current.src = ''; iframeRef.current.src = s } }}
              title="Reload game"
              aria-label="Reload game"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-all"
            >
              <RefreshIcon />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-all"
            >
              {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Action bar (below player) ───────────────────────────────────── */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {/* Like */}
        <button
          onClick={toggleLike}
          aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
          aria-pressed={liked}
          className={[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150',
            liked
              ? 'bg-danger/15 border-danger/30 text-danger'
              : 'bg-surface border-border/60 text-secondary hover:text-danger hover:border-danger/30',
          ].join(' ')}
        >
          <HeartIcon filled={liked} />
          {liked ? 'Liked' : 'Like'}
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          aria-label="Share this game"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-border/60 bg-surface text-secondary hover:text-primary hover:border-accent/40 transition-all duration-150"
        >
          <ShareIcon />
          Share
        </button>

        {/* Report */}
        <button
          onClick={() => setReportOpen(true)}
          aria-label="Report an issue"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-border/60 bg-surface text-secondary hover:text-warning hover:border-warning/30 transition-all duration-150 ml-auto"
        >
          <FlagIcon />
          Report
        </button>
      </div>

      {/* ── Rating row ─────────────────────────────────────────────────── */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-surface rounded-xl border border-border/60">
        {/* Aggregate */}
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-4xl text-primary">{formatRating(game.rating)}</span>
          <div className="flex flex-col gap-1">
            <StarRating value={game.rating} readonly size="md" />
            <span className="text-xs text-muted">{game.ratingCount.toLocaleString()} ratings</span>
          </div>
        </div>

        <div className="hidden sm:block w-px h-10 bg-border/60" aria-hidden />

        {/* User rating */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted">Your rating</span>
          <StarRating value={userRating} onChange={handleRate} size="lg" />
        </div>

        <div className="ml-auto text-right hidden sm:block">
          <p className="text-sm font-semibold text-primary">{formatPlayCount(game.plays)}</p>
          <p className="text-xs text-muted">plays</p>
        </div>
      </div>

      {/* ── Info tabs ──────────────────────────────────────────────────── */}
      <div className="mt-4">
        {/* Tab nav */}
        <div className="flex gap-1 border-b border-border/60 mb-4" role="tablist">
          {([ ['about', 'About'], ['howto', 'How to Play'], ['controls', 'Controls'] ] as [Tab, string][]).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`tabpanel-${id}`}
              id={`tab-${id}`}
              onClick={() => setActiveTab(id)}
              className={[
                'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors duration-150 -mb-px',
                activeTab === id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-secondary hover:text-primary hover:border-border',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        {/* About */}
        {activeTab === 'about' && (
          <div
            id="tabpanel-about"
            role="tabpanel"
            aria-labelledby="tab-about"
            className="text-secondary text-sm leading-relaxed space-y-3 animate-fade-in"
          >
            <p>{game.description}</p>
            {game.developer && (
              <p className="text-xs text-muted">
                Developed by <span className="text-secondary">{game.developer}</span>
              </p>
            )}
            {/* Tags */}
            {game.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {game.tags.map((tag) => (
                  <a
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface border border-border/60 text-secondary hover:text-primary hover:border-accent/40 transition-all duration-150"
                  >
                    #{tag}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* How to Play */}
        {activeTab === 'howto' && (
          <div
            id="tabpanel-howto"
            role="tabpanel"
            aria-labelledby="tab-howto"
            className="animate-fade-in"
          >
            {game.instructions ? (
              <p className="text-secondary text-sm leading-relaxed">{game.instructions}</p>
            ) : (
              <p className="text-muted text-sm italic">No instructions provided for this game.</p>
            )}
          </div>
        )}

        {/* Controls */}
        {activeTab === 'controls' && (
          <div
            id="tabpanel-controls"
            role="tabpanel"
            aria-labelledby="tab-controls"
            className="space-y-4 animate-fade-in"
          >
            {hasControls ? (
              <>
                {game.controls?.keyboard && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-2">
                      ⌨ Keyboard
                    </h3>
                    <p className="text-sm text-secondary leading-relaxed flex flex-wrap items-center gap-1.5">
                      {parseControlString(game.controls.keyboard)}
                    </p>
                  </div>
                )}
                {game.controls?.mouse && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-2">
                      🖱 Mouse
                    </h3>
                    <p className="text-sm text-secondary">{game.controls.mouse}</p>
                  </div>
                )}
                {game.controls?.touch && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-2">
                      👆 Touch
                    </h3>
                    <p className="text-sm text-secondary">{game.controls.touch}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted text-sm italic">No control info available.</p>
            )}
          </div>
        )}
      </div>

      {/* Report Modal */}
      {reportOpen && (
        <ReportModal
          gameName={game.title}
          onClose={() => setReportOpen(false)}
          onSubmit={handleReport}
        />
      )}
    </>
  )
}
