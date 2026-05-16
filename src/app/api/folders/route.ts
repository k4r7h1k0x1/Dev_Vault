import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import connectDB from '@/app/lib/mongoose'
import { Folder, Note } from '@/app/models'
import { getServerUser } from '@/app/lib/getServerUser'

export async function GET() {
  try {
    const user = await getServerUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const folders = await Folder.find({ userId: user.id })
      .sort({ name: 1 })
      .lean()

    const userObjectId = new mongoose.Types.ObjectId(user.id)

    const counts = await Note.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: '$folder', count: { $sum: 1 } } },
    ])

    const countMap: Record<string, number> = {}
    counts.forEach((c) => {
      if (c._id) countMap[c._id.toString()] = c.count
    })

    const foldersWithCount = folders.map((f) => ({
      ...f,
      noteCount: countMap[f._id.toString()] ?? 0,
    }))

    return NextResponse.json({ folders: foldersWithCount })
  } catch (error) {
    console.error('[GET /api/folders]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const { name } = await req.json()
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const existing = await Folder.findOne({ name: name.trim(), userId: user.id })
    if (existing) {
      return NextResponse.json({ error: 'Folder already exists' }, { status: 409 })
    }

    const folder = await Folder.create({
      name: name.trim().slice(0, 100),
      userId: user.id,
    })

    return NextResponse.json({
      folder: { ...folder.toObject(), noteCount: 0 },
    }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/folders]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}