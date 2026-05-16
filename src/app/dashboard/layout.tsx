import { auth } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import ClientDashboardShell from '@/components/dashboard/ClientDashboardShell'
import MobileSidebarToggle from '@/components/dashboard/MobileSidebarToggle'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#07051a',
      position: 'relative',
    }}>
      <Suspense fallback={
        <aside style={{ width: 240, minWidth: 240, backgroundColor: '#0d0b1e' }} />
      }>
        <Sidebar user={session.user} />
      </Suspense>

      <main style={{
        flex: 1,
        overflowY: 'auto',
        backgroundColor: '#07051a',
        minWidth: 0,
      }}>
        <div className="mobile-topbar">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backgroundColor: '#0d0b1e',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 15,
              fontWeight: 700,
              color: '#fff',
            }}>
              <span style={{ color: '#7c3aed' }}>◆</span>
              DevVault
            </div>
            <MobileSidebarToggle />
          </div>
        </div>

        <Suspense fallback={null}>
          {children}
        </Suspense>
      </main>

      <ClientDashboardShell />

      <style>{`
        /* Desktop: show sidebar normally */
        .mobile-topbar { display: none; }
        .sidebar-wrapper { display: flex !important; }

        /* Mobile: hide sidebar, show top bar */
        @media (max-width: 768px) {
          .mobile-topbar { display: block; }
          aside {
            position: fixed !important;
            left: -260px !important;
            top: 0;
            bottom: 0;
            z-index: 100;
            transition: left 0.25s ease;
            box-shadow: 4px 0 24px rgba(0,0,0,0.4);
          }
          aside.mobile-open {
            left: 0 !important;
          }
          .mobile-overlay {
            display: block !important;
          }
        }

        @media (max-width: 480px) {
          aside {
            width: 100vw !important;
            min-width: unset !important;
          }
        }
      `}</style>
    </div>
  )
}