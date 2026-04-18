// ─── Play Count ───────────────────────────────────────────────────────────────

export function formatPlayCount(plays: number): string {
  if (plays >= 1_000_000) return `${(plays / 1_000_000).toFixed(1)}M`
  if (plays >= 1_000)     return `${Math.round(plays / 1_000)}K`
  return String(plays)
}

// ─── Rating ───────────────────────────────────────────────────────────────────

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

// ─── Relative Date ────────────────────────────────────────────────────────────

export function formatRelativeDate(dateStr: string): string {
  const date  = new Date(dateStr)
  const now   = new Date()
  const diff  = Math.floor((now.getTime() - date.getTime()) / 1000) // seconds

  if (diff < 60)           return 'just now'
  if (diff < 3600)         return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)        return `${Math.floor(diff / 3600)}h ago`
  if (diff < 86400 * 7)   return `${Math.floor(diff / 86400)}d ago`
  if (diff < 86400 * 30)  return `${Math.floor(diff / (86400 * 7))}w ago`
  if (diff < 86400 * 365) return `${Math.floor(diff / (86400 * 30))}mo ago`
  return `${Math.floor(diff / (86400 * 365))}y ago`
}

// ─── Random Game ──────────────────────────────────────────────────────────────

import type { Game } from '@/lib/types'

export function getRandomGame(games: Game[]): Game {
  return games[Math.floor(Math.random() * games.length)]
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

export function getStarRating(rating: number): { full: number; half: boolean; empty: number } {
  const full  = Math.floor(rating)
  const half  = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return { full, half, empty }
}

// ─── Clamp ────────────────────────────────────────────────────────────────────

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// ─── Class names (tiny cx helper) ─────────────────────────────────────────────

export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
