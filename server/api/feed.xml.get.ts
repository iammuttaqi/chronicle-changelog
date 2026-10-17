import { prisma } from '~/server/utils/prisma'
import { generateRssFeed } from '~/server/utils/rss'
import type { Release } from '~/types/chronicle'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
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

  const xml = generateRssFeed({
    title: settings?.feedTitle || 'Chronicle Changelog',
    link: projectUrl,
    description: settings?.feedDesc || 'Latest releases and platform improvements.',
    feedUrl: `${projectUrl}/api/feed.xml`,
    releases: releases as Release[]
  })

  return xml
})
