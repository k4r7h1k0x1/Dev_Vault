'use client'
import { useRef, useEffect } from 'react'

interface EditorPaneProps {
  value: string
  onChange: (val: string) => void
  onSaveNow: () => void
}

export default function EditorPane({ value, onChange, onSaveNow }: EditorPaneProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        onSaveNow()
      }
      if (e.key === 'Tab' && document.activeElement === textareaRef.current) {
        e.preventDefault()
        const el = textareaRef.current!
        const start = el.selectionStart
        const end = el.selectionEnd
        const newVal = value.substring(0, start) + '  ' + value.substring(end)
        onChange(newVal)
        requestAnimationFrame(() => {
          el.selectionStart = start + 2
          el.selectionEnd = start + 2
        })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onSaveNow, onChange, value])

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      overflow: 'hidden',
    }}>
      
      <div style={{
        padding: '6px 16px',
        fontSize: 10,
        fontWeight: 600,
        color: '#4b5563',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span>MARKDOWN</span>
        <span style={{ color: '#374151' }}>{value.length} chars</span>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        spellCheck={false}
        placeholder={`# Your note title\n\nStart writing in markdown...\n\n## Features\n- **Bold**, *italic*, \`code\`\n- [Links](https://example.com)\n- > Blockquotes\n\`\`\`javascript\nconsole.log('hello')\n\`\`\``}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          resize: 'none',
          padding: '20px',
          color: '#d1d5db',
          fontSize: 15,
          lineHeight: 1.9,
          fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", Consolas, monospace',
          caretColor: '#7c3aed',
          whiteSpace: 'pre',
          overflowWrap: 'normal',
          overflowX: 'auto',
          overflowY: 'auto',
          tabSize: 2,
        }}
      />
    </div>
  )
}