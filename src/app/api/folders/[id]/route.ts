import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/app/lib/mongoose'
import { Folder, Note } from '@/app/models'
import { getServerUser } from '@/app/lib/getServerUser'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getServerUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const { name } = await req.json()

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    await connectDB()

    const folder = await Folder.findOneAndUpdate(
      { _id: id, userId: user.id },
      { name: name.trim().slice(0, 100) },
      { new: true }
    )

    if (!folder) return NextResponse.json({ error: 'Folder not found' }, { status: 404 })

    return NextResponse.json({ folder })
  } catch (error) {
    console.error('[PUT /api/folders/:id]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getServerUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await connectDB()

    const folder = await Folder.findOneAndDelete({ _id: id, userId: user.id })
    if (!folder) return NextResponse.json({ error: 'Folder not found' }, { status: 404 })

    await Note.updateMany(
      { folder: id, userId: user.id },
      { $set: { folder: null } }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/folders/:id]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}