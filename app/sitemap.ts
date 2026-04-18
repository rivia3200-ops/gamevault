import { MetadataRoute } from 'next'
import { getAllGames, getAllCategories } from '@/lib/games'
import { getAllBlogPosts } from '@/data/blog-posts'

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://freegamevault.com').replace(/^http:\/\//, 'https://')

export default function sitemap(): MetadataRoute.Sitemap {
  const games      = getAllGames()
  const categories = getAllCategories()

  const blogPosts = getAllBlogPosts()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                     priority: 1.0, changeFrequency: 'daily'   },
    { url: `${BASE_URL}/popular`,        priority: 0.9, changeFrequency: 'daily'   },
    { url: `${BASE_URL}/new-games`,      priority: 0.9, changeFrequency: 'daily'   },
    { url: `${BASE_URL}/search`,         priority: 0.7, changeFrequency: 'weekly'  },
    { url: `${BASE_URL}/privacy-policy`, priority: 0.3, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/terms`,          priority: 0.3, changeFrequency: 'monthly' },
  ]

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url:             `${BASE_URL}/category/${cat.slug}`,
    priority:        0.8,
    changeFrequency: 'weekly',
  }))

  const gamePages: MetadataRoute.Sitemap = games.map((game) => ({
    url:             `${BASE_URL}/game/${game.slug}`,
    priority:        0.7,
    changeFrequency: 'monthly',
    lastModified:    new Date(game.addedAt),
  }))

  const blogIndexPage: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/blog`, priority: 0.8, changeFrequency: 'weekly' },
  ]

  const blogPages: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url:             `${BASE_URL}/blog/${post.slug}`,
    priority:        0.8,
    changeFrequency: 'monthly' as const,
    lastModified:    new Date(post.updatedAt),
  }))

  return [...staticPages, ...blogIndexPage, ...blogPages, ...categoryPages, ...gamePages]
}
