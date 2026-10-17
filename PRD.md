# Product Requirements Document (PRD)
## Chronicle Changelog Studio

**Document Version:** 1.0.0  
**Status:** Approved for Implementation  
**Target Delivery:** MVP Release  
**Author:** Lead Product Manager  
**Repository Path:** `/Users/muttaqi/ai-engineering-team/projects/chronicle-changelog`

---

## 1. Executive Summary & Value Proposition

### 1.1 Executive Summary
**Chronicle Changelog Studio** is an editorial-grade, developer-first release notes authoring and syndication platform built for modern software engineering teams, library maintainers, and product organizations. Modern engineering teams ship continuously, yet communicating what changed remains deeply fragmented across commit logs, ad-hoc Slack messages, unread Notion documents, and opaque pull request summaries. Commercial changelog tools are bloated, charge exorbitant recurring fees for simple hosted static pages, or lock open syndication behind enterprise paywalls.

Chronicle provides an authoring studio tailored to engineering discipline: live split-screen Markdown authoring, strict Semantic Versioning (SemVer) guidance, categorized change tagging, 1-click external distribution (Slack, GitHub Releases, HTML embeds), and native dual-feed developer syndication (compliant RSS 2.0 XML and JSON Feed v1.1).

### 1.2 Vision & Core Thesis
*Release notes are not administrative chores; they are the editorial narrative of software momentum.* 
Chronicle bridges the gap between raw Git commits and customer-facing product storytelling, ensuring teams maintain disciplined SemVer standards while delivering transparent, accessible, and easily consumable release feeds for developers and customers alike.

### 1.3 Problem Statement
1. **Fragmented Communication Channels:** Product and engineering updates are scattered across PRs, internal wikis, Slack channels, and marketing emails. Teams lack a unified public timeline that serves both technical consumers and executive stakeholders.
2. **Ambiguous Versioning Discipline:** Teams frequently misclassify breaking changes or issue minor version bumps for patch fixes, breaking downstream consumer integrations.
3. **Bloated & Closed Commercial Vendors:** Existing hosted changelog widgets cost $40–$150/month, inject heavy third-party tracking scripts, display intrusive vendor branding, and lack native developer syndication.
4. **Neglected Developer Syndication:** Power users and developers demand standard feeds (RSS and JSON Feed) to automate webhooks, digest readers, and pipeline triggers. These are either missing or locked behind enterprise tiers in competing software.

### 1.4 Target Personas
- **Staff Engineers & Engineering Leads:** Needs disciplined versioning, breaking change warnings, and rapid export to GitHub Releases and internal Slack channels.
- **Open-Source Maintainers & Library Authors:** Demands clean Markdown authoring, zero-dependency hosting, SemVer validation, and standard RSS feeds for developer subscribers.
- **Technical Product Managers & Developer Advocates:** Needs an intuitive editorial studio to translate technical merge commits into customer value categories (Features, Improvements, Fixes).
- **Indie SaaS Founders:** Needs an elegant, high-craft public release timeline that communicates velocity without requiring expensive third-party SaaS subscriptions.

### 1.5 Unique Value Proposition & Differentiation
| Feature | Chronicle Changelog Studio | Generic SaaS Widgets (Beamer, LaunchNotes) | GitHub Releases |
| :--- | :--- | :--- | :--- |
| **Aesthetic Standard** | Standards 3.0 Warm Paper / Editorial Slate | Cluttered widgets, forced popups | Utilitarian monospaced developer UI |
| **Developer Syndication** | Built-in RSS 2.0 XML & JSON Feed v1.1 | Locked behind enterprise paywalls | Raw atom feed only (no categorized metadata) |
| **SemVer Intelligence** | Auto-validation & version bump recommendation | None (Free-text versioning only) | Tag-based (no change impact validation) |
| **1-Click Multi-Exporter** | GitHub Releases, Slack Mrkdwn, HTML Card | Limited or Zapier-dependent | GitHub only |
| **Zero Emoji Policy** | Strict Lucide SVG iconography | Emoji clutter and noisy banners | Ad-hoc user input |
| **Deployment Footprint** | Lightweight Nuxt 3 + SQLite (zero vendor lock-in) | Proprietary hosted cloud dependency | Locked to GitHub platform |

### 1.6 Key Performance Indicators (KPIs)
- **Authoring Velocity:** Average time to draft, validate SemVer, and publish a release < 3 minutes.
- **Syndication Reliability:** 100% schema validation compliance for `/api/feed.xml` (RSS 2.0) and `/api/feed.json` (JSON Feed 1.1).
- **Public Feed Engagement:** Search and category filter response latency < 50ms for timelines with 100+ releases.
- **Lighthouse Performance Score:** 98+ on Performance, Accessibility, Best Practices, and SEO.

---

## 2. User Stories & Gherkin Acceptance Criteria

### US-01: Release Drafting & Markdown Studio
**As an** Engineering Lead or Product Manager,  
**I want** a dedicated authoring studio with live split-screen Markdown preview, SemVer validation, and draft/scheduled/published state management,  
**So that** I can craft high-fidelity release announcements with zero formatting surprises and disciplined versioning.

#### Acceptance Criteria (Gherkin):
```gherkin
Feature: Release Drafting and Markdown Studio

  Scenario: Author creates a new release draft with live split preview
    Given the author navigates to the Studio route "/studio/new"
    When the author types Markdown content into the editor textarea
    Then the right-hand preview panel renders formatted HTML in real time with zero noticeable lag (<50ms)
    And standard Markdown elements (H2, H3, code blocks, lists, blockquotes, links) render according to Standards 3.0 typography tokens.

  Scenario: Strict SemVer validation and automatic next-version recommendation
    Given the latest published release in the database is "v1.4.2"
    When the author opens the release creation dialog
    And the author adds a change item with category "BREAKING"
    Then the SemVer helper displays a recommendation badge "Suggested: v2.0.0 (Major bump)"
    When the author enters an invalid version string "1.4" or "beta-v1"
    Then the version input field displays an inline validation error "Version must match Semantic Versioning (e.g., v1.5.0 or 1.5.0)"
    And the "Publish" button remains disabled until valid SemVer is provided.

  Scenario: Managing release publication lifecycle states
    Given an author has authored a release with version "v1.5.0"
    When the author clicks "Save Draft"
    Then the release is stored with status "DRAFT" and does not appear on the public timeline or in syndication feeds
    When the author selects a future timestamp and clicks "Schedule"
    Then the release is saved with status "SCHEDULED" and shows a scheduled countdown badge in the Studio list
    When the author clicks "Publish Now"
    Then the release status updates to "PUBLISHED", sets "publishedAt" to current UTC timestamp, and immediately appears at the top of the public timeline and syndication feeds.

  Scenario: Form state resilience against accidental loss
    Given an author is actively typing in the studio editor
    When the author accidentally refreshes the browser or navigates away
    Then the unsaved draft content is retrieved from local storage autosave backup upon returning to the studio.
```

---

### US-02: Standardized Change Tagging & Badges
**As a** release author,  
**I want** to classify individual changes into standardized categories (Features, Improvements, Fixes, Breaking Changes) with interactive badge previews,  
**So that** end users and API consumers can immediately assess the operational impact of each release.

#### Acceptance Criteria (Gherkin):
```gherkin
Feature: Standardized Change Tagging and Badges

  Scenario: Adding and categorizing release change items
    Given the author is in the Release Studio editor
    When the author clicks "Add Change Item"
    Then an item entry row appears with a Category dropdown, Title input, and Description text area
    When the author selects category "FEATURE"
    Then the badge displays an emerald theme with a Lucide "Sparkles" icon and label "Feature"
    When the author selects category "BREAKING"
    Then the badge displays a crimson theme with a Lucide "AlertTriangle" icon and label "Breaking Change"
    When the author selects category "IMPROVEMENT"
    Then the badge displays an indigo theme with a Lucide "Zap" icon and label "Improvement"
    When the author selects category "FIX"
    Then the badge displays an amber theme with a Lucide "Wrench" icon and label "Fix".

  Scenario: Zero emoji enforcement across badges and UI controls
    Given any rendered category badge, button, or header in the studio or public timeline
    Then the element contains strictly zero emoji characters
    And all category distinctions use Lucide SVG icons paired with high-legibility typographic labels.

  Scenario: Reordering and deleting change items
    Given a release draft has 3 categorized change items
    When the author clicks the trash icon on item 2
    Then the item is immediately removed from the list and the preview updates
    When the author drags or clicks reorder controls
    Then the sort order updates sequentially.
```

---

### US-03: Public Hosted Release Timeline
**As a** software consumer, developer, or stakeholder,  
**I want** to browse a public, chronological timeline of releases with real-time search, category filter chips, and direct permalink anchors,  
**So that** I can easily discover updates, investigate historical fixes, and link directly to specific version notes.

#### Acceptance Criteria (Gherkin):
```gherkin
Feature: Public Hosted Release Timeline

  Scenario: Browsing the chronological release stream
    Given a user visits the root changelog URL "/"
    When the page loads
    Then all published releases are displayed in reverse-chronological order
    And each release displays its SemVer badge, publication date (relative and formatted), release title, executive summary, categorized change list, and full Markdown body
    And draft or scheduled releases are strictly excluded.

  Scenario: Real-time search query filtering
    Given the public timeline contains 10 published releases
    When the user types "database" into the sticky search bar
    Then the timeline instantly filters within 50ms to display only releases whose title, summary, markdown content, or change item titles match the query
    And a count indicator displays "Showing X releases matching 'database'".

  Scenario: Category chip filtering
    Given the user is viewing the public timeline
    When the user clicks the "Breaking Changes" filter chip
    Then the active chip state highlights with high-contrast slate styling
    And the timeline filters to display only releases containing at least one "BREAKING" change item
    When the user clicks "All Releases"
    Then the filter resets and the complete release timeline is displayed.

  Scenario: Direct permalink navigation and anchor scrolling
    Given a user navigates directly to "/#v1.4.0" or clicks a release anchor icon
    When the page completes rendering
    Then the browser smoothly scrolls to the card with ID "v1.4.0"
    And the target card displays a subtle focus ring transition indicating the active anchor
    And the user's clipboard is populated with the direct shareable permalink URL.

  Scenario: Empty state when search yields no matches
    Given a user enters a query "nonexistent-query-xyz"
    When no published releases match the query
    Then an empty state card appears with a Lucide "Search" icon, message "No releases found matching your search", and a "Clear filters" action button.
```

---

### US-04: Developer Syndication Engine (RSS 2.0 & JSON Feed)
**As a** developer or automated pipeline consumer,  
**I want** standard, dynamic RSS 2.0 (`/api/feed.xml`) and JSON Feed v1.1 (`/api/feed.json`) endpoints,  
**So that** I can subscribe via feed readers (NetNewsWire, Feedly) or ingest new releases into CI/CD pipelines, Discord bots, and Slack webhooks.

#### Acceptance Criteria (Gherkin):
```gherkin
Feature: Developer Syndication Engine

  Scenario: Consuming the RSS 2.0 XML feed
    Given published releases exist in the database
    When an HTTP GET request is made to "/api/feed.xml"
    Then the response returns HTTP 200 with Content-Type "application/xml; charset=utf-8"
    And the XML structure adheres strictly to the RSS 2.0 specification with "<rss version=\"2.0\">"
    And the channel contains title, link, description, language, and valid "lastBuildDate"
    And each published release is an "<item>" element containing "<title>", "<link>", "<guid isPermaLink=\"true\">", "<pubDate>" (RFC 822 formatted), and formatted HTML inside "<content:encoded><![CDATA[ ... ]]></content:encoded>"
    And draft and scheduled releases are excluded.

  Scenario: Consuming the JSON Feed v1.1
    Given published releases exist in the database
    When an HTTP GET request is made to "/api/feed.json"
    Then the response returns HTTP 200 with Content-Type "application/feed+json; charset=utf-8"
    And the JSON structure contains "version": "https://jsonfeed.org/version/1.1", "title", "home_page_url", and "feed_url"
    And the "items" array contains objects with "id", "url", "title", "summary", "content_html", "date_published" (ISO 8601), and categorized change "tags"
    And the HTTP response includes caching headers "Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400".

  Scenario: Head tag discoverability
    Given any user loads the public layout
    Then the HTML "<head>" section includes "<link rel=\"alternate\" type=\"application/rss+xml\" title=\"RSS Feed\" href=\"/api/feed.xml\" />"
    And "<link rel=\"alternate\" type=\"application/feed+json\" title=\"JSON Feed\" href=\"/api/feed.json\" />".
```

---

### US-05: 1-Click Multi-Exporter Suite
**As an** engineering lead preparing cross-channel announcements,  
**I want** 1-click export actions for GitHub Releases, Slack Mrkdwn, and HTML embed snippets,  
**So that** I can syndicate release notes to stakeholders across multiple communication channels without manual reformatting.

#### Acceptance Criteria (Gherkin):
```gherkin
Feature: 1-Click Multi-Exporter Suite

  Scenario: Exporting to GitHub Release format
    Given an author or visitor views a release card and clicks "Export" -> "Copy for GitHub Release"
    When the clipboard action completes
    Then the clipboard contains Markdown formatted with standardized GitHub headers:
      """
      ## What's Changed in vX.Y.Z
      ### 🚀 Features
      - Feature Title: Description
      ### ⚡ Improvements
      - Improvement Title: Description
      ### 🐛 Bug Fixes
      - Fix Title: Description
      ### ⚠️ Breaking Changes
      - Breaking Title: Description
      """
    And an accessible toast notification confirms "Copied GitHub Release Markdown to clipboard".

  Scenario: Exporting to Slack mrkdwn format
    Given the user clicks "Export" -> "Copy for Slack"
    When the action executes
    Then the clipboard contains clean Slack mrkdwn with bold release title, categorized bullet points using Slack-compatible formatting (`*v1.4.0* - Title`, `• *Feature:* Description`), and a link to the full web permalink
    And zero unescaped raw HTML tags are present.

  Scenario: Exporting HTML embed card snippet
    Given the user clicks "Export" -> "Copy Embed Snippet"
    When the action executes
    Then the clipboard contains a responsive, standalone HTML/CSS card snippet ready to be pasted into third-party documentation portals or marketing sites.
```

---

## 3. Standards 3.0 Design & Quality Specifications

### 3.1 Design Philosophy: Editorial Warmth & High Craft
Chronicle Changelog Studio adheres strictly to **Standards 3.0** aesthetics:
- **First-Class Editorial Light Mode:** The interface is built around a warm, tactile stone/paper canvas that feels closer to high-end print design and modern developer documentation (e.g., Linear, Stripe, Tailwind) than sterile corporate software.
- **Deep Slate Contrast:** Primary headings and text leverage deep rich slates (`#0f172a` and `#334155`), ensuring maximum legibility, zero washed-out low-contrast gray text, and full WCAG 2.1 AAA compliance for headers.
- **Hairline Precision Borders & Micro-Shadows:** Modals, cards, and input fields utilize hairline slate borders (`#e2e8f0`) with subtle, warm paper micro-shadows (`box-shadow: 0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.02)`). Harsh pure black dropshadows are forbidden.

### 3.2 Color Token Architecture
| Token Name | Hex Code | Tailwind Equivalent | Purpose & Application |
| :--- | :--- | :--- | :--- |
| `surface-canvas` | `#fafaf9` | `bg-stone-50` | Primary app canvas background (warm stone/paper) |
| `surface-card` | `#ffffff` | `bg-white` | Elevated release cards, dialog panels, active controls |
| `surface-subtle` | `#f5f5f4` | `bg-stone-100` | Code block backgrounds, filter chips, table headers |
| `text-primary` | `#0f172a` | `text-slate-900` | High-contrast headings, active release titles, bold metrics |
| `text-body` | `#334155` | `text-slate-700` | Editorial descriptions, changelog paragraphs, body copy |
| `text-muted` | `#64748b` | `text-slate-500` | Timestamps, author metadata, secondary labels, icons |
| `border-subtle` | `#e2e8f0` | `border-slate-200` | Card borders, dividers, editor split separators |
| `border-focus` | `#0f172a` | `ring-slate-900` | Keyboard focus indicator (2px offset ring) |
| `badge-feature-text` | `#059669` | `text-emerald-700` | Features badge typography |
| `badge-feature-bg` | `#ecfdf5` | `bg-emerald-50` | Features badge background |
| `badge-feature-border` | `#a7f3d0` | `border-emerald-200` | Features badge hairline border |
| `badge-improve-text` | `#4f46e5` | `text-indigo-700` | Improvements badge typography |
| `badge-improve-bg` | `#eef2ff` | `bg-indigo-50` | Improvements badge background |
| `badge-improve-border`| `#c7d2fe` | `border-indigo-200` | Improvements badge hairline border |
| `badge-fix-text` | `#b45309` | `text-amber-700` | Fixes badge typography |
| `badge-fix-bg` | `#fffbeb` | `bg-amber-50` | Fixes badge background |
| `badge-fix-border` | `#fde68a` | `border-amber-200` | Fixes badge hairline border |
| `badge-break-text` | `#dc2626` | `text-rose-700` | Breaking Changes badge typography |
| `badge-break-bg` | `#fef2f2` | `bg-rose-50` | Breaking Changes badge background |
| `badge-break-border` | `#fecdd3` | `border-rose-200` | Breaking Changes badge hairline border |

### 3.3 Strict Iconography & Zero Emoji Rule
- **Strictly ZERO Emojis:** No emojis are permitted in buttons, badge indicators, headers, cards, or system dialogs. Emojis create uncontrolled cross-platform visual artifacts, clash with typography, and degrade professional developer credibility.
- **Lucide SVG System:** 100% of UI icons must be drawn from `lucide-vue-next` (16px or 18px stroke width 1.75):
  - Features: `Sparkles`
  - Improvements: `Zap`
  - Fixes: `Wrench`
  - Breaking Changes: `AlertTriangle`
  - Syndication: `Rss`
  - Share/Export: `Share2` or `Copy`
  - Search: `Search`
  - Calendar/Date: `Calendar`
  - Tag/Version: `Tag`
  - Filter: `Filter`
  - Studio Editor: `PenTool`, `Eye`, `Check`, `ExternalLink`, `ChevronRight`

### 3.4 Motion Graphics & Animation Specifications
- **Micro-Interactions:** Subtle interactive transforms on buttons and interactive chips: `transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1)`.
- **Badge Hover States:** Soft background luminescence and border tint enhancement on hover (`hover:border-slate-300`, `hover:shadow-sm`).
- **Timeline Staggered Entry:** Staggered opacity and subtle Y-offset reveal (`translateY(6px)` to `translateY(0)` over 220ms) for newly mounted release cards.
- **Accessibility (Reduced Motion):** All animations and transitions must wrap in `@media (prefers-reduced-motion: reduce)` to disable layout transforms and snap state changes immediately.

### 3.5 Established Component Primitives (`radix-vue`)
All interactive headless primitives must leverage `radix-vue` wrapped in bespoke styling:
- **Dialog / Modal:** `DialogRoot`, `DialogPortal`, `DialogOverlay` (backdrop-blur-sm bg-slate-900/20), `DialogContent` for the 1-Click Exporter suite and Release Settings.
- **Dropdown Menu:** `DropdownMenuRoot`, `DropdownMenuContent`, `DropdownMenuItem` for export options and release actions.
- **Toggle Group / Filter Chips:** Accessible multi-state filter controls with keyboard navigation (`ArrowLeft`, `ArrowRight`, `Space`).
- **Tooltip:** `TooltipRoot`, `TooltipContent` for instant action shortcuts (e.g., "Copy Permalink").

### 3.6 Skeletons, Empty States & Error Boundaries
- **Loading Skeletons:** Animated stone pulse skeletons (`bg-stone-200/60 animate-pulse rounded-md`) mirroring the exact geometry of release cards (header line, date chip, 3 change item bars, markdown text block).
- **Empty States:** Clear, purposeful empty states:
  - *No search results:* Centered Lucide `Search` icon in a stone badge, message explaining query mismatch, and single-click "Clear Search" button.
  - *Studio zero drafts:* Illustrated minimal card with "No releases created yet. Start drafting v1.0.0 today" with a primary "Draft First Release" action.
- **Graceful Error Boundaries:** Nuxt `<NuxtErrorBoundary>` wrapping page contents. Server errors return structured `{ statusCode: 500, message: "..." }` with human-readable diagnostic cues, never crashing the client.

### 3.7 Tone of Voice & Copy Standards
- **Tone:** Concise, authoritative, engineer-to-engineer, understated, and transparent.
- **Forbidden Clichés:** Absolutely zero generic AI marketing tropes:
  - ❌ *"Supercharge your productivity"*
  - ❌ *"Streamline your changelog journey"*
  - ❌ *"Unlock next-level release intelligence"*
  - ❌ *"Delve into our cutting-edge updates"*
- **Approved Phrasing:**
  - ✅ *"Categorized change stream for Chronicle v1.4.0"*
  - ✅ *"Breaking change: API endpoint /v1/auth now requires Bearer token"*
  - ✅ *"Syndicated via RSS 2.0 and JSON Feed v1.1"*

---

## 4. Lightweight Stack Specifications

### 4.1 Technology Matrix
| Layer | Specification | Justification |
| :--- | :--- | :--- |
| **Framework** | Nuxt 3 (v3.13+) | Full-stack Vue 3 Composition API, file-based routing, instant Nitro SSR/SSG. |
| **Architecture Style** | `<script setup lang="ts">` | Clean, modern Vue 3 syntax with full TypeScript inference. |
| **Server Engine** | Nitro (Nuxt 3 built-in) | Ultra-lightweight edge/Node server for instant `/api/feed.xml`, `/api/feed.json`, and CRUD endpoints. |
| **Styling** | Tailwind CSS 3.4+ + `@tailwindcss/typography` | Utility-first styling with typography plugin for editorial Markdown rendering. |
| **UI Primitives** | `radix-vue` (v1.9+) | Unstyled, fully accessible WAI-ARIA compliant headless primitives. |
| **Iconography** | `lucide-vue-next` | Consistent, modern, zero-emoji SVG iconography. |
| **Database & ORM** | Prisma ORM with SQLite | Zero-configuration, file-based SQLite database with `/tmp` serverless fallback. |
| **Markdown Processor**| `markdown-it` or `marked` + `dompurify` | Fast, secure, sanitized live split-preview Markdown parsing. |
| **Package Manager** | `pnpm` exclusively | Fast, deterministic, space-efficient dependency management. |

### 4.2 Database Schema Architecture (`prisma/schema.prisma`)
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum ReleaseStatus {
  DRAFT
  SCHEDULED
  PUBLISHED
}

enum SemverType {
  MAJOR
  MINOR
  PATCH
}

enum ChangeCategory {
  FEATURE
  IMPROVEMENT
  FIX
  BREAKING
}

model Release {
  id              String         @id @default(cuid())
  version         String         @unique // e.g., "v1.4.0"
  title           String         // e.g., "Performance Overhaul & Webhook Feeds"
  slug            String         @unique // e.g., "v1-4-0"
  summary         String         // 1-2 sentence executive summary
  contentMarkdown String         // Full editorial Markdown release notes
  status          ReleaseStatus  @default(DRAFT)
  semverType      SemverType     @default(MINOR)
  publishedAt     DateTime?
  scheduledFor    DateTime?
  authorName      String         @default("Core Engineering")
  authorAvatar    String?        // URL or initial avatar
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  changes         ChangeItem[]

  @@index([status, publishedAt])
}

model ChangeItem {
  id          String         @id @default(cuid())
  releaseId   String
  category    ChangeCategory
  title       String         // e.g., "Dynamic RSS 2.0 Syndication Feed"
  description String?        // Supplementary technical note or PR reference
  sortOrder   Int            @default(0)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  release     Release        @relation(fields: [releaseId], references: [id], onDelete: Cascade)

  @@index([releaseId, sortOrder])
}

model ProjectSettings {
  id             String   @id @default("default")
  projectName    String   @default("Chronicle Studio")
  projectTagline String   @default("Editorial release notes and changelog feed.")
  projectUrl     String   @default("https://chronicle.local")
  feedTitle      String   @default("Chronicle Changelog")
  feedDesc       String   @default("Latest releases and platform improvements.")
  updatedAt      DateTime @updatedAt
}
```

### 4.3 Directory & File Architecture
```
chronicle-changelog/
├── assets/
│   └── css/
│       └── main.css             # Tailwind base and Standards 3.0 paper tokens
├── components/
│   ├── ui/                      # Radix-Vue styled primitives (Badge, Dialog, Button)
│   │   ├── Badge.vue
│   │   ├── Button.vue
│   │   ├── Dialog.vue
│   │   └── Dropdown.vue
│   ├── changelog/
│   │   ├── ReleaseCard.vue       # Public release card with sticky anchor
│   │   ├── CategoryBadge.vue     # Animated category badge (Lucide icons)
│   │   ├── FilterBar.vue         # Search input & category chip filter bar
│   │   ├── ExporterModal.vue     # GitHub / Slack / HTML copy modal
│   │   └── ReleaseSkeleton.vue   # Loading shimmer skeleton
│   └── studio/
│       ├── MarkdownEditor.vue    # Split-screen editor + preview
│       ├── ChangeItemManager.vue # Change item authoring & category selection
│       └── SemverHelper.vue      # SemVer validator & bump guidance badge
├── composables/
│   ├── useChangelog.ts          # Timeline search, filter, and fetch state
│   ├── useStudio.ts             # Draft editing state, autosave, and mutation API
│   └── useExporter.ts           # Slack mrkdwn, GitHub markdown, and HTML generator
├── layouts/
│   ├── default.vue              # Public header, feed links, and footer
│   └── studio.vue               # Studio navigation and status bar
├── pages/
│   ├── index.vue                # Public timeline stream
│   ├── release/
│   │   └── [slug].vue           # Standalone permalink release view
│   └── studio/
│       ├── index.vue            # Studio releases manager (drafts/published)
│       ├── new.vue              # New release authoring studio
│       └── [id].vue             # Existing release editor
├── prisma/
│   ├── schema.prisma            # SQLite schema
│   └── seed.ts                  # Rich realistic seed data (v1.0.0 through v1.2.1)
├── server/
│   ├── api/
│   │   ├── releases/            # REST API endpoints (GET, POST, PUT, DELETE)
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── feed.xml.get.ts      # Nitro RSS 2.0 XML route handler
│   │   └── feed.json.get.ts     # Nitro JSON Feed v1.1 route handler
│   └── utils/
│       ├── prisma.ts            # Prisma client singleton (/tmp SQLite resolver)
│       ├── rss.ts               # RSS 2.0 XML builder with CDATA formatting
│       └── jsonFeed.ts          # JSON Feed v1.1 builder
├── nuxt.config.ts               # Nuxt 3 configuration & Tailwind setup
├── package.json                 # pnpm dependencies and scripts
├── tailwind.config.ts           # Warm stone/paper palette & custom shadows
└── tsconfig.json
```

---

## 5. Explicit MVP Scope Boundaries

### 5.1 In-Scope (Phase 1 MVP Delivery)
1. **Editorial Studio Authoring Workflow:**
   - Full split-screen Markdown authoring with real-time preview.
   - Comprehensive SemVer validation (Major, Minor, Patch with regex verification and bump advice).
   - Release status management: Draft, Scheduled (future timestamp), Published.
   - Local storage draft auto-recovery on reload.
2. **Categorized Change Tagging:**
   - Standard semantic categories: Features, Improvements, Fixes, Breaking Changes.
   - Dynamic change item manager (add, delete, reorder, assign category).
   - High-contrast, zero-emoji Lucide SVG category badges.
3. **Public Hosted Release Timeline:**
   - Reverse-chronological feed of published releases with sticky version/date anchors.
   - Instant client-side fuzzy search across title, summary, markdown, and change item text.
   - Category filter chips (All, Features, Improvements, Fixes, Breaking Changes).
   - Version type filter chips (All, Major, Minor, Patch).
   - Deep permalinks (`/#v1.4.0` and `/release/v1-4-0`) with smooth scroll targeting.
4. **Developer Syndication Engine:**
   - Dynamic `/api/feed.xml` delivering 100% compliant RSS 2.0 XML.
   - Dynamic `/api/feed.json` delivering 100% compliant JSON Feed v1.1.
   - Caching headers (`s-maxage=3600`) and autodiscovery tags in `<head>`.
5. **1-Click Multi-Exporter Suite:**
   - Instant copy for GitHub Release (formatted markdown with categorical headers).
   - Instant copy for Slack (mrkdwn format with bold titles, bullets, permalink).
   - Instant copy for HTML embed card (standalone responsive snippet).
6. **Standards 3.0 Light Mode Aesthetics:**
   - Warm paper/stone canvas (`#fafaf9`), rich slate typography (`#0f172a`), hairline borders (`#e2e8f0`).
   - Strictly zero emojis in buttons, badges, headers, or cards.
   - Radix-Vue headless primitives with custom micro-shadows and motion transitions.
7. **Production Data Seed:**
   - Pre-populated realistic release history (e.g. v1.0.0, v1.1.0, v1.1.1, v1.2.0) demonstrating breaking changes, fixes, and features out of the box.

### 5.2 Out-of-Scope (Post-MVP Roadmap)
- **Multi-Tenant User Accounts & RBAC:** Multi-user team permissions (Admin, Editor, Viewer) via OAuth/Clerk. (MVP is single-tenant studio).
- **Direct Email Newsletter Blast:** Automatic email distribution to external subscriber lists via Resend or SendGrid webhooks.
- **Bi-Directional GitHub Sync:** Automatic ingestion of merged pull requests via GitHub App Webhooks.
- **Custom Domain CNAME Routing:** Dynamic multi-tenant custom domain SSL provisioning.
- **Dark Mode Theme Switcher:** Deferred to keep focus on executing the warm editorial light mode experience to perfection.
- **Paid Tier Billing & Monetization:** Stripe subscription gating or enterprise license keys.

### 5.3 Technical Risks & Mitigations
| Risk | Severity | Mitigation Strategy |
| :--- | :--- | :--- |
| **Serverless SQLite Ephemeral Storage** | Medium | Provide default local SQLite storage with transparent `/tmp/chronicle.db` fallback and seed hydration on cold start if deployed to ephemeral serverless containers. |
| **Markdown XSS Injection** | High | Run rendered HTML through `DOMPurify` (or server-side sanitizer) before injecting into the preview panel or public timeline. |
| **Feed Specification Regressions** | Medium | Validate XML output against W3C RSS 2.0 schemas and JSON Feed against JSON Feed v1.1 validator in automated Nitro route tests. |
| **Performance on Large Changelogs** | Low | Implement virtualized rendering or paginated timeline queries if release count exceeds 100 entries. |

---

## 6. Acceptance & Sign-off Criteria
The MVP implementation will be deemed complete and production-ready when:
1. All 5 core User Stories pass all Gherkin Acceptance Criteria scenarios.
2. The public timeline, studio authoring flow, and syndication feeds run end-to-end using Nuxt 3, Nitro, Tailwind CSS, Radix-Vue, and Prisma SQLite via `pnpm`.
3. Lighthouse Accessibility and Best Practices scores achieve 98+ with zero emoji usage across all system controls.
4. Both `/api/feed.xml` and `/api/feed.json` return valid feeds conforming to RFC 822 and JSON Feed v1.1 specifications.
