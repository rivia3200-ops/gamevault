'use client'

import { useCallback } from 'react'
import { useRouter }   from 'next/navigation'
import gamesData       from '@/data/games.json'
import type { Game }   from '@/lib/types'

interface Props {
  className?: string
  children?:  React.ReactNode
}

export default function RandomGameButton({ className, children }: Props) {
  const router = useRouter()

  const go = useCallback(() => {
    const games = gamesData as Game[]
    const game  = games[Math.floor(Math.random() * games.length)]
    router.push(`/game/${game.slug}`)
  }, [router])

  return (
    <button type="button" onClick={go} className={className}>
      {children ?? '🎲 Random Game'}
    </button>
  )
}
