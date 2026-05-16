import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/app/lib/mongoose'
import { Note } from '@/app/models'
import { getServerUser } from '@/app/lib/getServerUser'

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim()

    if (!q || q.length < 1) {
      return NextResponse.json({ notes: [] })
    }

    await connectDB()

    const notes = await Note.find({
      userId: user.id,
      $text: { $search: q },
    }, {
      score: { $meta: 'textScore' },
    })
      .populate('folder', 'name')
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .lean()

    return NextResponse.json({ notes })
  } catch (error) {
    console.error('[GET /api/notes/search]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}