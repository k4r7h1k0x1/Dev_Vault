'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

interface PreviewPaneProps {
  value: string
  noteTitle: string
}

export default function PreviewPane({ value, noteTitle }: PreviewPaneProps) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <style>{`
        /* Base hljs */
        .hljs { background: transparent; color: #abb2bf; }

        /* Keywords: const, let, function, return, if, import, export, etc. */
        .hljs-keyword,
        .hljs-selector-tag,
        .hljs-built_in,
        .hljs-name,
        .hljs-tag { color: #c678dd; }

        /* Strings */
        .hljs-string,
        .hljs-attr,
        .hljs-attribute,
        .hljs-addition { color: #98c379; }

        /* Numbers, booleans */
        .hljs-number,
        .hljs-literal,
        .hljs-type { color: #d19a66; }

        /* Functions, methods */
        .hljs-title,
        .hljs-title.function_,
        .hljs-title.class_,
        .hljs-function { color: #61afef; }

        /* Variables, params, identifiers */
        .hljs-variable,
        .hljs-params { color: #e06c75; }

        /* Comments */
        .hljs-comment,
        .hljs-quote,
        .hljs-meta { color: #5c6370; font-style: italic; }

        /* Operators, punctuation */
        .hljs-operator,
        .hljs-punctuation { color: #abb2bf; }

        /* Properties */
        .hljs-property { color: #e06c75; }

        /* Class names */
        .hljs-class .hljs-title { color: #e5c07b; }

        /* Constants */
        .hljs-symbol,
        .hljs-bullet,
        .hljs-regexp { color: #56b6c2; }

        /* Deletion */
        .hljs-deletion { color: #e06c75; }

        /* Code block wrapper */
        .markdown-preview pre {
          background: rgba(0, 0, 0, 0.35) !important;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 16px;
          margin: 12px 0;
          overflow-x: auto;
        }
        .markdown-preview pre code {
          background: none !important;
          color: inherit;
          padding: 0;
          font-size: 12.5px;
          line-height: 1.75;
          font-family: "Fira Code", "Cascadia Code", "JetBrains Mono", Consolas, monospace;
        }
        .markdown-preview code:not(pre code) {
          font-family: "Fira Code", "Cascadia Code", Consolas, monospace;
          font-size: 12px;
          background: rgba(124,58,237,0.15);
          color: #a78bfa;
          padding: 1px 6px;
          border-radius: 4px;
          border: 1px solid rgba(124,58,237,0.2);
        }
      `}</style>

      <div style={{
        padding: '6px 16px',
        fontSize: 10,
        fontWeight: 600,
        color: '#4b5563',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        PREVIEW
      </div>

      <div
        className="markdown-preview"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px 32px',
        }}
      >
        {value.trim() ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({ children }) => (
                <h1 style={{ fontSize: 27, fontWeight: 700, color: '#f9fafb', marginBottom: 14, marginTop: 2, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 8 , fontFamily: '"Fira Code", monospace'}}>{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 style={{ fontSize: 19, fontWeight: 700, color: '#e5e7eb', marginBottom: 10, marginTop: 28 }}>{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#d1d5db', marginBottom: 6, marginTop: 18 }}>{children}</h3>
              ),
              p: ({ children }) => (
                <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.9, marginBottom: 14, marginTop: 0 }}>{children}</p>
              ),
              code: ({ className, children, ...props }: any) => {
                const isHighlighted = className?.startsWith('language-')
                if (isHighlighted) {
                  return <code className={className} {...props}>{children}</code>
                }
                return (
                  <code style={{
                    fontFamily: 'monospace',
                    fontSize: 12,
                    background: 'rgba(124,58,237,0.15)',
                    color: '#a78bfa',
                    padding: '1px 6px',
                    borderRadius: 4,
                    border: '1px solid rgba(124,58,237,0.2)',
                  }}>{children}</code>
                )
              },
              pre: ({ children }) => (
                <pre style={{ margin: '12px 0', background: 'none', padding: 0 }}>{children}</pre>
              ),
              blockquote: ({ children }) => (
                <blockquote style={{
                  borderLeft: '3px solid #7c3aed',
                  margin: '12px 0',
                  padding: '4px 16px',
                  background: 'rgba(124,58,237,0.06)',
                  borderRadius: '0 6px 6px 0',
                  fontStyle: 'italic',
                  color: '#9ca3af',
                }}>{children}</blockquote>
              ),
              ul: ({ children }) => (
                <ul style={{ color: '#9ca3af', fontSize: 15, lineHeight: 1.9, paddingLeft: 24, marginBottom: 14 }}>{children}</ul>
              ),
              ol: ({ children }) => (
                <ol style={{ color: '#9ca3af', fontSize: 15, lineHeight: 1.9, paddingLeft: 22, marginBottom: 14 }}>{children}</ol>
              ),
              li: ({ children }) => (
                <li style={{ marginBottom: 7 ,color: '#cbd5e1' }}>{children}</li>
              ),
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', textDecoration: 'underline' }}>{children}</a>
              ),
              strong: ({ children }) => (
                <strong style={{ color: '#e5e7eb', fontWeight: 600 }}>{children}</strong>
              ),
              em: ({ children }) => (
                <em style={{ color: '#d1d5db', fontStyle: 'italic' }}>{children}</em>
              ),
              hr: () => (
                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '20px 0' }} />
              ),
              table: ({ children }) => (
                <div style={{ overflowX: 'auto', marginBottom: 12 }}>
                  <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th style={{ padding: '8px 12px', background: 'rgba(124,58,237,0.15)', color: '#a78bfa', fontWeight: 600, fontSize: 12, textAlign: 'left', border: '1px solid rgba(255,255,255,0.07)' }}>{children}</th>
              ),
              td: ({ children }) => (
                <td style={{ padding: '7px 12px', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.06)', fontSize: 12 }}>{children}</td>
              ),
            }}
          >
            {value}
          </ReactMarkdown>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#374151',
            gap: 8,
          }}>
            <div style={{ fontSize: 28 }}>◈</div>
            <div style={{ fontSize: 13 }}>Preview will appear here</div>
          </div>
        )}
      </div>
    </div>
  )
}