'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Please try again.')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}>⬡</span>
            <span style={{ color: '#ffffff', fontFamily: 'monospace', fontWeight: '700', fontSize: '18px' }}>
              DevVault
            </span>
          </Link>
          <h1 style={{
            color: '#ffffff',
            fontSize: '24px',
            fontWeight: '700',
            marginTop: '24px',
            marginBottom: '8px',
          }}>
            Welcome back
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px' }}>
            Sign in to your vault
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
        }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: '#fca5a5',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px',
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px',
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading
                  ? 'rgba(139,92,246,0.5)'
                  : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: '#ffffff',
                border: '1px solid rgba(167,139,250,0.3)',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 0 24px rgba(124,58,237,0.4)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Signing in...' : 'Log in'}
            </button>
          </form>
        </div>

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '14px',
        }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: '500' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}