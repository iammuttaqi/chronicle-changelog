import { prisma } from '~/server/utils/prisma'
import type { Release, ReleaseItem } from '~/types/chronicle'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const statusParam = (query.status as string) || 'PUBLISHED'
  const categoryParam = query.category as string
  const semverParam = query.semverType as string
  const searchParam = (query.search as string)?.trim().toLowerCase()

  // Base Prisma where clause
  const where: any = {}

  if (statusParam !== 'ALL') {
    where.status = statusParam
  }

  if (semverParam && semverParam !== 'ALL') {
    where.semverType = semverParam
  }

  if (categoryParam && categoryParam !== 'ALL') {
    where.items = {
      some: {
        category: categoryParam
      }
    }
  }

  // Fetch all releases with items matching base criteria
  const releases = await prisma.release.findMany({
    where,
    include: {
      items: {
        orderBy: {
          sortOrder: 'asc'
        }
      }
    },
    orderBy: [
      { publishedAt: 'desc' },
      { createdAt: 'desc' }
    ]
  })

  // If search query is provided, perform case-insensitive fuzzy filtering
  let filtered = releases
  if (searchParam) {
    filtered = releases.filter((rel) => {
      const matchTitle = rel.title?.toLowerCase().includes(searchParam)
      const matchVersion = rel.version?.toLowerCase().includes(searchParam)
      const matchSummary = rel.summary?.toLowerCase().includes(searchParam)
      const matchMarkdown = rel.contentMarkdown?.toLowerCase().includes(searchParam)
      const matchItems = rel.items?.some((i) =>
        i.description?.toLowerCase().includes(searchParam) ||
        i.authorName?.toLowerCase().includes(searchParam)
      )
      return matchTitle || matchVersion || matchSummary || matchMarkdown || matchItems
    })
  }

  return {
    success: true,
    data: filtered as Release[],
    total: filtered.length
  }
})
