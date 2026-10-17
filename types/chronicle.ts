export type ReleaseStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED'
export type SemverType = 'MAJOR' | 'MINOR' | 'PATCH'
export type ChangeCategory = 'FEATURE' | 'IMPROVEMENT' | 'FIX' | 'BREAKING'

export interface ReleaseItem {
  id: string
  releaseId: string
  category: ChangeCategory
  description: string
  prNumber?: number | null
  authorName?: string | null
  sortOrder: number
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Release {
  id: string
  version: string
  title: string
  slug: string
  summary: string
  contentMarkdown: string
  status: ReleaseStatus
  semverType: SemverType
  publishedAt?: string | Date | null
  scheduledFor?: string | Date | null
  authorName: string
  authorAvatar?: string | null
  createdAt: string | Date
  updatedAt: string | Date
  items: ReleaseItem[]
}

export interface ReleaseDraftInput {
  version: string
  title: string
  summary: string
  contentMarkdown: string
  status?: ReleaseStatus
  semverType?: SemverType
  publishedAt?: string | null
  scheduledFor?: string | null
  authorName?: string
  authorAvatar?: string | null
  items: Array<{
    id?: string
    category: ChangeCategory
    description: string
    prNumber?: number | null
    authorName?: string | null
    sortOrder?: number
  }>
}

export type ExportTarget = 'GITHUB' | 'SLACK' | 'HTML_EMBED'

export interface SubscriberInput {
  email: string
}
