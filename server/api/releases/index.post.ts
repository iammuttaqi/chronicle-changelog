import { prisma } from '~/server/utils/prisma'
import { isValidSemver, normalizeVersion, formatSlug, recommendNextVersion } from '~/server/utils/semver'
import type { ReleaseDraftInput } from '~/types/chronicle'

export default defineEventHandler(async (event) => {
  const body = await readBody<ReleaseDraftInput>(event)

  if (!body || !body.version || !body.title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required release fields: version and title are required.'
    })
  }

  if (!isValidSemver(body.version)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid SemVer version string. Expected format: v1.0.0 or 1.0.0.'
    })
  }

  const normalizedVer = normalizeVersion(body.version)
  const slug = formatSlug(normalizedVer)

  // Check if version or slug already exists
  const existing = await prisma.release.findFirst({
    where: {
      OR: [
        { version: normalizedVer },
        { slug }
      ]
    }
  })

  if (existing) {
    throw createError({
      statusCode: 400,
      statusMessage: `A release with version ${normalizedVer} or slug ${slug} already exists.`
    })
  }

  const items = body.items || []

  // Auto-determine semverType if not explicitly supplied
  let semverType = body.semverType
  if (!semverType) {
    const categories = items.map((i) => i.category)
    const rec = recommendNextVersion(normalizedVer, categories)
    semverType = rec.bumpType
  }

  const status = body.status || 'DRAFT'
  let publishedAt: Date | null = null
  if (status === 'PUBLISHED') {
    publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date()
  }

  const scheduledFor = body.scheduledFor ? new Date(body.scheduledFor) : null

  // Create Release with nested items
  const created = await prisma.release.create({
    data: {
      version: normalizedVer,
      title: body.title.trim(),
      slug,
      summary: (body.summary || '').trim(),
      contentMarkdown: (body.contentMarkdown || '').trim(),
      status,
      semverType,
      publishedAt,
      scheduledFor,
      authorName: (body.authorName || 'Core Team').trim(),
      authorAvatar: body.authorAvatar || null,
      items: {
        create: items.map((item, index) => ({
          category: item.category,
          description: item.description.trim(),
          prNumber: item.prNumber ? Number(item.prNumber) : null,
          authorName: item.authorName ? item.authorName.trim() : null,
          sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : index
        }))
      }
    },
    include: {
      items: true
    }
  })

  setResponseStatus(event, 201)
  return {
    success: true,
    data: {
      id: created.id,
      version: created.version,
      slug: created.slug,
      status: created.status,
      publishedAt: created.publishedAt,
      itemsCount: created.items.length
    }
  }
})
