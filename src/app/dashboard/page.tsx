'use client'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useNotes } from '@/hooks/useNotes'
import { useFolders } from '@/hooks/useFolders'
import NoteCard from '@/components/dashboard/NoteCard'
import StatsBar from '@/components/dashboard/StatsBar'
import type { NoteResponse } from '@/types/note'

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeFolder = searchParams.get('folder') ?? undefined
  const activeFilter = searchParams.get('filter') ?? undefined
  const activeTag    = searchParams.get('tag') ?? undefined
  const showSearch   = searchParams.get('search') === '1'

  const { notes, loading, searchNotes, createNote } = useNotes({
    folder: activeFolder,
    isPublic: activeFilter === 'public',
    tag: activeTag,
  })
  const { folders } = useFolders()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<NoteResponse[]>([])
  const [searching, setSearching] = useState(false)
  const [creating, setCreating] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (showSearch && searchRef.current) searchRef.current.focus()
  }, [showSearch])

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      const results = await searchNotes(searchQuery)
      setSearchResults(results)
      setSearching(false)
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [searchQuery])

  async function handleNewNote() {
    setCreating(true)
    const note = await createNote({ title: 'Untitled', bodyContent: '', folder: activeFolder ?? null })
    setCreating(false)
    if (note) router.push(`/dashboard/note/${note._id}`)
  }

  let folderName = 'All Notes'
  if (activeFolder) folderName = folders.find(f => f._id === activeFolder)?.name ?? 'Folder'
  else if (activeFilter === 'public') folderName = 'Public Notes'
  else if (activeTag) folderName = `#${activeTag}`

  const totalPublic = notes.filter(n => n.isPublic).length
  const allTags = new Set(notes.flatMap(n => n.tags))
  const displayNotes = searchQuery.trim() ? searchResults : notes
  const showStats = !activeFolder && activeFilter !== 'public' && !activeTag

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', minHeight: '100vh' }}>

      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 24,
      }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#4b5563', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
            VAULT
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f9fafb', margin: 0 }}>
              {folderName}
            </h1>
            {activeTag && (
              <button
                onClick={() => router.push('/dashboard')}
                title="Clear tag filter"
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontSize: 11, padding: '3px 9px', borderRadius: 10,
                  background: 'rgba(124,58,237,0.15)', color: '#a78bfa',
                  border: '1px solid rgba(124,58,237,0.3)',
                  cursor: 'pointer', fontWeight: 500,
                }}
              >
                #{activeTag} <span style={{ opacity: 0.7 }}>×</span>
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {['✨', '🟰'].map((icon, i) => (
            <button key={i} style={{
              background: i === 0 ? 'rgba(124,58,237,0.15)' : 'none',
              border: '1px solid ' + (i === 0 ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.07)'),
              borderRadius: 6, color: i === 0 ? '#a78bfa' : '#6b7280',
              width: 32, height: 32, cursor: 'pointer', fontSize: 14,
            }}>{icon}</button>
          ))}
        </div>
      </div>

      {showStats && (
        <StatsBar
          totalNotes={notes.length}
          totalFolders={folders.length}
          totalPublic={totalPublic}
          totalTags={allTags.size}
        />
      )}

      {showSearch && (
        <div style={{ marginBottom: 20 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(124,58,237,0.4)',
            borderRadius: 8, padding: '10px 14px',
          }}>
            <span style={{ color: '#7c3aed' }}>⌕</span>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search your notes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                flex: 1, background: 'none', border: 'none',
                outline: 'none', color: '#f9fafb', fontSize: 14,
              }}
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSearchResults([]) }}
                style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 16 }}
              >✕</button>
            )}
          </div>
        </div>
      )}

      <div style={{
        fontSize: 11, fontWeight: 600, color: '#4b5563',
        letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14,
      }}>
        {searching ? 'Searching...' : searchQuery
          ? `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`
          : `Recent · ${notes.length} note${notes.length !== 1 ? 's' : ''}`}
      </div>

      {loading && (
        <div className="notes-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              height: 140,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 10,
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.1}s`,
            }} />
          ))}
        </div>
      )}

      {!loading && displayNotes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 32px', color: '#4b5563' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>◆</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#6b7280', marginBottom: 8 }}>
            {searchQuery ? 'No notes match your search' : activeTag ? `No notes tagged #${activeTag}` : 'No notes yet'}
          </div>
          <div style={{ fontSize: 13, color: '#374151', marginBottom: 24 }}>
            {searchQuery ? 'Try different keywords' : activeTag ? 'Try a different tag' : 'Create your first note to get started'}
          </div>
          {!searchQuery && !activeTag && (
            <button
              onClick={handleNewNote}
              disabled={creating}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                border: 'none', borderRadius: 8,
                color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {creating ? 'Creating...' : '+ New Note'}
            </button>
          )}
        </div>
      )}

      <style>{`
        .notes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (max-width: 1024px) {
          .notes-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .notes-grid { grid-template-columns: 1fr; gap: 8px; }
        }
      `}</style>

      {!loading && displayNotes.length > 0 && (
        <div className="notes-grid">
          {displayNotes.map(note => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}