// ─── Global type augmentation ─────────────────────────────────────────────────

declare global {
  interface Window {
    gtag?:         (...args: unknown[]) => void
    dataLayer?:    unknown[]
    adsbygoogle?:  unknown[]
  }
}

// ─── Core ─────────────────────────────────────────────────────────────────────

function trackEvent(
  action:   string,
  category: string,
  label?:   string,
  value?:   number,
) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', action, {
    event_category: category,
    event_label:    label,
    value,
  })
}

// ─── Analytics API ────────────────────────────────────────────────────────────

export const Analytics = {
  // Game events
  gamePlay(slug: string, title: string, category: string) {
    trackEvent('game_play',          'Games',      `${title} (${slug})`, 1)
    trackEvent('game_category_play', 'Categories', category)
  },

  gameFullscreen(slug: string) {
    trackEvent('game_fullscreen', 'Games', slug)
  },

  gameLike(slug: string, liked: boolean) {
    trackEvent(liked ? 'game_like' : 'game_unlike', 'Games', slug)
  },

  gameRating(slug: string, rating: number) {
    trackEvent('game_rating', 'Games', slug, rating)
  },

  gameShare(slug: string) {
    trackEvent('game_share', 'Games', slug)
  },

  gameReport(slug: string) {
    trackEvent('game_report', 'Games', slug)
  },

  // Search
  searchQuery(query: string, resultCount: number) {
    trackEvent('search', 'Search', query, resultCount)
  },

  // Navigation
  categoryView(category: string) {
    trackEvent('category_view', 'Navigation', category)
  },

  // Engagement
  loadMore(page: string, count: number) {
    trackEvent('load_more', 'Engagement', page, count)
  },

  // Privacy
  cookieConsent(accepted: boolean) {
    trackEvent(
      accepted ? 'cookie_accept' : 'cookie_reject',
      'Privacy',
    )

    // Update GA consent state
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: accepted ? 'granted' : 'denied',
        ad_storage:        accepted ? 'granted' : 'denied',
      })
    }
  },
}
