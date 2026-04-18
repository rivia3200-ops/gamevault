'use client'

import { useEffect, useState, useCallback, createContext, useContext, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id:       string
  message:  string
  variant?: ToastVariant
  duration?: number
}

interface ToastContextValue {
  show: (message: string, variant?: ToastVariant, duration?: number) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

// ─── Single Toast Item ────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: 'bg-success/15 border-success/30 text-success',
  error:   'bg-danger/15  border-danger/30  text-danger',
  info:    'bg-info/15    border-info/30    text-info',
  warning: 'bg-warning/15 border-warning/30 text-warning',
}

const VARIANT_ICON: Record<ToastVariant, string> = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast
  onRemove: (id: string) => void
}) {
  const [visible, setVisible] = useState(false)
  const variant = toast.variant ?? 'info'

  useEffect(() => {
    // mount → fade in
    const t1 = setTimeout(() => setVisible(true), 10)
    // start fade-out before remove
    const fadeDelay = (toast.duration ?? 3000) - 300
    const t2 = setTimeout(() => setVisible(false), fadeDelay)
    const t3 = setTimeout(() => onRemove(toast.id), toast.duration ?? 3000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [toast, onRemove])

  return (
    <div
      role="alert"
      aria-live="polite"
      className={[
        'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium',
        'transition-all duration-300',
        VARIANT_STYLES[variant],
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-2 pointer-events-none',
      ].join(' ')}
    >
      <span className="text-base leading-none select-none" aria-hidden>
        {VARIANT_ICON[variant]}
      </span>
      <span>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
        className="ml-auto pl-2 opacity-60 hover:opacity-100 transition-opacity text-base leading-none"
      >
        ×
      </button>
    </div>
  )
}

// ─── Provider + Container ─────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(0)

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const show = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = 3000) => {
      const id = `toast-${++idRef.current}`
      setToasts((prev) => [...prev, { id, message, variant, duration }])
    },
    [],
  )

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      {/* ── Toast stack ────────────────────────────────────────────────── */}
      <div
        aria-label="Notifications"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// ─── Standalone (no provider) convenience ────────────────────────────────────

export default ToastProvider
