import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IFolder extends Document {
  name: string
  userId: Types.ObjectId
  createdAt: Date
}

const FolderSchema = new Schema<IFolder>(
  {
    name: {
      type: String,
      required: [true, 'Folder name is required'],
      trim: true,
      maxlength: [100, 'Folder name cannot exceed 100 characters'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true,
  }
)

FolderSchema.index({ userId: 1, createdAt: 1 })

const Folder: Model<IFolder> =
  mongoose.models.Folder || mongoose.model<IFolder>('Folder', FolderSchema)

export default Folder