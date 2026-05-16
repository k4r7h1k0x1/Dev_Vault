import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/app/lib/mongoose'
import { Note } from '@/app/models'
import { getServerUser } from '@/app/lib/getServerUser'
import { generateSlug } from '@/app/lib/generateSlug'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const user = await getServerUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await connectDB()

    const note = await Note.findOne({ _id: id, userId: user.id })
      .populate('folder', 'name')
      .lean()

    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 })

    return NextResponse.json({ note })
  } catch (error) {
    console.error('[GET /api/notes/:id]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const user = await getServerUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await connectDB()

    const body = await req.json()
    const { title, bodyContent, tags, folder, isPublic } = body

    const note = await Note.findOne({ _id: id, userId: user.id })
    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    if (typeof title === 'string') note.title = title.trim().slice(0, 300) || 'Untitled'
    if (typeof bodyContent === 'string') note.body = bodyContent
    if (Array.isArray(tags)) note.tags = tags.map((t: string) => t.trim()).filter(Boolean)
    if (folder !== undefined) note.folder = folder || null
    if (typeof isPublic === 'boolean') {
      note.isPublic = isPublic
      if (isPublic && !note.publicSlug) {
        note.publicSlug = generateSlug()
      }
    }

    await note.save()
    const populated = await note.populate('folder', 'name')

    return NextResponse.json({ note: populated })
  } catch (error) {
    console.error('[PUT /api/notes/:id]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const user = await getServerUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await connectDB()

    const note = await Note.findOneAndDelete({ _id: id, userId: user.id })
    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/notes/:id]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}