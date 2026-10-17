import { prisma } from '~/server/utils/prisma'
import { isValidSemver, normalizeVersion, formatSlug, recommendNextVersion } from '~/server/utils/semver'
import type { ReleaseDraftInput, Release } from '~/types/chronicle'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing release identifier.'
    })
  }

  const existing = await prisma.release.findUnique({
    where: { id }
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: `Release "${id}" not found.`
    })
  }

  const body = await readBody<ReleaseDraftInput>(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body.'
    })
  }

  let normalizedVer = existing.version
  let slug = existing.slug

  if (body.version && body.version !== existing.version) {
    if (!isValidSemver(body.version)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid SemVer version string.'
      })
    }
    normalizedVer = normalizeVersion(body.version)
    slug = formatSlug(normalizedVer)

    // Check conflict
    const conflict = await prisma.release.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          { OR: [{ version: normalizedVer }, { slug }] }
        ]
      }
    })
    if (conflict) {
      throw createError({
        statusCode: 400,
        statusMessage: `Version ${normalizedVer} or slug ${slug} is already taken by another release.`
      })
    }
  }

  const items = body.items || []

  // SemVer type calculation
  let semverType = body.semverType || existing.semverType
  if (!body.semverType && items.length > 0) {
    const categories = items.map((i) => i.category)
    const rec = recommendNextVersion(normalizedVer, categories)
    semverType = rec.bumpType
  }

  const status = body.status || existing.status
  let publishedAt = existing.publishedAt

  if (status === 'PUBLISHED' && !existing.publishedAt) {
    publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date()
  } else if (body.publishedAt) {
    publishedAt = new Date(body.publishedAt)
  }

  const scheduledFor = body.scheduledFor ? new Date(body.scheduledFor) : null

  // Transaction: update release and synchronize items
  const updated = await prisma.$transaction(async (tx) => {
    // Delete existing items
    await tx.releaseItem.deleteMany({
      where: { releaseId: id }
    })

    // Update release details and insert new items
    return tx.release.update({
      where: { id },
      data: {
        version: normalizedVer,
        title: body.title !== undefined ? body.title.trim() : existing.title,
        slug,
        summary: body.summary !== undefined ? body.summary.trim() : existing.summary,
        contentMarkdown: body.contentMarkdown !== undefined ? body.contentMarkdown.trim() : existing.contentMarkdown,
        status,
        semverType,
        publishedAt,
        scheduledFor,
        authorName: body.authorName ? body.authorName.trim() : existing.authorName,
        authorAvatar: body.authorAvatar !== undefined ? body.authorAvatar : existing.authorAvatar,
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
        items: {
          orderBy: {
            sortOrder: 'asc'
          }
        }
      }
    })
  })

  return {
    success: true,
    data: updated as Release
  }
})
