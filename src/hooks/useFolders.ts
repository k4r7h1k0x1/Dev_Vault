'use client'
import { useState, useEffect, useCallback } from 'react'
import type { FolderResponse } from '@/types/note'

export function useFolders() {
  const [folders, setFolders] = useState<FolderResponse[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFolders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/folders')
      if (!res.ok) throw new Error('Failed to fetch folders')
      const data = await res.json()
      setFolders(data.folders)
    } catch {
      setFolders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFolders()
  }, [fetchFolders])

  const createFolder = async (name: string): Promise<FolderResponse | null> => {
    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error('Failed to create folder')
      const data = await res.json()
      setFolders((prev) => [...prev, data.folder].sort((a, b) => a.name.localeCompare(b.name)))
      return data.folder
    } catch {
      return null
    }
  }

  const renameFolder = async (id: string, name: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/folders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) return false
      const data = await res.json()
      setFolders((prev) => prev.map((f) => (f._id === id ? data.folder : f)))
      return true
    } catch {
      return false
    }
  }

  const deleteFolder = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/folders/${id}`, { method: 'DELETE' })
      if (!res.ok) return false
      setFolders((prev) => prev.filter((f) => f._id !== id))
      return true
    } catch {
      return false
    }
  }

  return { folders, loading, refetch: fetchFolders, createFolder, renameFolder, deleteFolder }
}