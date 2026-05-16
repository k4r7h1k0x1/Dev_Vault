'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { NoteResponse } from '@/types/note'

function getPreview(body: string) {
  return body
    .replace(/```[\s\S]*?```/g, '[code]')
    .replace(/#{1,6}\s/g, '')
    .replace(/[*_`~]/g, '')
    .trim()
    .slice(0, 80)
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d`
  return `${Math.floor(days / 30)}mo`
}

interface QuickAction {
  label: string
  icon: string
  action: () => void
}

export default function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<NoteResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const quickActions: QuickAction[] = [
    { label: 'New note', icon: '+', action: () => { setOpen(false); router.push('/dashboard/note/new') } },
    { label: 'All notes', icon: '◉', action: () => { setOpen(false); router.push('/dashboard') } },
    { label: 'Public notes', icon: '◎', action: () => { setOpen(false); router.push('/dashboard?filter=public') } },
    { label: 'Search notes', icon: '⌕', action: () => { setOpen(false); router.push('/dashboard?search=1') } },
  ]

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(v => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setSelected(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/notes/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data.notes ?? [])
          setSelected(0)
        }
      } finally {
        setLoading(false)
      }
    }, 200)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  const items = query.trim()
    ? results
    : null

  const totalItems = query.trim()
    ? results.length
    : quickActions.length

  function navigate(note: NoteResponse) {
    setOpen(false)
    router.push(`/dashboard/note/${note._id}`)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected(s => Math.min(s + 1, totalItems - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected(s => Math.max(s - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (query.trim() && results[selected]) {
        navigate(results[selected])
      } else if (!query.trim() && quickActions[selected]) {
        quickActions[selected].action()
      }
    }
  }

  if (!open) return null

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 9998,
          backdropFilter: 'blur(4px)',
        }}
      />

      <div style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: 580,
        zIndex: 9999,
        background: '#1a1035',
        border: '1px solid rgba(124,58,237,0.3)',
        borderRadius: 14,
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        overflow: 'hidden',
      }}>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span style={{ color: '#7c3aed', fontSize: 16 }}>⌕</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search notes or type a command..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: '#f9fafb', fontSize: 15,
            }}
          />
          {loading && (
            <div style={{
              width: 14, height: 14,
              border: '2px solid rgba(124,58,237,0.3)',
              borderTop: '2px solid #7c3aed',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
              flexShrink: 0,
            }} />
          )}
          <kbd style={{
            fontSize: 10, color: '#4b5563',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 4, padding: '2px 6px',
          }}>ESC</kbd>
        </div>

        <div style={{ maxHeight: 380, overflowY: 'auto' }}>

          {!query.trim() && (
            <>
              <div style={{
                fontSize: 10, fontWeight: 600, color: '#4b5563',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '10px 16px 4px',
              }}>Quick actions</div>
              {quickActions.map((a, i) => (
                <div
                  key={a.label}
                  onClick={a.action}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 16px', cursor: 'pointer',
                    background: selected === i ? 'rgba(124,58,237,0.15)' : 'none',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={() => setSelected(i)}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: 'rgba(124,58,237,0.15)',
                    border: '1px solid rgba(124,58,237,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#a78bfa', fontSize: 14, flexShrink: 0,
                  }}>{a.icon}</span>
                  <span style={{ color: '#e5e7eb', fontSize: 14 }}>{a.label}</span>
                  {selected === i && (
                    <kbd style={{
                      marginLeft: 'auto', fontSize: 10, color: '#6b7280',
                      background: 'rgba(255,255,255,0.05)', borderRadius: 4, padding: '1px 6px',
                    }}>↵</kbd>
                  )}
                </div>
              ))}
            </>
          )}

          {query.trim() && results.length === 0 && !loading && (
            <div style={{
              padding: '32px 16px', textAlign: 'center',
              color: '#4b5563', fontSize: 13,
            }}>
              No notes match "{query}"
            </div>
          )}

          {query.trim() && results.length > 0 && (
            <>
              <div style={{
                fontSize: 10, fontWeight: 600, color: '#4b5563',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '10px 16px 4px',
              }}>Notes — {results.length} found</div>
              {results.map((note, i) => (
                <div
                  key={note._id}
                  onClick={() => navigate(note)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '10px 16px', cursor: 'pointer',
                    background: selected === i ? 'rgba(124,58,237,0.15)' : 'none',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={() => setSelected(i)}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#6b7280', fontSize: 12, flexShrink: 0, marginTop: 1,
                  }}>◈</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 600, color: '#f9fafb',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{note.title}</div>
                    {getPreview(note.body) && (
                      <div style={{
                        fontSize: 12, color: '#6b7280',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        marginTop: 2,
                      }}>{getPreview(note.body)}</div>
                    )}
                  </div>
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                    gap: 3, flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 10, color: '#4b5563' }}>{timeAgo(note.updatedAt)}</span>
                    {note.folder && (
                      <span style={{
                        fontSize: 9, color: '#6b7280',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 4, padding: '1px 5px',
                      }}>{(note.folder as any).name}</span>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div style={{
          padding: '8px 16px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', gap: 16,
          fontSize: 11, color: '#374151',
        }}>
          <span><kbd style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, padding: '1px 5px' }}>↑↓</kbd> navigate</span>
          <span><kbd style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, padding: '1px 5px' }}>↵</kbd> open</span>
          <span><kbd style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, padding: '1px 5px' }}>esc</kbd> close</span>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}