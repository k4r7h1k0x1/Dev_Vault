'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-6">
      <nav
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          width: '100%',
          maxWidth: '900px',
        }}
      >
        <div className="px-6 h-14 flex items-center justify-between">

          <Link
            href="/"
            style={{ color: '#ffffff', textDecoration: 'none' }}
            className="flex items-center gap-2 font-mono font-bold text-base"
          >
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
              borderRadius: '6px',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
            }}>⬡</span>
            DevVault
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {['Features', 'Editor', 'Roadmap'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                fontSize: '14px',
                padding: '7px 16px',
                borderRadius: '10px',
                transition: 'all 0.2s',
                border: '1px solid transparent',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
              }}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '14px',
                padding: '7px 18px',
                borderRadius: '10px',
                border: '1px solid rgba(167,139,250,0.4)',
                boxShadow: '0 0 16px rgba(124,58,237,0.4)',
                transition: 'all 0.2s',
                fontWeight: '500',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 0 28px rgba(124,58,237,0.65)'
                e.currentTarget.style.background = 'linear-gradient(135deg, #a78bfa, #8b5cf6)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 0 16px rgba(124,58,237,0.4)'
                e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
              }}
            >
              Sign up
            </Link>
          </div>

          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
            }}
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.08)',
              padding: '16px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {['Features', 'Editor', 'Roadmap'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px', display: 'flex', gap: '8px' }}>
              <Link href="/login" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', textDecoration: 'none' }}>
                Log in
              </Link>
              <Link
                href="/signup"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: '#ffffff',
                  fontSize: '14px',
                  padding: '7px 18px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}