import { auth } from '@/app/lib/auth'

export async function getServerUser() {
  const session = await auth()
  if (!session?.user?.id) return null
  return session.user
}