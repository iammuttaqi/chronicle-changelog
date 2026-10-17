import type { Release } from '~/types/chronicle'
import { renderMarkdown, sanitizeHtml } from './markdown'

function escapeXml(unsafe: string): string {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function escapeCdata(content: string): string {
  if (!content) return ''
  return content.replace(/\]\]>/g, ']]]]><![CDATA[>')
}

export function formatRfc822Date(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return new Date().toUTCString()
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  return date.toUTCString()
}

export interface RssChannelOptions {
  title: string
  link: string
  description: string
  language?: string
  feedUrl: string
  releases: Release[]
}

export function generateRssFeed(options: RssChannelOptions): string {
  const {
    title,
    link,
    description,
    language = 'en',
    feedUrl,
    releases
  } = options

  const lastBuildDate = releases.length > 0 && releases[0].publishedAt
    ? formatRfc822Date(releases[0].publishedAt)
    : new Date().toUTCString()

  const itemsXml = releases.map((rel) => {
    const itemTitle = `${rel.version} — ${rel.title}`
    const itemLink = `${link}/#${rel.version}`
    const itemGuid = `${link}/release/${rel.slug}`
    const pubDate = formatRfc822Date(rel.publishedAt)

    // Build rich HTML body with change items list followed by markdown content
    let itemsHtml = ''
    if (rel.items && rel.items.length > 0) {
      itemsHtml += '<h3>What Changed</h3><ul>'
      for (const item of rel.items) {
        const pr = item.prNumber ? ` (#${item.prNumber})` : ''
        const author = item.authorName ? ` by ${escapeXml(item.authorName)}` : ''
        itemsHtml += `<li><strong>[${escapeXml(item.category)}]</strong> ${escapeXml(item.description)}${author}${pr}</li>`
      }
      itemsHtml += '</ul>'
    }

    const bodyHtml = renderMarkdown(rel.contentMarkdown || '')
    const fullHtml = sanitizeHtml(`${itemsHtml}${bodyHtml}`)

    return `    <item>
      <title>${escapeXml(itemTitle)}</title>
      <link>${escapeXml(itemLink)}</link>
      <guid isPermaLink="true">${escapeXml(itemGuid)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${escapeCdata(rel.summary || '')}]]></description>
      <content:encoded><![CDATA[${escapeCdata(fullHtml)}]]></content:encoded>
    </item>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(link)}</link>
    <description>${escapeXml(description)}</description>
    <language>${escapeXml(language)}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`
}
