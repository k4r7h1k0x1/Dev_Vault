import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines, faFolder, faGlobe, faTag } from '@fortawesome/free-solid-svg-icons'

interface StatsBarProps {
  totalNotes: number
  totalFolders: number
  totalPublic: number
  totalTags: number
}

export default function StatsBar({ totalNotes, totalFolders, totalPublic, totalTags }: StatsBarProps) {
  const stats = [
    { label: 'TOTAL NOTES', value: totalNotes, icon: faFileLines },
    { label: 'FOLDERS',     value: totalFolders, icon: faFolder },
    { label: 'PUBLIC',      value: totalPublic, icon: faGlobe },
    { label: 'TAGS',        value: totalTags, icon: faTag },
  ]

  return (
    <>
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            margin-bottom: 20px;
          }
        }
        @media (max-width: 380px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
          }
        }
      `}</style>

      <div className="stats-grid">
        {stats.map(s => (
          <div
            key={s.label}
            style={{
              padding: '16px 18px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
            }}
          >
            <div style={{
              fontSize: 10,
              fontWeight: 600,
              color: '#4b5563',
              letterSpacing: '0.1em',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              textTransform: 'uppercase' as const,
            }}>
              <FontAwesomeIcon icon={s.icon} style={{ fontSize: 10 }} />
              {s.label}
            </div>
            <div style={{
              fontSize: 30,
              fontWeight: 700,
              color: '#f9fafb',
              lineHeight: 1,
            }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}