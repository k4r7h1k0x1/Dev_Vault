export interface NoteResponse {
  _id: string
  title: string
  body: string
  folder: { _id: string; name: string } | null
  tags: string[]
  isPublic: boolean
  publicSlug: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export interface FolderResponse {
  _id: string
  name: string
  userId: string
  createdAt: string
}