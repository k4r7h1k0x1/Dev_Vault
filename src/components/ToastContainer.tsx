'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ToastType } from '@/hooks/useToast'

interface ToastItem {
  id: string
  message: string
  type: ToastType
  exiting: boolean
}

const COLORS: Record<ToastType, { bg: string; border: string; dot: string }> = {
  success: { bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.3)',  dot: '#34d399' },
  error:   { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   dot: '#ef4444' },
  info:    { bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.3)',  dot: '#60a5fa' },
  warning: { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)', dot: '#f59e0b' },
}

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300)
  }, [])

  useEffect(() => {
    function handler(e: Event) {
      const { message, type } = (e as CustomEvent).detail as { message: string; type: ToastType }
      const id = Math.random().toString(36).slice(2)
      setToasts(prev => [...prev.slice(-4), { id, message, type, exiting: false }])
      setTimeout(() => dismiss(id), 3500)
    }
    window.addEventListener('devvault:toast', handler)
    return () => window.removeEventListener('devvault:toast', handler)
  }, [dismiss])

  if (toasts.length === 0) return null

  return (
    <>
      <style>{`
        @keyframes toast-in  { from { opacity:0; transform:translateY(12px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes toast-out { from { opacity:1; transform:translateY(0) scale(1); } to { opacity:0; transform:translateY(-8px) scale(0.97); } }
        .toast-enter { animation: toast-in  0.22s ease forwards; }
        .toast-exit  { animation: toast-out 0.25s ease forwards; }
      `}</style>
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
      }}>
        {toasts.map(t => {
          const c = COLORS[t.type]
          return (
            <div
              key={t.id}
              className={t.exiting ? 'toast-exit' : 'toast-enter'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: '#1a1035',
                border: `1px solid ${c.border}`,
                borderRadius: 10,
                padding: '10px 14px',
                minWidth: 240,
                maxWidth: 360,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                pointerEvents: 'all',
                cursor: 'pointer',
              }}
              onClick={() => dismiss(t.id)}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: c.bg, border: `1px solid ${c.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: c.dot, fontWeight: 700, flexShrink: 0,
              }}>
                {ICONS[t.type]}
              </div>
              <span style={{ fontSize: 13, color: '#e5e7eb', lineHeight: 1.4, flex: 1 }}>
                {t.message}
              </span>
              <span style={{ color: '#4b5563', fontSize: 14, flexShrink: 0 }}>×</span>
            </div>
          )
        })}
      </div>
    </>
  )
}