import { prisma } from '~/server/utils/prisma'
import type { ExportTarget } from '~/types/chronicle'

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
  const releaseUrl = `${baseUrl}/#${release.version}`

  let formattedText = ''

  if (body.target === 'GITHUB') {
    // Standard GitHub Release Markdown
    const features = release.items.filter((i) => i.category === 'FEATURE')
    const improvements = release.items.filter((i) => i.category === 'IMPROVEMENT')
    const fixes = release.items.filter((i) => i.category === 'FIX')
    const breaking = release.items.filter((i) => i.category === 'BREAKING')

    let lines: string[] = []
    lines.push(`## What's Changed in ${release.version}`)
    lines.push('')
    if (release.summary) {
      lines.push(release.summary)
      lines.push('')
    }

    if (features.length > 0) {
      lines.push('### 🚀 Features')
      features.forEach((item) => {
        const author = item.authorName ? ` by ${item.authorName}` : ''
        const pr = item.prNumber ? ` in #${item.prNumber}` : ''
        lines.push(`- ${item.description}${author}${pr}`)
      })
      lines.push('')
    }

    if (improvements.length > 0) {
      lines.push('### ⚡ Improvements')
      improvements.forEach((item) => {
        const author = item.authorName ? ` by ${item.authorName}` : ''
        const pr = item.prNumber ? ` in #${item.prNumber}` : ''
        lines.push(`- ${item.description}${author}${pr}`)
      })
      lines.push('')
    }

    if (fixes.length > 0) {
      lines.push('### 🐛 Bug Fixes')
      fixes.forEach((item) => {
        const author = item.authorName ? ` by ${item.authorName}` : ''
        const pr = item.prNumber ? ` in #${item.prNumber}` : ''
        lines.push(`- ${item.description}${author}${pr}`)
      })
      lines.push('')
    }

    if (breaking.length > 0) {
      lines.push('### ⚠️ Breaking Changes')
      breaking.forEach((item) => {
        const author = item.authorName ? ` by ${item.authorName}` : ''
        const pr = item.prNumber ? ` in #${item.prNumber}` : ''
        lines.push(`- ${item.description}${author}${pr}`)
      })
      lines.push('')
    }

    lines.push(`**Full Changelog**: ${releaseUrl}`)
    formattedText = lines.join('\n').trim()
  } else if (body.target === 'SLACK') {
    // Slack mrkdwn
    let lines: string[] = []
    lines.push(`*Release ${release.version} — ${release.title}*`)
    if (release.summary) {
      lines.push(`${release.summary}`)
    }
    lines.push('')

    const features = release.items.filter((i) => i.category === 'FEATURE')
    const improvements = release.items.filter((i) => i.category === 'IMPROVEMENT')
    const fixes = release.items.filter((i) => i.category === 'FIX')
    const breaking = release.items.filter((i) => i.category === 'BREAKING')

    if (features.length > 0) {
      lines.push('*Features:*')
      features.forEach((i) => {
        const extra = [i.authorName ? `by ${i.authorName}` : '', i.prNumber ? `#${i.prNumber}` : '']
          .filter(Boolean)
          .join(', ')
        lines.push(`• *Feature:* ${i.description}${extra ? ` (${extra})` : ''}`)
      })
      lines.push('')
    }

    if (improvements.length > 0) {
      lines.push('*Improvements:*')
      improvements.forEach((i) => {
        const extra = [i.authorName ? `by ${i.authorName}` : '', i.prNumber ? `#${i.prNumber}` : '']
          .filter(Boolean)
          .join(', ')
        lines.push(`• *Improvement:* ${i.description}${extra ? ` (${extra})` : ''}`)
      })
      lines.push('')
    }

    if (fixes.length > 0) {
      lines.push('*Bug Fixes:*')
      fixes.forEach((i) => {
        const extra = [i.authorName ? `by ${i.authorName}` : '', i.prNumber ? `#${i.prNumber}` : '']
          .filter(Boolean)
          .join(', ')
        lines.push(`• *Fix:* ${i.description}${extra ? ` (${extra})` : ''}`)
      })
      lines.push('')
    }

    if (breaking.length > 0) {
      lines.push('*Breaking Changes:*')
      breaking.forEach((i) => {
        const extra = [i.authorName ? `by ${i.authorName}` : '', i.prNumber ? `#${i.prNumber}` : '']
          .filter(Boolean)
          .join(', ')
        lines.push(`• *Breaking:* ${i.description}${extra ? ` (${extra})` : ''}`)
      })
      lines.push('')
    }

    lines.push(`🔗 *Full Release Notes:* <${releaseUrl}>`)
    formattedText = lines.join('\n').trim()
  } else if (body.target === 'HTML_EMBED') {
    // Standalone responsive HTML card snippet with inline styling
    const dateStr = release.publishedAt
      ? new Date(release.publishedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : 'Unpublished'

    const itemElements = release.items.map((i) => {
      let badgeBg = '#ecfdf5'
      let badgeColor = '#059669'
      let badgeBorder = '#a7f3d0'
      if (i.category === 'IMPROVEMENT') {
        badgeBg = '#eef2ff'
        badgeColor = '#4f46e5'
        badgeBorder = '#c7d2fe'
      } else if (i.category === 'FIX') {
        badgeBg = '#fffbeb'
        badgeColor = '#b45309'
        badgeBorder = '#fde68a'
      } else if (i.category === 'BREAKING') {
        badgeBg = '#fef2f2'
        badgeColor = '#dc2626'
        badgeBorder = '#fecdd3'
      }

      return `<li style="margin-bottom:8px;display:flex;align-items:flex-start;gap:8px;">
        <span style="display:inline-block;padding:2px 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;border-radius:4px;background-color:${badgeBg};color:${badgeColor};border:1px solid ${badgeBorder};white-space:nowrap;">${i.category}</span>
        <span style="color:#334155;font-size:14px;line-height:1.5;">${i.description}</span>
      </li>`
    }).join('\n')

    formattedText = `<!-- Chronicle Changelog Embed Card: ${release.version} -->
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e7e5e4;border-radius:8px;padding:24px;box-shadow:0 1px 3px 0 rgba(15,23,42,0.04);">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
    <div style="display:flex;align-items:center;gap:10px;">
      <span style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;font-weight:600;color:#0f172a;background:#f5f5f4;padding:4px 10px;border-radius:6px;border:1px solid #e7e5e4;">${release.version}</span>
      <h3 style="margin:0;font-size:18px;font-weight:600;color:#0f172a;">${release.title}</h3>
    </div>
    <span style="font-size:12px;color:#64748b;">${dateStr}</span>
  </div>
  <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 16px 0;">${release.summary || ''}</p>
  <ul style="list-style:none;padding:0;margin:0 0 20px 0;">
    ${itemElements}
  </ul>
  <div style="text-align:right;">
    <a href="${releaseUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#ea580c;color:#ffffff;text-decoration:none;font-size:13px;font-weight:500;padding:8px 16px;border-radius:6px;">View Full Release &rarr;</a>
  </div>
</div>`
  }

  return {
    target: body.target,
    formattedText
  }
})
