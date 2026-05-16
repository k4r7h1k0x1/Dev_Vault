import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/app/lib/mongoose'
import { Note, Folder } from '@/app/models'
import { getServerUser } from '@/app/lib/getServerUser'

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const { searchParams } = new URL(req.url)
    const folder = searchParams.get('folder')
    const isPublic = searchParams.get('public')
    const tag = searchParams.get('tag')

    let query: Record<string, unknown>

    if (isPublic === 'true') {
      query = { isPublic: true }
      if (tag) query.tags = tag
    } else {
      query = { userId: user.id }
      if (folder) query.folder = folder
      if (tag) query.tags = tag
    }

    const notes = await Note.find(query)
      .populate('folder', 'name')
      .sort({ updatedAt: -1 })
      .lean()

    return NextResponse.json({ notes })
  } catch (error) {
    console.error('[GET /api/notes]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const body = await req.json()
    const { title, bodyContent, folder, tags } = body

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (folder) {
      const folderDoc = await Folder.findOne({ _id: folder, userId: user.id })
      if (!folderDoc) {
        return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
      }
    }

    const note = await Note.create({
      title: title.trim().slice(0, 300),
      body: typeof bodyContent === 'string' ? bodyContent : '',
      folder: folder || null,
      tags: Array.isArray(tags) ? tags.map((t: string) => t.trim()).filter(Boolean) : [],
      userId: user.id,
      isPublic: false,
      publicSlug: null,
    })

    const populated = await note.populate('folder', 'name')

    return NextResponse.json({ note: populated }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/notes]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}