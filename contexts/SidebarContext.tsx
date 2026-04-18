'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface SidebarContextValue {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

// ─── Context ─────────────────────────────────────────────────────────────────

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

// ─── Provider ────────────────────────────────────────────────────────────────

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])
  const open   = useCallback(() => setIsOpen(true),  [])
  const close  = useCallback(() => setIsOpen(false), [])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth < 1024) close()
    }
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [close])

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) close()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, close])

  // Prevent body scroll when sidebar overlay is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, open, close }}>
      {children}
    </SidebarContext.Provider>
  )
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext)
  if (!ctx) {
    throw new Error('useSidebar must be used within a <SidebarProvider>')
  }
  return ctx
}
