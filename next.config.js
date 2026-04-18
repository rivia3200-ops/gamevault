/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },

  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },

  // Compress responses
  compress: true,

  async headers() {
    return [
      // ── Security + performance headers for all routes ─────────────────────
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking (except game pages which need iframes)
          { key: 'X-Frame-Options',        value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff'    },
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on'         },
        ],
      },

      // ── Static assets — aggressive caching ────────────────────────────────
      {
        source: '/static/(.*)',
        headers: [
          {
            key:   'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },

      // ── Next.js built assets — immutable ──────────────────────────────────
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key:   'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },

      // ── Images ────────────────────────────────────────────────────────────
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key:   'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },

      // ── Public assets (icons, manifest, og-image) ─────────────────────────
      {
        source: '/(favicon.*|apple-touch-icon.*|site.webmanifest|og-image.*)',
        headers: [
          {
            key:   'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },

      // ── Game pages — CSP + permissions for iframe embedding ───────────────
      {
        source: '/game/:slug*',
        headers: [
          // Override X-Frame-Options on game pages (iframes need to embed)
          { key: 'X-Frame-Options', value: 'ALLOWALL' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
              "style-src 'self' 'unsafe-inline' https:",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https:",
              "connect-src 'self' https:",
              // Allow ALL origins in frames (game embeds come from many domains)
              "frame-src *",
              "media-src 'self' blob: https:",
              "worker-src 'self' blob:",
            ].join('; '),
          },
          // Allow fullscreen and gamepad APIs from embedded iframes
          {
            key:   'Permissions-Policy',
            value: 'fullscreen=*, gamepad=*',
          },
        ],
      },
    ]
  },

  async redirects() {
    return [
      // Legacy path aliases
      {
        source:      '/games',
        destination: '/',
        permanent:   true,
      },
      {
        source:      '/categories',
        destination: '/',
        permanent:   true,
      },
    ]
  },
}

module.exports = nextConfig
