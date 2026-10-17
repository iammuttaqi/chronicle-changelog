import fs from 'node:fs'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'
import {
  isValidSemver,
  parseSemver,
  normalizeVersion,
  formatSlug,
  compareSemver,
  recommendNextVersion
} from '../server/utils/semver'
import {
  formatGitHubExport,
  formatSlackExport,
  formatHtmlEmbedExport,
  formatReleaseExport
} from '../server/utils/exporter'
import { generateRssFeed, formatRfc822Date } from '../server/utils/rss'
import { generateJsonFeed } from '../server/utils/jsonFeed'
import type { Release, ReleaseItem } from '../types/chronicle'

// --- Lightweight Test Harness ---
let totalTests = 0
let passedTests = 0
let failedTests = 0
const failureReports: string[] = []

function assert(condition: boolean, message: string) {
  totalTests++
  if (condition) {
    passedTests++
    console.log(`  \x1b[32m✔\x1b[0m ${message}`)
  } else {
    failedTests++
    const err = `  \x1b[31m✖ [FAIL]\x1b[0m ${message}`
    console.error(err)
    failureReports.push(message)
  }
}

function suite(name: string) {
  console.log(`\n\x1b[1m\x1b[34m=== [SUITE] ${name} ===\x1b[0m`)
}

async function runAllTests() {
  const startTime = Date.now()
  console.log('\x1b[1m\x1b[36m🚀 Starting Chronicle Automated Verification Suite (Standards 3.0)\x1b[0m')

  // ==========================================
  // SUITE 1: SemVer Bump & Validation Logic
  // ==========================================
  suite('1. SemVer Validation, Parsing & Recommender Engine')

  // 1.1 isValidSemver
  assert(isValidSemver('v1.0.0') === true, 'isValidSemver accepts standard "v1.0.0"')
  assert(isValidSemver('1.0.0') === true, 'isValidSemver accepts version without prefix "1.0.0"')
  assert(isValidSemver('v0.1.0-alpha.1') === true, 'isValidSemver accepts prerelease "v0.1.0-alpha.1"')
  assert(isValidSemver('v10.200.3000') === true, 'isValidSemver accepts multi-digit versions "v10.200.3000"')
  assert(isValidSemver('v1') === false, 'isValidSemver rejects incomplete version "v1"')
  assert(isValidSemver('1.0') === false, 'isValidSemver rejects partial version "1.0"')
  assert(isValidSemver('v1.0.0.0') === false, 'isValidSemver rejects 4-part version "v1.0.0.0"')
  assert(isValidSemver('release-1.0') === false, 'isValidSemver rejects non-semver string "release-1.0"')
  assert(isValidSemver('') === false, 'isValidSemver rejects empty string')

  // 1.2 parseSemver
  const parsed = parseSemver('v2.4.9-rc.2')
  assert(parsed !== null, 'parseSemver successfully parses "v2.4.9-rc.2"')
  assert(parsed?.major === 2, 'parseSemver extracts major = 2')
  assert(parsed?.minor === 4, 'parseSemver extracts minor = 4')
  assert(parsed?.patch === 9, 'parseSemver extracts patch = 9')
  assert(parsed?.prerelease === 'rc.2', 'parseSemver extracts prerelease = "rc.2"')
  assert(parseSemver('invalid') === null, 'parseSemver returns null for invalid semver string')

  // 1.3 normalizeVersion
  assert(normalizeVersion('1.5.0') === 'v1.5.0', 'normalizeVersion prepends "v" when omitted')
  assert(normalizeVersion('v1.5.0') === 'v1.5.0', 'normalizeVersion preserves existing "v" prefix')

  // 1.4 formatSlug
  assert(formatSlug('v1.2.3') === 'v1-2-3', 'formatSlug converts dots to dashes ("v1.2.3" -> "v1-2-3")')
  assert(formatSlug('2.0.0') === 'v2-0-0', 'formatSlug normalizes and converts dots to dashes ("2.0.0" -> "v2-0-0")')

  // 1.5 compareSemver
  assert(compareSemver('v2.0.0', 'v1.9.9') > 0, 'compareSemver: v2.0.0 > v1.9.9')
  assert(compareSemver('v1.2.0', 'v1.1.9') > 0, 'compareSemver: v1.2.0 > v1.1.9')
  assert(compareSemver('v1.0.1', 'v1.0.0') > 0, 'compareSemver: v1.0.1 > v1.0.0')
  assert(compareSemver('v1.0.0', '1.0.0') === 0, 'compareSemver: v1.0.0 == 1.0.0')
  assert(compareSemver('v1.0.0', 'v1.0.1') < 0, 'compareSemver: v1.0.0 < v1.0.1')

  // 1.6 recommendNextVersion
  const recMajor = recommendNextVersion('v1.2.3', ['FEATURE', 'BREAKING', 'FIX'])
  assert(recMajor.bumpType === 'MAJOR', 'recommendNextVersion chooses MAJOR bump when BREAKING item present')
  assert(recMajor.nextVersion === 'v2.0.0', 'recommendNextVersion calculates v2.0.0 for MAJOR bump from v1.2.3')

  const recMinor = recommendNextVersion('v1.2.3', ['FEATURE', 'IMPROVEMENT', 'FIX'])
  assert(recMinor.bumpType === 'MINOR', 'recommendNextVersion chooses MINOR bump when FEATURE item present (no BREAKING)')
  assert(recMinor.nextVersion === 'v1.3.0', 'recommendNextVersion calculates v1.3.0 for MINOR bump from v1.2.3')

  const recPatch = recommendNextVersion('v1.2.3', ['IMPROVEMENT', 'FIX'])
  assert(recPatch.bumpType === 'PATCH', 'recommendNextVersion chooses PATCH bump when only FIX/IMPROVEMENT present')
  assert(recPatch.nextVersion === 'v1.2.4', 'recommendNextVersion calculates v1.2.4 for PATCH bump from v1.2.3')

  // ==========================================
  // SUITE 2: Multi-Exporter Transformations
  // ==========================================
  suite('2. Multi-Exporter Transformations (GitHub, Slack mrkdwn, HTML embed)')

  const sampleRelease: Release = {
    id: 'test-release-export-1',
    version: 'v1.5.0',
    slug: 'v1-5-0',
    title: 'Audit Logging & Webhook Syndication',
    summary: 'Introducing enterprise audit logs and real-time webhook events.',
    contentMarkdown: '### Deep Dive\nFull details on the webhook architecture.',
    status: 'PUBLISHED',
    semverType: 'MINOR',
    publishedAt: new Date('2026-10-15T10:00:00Z'),
    scheduledFor: null,
    authorName: 'Chronicle Team',
    authorAvatar: null,
    createdAt: new Date('2026-10-15T09:00:00Z'),
    updatedAt: new Date('2026-10-15T10:00:00Z'),
    items: [
      {
        id: 'item-1',
        releaseId: 'test-release-export-1',
        category: 'FEATURE',
        description: 'Webhook syndication engine with HMAC signing',
        prNumber: 101,
        authorName: '@sarah',
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item-2',
        releaseId: 'test-release-export-1',
        category: 'IMPROVEMENT',
        description: 'Optimized full-text changelog indexing in SQLite',
        prNumber: 102,
        authorName: '@david',
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item-3',
        releaseId: 'test-release-export-1',
        category: 'FIX',
        description: 'Fixed timestamp UTC serialization on Safari',
        prNumber: 103,
        authorName: null,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item-4',
        releaseId: 'test-release-export-1',
        category: 'BREAKING',
        description: 'Deprecated legacy XML feed query parameter',
        prNumber: 104,
        authorName: '@sarah',
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }

  const baseUrl = 'https://changelog.chronicle.dev'
  const releaseUrl = `${baseUrl}/#${sampleRelease.version}`

  // 2.1 GitHub Markdown Exporter
  const ghOutput = formatGitHubExport(sampleRelease, releaseUrl)
  assert(ghOutput.includes("## What's Changed in v1.5.0"), 'GitHub export contains standard header "## What\'s Changed in v1.5.0"')
  assert(ghOutput.includes(sampleRelease.summary), 'GitHub export includes release summary')
  assert(ghOutput.includes('### 🚀 Features'), 'GitHub export includes "### 🚀 Features" category header')
  assert(ghOutput.includes('- Webhook syndication engine with HMAC signing by @sarah in #101'), 'GitHub export formats feature item with author and PR link')
  assert(ghOutput.includes('### ⚡ Improvements'), 'GitHub export includes "### ⚡ Improvements" category header')
  assert(ghOutput.includes('### 🐛 Bug Fixes'), 'GitHub export includes "### 🐛 Bug Fixes" category header')
  assert(ghOutput.includes('### ⚠️ Breaking Changes'), 'GitHub export includes "### ⚠️ Breaking Changes" category header')
  assert(ghOutput.includes(`**Full Changelog**: ${releaseUrl}`), 'GitHub export includes full changelog link footer')

  // 2.2 Slack mrkdwn Exporter
  const slackOutput = formatSlackExport(sampleRelease, releaseUrl)
  assert(slackOutput.includes('*Release v1.5.0 — Audit Logging & Webhook Syndication*'), 'Slack export has bold release title header')
  assert(slackOutput.includes('*Features:*'), 'Slack export includes "*Features:*" section')
  assert(slackOutput.includes('• *Feature:* Webhook syndication engine with HMAC signing (by @sarah, #101)'), 'Slack export formats bullet with author attribution and PR number')
  assert(slackOutput.includes('*Improvements:*'), 'Slack export includes "*Improvements:*" section')
  assert(slackOutput.includes('*Bug Fixes:*'), 'Slack export includes "*Bug Fixes:*" section')
  assert(slackOutput.includes('*Breaking Changes:*'), 'Slack export includes "*Breaking Changes:*" section')
  assert(slackOutput.includes(`🔗 *Full Release Notes:* <${releaseUrl}>`), 'Slack export has correct link syntax <URL>')

  // 2.3 HTML Embed Exporter
  const htmlOutput = formatHtmlEmbedExport(sampleRelease, releaseUrl)
  assert(htmlOutput.includes('<!-- Chronicle Changelog Embed Card: v1.5.0 -->'), 'HTML embed includes standard identifier comment')
  assert(htmlOutput.includes('font-family:-apple-system,BlinkMacSystemFont'), 'HTML embed includes robust inline styling')
  assert(htmlOutput.includes('background-color:#ecfdf5;color:#059669;border:1px solid #a7f3d0;'), 'HTML embed renders green badge styling for FEATURE')
  assert(htmlOutput.includes('background-color:#fef2f2;color:#dc2626;border:1px solid #fecdd3;'), 'HTML embed renders red badge styling for BREAKING')
  assert(htmlOutput.includes('View Full Release &rarr;'), 'HTML embed includes call-to-action link')

  // 2.4 Delegator formatReleaseExport
  assert(formatReleaseExport(sampleRelease, 'GITHUB', baseUrl) === ghOutput, 'formatReleaseExport handles GITHUB target')
  assert(formatReleaseExport(sampleRelease, 'SLACK', baseUrl) === slackOutput, 'formatReleaseExport handles SLACK target')
  assert(formatReleaseExport(sampleRelease, 'HTML_EMBED', baseUrl) === htmlOutput, 'formatReleaseExport handles HTML_EMBED target')

  // ==========================================
  // SUITE 3: Syndication Feeds (RSS 2.0 & JSON Feed v1.1)
  // ==========================================
  suite('3. Syndication Feeds (RSS 2.0 XML & JSON Feed v1.1)')

  // 3.1 RSS 2.0 XML
  const rssOutput = generateRssFeed({
    title: 'Chronicle Feed',
    link: 'https://changelog.chronicle.dev',
    description: 'Changelog updates',
    feedUrl: 'https://changelog.chronicle.dev/api/feed.xml',
    releases: [sampleRelease]
  })
  assert(rssOutput.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'RSS feed starts with valid XML declaration')
  assert(rssOutput.includes('<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">'), 'RSS feed contains correct rss 2.0 and namespace definitions')
  assert(rssOutput.includes('<channel>'), 'RSS feed includes <channel> wrapper')
  assert(rssOutput.includes('<title>Chronicle Feed</title>'), 'RSS channel includes title')
  assert(rssOutput.includes('<atom:link href="https://changelog.chronicle.dev/api/feed.xml" rel="self" type="application/rss+xml" />'), 'RSS channel includes atom:link self pointer')
  assert(rssOutput.includes('<item>'), 'RSS channel contains <item> elements')
  assert(rssOutput.includes('<title>v1.5.0 — Audit Logging &amp; Webhook Syndication</title>'), 'RSS item escapes ampersands in title')
  assert(rssOutput.includes('<guid isPermaLink="true">https://changelog.chronicle.dev/release/v1-5-0</guid>'), 'RSS item contains valid permalink guid')
  assert(rssOutput.includes('<content:encoded><![CDATA['), 'RSS item includes rich content:encoded with CDATA')
  assert(rssOutput.includes('<strong>[FEATURE]</strong> Webhook syndication engine with HMAC signing by @sarah (#101)'), 'RSS rich body formats structured release item list')

  // 3.2 JSON Feed v1.1
  const jsonFeed = generateJsonFeed({
    title: 'Chronicle JSON Feed',
    homePageUrl: 'https://changelog.chronicle.dev',
    feedUrl: 'https://changelog.chronicle.dev/api/feed.json',
    description: 'JSON Changelog feed',
    releases: [sampleRelease]
  })
  assert(jsonFeed.version === 'https://jsonfeed.org/version/1.1', 'JSON Feed conforms to version 1.1 spec')
  assert(jsonFeed.title === 'Chronicle JSON Feed', 'JSON Feed has correct title')
  assert(jsonFeed.home_page_url === 'https://changelog.chronicle.dev', 'JSON Feed has correct home_page_url')
  assert(jsonFeed.feed_url === 'https://changelog.chronicle.dev/api/feed.json', 'JSON Feed has correct feed_url')
  assert(Array.isArray(jsonFeed.items) && jsonFeed.items.length === 1, 'JSON Feed contains exactly 1 item')

  const feedItem = jsonFeed.items[0]
  assert(feedItem.id === 'https://changelog.chronicle.dev/release/v1-5-0', 'JSON Feed item has correct permalink id')
  assert(feedItem.title === 'v1.5.0 — Audit Logging & Webhook Syndication', 'JSON Feed item has correct title')
  assert(feedItem.summary === sampleRelease.summary, 'JSON Feed item includes summary')
  assert(feedItem.date_published === '2026-10-15T10:00:00.000Z', 'JSON Feed item date_published is valid ISO 8601 string')
  assert(feedItem.authors[0].name === 'Chronicle Team', 'JSON Feed item author attribution is correct')
  assert(feedItem.tags.includes('FEATURE') && feedItem.tags.includes('BREAKING'), 'JSON Feed item extracts tags from categories')

  // ==========================================
  // SUITE 4: Releases CRUD & Cascade Item Relationships
  // ==========================================
  suite('4. Database Releases CRUD & Cascade Relationships')

  const devDbPath = path.resolve(process.cwd(), 'prisma', 'dev.db')
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: `file:${devDbPath}`
      }
    }
  })

  const testVersion = 'v99.1.0'
  const testSlug = 'v99-1-0'

  // Clean up any stale test release before starting
  await prisma.release.deleteMany({
    where: {
      OR: [
        { version: testVersion },
        { slug: testSlug }
      ]
    }
  })

  // 4.1 Create Release with items
  const createdRelease = await prisma.release.create({
    data: {
      version: testVersion,
      slug: testSlug,
      title: 'Automated Test Release',
      summary: 'Testing CRUD operations and cascading deletion.',
      contentMarkdown: '## Test Content\nAutomated suite execution verification.',
      status: 'PUBLISHED',
      semverType: 'MINOR',
      publishedAt: new Date(),
      authorName: 'QA Engine',
      items: {
        create: [
          {
            category: 'FEATURE',
            description: 'Automated verification test runner',
            prNumber: 991,
            authorName: '@qa-bot',
            sortOrder: 0
          },
          {
            category: 'FIX',
            description: 'Resolved race condition in test assertion harness',
            prNumber: 992,
            authorName: '@qa-bot',
            sortOrder: 1
          }
        ]
      }
    },
    include: {
      items: true
    }
  })

  assert(createdRelease.id !== undefined && createdRelease.id.length > 0, 'Release created with valid cuid')
  assert(createdRelease.version === testVersion, 'Created release preserves exact normalized version')
  assert(createdRelease.items.length === 2, 'Created release has 2 nested ReleaseItem records')

  const releaseId = createdRelease.id

  // 4.2 Read Release & verify relationships
  const fetchedRelease = await prisma.release.findUnique({
    where: { id: releaseId },
    include: { items: { orderBy: { sortOrder: 'asc' } } }
  })
  assert(fetchedRelease !== null, 'Release successfully retrieved by ID')
  assert(fetchedRelease?.slug === testSlug, 'Retrieved release slug matches')
  assert(fetchedRelease?.items[0].category === 'FEATURE', 'First item category is FEATURE')
  assert(fetchedRelease?.items[1].category === 'FIX', 'Second item category is FIX')
  assert(fetchedRelease?.items[0].prNumber === 991, 'Item PR number preserved correctly')

  // 4.3 Update Release & items
  const updatedRelease = await prisma.release.update({
    where: { id: releaseId },
    data: {
      title: 'Updated Test Release Title',
      summary: 'Updated summary after editorial review.'
    }
  })
  assert(updatedRelease.title === 'Updated Test Release Title', 'Release title successfully updated')
  assert(updatedRelease.summary === 'Updated summary after editorial review.', 'Release summary successfully updated')

  // 4.4 Cascade Item Deletion Verification
  // Check items exist before deletion
  const itemsBeforeDelete = await prisma.releaseItem.findMany({
    where: { releaseId }
  })
  assert(itemsBeforeDelete.length === 2, 'Verified 2 child items exist prior to cascade deletion')

  // Delete parent release
  await prisma.release.delete({
    where: { id: releaseId }
  })

  // Verify parent is deleted
  const deletedReleaseCheck = await prisma.release.findUnique({
    where: { id: releaseId }
  })
  assert(deletedReleaseCheck === null, 'Parent release record successfully deleted')

  // Verify child items are automatically cascade-deleted
  const itemsAfterDelete = await prisma.releaseItem.findMany({
    where: { releaseId }
  })
  assert(itemsAfterDelete.length === 0, 'All child ReleaseItem records were cascade-deleted from database (cascade integrity verified)')

  await prisma.$disconnect()

  // ==========================================
  // SUITE 5: Database Integrity & Serverless Cold-Start Readiness
  // ==========================================
  suite('5. Database Integrity & Serverless Cold-Start Readiness')

  const prismaStarterPath = path.resolve(process.cwd(), 'prisma', 'starter.db')
  const publicStarterPath = path.resolve(process.cwd(), 'public', 'starter.db')

  assert(fs.existsSync(prismaStarterPath), 'prisma/starter.db exists on disk')
  assert(fs.statSync(prismaStarterPath).size > 0, `prisma/starter.db is populated (${fs.statSync(prismaStarterPath).size} bytes)`)

  assert(fs.existsSync(publicStarterPath), 'public/starter.db exists on disk')
  assert(fs.statSync(publicStarterPath).size > 0, `public/starter.db is populated (${fs.statSync(publicStarterPath).size} bytes)`)

  // Query releases inside prisma/starter.db directly
  const starterPrisma = new PrismaClient({
    datasources: {
      db: { url: `file:${prismaStarterPath}` }
    }
  })
  const starterReleases = await starterPrisma.release.findMany({
    include: { items: true }
  })
  assert(starterReleases.length >= 4, `starter.db contains ${starterReleases.length} pre-seeded releases (>= 4 required)`)
  const hasPublished = starterReleases.some((r) => r.status === 'PUBLISHED')
  assert(hasPublished, 'starter.db contains published releases ready for public timeline')
  await starterPrisma.$disconnect()

  // Cold Start Simulation with VERCEL=1
  const tmpDbPath = '/tmp/chronicle.db'
  if (fs.existsSync(tmpDbPath)) {
    fs.unlinkSync(tmpDbPath)
  }

  process.env.VERCEL = '1'
  delete process.env.DATABASE_URL
  // Re-import getPrismaClient to trigger cold start logic
  const { getPrismaClient } = await import('../server/utils/prisma')
  const coldPrisma = getPrismaClient()
  const coldReleases = await coldPrisma.release.findMany()

  assert(fs.existsSync(tmpDbPath), 'Simulated serverless cold start: /tmp/chronicle.db created')
  assert(fs.statSync(tmpDbPath).size > 0, `Simulated serverless cold start: /tmp/chronicle.db hydrated (${fs.statSync(tmpDbPath).size} bytes)`)
  assert(coldReleases.length >= 4, `Simulated serverless cold start: successfully queried ${coldReleases.length} releases from /tmp/chronicle.db`)
  await coldPrisma.$disconnect()

  // ==========================================
  // SUITE 6: Anti-AI Slop Heuristic Audit & Accessibility
  // ==========================================
  suite('6. Anti-AI Slop Heuristic Audit & Motion Accessibility')

  function walkFiles(dir: string, ext: string): string[] {
    let results: string[] = []
    const list = fs.readdirSync(dir)
    for (const file of list) {
      const full = path.join(dir, file)
      const stat = fs.statSync(full)
      if (stat.isDirectory()) {
        if (!full.includes('node_modules') && !full.includes('.nuxt') && !full.includes('.output') && !full.includes('.git')) {
          results = results.concat(walkFiles(full, ext))
        }
      } else if (file.endsWith(ext)) {
        results.push(full)
      }
    }
    return results
  }

  const vueFiles = walkFiles('.', '.vue')
  assert(vueFiles.length >= 20, `Found ${vueFiles.length} Vue components/pages to scan`)

  // Emoji regex
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1FA70}-\u{1FAFF}]/u

  let emojiViolations: { file: string; line: number; text: string }[] = []
  for (const f of vueFiles) {
    const lines = fs.readFileSync(f, 'utf8').split('\n')
    lines.forEach((line, idx) => {
      if (emojiRegex.test(line)) {
        emojiViolations.push({ file: f, line: idx + 1, text: line.trim() })
      }
    })
  }
  assert(emojiViolations.length === 0, `Anti-AI Slop: ZERO emojis found in .vue files (${emojiViolations.length} violations)`)

  // Marketing Buzzwords
  const buzzwords = [
    'seamless', 'effortless', 'game-changing', 'revolutionary', 'supercharge',
    'unleash', 'elevate', 'delve', 'tapestry', 'dive into', 'power of', 'cutting-edge',
    'world-class', 'next-level', 'unlock', 'synergy', 'paradigm shift', 'disrupt'
  ]
  let buzzwordViolations: { file: string; line: number; word: string }[] = []
  for (const f of vueFiles) {
    const lines = fs.readFileSync(f, 'utf8').split('\n')
    lines.forEach((line, idx) => {
      for (const bw of buzzwords) {
        const regex = new RegExp(`\\b${bw}\\b`, 'i')
        if (regex.test(line)) {
          buzzwordViolations.push({ file: f, line: idx + 1, word: bw })
        }
      }
    })
  }
  assert(buzzwordViolations.length === 0, `Anti-AI Slop: ZERO generic marketing buzzwords in UI copy (${buzzwordViolations.length} violations)`)

  // Lucide Icons Verification
  const filesUsingIcons = vueFiles.filter((f) => {
    const content = fs.readFileSync(f, 'utf8')
    return content.includes('lucide-vue-next')
  })
  assert(filesUsingIcons.length >= 15, `Semantic Icons: ${filesUsingIcons.length} Vue components import semantic SVG icons from lucide-vue-next`)

  // Motion Accessibility (prefers-reduced-motion)
  const cssPath = path.resolve(process.cwd(), 'assets', 'css', 'main.css')
  assert(fs.existsSync(cssPath), 'assets/css/main.css exists')
  const cssContent = fs.readFileSync(cssPath, 'utf8')
  assert(cssContent.includes('@media (prefers-reduced-motion: reduce)'), 'CSS contains @media (prefers-reduced-motion: reduce) safeguard')
  assert(cssContent.includes('animation-duration: 0.01ms !important'), 'CSS sets instant animation duration for reduced motion preference')
  assert(cssContent.includes('transition-duration: 0.01ms !important'), 'CSS sets instant transition duration for reduced motion preference')

  // ==========================================
  // Summary & Exit
  // ==========================================
  const duration = Date.now() - startTime
  console.log('\n============================================================')
  console.log(`\x1b[1mVERIFICATION SUMMARY: ${passedTests}/${totalTests} tests passed in ${duration}ms\x1b[0m`)
  if (failedTests > 0) {
    console.error(`\x1b[31m${failedTests} tests failed!\x1b[0m`)
    failureReports.forEach((report, i) => {
      console.error(`  ${i + 1}. ${report}`)
    })
    process.exit(1)
  } else {
    console.log('\x1b[32m✔ All verification checks passed cleanly with 0 failures.\x1b[0m')
    console.log('============================================================\n')
    process.exit(0)
  }
}

runAllTests().catch((err) => {
  console.error('Unhandled verification error:', err)
  process.exit(1)
})
