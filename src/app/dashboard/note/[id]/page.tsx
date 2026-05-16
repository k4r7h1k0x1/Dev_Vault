'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import EditorHeader from '@/components/editor/EditorHeader'
import EditorPane from '@/components/editor/EditorPane'
import PreviewPane from '@/components/editor/PreviewPane'
import { useAutoSave } from '@/hooks/useAutoSave'
import type { NoteResponse } from '@/types/note'

export default function NoteEditorPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [note, setNote] = useState<NoteResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [body, setBody] = useState('')
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/notes/${id}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null }
        return r.json()
      })
      .then(data => {
        if (!data) return
        setNote(data.note)
        setBody(data.note.body ?? '')
        setTitle(data.note.title ?? '')
        setTags(data.note.tags ?? [])
        setLoading(false)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [id])

  useEffect(() => {
    if (note) setSaveStatus('unsaved')
  }, [body, title, tags])

  const handleSave = useCallback((success: boolean) => {
    setSaveStatus(success ? 'saved' : 'unsaved')
    if (success && note) {
      setNote(prev => prev ? { ...prev, title, body, tags, updatedAt: new Date().toISOString() } : prev)
    }
  }, [note, title, body, tags])

  const { saveNow } = useAutoSave({
    noteId: id,
    data: { title, bodyContent: body, tags },
    delay: 1500,
    onSave: handleSave,
  })

  async function handleSaveNow() {
    setSaveStatus('saving')
    await saveNow()
  }

  function handleTitleChange(val: string) {
    setTitle(val)
    setNote(prev => prev ? { ...prev, title: val } : prev)
  }

  function handleTagsChange(newTags: string[]) {
    setTags(newTags)
    setNote(prev => prev ? { ...prev, tags: newTags } : prev)
  }

  async function handlePublicToggle(isPublic: boolean) {
    if (!note) return
    setSaveStatus('saving')
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic }),
      })
      if (res.ok) {
        const data = await res.json()
        setNote(data.note)
        setTags(data.note.tags ?? [])
        setSaveStatus('saved')
      }
    } catch {
      setSaveStatus('unsaved')
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setSaveStatus('unsaved')
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: '#4b5563',
        fontSize: 14,
        gap: 10,
      }}>
        <div style={{
          width: 16,
          height: 16,
          border: '2px solid rgba(124,58,237,0.3)',
          borderTop: '2px solid #7c3aed',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        Loading note...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (notFound || !note) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: '#6b7280',
        gap: 16,
      }}>
        <div style={{ fontSize: 40 }}>◈</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#9ca3af' }}>Note not found</div>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            padding: '8px 20px',
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 8,
            color: '#a78bfa',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >← Back to dashboard</button>
      </div>
    )
  }

  const editorNote = { ...note, title, body, tags }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <EditorHeader
        note={editorNote}
        saveStatus={saveStatus}
        onTitleChange={handleTitleChange}
        onTagsChange={handleTagsChange}
        onPublicToggle={handlePublicToggle}
        onSaveNow={handleSaveNow}
        onDelete={handleDelete}
      />

      <div className="mobile-editor-tabs">
        <style>{`
          .mobile-editor-tabs { display: none; }
          @media (max-width: 768px) {
            .mobile-editor-tabs {
              display: flex;
              border-bottom: 1px solid rgba(255,255,255,0.06);
              background: #0d0b1e;
            }
          }
          .editor-tab {
            flex: 1;
            padding: 10px;
            background: none;
            border: none;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.15s;
          }
          .editor-tab.active {
            color: #a78bfa;
            border-bottom: 2px solid #7c3aed;
          }
          .editor-tab.inactive {
            color: #4b5563;
          }
          .hide-mobile { display: flex !important; }
          @media (max-width: 768px) {
            .hide-mobile { display: none !important; }
            .show-mobile { display: flex !important; }
          }`}
          </style>
        <button
          className={`editor-tab ${mobileTab === 'editor' ? 'active' : 'inactive'}`}
          onClick={() => setMobileTab('editor')}
        >Markdown</button>
        <button
          className={`editor-tab ${mobileTab === 'preview' ? 'active' : 'inactive'}`}
          onClick={() => setMobileTab('preview')}
        >Preview</button>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div className={mobileTab === 'preview' ? 'hide-mobile' : ''} style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <EditorPane
            value={body}
            onChange={val => { setBody(val); setSaveStatus('unsaved') }}
            onSaveNow={handleSaveNow}
          />
        </div>
        <div className={mobileTab === 'editor' ? 'hide-mobile' : ''} style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <PreviewPane value={body} noteTitle={title} />
        </div>
      </div>
    </div>
  )
}