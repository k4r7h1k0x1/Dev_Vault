'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewNotePage() {
  const router = useRouter()

  useEffect(() => {
    fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Untitled', bodyContent: '' }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.note?._id) router.replace(`/dashboard/note/${d.note._id}`)
        else router.replace('/dashboard')
      })
      .catch(() => router.replace('/dashboard'))
  }, [router])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      color: '#6b7280',
      fontSize: 14,
    }}>
      Creating note...
    </div>
  )
}