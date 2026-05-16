'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { NoteResponse } from '@/types/note'

interface EditorHeaderProps {
  note: NoteResponse
  saveStatus: 'saved' | 'saving' | 'unsaved'
  onTitleChange: (title: string) => void
  onTagsChange: (tags: string[]) => void
  onPublicToggle: (isPublic: boolean) => void
  onSaveNow: () => void
  onDelete: () => void
}

export default function EditorHeader({
  note,
  saveStatus,
  onTitleChange,
  onTagsChange,
  onPublicToggle,
  onSaveNow,
  onDelete
}: EditorHeaderProps) {
  const router = useRouter()
  const [tagInput, setTagInput] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const tagRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showTagInput && tagRef.current) tagRef.current.focus()
  }, [showTagInput])

  function addTag(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const t = tagInput.trim().replace(/^#/, '')
      if (t && !note.tags.includes(t)) {
        onTagsChange([...note.tags, t])
      }
      setTagInput('')
      setShowTagInput(false)
    }
    if (e.key === 'Escape') {
      setTagInput('')
      setShowTagInput(false)
    }
  }

  function removeTag(tag: string) {
    onTagsChange(note.tags.filter(t => t !== tag))
  }

  async function handleCopyLink() {
    if (!note.publicSlug) return
    const url = `${window.location.origin}/p/${note.publicSlug}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const folderName = note.folder ? (note.folder as any).name?.toUpperCase() : null

  const statusColor = saveStatus === 'saved'
    ? '#34d399' : saveStatus === 'saving' ? '#f59e0b' : '#6b7280'
  const statusLabel = saveStatus === 'saved'
    ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Unsaved'

  return (
    <div style={{
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      backgroundColor: '#0d0b1e',
      flexShrink: 0,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        gap: 10,
        flexWrap: 'wrap',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11, fontWeight: 600, color: '#4b5563',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <span
            onClick={() => router.push('/dashboard')}
            style={{ cursor: 'pointer', color: '#6b7280' }}
          >VAULT</span>
          {folderName && (
            <>
              <span style={{ color: '#374151' }}>›</span>
              <span style={{ color: '#6b7280' }}>{folderName}</span>
            </>
          )}
          <span style={{ color: '#374151' }}>›</span>
          <span style={{ color: '#9ca3af' }}>
            {note.title.toUpperCase().slice(0, 28)}
            {note.title.length > 28 ? '...' : ''}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: statusColor }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColor }} />
            {statusLabel}
          </div>

          <span className="hide-on-mobile" style={{ fontSize: 11, color: '#4b5563' }}>
            EDITED {new Date(note.updatedAt).toLocaleDateString()}
          </span>
          <style>{`
            @media (max-width: 600px) { .hide-on-mobile { display: none; } }
          `}</style>

          {note.isPublic && note.publicSlug && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              background: 'rgba(52,211,153,0.06)',
              border: '1px solid rgba(52,211,153,0.2)',
              borderRadius: 7,
              overflow: 'hidden',
            }}>
              <span style={{
                fontSize: 11, color: '#34d399', padding: '4px 8px',
                fontFamily: 'monospace', maxWidth: 200,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                /p/{note.publicSlug}
              </span>
              <button
                onClick={handleCopyLink}
                title="Copy share link"
                style={{
                  padding: '4px 8px',
                  background: copied ? 'rgba(52,211,153,0.2)' : 'rgba(52,211,153,0.1)',
                  border: 'none',
                  borderLeft: '1px solid rgba(52,211,153,0.2)',
                  color: '#34d399',
                  fontSize: 11,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'background 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {copied ? '✓ Copied' : '⎘ Copy'}
              </button>
            </div>
          )}

          {confirmDelete ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: '#f87171' }}>Delete?</span>
              <button
                onClick={async () => {
                  setDeleting(true)
                  await onDelete()
                  setDeleting(false)
                  setConfirmDelete(false)
                }}
                disabled={deleting}
                style={{
                  padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                  border: '1px solid rgba(239,68,68,0.5)',
                  background: 'rgba(239,68,68,0.15)',
                  color: '#f87171',
                  fontSize: 11, fontWeight: 600,
                }}
              >
                {deleting ? '...' : 'Yes'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{
                  padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#6b7280',
                  fontSize: 11, fontWeight: 600,
                }}
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              title="Delete note"
              style={{
                width: 30, height: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 6, cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                color: '#6b7280',
                fontSize: 14,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'
                e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
                e.currentTarget.style.color = '#f87171'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.color = '#6b7280'
              }}
            >
              🗑
            </button>
          )}

          <button
            onClick={() => onPublicToggle(!note.isPublic)}
            style={{
              padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
              border: '1px solid ' + (note.isPublic ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.1)'),
              background: note.isPublic ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.04)',
              color: note.isPublic ? '#34d399' : '#6b7280',
              fontSize: 11, fontWeight: 600, letterSpacing: '0.05em',
            }}
          >
            {note.isPublic ? '◎ PUBLIC' : '⊘ PRIVATE'}
          </button>

          <button
            onClick={onSaveNow}
            style={{
              padding: '6px 14px', borderRadius: 7, border: 'none',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>
      </div>

      <div style={{ padding: '0 20px 14px' }}>
        <input
          type="text"
          value={note.title}
          onChange={e => onTitleChange(e.target.value)}
          onKeyDown={e => e.key === 's' && (e.metaKey || e.ctrlKey) && (e.preventDefault(), onSaveNow())}
          placeholder="Untitled"
          style={{
            display: 'block', width: '100%',
            background: 'none', border: 'none', outline: 'none',
            fontSize: 22, fontWeight: 700, color: '#f9fafb',
            marginBottom: 10, letterSpacing: '-0.3px',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
          {note.tags.map(tag => (
            <span key={tag} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 11, padding: '2px 8px', borderRadius: 10,
              background: 'rgba(124,58,237,0.15)', color: '#a78bfa',
              border: '1px solid rgba(124,58,237,0.2)',
            }}>
              #{tag}
              <span
                onClick={() => removeTag(tag)}
                style={{ cursor: 'pointer', opacity: 0.6, fontSize: 12, lineHeight: 1 }}
              >×</span>
            </span>
          ))}

          {showTagInput ? (
            <input
              ref={tagRef}
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={addTag}
              onBlur={() => { setTagInput(''); setShowTagInput(false) }}
              placeholder="tag name..."
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(124,58,237,0.4)',
                borderRadius: 6, padding: '2px 8px',
                color: '#a78bfa', fontSize: 11, outline: 'none', width: 100,
              }}
            />
          ) : (
            <button
              onClick={() => setShowTagInput(true)}
              style={{
                background: 'none',
                border: '1px dashed rgba(255,255,255,0.1)',
                borderRadius: 6, padding: '2px 8px',
                color: '#4b5563', fontSize: 11, cursor: 'pointer',
              }}
            >+ tag</button>
          )}
        </div>
      </div>
    </div>
  )
}