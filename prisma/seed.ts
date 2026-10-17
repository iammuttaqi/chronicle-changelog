import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('[Seed] Starting database population...')

  // Clear existing records to ensure idempotent seed runs
  await prisma.releaseItem.deleteMany({})
  await prisma.release.deleteMany({})
  await prisma.subscriber.deleteMany({})
  await prisma.projectSettings.deleteMany({})

  // Seed Project Settings
  await prisma.projectSettings.create({
    data: {
      id: 'default',
      projectName: 'Chronicle Studio',
      projectTagline: 'Editorial release notes and developer syndication feed.',
      projectUrl: 'https://chronicle.local',
      feedTitle: 'Chronicle Changelog',
      feedDesc: 'Latest releases, feature additions, performance tuning, and breaking changes.'
    }
  })

  // Seed Releases
  // Release 1: v1.2.1 (Patch)
  await prisma.release.create({
    data: {
      version: 'v1.2.1',
      title: 'Feed Performance & Security Hardening',
      slug: 'v1-2-1',
      summary: 'Sub-millisecond RSS 2.0 streaming, memory leak patch in the Markdown cache, and strict CSP headers.',
      contentMarkdown: `## Overview
This patch release addresses edge-case memory accumulation during high-frequency feed scraping, implements RFC 822 date caching, and hardens HTML embed sanitizer boundaries.

### Highlights
- **Feed Rendering**: Generated feeds now stream with sub-millisecond response latency.
- **Sanitizer Isolation**: DOMPurify rules updated to strictly strip executable iframe protocols in standalone HTML cards.
- **Memory Footprint**: Resolved a leak in the syntax highlighter regex compilation pass.`,
      status: 'PUBLISHED',
      semverType: 'PATCH',
      publishedAt: new Date('2026-10-16T14:30:00.000Z'),
      authorName: 'Core Engineering',
      authorAvatar: null,
      items: {
        create: [
          {
            category: 'FIX',
            description: 'Resolve memory leak in client Markdown syntax highlighter cache',
            prNumber: 158,
            authorName: '@sarah',
            sortOrder: 0
          },
          {
            category: 'IMPROVEMENT',
            description: 'Cache RFC 822 pubDate string conversions to accelerate RSS feed generation',
            prNumber: 159,
            authorName: '@muttaqi',
            sortOrder: 1
          },
          {
            category: 'FIX',
            description: 'Sanitize deeply nested script tags in raw HTML embed mode',
            prNumber: 161,
            authorName: '@alex',
            sortOrder: 2
          }
        ]
      }
    }
  })

  // Release 2: v1.2.0 (Minor)
  await prisma.release.create({
    data: {
      version: 'v1.2.0',
      title: 'Editorial Studio & Multi-Format Exporter',
      slug: 'v1-2-0',
      summary: 'Split-screen authoring studio with real-time Markdown preview, SemVer bump recommendation engine, and Slack mrkdwn copy exporter.',
      contentMarkdown: `## Introducing Changelog Studio
Chronicle now includes a full editorial authoring environment crafted specifically for software release communication.

### Real-Time Split Studio
The authoring interface gives release managers an instant, side-by-side view of their raw Markdown and its compiled HTML representation. Typography tokens render identically to the public feed.

### SemVer Recommendation Engine
By inspecting your categorized change items, Chronicle calculates the required Semantic Versioning increment:
- Any **BREAKING** change prompts a **Major** version bump.
- Any **FEATURE** change without breaking items prompts a **Minor** version bump.
- Exclusively **FIX** or **IMPROVEMENT** items suggest a **Patch** version bump.

### Multi-Platform Exporter Suite
Distribute your announcements everywhere with 1 click:
- **GitHub Releases**: Clean markdown formatted with categorical headings.
- **Slack mrkdwn**: Tailored bold headings, bullet points, and web permalink links.
- **HTML Embed Card**: Standalone, responsive HTML and inline CSS card ready for any site.`,
      status: 'PUBLISHED',
      semverType: 'MINOR',
      publishedAt: new Date('2026-10-10T11:00:00.000Z'),
      authorName: 'Core Engineering',
      authorAvatar: null,
      items: {
        create: [
          {
            category: 'FEATURE',
            description: 'Live split-screen Markdown authoring studio with zero-lag preview',
            prNumber: 145,
            authorName: '@sarah',
            sortOrder: 0
          },
          {
            category: 'FEATURE',
            description: 'Automatic SemVer bump recommendation based on tagged change items',
            prNumber: 147,
            authorName: '@muttaqi',
            sortOrder: 1
          },
          {
            category: 'FEATURE',
            description: '1-Click multi-exporter for GitHub Releases, Slack mrkdwn, and HTML embed card',
            prNumber: 149,
            authorName: '@muttaqi',
            sortOrder: 2
          },
          {
            category: 'IMPROVEMENT',
            description: 'Sub-50ms fuzzy timeline filter latency on 100+ releases',
            prNumber: 151,
            authorName: '@alex',
            sortOrder: 3
          }
        ]
      }
    }
  })

  // Release 3: v1.1.0 (Minor with Breaking Change)
  await prisma.release.create({
    data: {
      version: 'v1.1.0',
      title: 'Syndication Protocol & REST API v1',
      slug: 'v1-1-0',
      summary: 'Native RSS 2.0 and JSON Feed v1.1 syndication endpoints, plus structured public REST API.',
      contentMarkdown: `## Syndication Protocols for Developer Workflows
Chronicle now natively exposes machine-readable feeds so engineering teams can integrate releases into automation pipelines, feed aggregators, and webhook listeners.

> **Breaking Change Notice**: Feed endpoints previously located at legacy \`/rss\` have moved to the standardized \`/api/feed.xml\` and \`/api/feed.json\` endpoints.

### Feed Standard Adherence
- **RSS 2.0**: Adheres strictly to the RSS 2.0 specification with XML CDATA HTML blocks, valid RFC 822 timestamps, and GUID permalinks.
- **JSON Feed v1.1**: Implements the open JSON Feed v1.1 specification with metadata tags for automated webhook ingestion.`,
      status: 'PUBLISHED',
      semverType: 'MINOR',
      publishedAt: new Date('2026-09-28T09:15:00.000Z'),
      authorName: 'Core Engineering',
      authorAvatar: null,
      items: {
        create: [
          {
            category: 'BREAKING',
            description: 'Syndication feed paths migrated from /rss to /api/feed.xml and /api/feed.json',
            prNumber: 120,
            authorName: '@muttaqi',
            sortOrder: 0
          },
          {
            category: 'FEATURE',
            description: 'RSS 2.0 XML endpoint with CDATA HTML content and RFC 822 dates',
            prNumber: 122,
            authorName: '@alex',
            sortOrder: 1
          },
          {
            category: 'FEATURE',
            description: 'JSON Feed v1.1 endpoint with categorized change tag metadata',
            prNumber: 124,
            authorName: '@sarah',
            sortOrder: 2
          },
          {
            category: 'IMPROVEMENT',
            description: 'Added autodiscovery link tags in document head for feed readers',
            prNumber: 127,
            authorName: '@alex',
            sortOrder: 3
          }
        ]
      }
    }
  })

  // Release 4: v1.0.0 (Major)
  await prisma.release.create({
    data: {
      version: 'v1.0.0',
      title: 'Chronicle Changelog Studio Inaugural Launch',
      slug: 'v1-0-0',
      summary: 'The foundational release of Chronicle: Warm paper typography, zero-emoji Lucide design system, and SQLite cold-start replication.',
      contentMarkdown: `## Welcome to Chronicle
We built Chronicle because release notes are not administrative chores; they are the editorial narrative of software momentum.

### Core Capabilities
- **Warm Editorial Canvas**: Crafted with tactile stone tokens (#fafaf9), deep slate typography (#0f172a), and subtle hairline borders.
- **Strict Zero-Emoji Policy**: Pure Lucide SVG iconography ensures crisp, unpolluted cross-platform typography.
- **Serverless SQLite Engine**: Automatic /tmp cold-start replication for zero-dependency hosting on Vercel.
- **Deep Permalinks**: Every release features direct anchor navigation and 1-click clipboard link sharing.`,
      status: 'PUBLISHED',
      semverType: 'MAJOR',
      publishedAt: new Date('2026-09-01T10:00:00.000Z'),
      authorName: 'Core Engineering',
      authorAvatar: null,
      items: {
        create: [
          {
            category: 'FEATURE',
            description: 'Reverse-chronological release stream with sticky version anchors',
            prNumber: 101,
            authorName: '@muttaqi',
            sortOrder: 0
          },
          {
            category: 'FEATURE',
            description: 'Standardized change categories: Features, Improvements, Fixes, Breaking Changes',
            prNumber: 102,
            authorName: '@sarah',
            sortOrder: 1
          },
          {
            category: 'IMPROVEMENT',
            description: 'Standards 3.0 Warm Paper and Editorial Slate color tokens',
            prNumber: 105,
            authorName: '@alex',
            sortOrder: 2
          },
          {
            category: 'FIX',
            description: 'Initial responsive mobile layout adjustments and hairline border rendering',
            prNumber: 108,
            authorName: '@muttaqi',
            sortOrder: 3
          }
        ]
      }
    }
  })

  // Seed Subscribers
  await prisma.subscriber.createMany({
    data: [
      {
        email: 'lead-architect@company.io',
        confirmed: true,
        confirmedAt: new Date('2026-09-02T12:00:00.000Z')
      },
      {
        email: 'developer-advocate@tech.org',
        confirmed: true,
        confirmedAt: new Date('2026-09-15T15:20:00.000Z')
      }
    ]
  })

  console.log('[Seed] Database successfully populated with 4 releases and initial subscribers.')
}

main()
  .catch((e) => {
    console.error('[Seed Error]', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
