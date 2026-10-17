import { prisma } from '~/server/utils/prisma'
import type { Release } from '~/types/chronicle'

export default defineEventHandler(async (event) => {
  const idOrSlug = event.context.params?.id

  if (!idOrSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing release identifier.'
    })
  }

  const release = await prisma.release.findFirst({
    where: {
      OR: [
        { id: idOrSlug },
        { slug: idOrSlug },
        { version: idOrSlug }
      ]
    },
    include: {
      items: {
        orderBy: {
          sortOrder: 'asc'
        }
      }
    }
  })

  if (!release) {
    throw createError({
      statusCode: 404,
      statusMessage: `Release "${idOrSlug}" not found.`
    })
  }

  return {
    success: true,
    data: release as Release
  }
})
