import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllBlogPosts, getFeaturedBlogPosts } from '@/data/blog-posts'

export const metadata: Metadata = {
  title: 'Gaming Blog — Tips, Lists & Guides | FreeGameVault',
  description: 'Gaming blog with game lists, tips, and guides. Find the best free browser games, unblocked games, and multiplayer games.',
  alternates: { canonical: 'https://freegamevault.com/blog' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function BlogPage() {
  const posts    = getAllBlogPosts()
  const featured = getFeaturedBlogPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Gaming Blog</h1>
      <p className="text-secondary mb-8">
        Game lists, tips, and guides for free browser games
      </p>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featured.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-surface rounded-xl overflow-hidden hover:bg-surface-hover transition border border-border/60"
              >
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <span className="text-xs text-accent font-medium uppercase tracking-wide">
                    {post.category}
                  </span>
                  <h3 className="text-white font-semibold mt-1 mb-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-secondary text-sm line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted">
                    <span>{post.readTime} min read</span>
                    <span>·</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All posts */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">All Posts</h2>
        <div className="flex flex-col gap-4">
          {posts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex gap-4 bg-surface rounded-xl p-4 hover:bg-surface-hover transition border border-border/60"
            >
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-accent font-medium uppercase tracking-wide">
                  {post.category}
                </span>
                <h3 className="text-white font-semibold mt-1 mb-1 leading-snug">
                  {post.title}
                </h3>
                <p className="text-secondary text-sm line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                  <span>{post.readTime} min read</span>
                  <span>·</span>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
