import type { Release } from '~/types/chronicle'
import { renderMarkdown, sanitizeHtml } from './markdown'

export interface JsonFeedOptions {
  title: string
  homePageUrl: string
  feedUrl: string
  description: string
  releases: Release[]
}

export function generateJsonFeed(options: JsonFeedOptions) {
  const {
    title,
    homePageUrl,
    feedUrl,
    description,
    releases
  } = options

  const items = releases.map((rel) => {
    let itemsHtml = ''
    if (rel.items && rel.items.length > 0) {
      itemsHtml += '<h3>What Changed</h3><ul>'
      for (const item of rel.items) {
        const pr = item.prNumber ? ` (#${item.prNumber})` : ''
        const author = item.authorName ? ` by ${item.authorName}` : ''
        itemsHtml += `<li><strong>[${item.category}]</strong> ${item.description}${author}${pr}</li>`
      }
      itemsHtml += '</ul>'
    }

    const bodyHtml = renderMarkdown(rel.contentMarkdown || '')
    const fullHtml = sanitizeHtml(`${itemsHtml}${bodyHtml}`)

    const tags = Array.from(new Set(rel.items.map((i) => i.category)))
    const publishedIso = rel.publishedAt
      ? new Date(rel.publishedAt).toISOString()
      : new Date().toISOString()

    return {
      id: `${homePageUrl}/release/${rel.slug}`,
      url: `${homePageUrl}/#${rel.version}`,
      title: `${rel.version} — ${rel.title}`,
      summary: rel.summary || '',
      content_html: fullHtml,
      date_published: publishedIso,
      authors: [
        {
          name: rel.authorName || 'Core Engineering'
        }
      ],
      tags
    }
  })

  return {
    version: 'https://jsonfeed.org/version/1.1',
    title,
    home_page_url: homePageUrl,
    feed_url: feedUrl,
    description,
    items
  }
}
