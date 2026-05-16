'use client'
import { useEffect, useRef, useCallback } from 'react'

interface UseAutoSaveOptions {
  noteId: string
  data: Record<string, unknown>
  delay?: number
  onSave?: (success: boolean) => void
}

export function useAutoSave({ noteId, data, delay = 1500, onSave }: UseAutoSaveOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestData = useRef(data)
  latestData.current = data

  const save = useCallback(async () => {
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(latestData.current),
      })
      onSave?.(res.ok)
    } catch {
      onSave?.(false)
    }
  }, [noteId, onSave])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(save, delay)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [data, delay, save])

  const saveNow = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    return save()
  }, [save])

  return { saveNow }
}