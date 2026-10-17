import { prisma } from '~/server/utils/prisma'
import { formatReleaseExport } from '~/server/utils/exporter'
import type { ExportTarget, Release } from '~/types/chronicle'

interface ExportRequestBody {
  releaseId: string
  target: ExportTarget
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ExportRequestBody>(event)

  if (!body || !body.releaseId || !body.target) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing releaseId or export target.'
    })
  }

  const release = await prisma.release.findFirst({
    where: {
      OR: [
        { id: body.releaseId },
        { version: body.releaseId },
        { slug: body.releaseId }
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
      statusMessage: 'Release not found.'
    })
  }

  const reqHost = getRequestHeader(event, 'host') || 'localhost:3000'
  const protocol = getRequestHeader(event, 'x-forwarded-proto') || 'http'
  const baseUrl = `${protocol}://${reqHost}`

  const formattedText = formatReleaseExport(release as Release, body.target, baseUrl)

  return {
    target: body.target,
    formattedText
  }
})
