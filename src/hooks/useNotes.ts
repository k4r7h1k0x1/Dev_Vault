'use client'
import { useState, useEffect, useCallback } from 'react'
import type { NoteResponse } from '@/types/note'

interface UseNotesOptions {
  folder?: string
  isPublic?: boolean
  tag?: string
}

export function useNotes(options: UseNotesOptions = {}) {
  const [notes, setNotes] = useState<NoteResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (options.folder) params.set('folder', options.folder)
      if (options.isPublic) params.set('public', 'true')
      if (options.tag) params.set('tag', options.tag)

      const res = await fetch(`/api/notes?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch notes')
      const data = await res.json()
      setNotes(data.notes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [options.folder, options.isPublic, options.tag])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const createNote = async (payload: {
    title: string
    bodyContent?: string
    folder?: string | null
    tags?: string[]
  }): Promise<NoteResponse | null> => {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to create note')
      const data = await res.json()
      setNotes((prev) => [data.note, ...prev])
      return data.note
    } catch {
      return null
    }
  }

  const updateNote = async (
    id: string,
    payload: Partial<{
      title: string
      bodyContent: string
      folder: string | null
      tags: string[]
      isPublic: boolean
    }>
  ): Promise<NoteResponse | null> => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to update note')
      const data = await res.json()
      setNotes((prev) => prev.map((n) => (n._id === id ? data.note : n)))
      return data.note
    } catch {
      return null
    }
  }

  const deleteNote = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete note')
      setNotes((prev) => prev.filter((n) => n._id !== id))
      return true
    } catch {
      return false
    }
  }

  const searchNotes = async (q: string): Promise<NoteResponse[]> => {
    if (!q.trim()) return []
    try {
      const res = await fetch(`/api/notes/search?q=${encodeURIComponent(q)}`)
      if (!res.ok) return []
      const data = await res.json()
      return data.notes
    } catch {
      return []
    }
  }

  return { notes, loading, error, refetch: fetchNotes, createNote, updateNote, deleteNote, searchNotes }
}