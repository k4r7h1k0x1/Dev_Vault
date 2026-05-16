'use client'
import { useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export function toast(message: string, type: ToastType = 'info') {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('devvault:toast', { detail: { message, type } }))
}

export function useToast() {
  const fire = useCallback((message: string, type: ToastType = 'info') => {
    toast(message, type)
  }, [])
  return { toast: fire }
}