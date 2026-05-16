import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'

interface Params {
  params: Promise<{ slug: string }>
}

async function getNote(slug: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/notes/public/${slug}`, {
      next: { revalidate: 60 }, 
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.note
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const note = await getNote(slug)
  if (!note) return { title: 'Note not found — DevVault' }
  return {
    title: `${note.title} — DevVault`,
    description: note.body.slice(0, 160).replace(/[#*`]/g, ''),
  }
}

export default async function PublicNotePage({ params }: Params) {
  const { slug } = await params
  const note = await getNote(slug)
  if (!note) notFound()

  const folderName = note.folder?.name

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#07051a',
      color: '#f9fafb',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>

      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0d0b1e',
      }}>
        <a href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          textDecoration: 'none',
          color: '#fff',
          fontFamily: 'monospace',
          fontWeight: 700,
          fontSize: 15,
        }}>
          <span style={{ color: '#7c3aed', fontSize: 18 }}>◆</span>
          DevVault
        </a>
        <span style={{
          fontSize: 11,
          padding: '3px 10px',
          borderRadius: 10,
          background: 'rgba(52,211,153,0.1)',
          border: '1px solid rgba(52,211,153,0.2)',
          color: '#34d399',
          fontWeight: 600,
        }}>
          PUBLIC NOTE
        </span>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#4b5563',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 20,
          display: 'flex',
          gap: 6,
        }}>
          <span>VAULT</span>
          {folderName && (
            <>
              <span style={{ color: '#374151' }}>›</span>
              <span>{folderName.toUpperCase()}</span>
            </>
          )}
        </div>

        <h1 style={{
          fontSize: 32,
          fontWeight: 700,
          color: '#f9fafb',
          margin: '0 0 16px',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}>
          {note.title}
        </h1>

        {note.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
            {note.tags.map((tag: string) => (
              <span key={tag} style={{
                fontSize: 11,
                padding: '3px 9px',
                borderRadius: 10,
                background: 'rgba(124,58,237,0.15)',
                color: '#a78bfa',
                border: '1px solid rgba(124,58,237,0.2)',
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div style={{ fontSize: 12, color: '#4b5563', marginBottom: 40 }}>
          Last updated {new Date(note.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: 40 }} />

        <div className="public-markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {note.body}
          </ReactMarkdown>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '20px 24px',
        textAlign: 'center',
        color: '#374151',
        fontSize: 12,
      }}>
        Shared via{' '}
        <a href="/" style={{ color: '#7c3aed', textDecoration: 'none' }}>DevVault</a>
        {' '}— the markdown notebook for developers
      </div>

      <style>{`
        .public-markdown h1 { font-size: 22px; font-weight: 700; color: #f9fafb; margin: 0 0 12px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px; }
        .public-markdown h2 { font-size: 17px; font-weight: 600; color: #e5e7eb; margin: 24px 0 8px; }
        .public-markdown h3 { font-size: 14px; font-weight: 600; color: #d1d5db; margin: 18px 0 6px; }
        .public-markdown p  { font-size: 14px; color: #9ca3af; line-height: 1.8; margin: 0 0 12px; }
        .public-markdown code { font-family: monospace; font-size: 12px; background: rgba(124,58,237,0.15); color: #a78bfa; padding: 1px 6px; border-radius: 4px; }
        .public-markdown pre { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 16px; margin: 12px 0; overflow-x: auto; }
        .public-markdown pre code { background: none; color: #86efac; padding: 0; font-size: 13px; line-height: 1.7; }
        .public-markdown blockquote { border-left: 3px solid #7c3aed; margin: 12px 0; padding: 4px 16px; background: rgba(124,58,237,0.06); border-radius: 0 6px 6px 0; }
        .public-markdown ul, .public-markdown ol { color: #9ca3af; font-size: 13px; line-height: 1.8; padding-left: 20px; margin-bottom: 12px; }
        .public-markdown a { color: #7c3aed; text-decoration: underline; }
        .public-markdown strong { color: #e5e7eb; }
        .public-markdown table { border-collapse: collapse; width: 100%; font-size: 13px; margin-bottom: 12px; }
        .public-markdown th { padding: 8px 12px; background: rgba(124,58,237,0.15); color: #a78bfa; font-weight: 600; text-align: left; border: 1px solid rgba(255,255,255,0.07); }
        .public-markdown td { padding: 7px 12px; color: #9ca3af; border: 1px solid rgba(255,255,255,0.06); }
        .public-markdown hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 20px 0; }
      `}</style>
    </div>
  )
}