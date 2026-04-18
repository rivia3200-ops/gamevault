import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllBlogPosts, getBlogPostBySlug } from '@/data/blog-posts'

export function generateStaticParams() {
  return getAllBlogPosts().map(post => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title:       post.metaTitle,
    description: post.metaDescription,
    openGraph: {
      title:         post.metaTitle,
      description:   post.metaDescription,
      images:        [{ url: post.coverImage }],
      type:          'article',
      publishedTime: post.publishedAt,
    },
    alternates: {
      canonical: `https://freegamevault.com/blog/${post.slug}`,
    },
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug)
  if (!post) notFound()

  const related = getAllBlogPosts().filter(p => p.slug !== post.slug).slice(0, 3)

  const jsonLd = {
    '@context':    'https://schema.org',
    '@type':       'BlogPosting',
    headline:      post.title,
    description:   post.metaDescription,
    image:         post.coverImage,
    datePublished: post.publishedAt,
    dateModified:  post.updatedAt,
    author:        { '@type': 'Organization', name: post.author },
    publisher:     { '@type': 'Organization', name: 'FreeGameVault', url: 'https://freegamevault.com' },
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-muted mb-6 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
        <span>/</span>
        <span className="text-white truncate">{post.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <span className="text-xs text-accent font-medium uppercase tracking-wide">
          {post.category}
        </span>
        <h1 className="text-3xl font-black text-white mt-2 mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-secondary flex-wrap">
          <span>By {post.author}</span>
          <span>·</span>
          <span>{post.readTime} min read</span>
          <span>·</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
      </div>

      {/* Cover image */}
      <img
        src={post.coverImage}
        alt={post.title}
        className="w-full rounded-xl mb-8 aspect-video object-cover"
      />

      {/* Content */}
      <div
        className="prose prose-invert prose-lg max-w-none
          prose-headings:text-white prose-headings:font-bold
          prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-[#ccccdd] prose-p:leading-relaxed
          prose-a:text-accent prose-a:no-underline hover:prose-a:underline
          prose-ul:text-[#ccccdd] prose-li:my-1
          prose-strong:text-white"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-border/60">
        {post.tags.map(tag => (
          <span
            key={tag}
            className="px-3 py-1 bg-surface text-secondary rounded-full text-sm border border-border/60"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 p-6 bg-surface rounded-xl border border-border/60 text-center">
        <h3 className="text-white font-bold text-xl mb-2">Ready to Play?</h3>
        <p className="text-secondary mb-4">
          Browse 900+ free browser games — no download, no login required
        </p>
        <Link
          href="/"
          className="inline-block bg-accent text-white font-semibold px-6 py-3 rounded-lg hover:bg-accent-hover transition"
        >
          Play Free Games Now →
        </Link>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-white mb-4">More Articles</h2>
          <div className="flex flex-col gap-3">
            {related.map(p => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="flex gap-3 p-3 bg-surface rounded-lg hover:bg-surface-hover transition border border-border/60"
              >
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <h3 className="text-white text-sm font-semibold leading-snug">{p.title}</h3>
                  <p className="text-muted text-xs mt-1">{p.readTime} min read</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
