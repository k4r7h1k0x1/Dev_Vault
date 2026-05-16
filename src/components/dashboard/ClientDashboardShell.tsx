'use client'
import CommandPalette from '@/components/dashboard/CommandPalette'
import ToastContainer from '@/components/ToastContainer'

export default function ClientDashboardShell() {
  return (
    <>
      <CommandPalette />
      <ToastContainer />
    </>
  )
}