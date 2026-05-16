import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/app/lib/mongoose'
import { Note } from '@/app/models'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    await connectDB()

    const note = await Note.findOne({ publicSlug: slug, isPublic: true })
      .populate('folder', 'name')
      .lean() as Record<string, unknown> | null

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    const { userId: _userId, ...safeNote } = note

    return NextResponse.json({ note: safeNote })
  } catch (error) {
    console.error('[GET /api/notes/public/:slug]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}