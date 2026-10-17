import { prisma } from '~/server/utils/prisma'
import { generateJsonFeed } from '~/server/utils/jsonFeed'
import type { Release } from '~/types/chronicle'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Content-Type', 'application/feed+json; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')

  // Fetch project settings
  const settings = await prisma.projectSettings.findFirst()

  // Fetch all published releases ordered reverse-chronologically
  const releases = await prisma.release.findMany({
    where: {
      status: 'PUBLISHED'
    },
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

  // Detect origin from request headers if available
  const reqHost = getRequestHeader(event, 'host') || 'localhost:3000'
  const protocol = getRequestHeader(event, 'x-forwarded-proto') || 'http'
  const defaultBaseUrl = `${protocol}://${reqHost}`

  const projectUrl = settings?.projectUrl && settings.projectUrl !== 'https://chronicle.local'
    ? settings.projectUrl
    : defaultBaseUrl

  const feed = generateJsonFeed({
    title: settings?.feedTitle || 'Chronicle Changelog',
    homePageUrl: projectUrl,
    feedUrl: `${projectUrl}/api/feed.json`,
    description: settings?.feedDesc || 'Latest releases and platform improvements.',
    releases: releases as Release[]
  })

  return feed
})
