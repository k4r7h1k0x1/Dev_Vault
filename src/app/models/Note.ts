import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface INote extends Document {
  title: string
  body: string
  folder: Types.ObjectId | null
  tags: string[]
  isPublic: boolean
  publicSlug: string | null
  userId: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const NoteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
      default: 'Untitled',
    },
    body: {
      type: String,
      default: '',
    },
    folder: {
      type: Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    publicSlug: {
      type: String,
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true,
    autoIndex: false,
  }
)

NoteSchema.index({ userId: 1, createdAt: -1 })
NoteSchema.index({ userId: 1, folder: 1 })
NoteSchema.index({ userId: 1, tags: 1 })
NoteSchema.index({ title: 'text', body: 'text' })

const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema)

export default Note