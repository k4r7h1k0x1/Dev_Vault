import Link from 'next/link'

export default function Hero() {
  return (
    <section className="px-6 max-w-6xl mx-auto" style={{ paddingTop: '140px', paddingBottom: '96px' }}>
      <div className="flex justify-center mb-8">
        <span style={{
          fontFamily: 'monospace',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.4)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '999px',
          padding: '6px 16px',
          background: 'rgba(255,255,255,0.04)',
        }}>
          v0.1 · markdown-first knowledge base
        </span>
      </div>

      <h1 style={{
        fontSize: 'clamp(36px, 6vw, 64px)',
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: '1.1',
        letterSpacing: '-0.02em',
        marginBottom: '24px',
        color: '#ffffff',
      }}>
        Your second brain,{' '}
        <br />
        <span style={{ color: '#a78bfa' }}>written in markdown.</span>
      </h1>

      <p style={{
        textAlign: 'center',
        color: 'rgba(255,255,255,0.5)',
        fontSize: '17px',
        maxWidth: '520px',
        margin: '0 auto 40px',
        lineHeight: '1.7',
      }}>
        DevVault is a private, markdown-powered notebook for developers. Capture snippets,
        system designs, and ideas — organized in folders, rendered with syntax highlighting.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '72px', flexWrap: 'wrap' }}>
        <Link href="/dashboard" style={{
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          color: '#ffffff',
          textDecoration: 'none',
          padding: '12px 28px',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '500',
          border: '1px solid rgba(167,139,250,0.3)',
          boxShadow: '0 0 24px rgba(124,58,237,0.4)',
        }}>
          Open the vault →
        </Link>
        <a href="#editor" style={{
          background: 'rgba(255,255,255,0.05)',
          color: 'rgba(255,255,255,0.7)',
          textDecoration: 'none',
          padding: '12px 28px',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '500',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          See the editor
        </a>
      </div>

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }}>

        <div style={{
          background: 'rgba(0,0,0,0.4)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', opacity: 0.8 }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', opacity: 0.8 }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', opacity: 0.8 }} />
          <span style={{
            fontFamily: 'monospace',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.35)',
            marginLeft: '12px',
          }}>
            ~/devvault/react/useEffect.md
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

          <div style={{
            background: 'rgba(0,0,0,0.35)',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            padding: '28px',
            fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace',
            fontSize: '13px',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.75)',
            whiteSpace: 'pre',
            overflowX: 'auto',
          }}>
{`# Understanding useEffect

The \`useEffect\` hook runs **side effects**
after the component renders.

\`\`\`javascript
useEffect(() => {
  console.log("mounted");
  return () => cleanup();
}, []);
\`\`\`

> Empty deps = run once on mount.`}
          </div>

          <div style={{
            background: 'rgba(10,8,30,0.6)',
            padding: '28px',
          }}>
            <h3 style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: '20px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '16px',
              marginTop: 0,
            }}>
              Understanding useEffect
            </h3>

            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: '1.7',
              marginBottom: '20px',
            }}>
              The{' '}
              <code style={{
                background: 'rgba(139,92,246,0.2)',
                color: '#a78bfa',
                padding: '2px 6px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '13px',
              }}>useEffect</code>
              {' '}hook runs{' '}
              <strong style={{ color: '#ffffff' }}>side effects</strong>
              {' '}after the component renders.
            </p>

            <div style={{
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              fontFamily: '"Fira Code", "Consolas", monospace',
              fontSize: '13px',
              lineHeight: '1.7',
            }}>
              <div style={{ color: '#a78bfa' }}>useEffect{'(() => {'}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', paddingLeft: '16px' }}>console.log(<span style={{ color: '#86efac' }}>"mounted"</span>);</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', paddingLeft: '16px' }}>return {'() =>'} <span style={{ color: '#a78bfa' }}>cleanup</span>();</div>
              <div style={{ color: '#a78bfa' }}>{`}, []);`}</div>
            </div>

            <div style={{
              borderLeft: '3px solid #7c3aed',
              paddingLeft: '16px',
            }}>
              <p style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: '14px',
                fontStyle: 'italic',
                margin: 0,
              }}>
                Empty deps = run once on mount.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}