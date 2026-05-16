'use client'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'

export default function MobileSidebarToggle() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const sidebar = document.querySelector('aside')
    const overlay = document.getElementById('mobile-overlay')
    if (sidebar) {
      if (open) {
        sidebar.classList.add('mobile-open')
      } else {
        sidebar.classList.remove('mobile-open')
      }
    }
    if (overlay) {
      overlay.style.display = open ? 'block' : 'none'
    }
  }, [open])

  useEffect(() => {
    const handler = () => setOpen(false)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          color: '#9ca3af',
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        <FontAwesomeIcon icon={open ? faXmark : faBars} />
      </button>

      <div
        id="mobile-overlay"
        onClick={() => setOpen(false)}
        style={{
          display: 'none',
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 99,
        }}
      />
    </>
  )
}