'use client'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faLock } from '@fortawesome/free-solid-svg-icons'
import type { NoteResponse } from '@/types/note'

const TAG_COLORS: Record<string, { bg: string; text: string }> = {}

function getTagColor(tag: string) {
  if (TAG_COLORS[tag]) return TAG_COLORS[tag]
  const hue = Array.from(tag).reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  const color = { bg: `hsla(${hue},60%,40%,0.25)`, text: `hsl(${hue},70%,70%)` }
  TAG_COLORS[tag] = color
  return color
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getPreview(body: string) {
  return body
    .replace(/```[\s\S]*?```/g, '[code]')
    .replace(/#{1,6}\s/g, '')
    .replace(/[*_`~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim()
    .slice(0, 160)
}

export default function NoteCard({ note }: { note: NoteResponse }) {
  const router = useRouter()
  const { data: session } = useSession()
  const preview = getPreview(note.body)
  const isOwner = session?.user?.id === note.userId

  function handleClick() {
    if (isOwner) {
      router.push(`/dashboard/note/${note._id}`)
    } else if (note.isPublic && note.publicSlug) {
      router.push(`/p/${note.publicSlug}`)
    }
  }

  function handleTagClick(e: React.MouseEvent, tag: string) {
    e.stopPropagation()
    router.push(`/dashboard?tag=${encodeURIComponent(tag)}`)
  }

  return (
    <div
      onClick={handleClick}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '18px 20px',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        minHeight: 140,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(124,58,237,0.4)'
        ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(124,58,237,0.06)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'
        ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 8,
      }}>
        <div style={{
          fontSize: 15,
          fontWeight: 700,
          color: '#f1f5f9',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
        }}>
          {note.title}
        </div>
        <FontAwesomeIcon
          icon={note.isPublic ? faGlobe : faLock}
          style={{
            fontSize: 13,
            color: note.isPublic ? '#34d399' : '#4b5563',
            flexShrink: 0,
            marginTop: 2,
          }}
        />
      </div>

      {preview && (
        <div style={{
          fontSize: 13,
          color: '#6b7280',
          lineHeight: 1.6,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        } as React.CSSProperties}>
          {preview}
        </div>
      )}

      {note.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {note.tags.slice(0, 4).map(tag => {
            const c = getTagColor(tag)
            return (
              <span
                key={tag}
                onClick={e => handleTagClick(e, tag)}
                title={`Filter by #${tag}`}
                style={{
                  fontSize: 11,
                  padding: '3px 9px',
                  borderRadius: 10,
                  background: c.bg,
                  color: c.text,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.7'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >
                #{tag}
              </span>
            )
          })}
        </div>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
        paddingTop: 4,
      }}>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#4b5563',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          {note.folder ? (note.folder as any).name : 'UNFILED'}
        </span>
        <span style={{ fontSize: 11, color: '#4b5563' }}>
          {formatDate(note.updatedAt)}
        </span>
      </div>
    </div>
  )
}