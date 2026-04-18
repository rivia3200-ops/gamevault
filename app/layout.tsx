import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk }    from 'next/font/google'
import Script                       from 'next/script'

import { SidebarProvider }  from '@/contexts/SidebarContext'
import Navbar               from '@/components/layout/Navbar'
import Sidebar              from '@/components/layout/Sidebar'
import Footer               from '@/components/layout/Footer'
import CookieBanner         from '@/components/ui/CookieBanner'
import MobileBottomNav      from '@/components/layout/MobileBottomNav'
import ToastProvider        from '@/components/ui/Toast'

import './globals.css'

// ─── Site Config ──────────────────────────────────────────────────────────────

const siteConfig = {
  name:          'GameVault',
  title:         'GameVault — Play Free Online Games Instantly',
  description:   'Play 1,000+ free online games instantly in your browser. Action, puzzle, racing, shooting, sports and more. No download, no login, no cost.',
  url:           process.env.NEXT_PUBLIC_SITE_URL || 'https://gamevault.vercel.app',
  ogImage:       '/og-image.png',
  twitterHandle: '@gamevaultgg',
}

// ─── Fonts ────────────────────────────────────────────────────────────────────

const inter = Inter({
  subsets:  ['latin'],
  variable: '--font-inter',
  display:  'swap',
  weight:   ['400', '500', '600'],
})

const spaceGrotesk = Space_Grotesk({
  subsets:  ['latin'],
  variable: '--font-space-grotesk',
  display:  'swap',
  weight:   ['500', '600', '700'],
})

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:  siteConfig.title,
    template: '%s | GameVault',
  },
  description: siteConfig.description,
  keywords: [
    'free online games', 'play games online', 'browser games',
    'no download games', 'html5 games', 'free games', 'online games',
    'action games', 'puzzle games', 'racing games', 'shooting games',
    'io games', 'hypercasual games', 'multiplayer games online',
  ],
  authors:   [{ name: 'GameVault' }],
  creator:   'GameVault',
  publisher: 'GameVault',
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:                true,
      follow:               true,
      'max-video-preview':  -1,
      'max-image-preview':  'large',
      'max-snippet':        -1,
    },
  },
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         siteConfig.url,
    siteName:    siteConfig.name,
    title:       siteConfig.title,
    description: siteConfig.description,
    images: [{
      url:    siteConfig.ogImage,
      width:  1200,
      height: 630,
      alt:    'GameVault — Free Online Games',
    }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       siteConfig.title,
    description: siteConfig.description,
    images:      [siteConfig.ogImage],
    creator:     siteConfig.twitterHandle,
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    other: [{ rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#6c63ff' }],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  alternates: {
    canonical: siteConfig.url,
  },
}

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#0a0a0f' },
    { media: '(prefers-color-scheme: light)', color: '#0a0a0f' },
  ],
}

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const gaId      = process.env.NEXT_PUBLIC_GA_ID
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID
  const isProd    = process.env.NODE_ENV === 'production'

  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* ── Preconnects for performance ──────────────────────────── */}
        <link rel="preconnect"  href="https://img.gamepix.com" />
        <link rel="preconnect"  href="https://games.gamepix.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* ── GA: consent defaults (must be before gtag.js loads) ──── */}
        {isProd && gaId && (
          <script dangerouslySetInnerHTML={{ __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent','default',{
              analytics_storage: 'denied',
              ad_storage: 'denied',
              wait_for_update: 500
            });
          `}} />
        )}
      </head>

      <body className="bg-background text-primary font-sans antialiased min-h-screen">
        <ToastProvider>
          <SidebarProvider>
            <Navbar />

            <div className="flex min-h-screen pt-[64px]">
              <Sidebar />
              <main className={[
                'flex-1 flex flex-col',
                'min-h-[calc(100vh-64px)]',
                'lg:ml-[240px]',
                'pb-[60px] lg:pb-0',
              ].join(' ')}>
                {children}
                <Footer />
              </main>
            </div>

            <MobileBottomNav />
            <CookieBanner />
          </SidebarProvider>
        </ToastProvider>

        {/* ── Google Analytics (production only) ───────────────────── */}
        {isProd && gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                  anonymize_ip: true,
                });
              ` }}
            />
          </>
        )}

        {/* ── Google AdSense (production only) ─────────────────────── */}
        {isProd && adsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
