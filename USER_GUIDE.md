# Chronicle Changelog Studio — User Guide & Editorial Playbook

> **The definitive technical guide to browsing, drafting, managing, and syndicating software release communications with Chronicle.**

---

## 1. Introduction & Overview

**Chronicle Changelog Studio** is an editorial-grade release notes, changelog drafting, and developer syndication platform. Built for engineering leads, open-source maintainers, and product organizations, Chronicle bridges raw Git commits and customer-facing software momentum.

Unlike generic changelog widgets that clutter screens with unbranded modals, inject third-party tracking scripts, or charge $50–$150/month to host a static page, Chronicle delivers a high-craft, self-contained platform adhering to **Standards 3.0** design principles.

### Key Capabilities at a Glance

| Feature Area | Key Functionality | Primary Benefit |
| :--- | :--- | :--- |
| **Public Release Timeline** | Chronological stream, multi-category chips, real-time query search, direct anchor permalinks | Zero-friction discovery for users and stakeholders |
| **Editorial Authoring Studio** | Split-screen Markdown editor with DOMPurify sanitization, word counter, and formatting toolbar | Real-time WYSIWYG confidence without rendering lag |
| **SemVer Recommendation** | Rule-based semantic versioning analyzer (Major / Minor / Patch) | Guarantees version integrity and flags breaking changes |
| **Draft Resilience** | Reactive local-storage autosave engine with timestamped recovery | Eliminates accidental draft loss across tabs or reloads |
| **Categorized Change Tagging** | Features, Improvements, Fixes, and Breaking Changes with semantic SVG badges | Visual clarity on operational impact without emoji clutter |
| **Developer Syndication** | RFC 822 RSS 2.0 (`/api/feed.xml`) & JSON Feed v1.1 (`/api/feed.json`) | Native ingestion for feed readers, bots, and CI/CD pipelines |
| **1-Click Multi-Exporter** | GitHub Releases Markdown, Slack mrkdwn, and responsive HTML embed card | Instant cross-platform distribution in under 5 seconds |

---

## 2. Navigating the Public Release Timeline

The public timeline (`/`) is Chronicle's primary interface for end users, customers, and engineering stakeholders.

```
┌────────────────────────────────────────────────────────────────────────┐
│  Chronicle Changelog Studio                     [ Studio ] [ Subscribe ]
│  The editorial narrative of software momentum.                         │
├────────────────────────────────────────────────────────────────────────┤
│  [ Search releases, PRs, or changes... (Press / to focus) ]   4 cataloged│
│  [All Categories 4] [Features 3] [Improvements 2] [Fixes 2] [Breaking 1]│
├────────────────────────────────────────────────────────────────────────┤
│  ● v1.3.0 — Real-Time Split Studio & Slack Multi-Exporter  [Oct 17, 2026]│
│    [FEATURE]   [IMPROVEMENT]   [FIX]                                   │
│    Summary: Introduced split-screen authoring and 1-click Slack exports│
│    [Read More / Details] [Copy Markdown] [Copy Slack] [Share Link]     │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Searching and Filtering Releases

Chronicle provides an instant, client-side search and filtering engine that processes full text in under 50ms:

1. **Full-Text Search:**
   - Click the sticky search input or press `/` anywhere on the page to focus the search box.
   - Type query keywords such as version strings (`v1.2`), issue/PR numbers (`#42`), features (`SQLite`), or author names (`@alex`).
   - The results counter dynamically updates (e.g., `Showing 2 releases matching "SQLite"`).
   - Press `Esc` or click the `X` button on the right side of the search bar to clear your search.

2. **Categorical Filtering:**
   - Filter chips allow filtering by specific change types:
     - **All Categories:** Shows the entire published release history.
     - **Features:** Shows releases containing functional additions (emerald badge with Lucide `Sparkles`).
     - **Improvements:** Filters to releases with performance tuning and refactors (indigo badge with Lucide `Zap`).
     - **Fixes:** Highlights releases containing bug patches and regression fixes (amber badge with Lucide `Wrench`).
     - **Breaking Changes:** Isolates major upgrades with breaking API, schema, or configuration modifications (crimson badge with Lucide `AlertTriangle`).
   - Counts alongside each filter tag reflect the live quantity of tagged releases currently published.

3. **SemVer Tier Filter:**
   - Filter by release weight: **Major**, **Minor**, or **Patch** to quickly audit past milestones or track patch frequency.

### 2.2 Release Permalinks & Deep Linking

Every release is assigned a permanent, human-readable slug and anchor identifier:
- **Anchor Permalink:** `https://chronicle-changelog.vercel.app/#v1.3.0`
- **Standalone Release Route:** `https://chronicle-changelog.vercel.app/release/v1-3-0`

When navigating to an anchor link:
1. The browser smoothly scrolls to the designated release card.
2. The release card briefly pulses with an active focus ring to orient the reader.
3. Clicking the `Share` or `Copy Link` button immediately places the canonical permalink onto your system clipboard.

### 2.3 Email & RSS Subscription

Readers can stay updated through two built-in mechanisms:
- **Email Digest:** Click the **Subscribe** button in the navigation header, enter an email address, and confirm. The subscriber record is securely stored in SQLite via `/api/subscribers`.
- **Feed Readers:** Feed discoverability links are embedded in the HTML document `<head>`. Users of NetNewsWire, Feedly, or Reeder can paste `https://chronicle-changelog.vercel.app/api/feed.xml` directly into their feed reader.

---

## 3. Editorial Authoring Studio Walkthrough

The **Editorial Studio** (`/studio`) is the administrative workspace for engineering leads, technical writers, and product managers.

### 3.1 Studio Workspace Dashboard

Navigating to `/studio` displays the release management index:
- **Release Status Columns/Filters:** Toggle between `All`, `Published`, `Drafts`, and `Scheduled`.
- **Metric Badges:** Instant tally of total releases, active drafts waiting for approval, and upcoming scheduled announcements.
- **Actions:** Quick actions to **Edit Draft**, **Publish Immediately**, **Preview Card**, or **Delete Release** (with cascade safeguards).
- **New Release:** Click **New Release** (top right) to launch the authoring canvas (`/studio/new`).

### 3.2 Authoring a Release Step-by-Step

```
┌────────────────────────────────────────────────────────────────────────┐
│  STEP 1: Semantic Versioning & Editorial Title                         │
│  [ Release Version: v1.4.0 ]  [ Title: Multi-Tenant Workspace Feeds ]  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ SemVer Guidance: Suggested v2.0.0 (Reason: Contains BREAKING)    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────┤
│  STEP 2: Executive Summary & Categorized Change Items                  │
│  [ Summary: Concise 1-2 sentence executive overview for stakeholders ] │
│  + Add Change Item -> [ Category: FEATURE ] [ Description: ... ]       │
├────────────────────────────────────────────────────────────────────────┤
│  STEP 3: Split-Screen Live Markdown Studio                             │
│  [ B I H2 ```` • " Link ]                               [ Live Sync ● ] │
│  ┌──────────────────────────────┬───────────────────────────────────┐  │
│  │ ## Architecture Changes      │ <h2>Architecture Changes</h2>     │  │
│  │ We overhauled the engine...  │ <p>We overhauled the engine...</p>│  │
│  └──────────────────────────────┴───────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────┤
│  STEP 4: Publication Lifecycle                                         │
│  [ Save as Draft ]   [ Schedule for Later ]   [ Publish Release Now ]  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Step 1: Semantic Versioning & SemVer Recommendation Engine

1. Enter the target version in the **Release Version** input (e.g., `v1.4.0`).
2. The version is continuously validated against strict Semantic Versioning rules:
   - Valid: `v1.0.0`, `1.4.2`, `v2.0.0-rc.1`, `v0.10.4`
   - Invalid: `v1`, `1.0`, `beta-1`, `v1.0.0.0`
3. If an invalid format is entered, an inline warning informs:
   > *"Must match Semantic Versioning format (e.g., v1.3.0 or 1.3.0)"*
4. **SemVer Recommendation Banner:**
   The engine analyzes the change items added to your draft:
   - If any change has category `BREAKING`: Recommends a **Major** bump (e.g., `v1.2.3` → `v2.0.0`).
   - If changes include `FEATURE` (no breaking changes): Recommends a **Minor** bump (e.g., `v1.2.3` → `v1.3.0`).
   - If only `FIX` or `IMPROVEMENT` items: Recommends a **Patch** bump (e.g., `v1.2.3` → `v1.2.4`).
   - Click **Apply Recommendation** to instantly insert the suggested version into the version field.

#### Step 2: Categorized Change Items

Click **Add Change Item** to attach structured changes to the release. Each item includes:
- **Category:** Choose `Feature`, `Improvement`, `Fix`, or `Breaking Change`.
- **Description:** Clear, imperative sentence describing the change (e.g., *"Added RFC 822 compliant RSS 2.0 XML endpoint"*).
- **PR Number (Optional):** Reference the corresponding GitHub PR (e.g., `104`). Chronicle automatically converts this into `#104` with link metadata in syndication exports.
- **Author Attribution (Optional):** Credit the engineer or external contributor (e.g., `@alex`).
- **Reordering & Deletion:** Move items up/down to curate visual priority or click the trash icon to remove an entry.

#### Step 3: Split-Screen Live Markdown Studio

The Markdown Editor delivers instant side-by-side rendering:
- **Left Pane (Markdown Source):** Type standard GitHub Flavored Markdown (GFM).
- **Right Pane (Real-Time Preview):** Instant sanitized preview powered by `markdown-it` and `dompurify`.
- **Formatting Toolbar:** Quick-insert buttons for:
  - **Bold:** `**text**` (`Ctrl/Cmd + B`)
  - **Italic:** `*text*` (`Ctrl/Cmd + I`)
  - **Heading 2:** `## Heading`
  - **Code Block:** ` ```language\n...``` `
  - **Bullet List:** `- Item`
  - **Blockquote:** `> Quote`
  - **Hyperlink:** `[Title](https://...)`
- **Responsive Viewport Modes (Mobile/Tablet):** Toggle between **Split**, **Write**, and **Preview** tabs when working on compact screens.
- **Document Telemetry:** Real-time word count and character count live in the toolbar status line.

#### Step 4: Publication Lifecycle & Autosave Recovery

Chronicle supports three distinct publication lifecycle states:
1. **DRAFT:** Saved privately. Visible exclusively within the Studio workspace; completely excluded from the public timeline and RSS/JSON feeds.
2. **SCHEDULED:** Specify a future UTC date and time. Chronicle queues the release and displays an upcoming schedule badge in the Studio dashboard.
3. **PUBLISHED:** Immediately makes the release live on the public timeline, stamps `publishedAt` to the current UTC timestamp, and triggers dynamic RSS/JSON Feed generation.

#### Draft Autosave & Disaster Recovery

Never worry about lost work due to accidental browser refreshes, tab closures, or network hiccups:
- The Studio actively monitors draft modifications and synchronizes state to `localStorage` under the key `chronicle:studio:draft_backup`.
- An autosave status indicator displays the elapsed time since the last snapshot (e.g., `Autosaved 1m ago` with an emerald pulse indicator).
- If you navigate away with unsaved changes and return to `/studio/new`, a **Restore Backup** button appears in the header. Clicking it restores the complete draft state (version, title, summary, change items, and markdown body).

---

## 4. Categorized Change Tags & Standards 3.0 Badges

Chronicle strictly enforces standardized change classification. Each category uses custom typography, hairline borders, and semantic SVG icons from `lucide-vue-next`. In adherence to our anti-clutter design rules, **emojis are strictly prohibited** in UI controls and badge indicators.

### 4.1 Categorization Specification

```
┌────────────────────────────────────────────────────────────────────────┐
│  CATEGORY SPECIFICATION & ACCESSIBILITY MATRIX                         │
├─────────────┬───────────┬────────────┬─────────────┬───────────────────┤
│ Category    │ Lucide    │ Light Text │ Background  │ Hairline Border   │
├─────────────┼───────────┼────────────┼─────────────┼───────────────────┤
│ FEATURE     │ Sparkles  │ #059669    │ #ecfdf5     │ #a7f3d0           │
│ IMPROVEMENT │ Zap       │ #4f46e5    │ #eef2ff     │ #c7d2fe           │
│ FIX         │ Wrench    │ #b45309    │ #fffbeb     │ #fde68a           │
│ BREAKING    │ AlertTri  │ #dc2626    │ #fef2f2     │ #fecdd3           │
└─────────────┴───────────┴────────────┴─────────────┴───────────────────┘
```

1. **Features (`FEATURE`):**
   - **Label:** `Feature`
   - **Icon:** `Sparkles` (Emerald theme)
   - **Use Case:** Net-new functionality, public APIs, UI additions, or new platform integrations.
2. **Improvements (`IMPROVEMENT`):**
   - **Label:** `Improvement`
   - **Icon:** `Zap` (Indigo theme)
   - **Use Case:** Performance optimizations, database query indexing, memory tuning, UI polish, refactors, and dependency updates.
3. **Fixes (`FIX`):**
   - **Label:** `Fix`
   - **Icon:** `Wrench` (Amber theme)
   - **Use Case:** Bug resolutions, regression fixes, mobile responsiveness corrections, and edge-case error handling.
4. **Breaking Changes (`BREAKING`):**
   - **Label:** `Breaking Change`
   - **Icon:** `AlertTriangle` (Crimson theme)
   - **Use Case:** Deprecations, altered REST/GraphQL endpoint signatures, schema migrations requiring user action, or removed config keys.

---

## 5. Developer Syndication Engine (RSS & JSON Feed)

Chronicle features native, dynamic developer syndication endpoints built directly on the Nuxt/Nitro server engine. No third-party syndication SaaS or manual XML generation required.

### 5.1 RSS 2.0 XML Feed (`/api/feed.xml`)

The RSS feed complies with strict **RFC 822** specifications and includes XML namespaces for Atom self-pointers and encoded content:

- **Endpoint:** `GET /api/feed.xml`
- **Content-Type:** `application/xml; charset=utf-8`
- **Cache-Control:** `public, s-maxage=3600, stale-while-revalidate=86400`
- **Payload Structure:**
  - Standard `<rss version="2.0" xmlns:atom="..." xmlns:content="...">` envelope.
  - `<channel>` container including title, link, description, language, and RFC 822 `lastBuildDate`.
  - Item entries containing `<title>`, `<link>`, `<guid isPermaLink="true">`, `<pubDate>`, and rich `<content:encoded><![CDATA[ ... ]]></content:encoded>` HTML bodies containing both the categorized change list and the Markdown text.

#### Verifying with cURL
```bash
curl -sI https://chronicle-changelog.vercel.app/api/feed.xml
# Returns HTTP/2 200 OK with application/xml
```

### 5.2 JSON Feed v1.1 (`/api/feed.json`)

The JSON Feed adheres to the official **JSON Feed 1.1** specification, designed for programmatic pipeline consumption:

- **Endpoint:** `GET /api/feed.json`
- **Content-Type:** `application/feed+json; charset=utf-8`
- **Cache-Control:** `public, s-maxage=3600, stale-while-revalidate=86400`
- **Payload Structure:**
  ```json
  {
    "version": "https://jsonfeed.org/version/1.1",
    "title": "Chronicle Changelog Studio",
    "home_page_url": "https://chronicle-changelog.vercel.app",
    "feed_url": "https://chronicle-changelog.vercel.app/api/feed.json",
    "description": "Editorial release notes and changelog feed.",
    "items": [
      {
        "id": "https://chronicle-changelog.vercel.app/release/v1-3-0",
        "url": "https://chronicle-changelog.vercel.app/#v1.3.0",
        "title": "v1.3.0 — Real-Time Split Studio & Slack Multi-Exporter",
        "summary": "Full authoring suite with live DOMPurify markdown preview...",
        "content_html": "<h3>What Changed</h3><ul><li>...</li></ul>...",
        "date_published": "2026-10-17T07:30:00.000Z",
        "authors": [{ "name": "Core Engineering" }],
        "tags": ["FEATURE", "IMPROVEMENT", "FIX"]
      }
    ]
  }
  ```

### 5.3 Automated Syndication Integrations

#### Integrating with Slack via Incoming Webhooks
Use Zapier, Make, or a lightweight serverless worker to poll `/api/feed.json` and post newly published items to an engineering channel:

```javascript
// Minimal Node.js / Serverless Slack Dispatcher
const response = await fetch('https://chronicle-changelog.vercel.app/api/feed.json');
const feed = await response.json();
const latest = feed.items[0];

await fetch(process.env.SLACK_WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: `*New Release Published: ${latest.title}*\n${latest.summary}\nRead full notes: ${latest.url}`
  })
});
```

#### Feed Readers (NetNewsWire, Feedly)
Simply paste `https://chronicle-changelog.vercel.app/api/feed.xml` into any modern feed reader to receive rich desktop or mobile release notifications.

---

## 6. 1-Click Multi-Exporter Suite

Engineering teams announce releases across multiple channels. Chronicle's **1-Click Multi-Exporter** formats release notes instantly for GitHub, Slack, and web embeds with zero manual copy-pasting or reformatting.

### 6.1 Launching the Exporter Modal

On any release card in the public timeline or the Studio dashboard:
1. Click the **Export** button (or the `Share2` icon).
2. The Radix Vue modal dialog appears with three export targets:
   - **GitHub Release**
   - **Slack mrkdwn**
   - **HTML Embed Card**
3. Select your target tab, review the syntax-highlighted dark preview block, and click **Copy to Clipboard**.

```
┌────────────────────────────────────────────────────────────────────────┐
│  Export Release Notes                                              [X] │
│  Copy formatted announcement copy for engineering channels.            │
├────────────────────────────────────────────────────────────────────────┤
│  [ GitHub Release ]       [ Slack mrkdwn ]       [ HTML Embed Card ]   │
├────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ ## What's Changed in v1.3.0                                      │  │
│  │                                                                  │  │
│  │ Full authoring suite with live split-screen Markdown preview...  │  │
│  │                                                                  │  │
│  │ ### 🚀 Features                                                  │  │
│  │ - Real-time split-screen Markdown preview by @alex in #142       │  │
│  │ - 1-Click Multi-Exporter for GitHub and Slack in #145            │  │
│  │                                                                  │  │
│  │ **Full Changelog**: https://chronicle-changelog.vercel.app/#v1.3.0│  │
│  └──────────────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────┤
│  Target: GitHub Release Markdown             [ Cancel ] [ Copy Text ]  │
└────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Target Format Specifications

#### 1. GitHub Releases Markdown
Generates GitHub-native markdown headers compatible with GitHub's release notes standard:
```markdown
## What's Changed in v1.3.0

Full authoring suite with live DOMPurify markdown preview and Slack exports.

### 🚀 Features
- Real-time split-screen Markdown preview by @alex in #142
- 1-Click Multi-Exporter for GitHub, Slack, and HTML in #145

### ⚡ Improvements
- Optimized SQLite query performance on cold starts in #148

### 🐛 Bug Fixes
- Resolved mobile viewport tab switching overflow in #150

**Full Changelog**: https://chronicle-changelog.vercel.app/#v1.3.0
```

#### 2. Slack mrkdwn
Generates bolded, bulleted copy formatted specifically for Slack's BlockKit and message composer:
```
*Release v1.3.0 — Real-Time Split Studio & Slack Multi-Exporter*
Full authoring suite with live DOMPurify markdown preview and Slack exports.

*Features:*
• *Feature:* Real-time split-screen Markdown preview (@alex, #142)
• *Feature:* 1-Click Multi-Exporter for GitHub, Slack, and HTML (#145)

*Improvements:*
• *Improvement:* Optimized SQLite query performance on cold starts (#148)

*Bug Fixes:*
• *Bug Fix:* Resolved mobile viewport tab switching overflow (#150)

View full changelog: <https://chronicle-changelog.vercel.app/#v1.3.0>
```

#### 3. Responsive HTML Embed Card
Produces a self-contained, responsive HTML and inline CSS card ready to paste into documentation sites, marketing sidebars, or internal intranets without external stylesheet dependencies:
```html
<!-- Chronicle Release Embed: v1.3.0 -->
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; background: #ffffff; color: #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
    <span style="font-family: monospace; font-size: 13px; font-weight: 700; background: #0f172a; color: #ffffff; padding: 3px 8px; border-radius: 6px;">v1.3.0</span>
    <span style="font-size: 12px; color: #64748b;">October 17, 2026</span>
  </div>
  <h3 style="margin: 0 0 8px 0; font-size: 17px; font-weight: 700;">Real-Time Split Studio & Slack Multi-Exporter</h3>
  <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155; line-height: 1.5;">Full authoring suite with live DOMPurify markdown preview and Slack exports.</p>
  <a href="https://chronicle-changelog.vercel.app/#v1.3.0" style="display: inline-block; font-size: 13px; font-weight: 600; color: #0f172a; text-decoration: underline;">Read Full Release Notes &rarr;</a>
</div>
```

---

## 7. Standards 3.0 Design & Architecture System

Chronicle adheres strictly to the **Standards 3.0** specification, prioritizing editorial craftsmanship, accessibility, and resilient zero-dependency deployment.

### 7.1 Tactile Stone/Paper Light Theme

- **Warm Paper Canvas (`#fafaf9`):** Replaces sterile #ffffff or harsh blue-gray backgrounds with an editorial warm stone canvas reminiscent of high-end print publications.
- **Deep Slate Contrast (`#0f172a` & `#334155`):** High-contrast typography provides optimal legibility for deep reading, complying with WCAG 2.1 AAA contrast ratios.
- **Hairline Borders (`#e2e8f0`):** Precise 1px borders paired with subtle paper micro-shadows (`box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04)`).

### 7.2 Headless Accessibility via Radix Vue

All interactive overlays leverage headless `radix-vue` primitives:
- `DialogRoot`, `DialogPortal`, and `DialogOverlay` provide automatic focus-trapping, ARIA labeling, and keyboard dismissal via `Escape`.
- `DropdownMenuRoot` provides keyboard navigation using `ArrowUp`, `ArrowDown`, and `Enter`.
- Tab groups provide standard roving tab-index accessibility for keyboard-first navigation.

### 7.3 Motion Physics & Reduced-Motion Safeguards

- Staggered card reveals utilize subtle cubic-bezier easing (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Reduced-Motion Compliance:**
  In `assets/css/main.css`, a global accessibility guard completely disables animations and transitions when the user's OS specifies `prefers-reduced-motion: reduce`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

### 7.4 Zero-Emoji Policy

To maintain technical authority and visual consistency across operating systems:
- **Zero emojis** are used in buttons, badge indicators, headers, cards, or dialogs.
- All category distinctions and actions are rendered with semantic SVG icons from `lucide-vue-next`.

### 7.5 Serverless SQLite Cold-Start Resilience

Deploying SQLite to serverless hosts (like Vercel AWS Lambda) typically fails because the root filesystem is read-only and instances are ephemeral. Chronicle solves this elegantly:
1. **Writable Ephemeral Volume:** On cold start, the database utility initializes SQLite against `/tmp/chronicle.db`.
2. **Three-Tier Seed Hydration:**
   - Tier 1: Copies physical `prisma/starter.db` if present.
   - Tier 2: Inspects `public/starter.db` in static output.
   - Tier 3: If candidate files are absent from the lambda bundle, it decodes an embedded compile-time binary template `STARTER_DB_BASE64` directly into `/tmp/chronicle.db`.
3. **Dedicated HEAD Route Handlers:** Lightweight handlers (`index.head.ts`, `feed.xml.head.ts`, `feed.json.head.ts`) respond to uptime monitoring pings and `curl -sI` health checks with `200 OK` in <5ms without running full SSR pipelines.

---

## 8. Keyboard Shortcuts & Power Workflows

| Shortcut | Context | Action |
| :--- | :--- | :--- |
| `/` | Public Timeline (`/`) | Focus full-text search input immediately |
| `Esc` | Anywhere | Close active modal dialog (Export, Subscribe) or clear search query |
| `Cmd/Ctrl + B` | Studio Markdown Editor | Wrap selection in `**bold**` |
| `Cmd/Ctrl + I` | Studio Markdown Editor | Wrap selection in `*italic*` |
| `Cmd/Ctrl + Enter` | Studio New / Edit Form | Submit and save release draft |
| `Tab` / `Shift + Tab` | Timeline & Modals | Accessible keyboard roving navigation through cards and interactive buttons |

---

## 9. Frequently Asked Questions (FAQs)

#### Q: How does Chronicle handle SQLite persistence on Vercel?
**A:** On Vercel serverless functions, the root filesystem is read-only, but `/tmp` is writable. Chronicle automatically copies or decodes a seeded SQLite database into `/tmp/chronicle.db` during container cold start. Writes (such as draft creation and newsletter signups) succeed within that execution instance. For persistent enterprise production multi-region deployments, swap the `provider = "sqlite"` in `prisma/schema.prisma` to `postgresql` or Turso libSQL by updating `DATABASE_URL`.

#### Q: Can I customize the publication date for historical release imports?
**A:** Yes. When creating or editing a release in the Studio, you can specify an exact historical or custom timestamp. Chronicle will place the release in its proper chronological order on the public timeline and update feed timestamps accordingly.

#### Q: Does Chronicle sanitize user-submitted Markdown?
**A:** Yes. All Markdown content is rendered via `markdown-it` and sanitized using `dompurify` both on the client and server prior to injection, neutralizing XSS vectors and unclosed tags.

#### Q: How does the SemVer Recommendation Engine determine the next version?
**A:** It queries the latest published release in the database. If your draft change items contain at least one `BREAKING` item, it recommends a Major bump (`v2.0.0`). If it contains at least one `FEATURE` item without breaking changes, it recommends a Minor bump (`v1.3.0`). If only `FIX` or `IMPROVEMENT` items exist, it recommends a Patch bump (`v1.2.4`).

#### Q: Where are the RSS and JSON Feed URLs located?
**A:** The RSS 2.0 XML feed is located at `/api/feed.xml`, and the JSON Feed 1.1 is at `/api/feed.json`. Both endpoints are publicly accessible, require no API keys, and include standard HTTP caching headers.
