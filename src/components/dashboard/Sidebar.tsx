'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useFolders } from '@/hooks/useFolders'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus, faMagnifyingGlass, faFileLines, faGlobe,
  faFolder, faFolderOpen, faGear, faArrowRightFromBracket,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'

interface SidebarUser {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export default function Sidebar({ user }: { user: SidebarUser }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { folders, refetch: refetchFolders, createFolder } = useFolders()

  const [newFolderName, setNewFolderName] = useState('')
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [creatingFolder, setCreatingFolder] = useState(false)

  const activeFolder = searchParams.get('folder')
  const activeFilter = searchParams.get('filter')

  function navigate(params: Record<string, string | null>) {
    const p = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => { if (v) p.set(k, v) })
    router.push(`/dashboard?${p.toString()}`)
  }

  async function handleNewNote() {
    const body: Record<string, unknown> = { title: 'Untitled', bodyContent: '' }
    if (activeFolder) body.folder = activeFolder
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (data.note?._id) {
      await refetchFolders()
      router.push(`/dashboard/note/${data.note._id}`)
    }
  }

  async function handleCreateFolder(e: React.FormEvent) {
    e.preventDefault()
    if (!newFolderName.trim()) return
    setCreatingFolder(true)
    await createFolder(newFolderName.trim())
    setNewFolderName('')
    setShowNewFolder(false)
    setCreatingFolder(false)
  }

  const username = user.name ?? user.email ?? 'user'
  const initials = username.slice(0, 2).toUpperCase()
  const totalNotes = folders.reduce((sum, f) => sum + ((f as any).noteCount ?? 0), 0)

  return (
    <aside style={{
      width: 240,
      minWidth: 240,
      height: '100vh',
      backgroundColor: '#0d0b1e',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>

      <div style={{
        padding: '20px 18px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          fontSize: 16,
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '-0.3px',
        }}>
          <span style={{
            color: '#7c3aed',
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
          }}>◆</span>
          DevVault
        </div>
      </div>

      <div style={{ padding: '14px 12px 8px' }}>
        <button
          onClick={handleNewNote}
          style={{
            width: '100%',
            padding: '10px 14px',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 2px 12px rgba(124,58,237,0.3)',
          }}
        >
          <FontAwesomeIcon icon={faPlus} style={{ fontSize: 13 }} />
          New Note
        </button>
      </div>

      <div style={{ padding: '4px 12px 10px' }}>
        <div
          onClick={() => router.push('/dashboard?search=1')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 7,
            padding: '8px 11px',
            cursor: 'pointer',
          }}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: '#6b7280', fontSize: 12 }} />
          <span style={{ color: '#6b7280', fontSize: 13, flex: 1 }}>Search notes...</span>
          <span style={{
            fontSize: 10,
            color: '#4b5563',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 4,
            padding: '2px 6px',
            whiteSpace: 'nowrap',
            fontFamily: 'monospace',
          }}>⌘K</span>
        </div>
      </div>

      <div style={{ padding: '2px 8px' }}>
        <NavItem
          label="All Notes"
          icon={<FontAwesomeIcon icon={faFileLines} />}
          active={!activeFolder && !activeFilter}
          onClick={() => navigate({})}
        />
        <NavItem
          label="Public"
          icon={<FontAwesomeIcon icon={faGlobe} />}
          active={activeFilter === 'public'}
          onClick={() => navigate({ filter: 'public' })}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px 0' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 8px 8px',
        }}>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#4b5563',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            Folders
          </span>
          <button
            onClick={() => setShowNewFolder(v => !v)}
            title="New folder"
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: 16,
              lineHeight: 1,
              padding: '0 2px',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FontAwesomeIcon icon={faPlus} style={{ fontSize: 11 }} />
          </button>
        </div>

        {showNewFolder && (
          <form onSubmit={handleCreateFolder} style={{ padding: '0 4px 8px' }}>
            <input
              autoFocus
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => e.key === 'Escape' && setShowNewFolder(false)}
              placeholder="Folder name..."
              disabled={creatingFolder}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(124,58,237,0.5)',
                borderRadius: 6,
                padding: '6px 10px',
                color: '#fff',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </form>
        )}

        {folders.map(folder => (
          <NavItem
            key={folder._id}
            label={folder.name}
            icon={
              <FontAwesomeIcon
                icon={activeFolder === folder._id ? faFolderOpen : faFolder}
              />
            }
            count={(folder as any).noteCount ?? 0}
            active={activeFolder === folder._id}
            onClick={() => navigate({ folder: folder._id })}
          />
        ))}
      </div>

      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 700,
          color: '#fff',
          flexShrink: 0,
        }}>
          {initials}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#e5e7eb',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {username}
          </div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>
            {totalNotes} note{totalNotes !== 1 ? 's' : ''} · {folders.length} folder{folders.length !== 1 ? 's' : ''}
          </div>
        </div>

        <button
          title="Settings"
          style={{
            background: 'none', border: 'none',
            color: '#4b5563', cursor: 'pointer',
            fontSize: 13, padding: 4, borderRadius: 4,
            display: 'flex', alignItems: 'center',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#9ca3af'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#4b5563'}
        >
          <FontAwesomeIcon icon={faGear} />
        </button>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          title="Sign out"
          style={{
            background: 'none', border: 'none',
            color: '#4b5563', cursor: 'pointer',
            fontSize: 13, padding: 4, borderRadius: 4,
            display: 'flex', alignItems: 'center',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#9ca3af'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#4b5563'}
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
        </button>
      </div>
    </aside>
  )
}

function NavItem({
  label, icon, active, onClick, count,
}: {
  label: string
  icon: React.ReactNode
  active: boolean
  onClick: () => void
  count?: number
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '7px 10px',
        borderRadius: 7,
        border: 'none',
        cursor: 'pointer',
        background: active ? 'rgba(124,58,237,0.18)' : 'none',
        color: active ? '#a78bfa' : '#9ca3af',
        fontSize: 13,
        textAlign: 'left',
        transition: 'background 0.15s, color 0.15s',
        marginBottom: 2,
      }}
      onMouseEnter={e => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
          ;(e.currentTarget as HTMLElement).style.color = '#e5e7eb'
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = 'none'
          ;(e.currentTarget as HTMLElement).style.color = '#9ca3af'
        }
      }}
    >
      <span style={{ fontSize: 13, flexShrink: 0, width: 16, display: 'flex', justifyContent: 'center' }}>
        {icon}
      </span>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: active ? 600 : 400 }}>
        {label}
      </span>
      {count !== undefined && (
        <span style={{
          fontSize: 11,
          color: active ? '#7c3aed' : '#4b5563',
          background: active ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.05)',
          borderRadius: 10,
          padding: '1px 7px',
          flexShrink: 0,
          fontWeight: 500,
        }}>{count}</span>
      )}
    </button>
  )
}