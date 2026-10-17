# Chronicle Changelog Studio — Launch Collateral & Distribution Kit

> **Complete launch package across Product Hunt, Twitter/X, Reddit, and Hacker News.**

---

## 1. Product Hunt Launch Pack

### Product Details
- **Product Name:** Chronicle Changelog Studio
- **Tagline:** Editorial release notes, changelog drafting, and public subscriber feeds for modern software teams
- **Categories:** Developer Tools, Engineering Productivity, Open Source, Product Management
- **Pricing:** 100% Free & Open Source (MIT Licensed)
- **Live Production URL:** [https://chronicle-changelog.vercel.app](https://chronicle-changelog.vercel.app)
- **GitHub Repository:** [https://github.com/iammuttaqi/chronicle-changelog](https://github.com/iammuttaqi/chronicle-changelog)

---

### First Maker Comment (Product Hunt)

```markdown
Hey Product Hunt community! 👋

I'm Muttaqi, creator of Chronicle Changelog Studio.

Software engineering teams ship continuous value every day. Yet communicating what changed remains deeply fragmented: updates get lost in raw Git commits, buried in unread Notion internal wikis, or hastily dumped into Slack channels.

When teams look for a dedicated changelog tool, the options are frustrating:
1. Bloated hosted SaaS widgets that charge $50 to $150/month just to serve a static web page.
2. Third-party vendor widgets that inject heavy trackers, pop up intrusive modals, and slap vendor badges onto your product.
3. Commercial services that gate standard developer syndication—like RSS 2.0 and JSON Feed—behind their highest enterprise tier.

We built Chronicle because release notes aren't an administrative chore; they are the editorial narrative of your software momentum.

Here is what makes Chronicle different:

1. Editorial Authoring Studio: A dedicated side-by-side split Markdown editor with real-time DOMPurify preview, word count telemetry, and localStorage autosave so you never lose an in-flight draft.
2. SemVer Recommendation Engine: As you classify your changes (Features, Improvements, Fixes, Breaking Changes), Chronicle analyzes the impact and suggests the correct Semantic Version bump (Major vX.0.0, Minor v0.X.0, or Patch v0.0.X).
3. Native Developer Syndication: Dynamic, RFC 822 compliant RSS 2.0 (/api/feed.xml) and JSON Feed v1.1 (/api/feed.json) out of the box with zero external dependencies.
4. 1-Click Multi-Exporter: Format your release announcement in under 5 seconds for GitHub Releases, Slack mrkdwn, or a responsive self-contained HTML embed card.
5. Standards 3.0 Design: A warm stone/paper canvas, rich dark slate typography, accessible Radix Vue primitives, zero emojis in UI controls, and full prefers-reduced-motion support.
6. Zero-Dependency Serverless SQLite: Built on Nuxt 3 and Prisma, utilizing a cold-start hydration engine that runs on Vercel serverless functions without requiring an external hosted database.

Chronicle is 100% open source under the MIT license. Check out the live release stream at https://chronicle-changelog.vercel.app or explore the code at https://github.com/iammuttaqi/chronicle-changelog.

I'd love to hear your feedback on the authoring experience, SemVer engine, or syndication pipeline. What does your team's current release workflow look like?
```

---

## 2. Twitter / X Announcement Thread (4-Tweet Pack)

> **Editorial Guideline:** Developer-first, zero AI buzzwords (*no "supercharge", "revolutionize", "game changer"*), clear technical value, and direct links.

### Tweet 1 (The Hook & Announcement)
```
Engineering teams ship continuously, but release notes are still scattered across git tags, Slack channels, and unread Notion docs.

Most changelog tools charge $99/mo for static pages and lock RSS behind enterprise plans.

Introducing Chronicle: an open-source editorial changelog studio.

Live demo: https://chronicle-changelog.vercel.app
Source: https://github.com/iammuttaqi/chronicle-changelog
```

### Tweet 2 (The Authoring Experience & SemVer Engine)
```
Writing release notes should have the same craft as writing software:

• Split-screen live Markdown preview with DOMPurify sanitization
• LocalStorage autosave recovery (no lost drafts on reload)
• SemVer engine that analyzes categorized changes and recommends Major, Minor, or Patch bumps automatically
```

### Tweet 3 (Syndication & 1-Click Multi-Exporter)
```
Distribute your updates everywhere without reformatting:

• Native RFC 822 RSS 2.0 (/api/feed.xml)
• JSON Feed v1.1 (/api/feed.json) for bots & webhooks
• 1-Click Multi-Exporter: copy formatted copy for GitHub Releases, Slack mrkdwn, or responsive HTML embed cards in 1 click
```

### Tweet 4 (Architecture & Open Source Stack)
```
Built with high-craft Standards 3.0 design:

• Nuxt 3, Vue 3, Radix Vue, Tailwind CSS, Prisma
• Zero-dependency serverless SQLite cold-start adapter for Vercel
• Strict zero-emoji UI with Lucide SVG iconography
• 106 automated tests passing

MIT Licensed: https://github.com/iammuttaqi/chronicle-changelog
```

---

## 3. Reddit Showcase Post

**Target Subreddits:** `r/SideProject`, `r/webdev`, `r/vuejs`, `r/selfhosted`

### Post Title
```
I built Chronicle: an open-source, editorial changelog studio with SemVer guidance, dual RSS/JSON feeds, and 1-click GitHub/Slack exports
```

### Post Body
```markdown
Hey everyone!

I wanted to share a project I built to solve a recurring frustration in my software engineering workflow: **Chronicle Changelog Studio**.

### The Problem
Whenever our team cuts a release, communicating what changed is always a chore. Commit logs are too technical for customers, PR summaries are messy, and pasting notes into Slack or GitHub leads to inconsistent formatting.

On top of that, commercial changelog widgets (Beamer, LaunchNotes, etc.) are absurdly expensive. They charge $50–$150/month for hosted static pages, inject tracking scripts, and lock standard syndication feeds like RSS behind high-tier plans.

### What Chronicle Does
Chronicle is an editorial-grade, developer-first changelog platform built on Nuxt 3, Vue 3, and Prisma:

1. **Split-Screen Markdown Studio:** Real-time side-by-side editing with DOMPurify sanitization, word counter, and formatting toolbar.
2. **SemVer Recommendation Engine:** Classify your release changes (Features, Improvements, Fixes, Breaking Changes). Chronicle automatically analyzes your items and recommends the correct version bump (e.g., flagging breaking changes for a Major bump).
3. **Draft Recovery & Autosave:** Continuous local-storage sync ensures you never lose in-flight release drafts across browser tabs or refreshes.
4. **1-Click Multi-Exporter:** One click copies your release formatted for:
   - **GitHub Releases:** Markdown with standard categorization headers (`## What's Changed in vX.Y.Z`).
   - **Slack:** Clean mrkdwn bullet points with PR links and author credits.
   - **HTML Embed Card:** Standalone, responsive HTML/CSS snippet to drop into documentation portals.
5. **Dual Developer Syndication:**
   - RFC 822 compliant RSS 2.0 at `/api/feed.xml`.
   - JSON Feed v1.1 at `/api/feed.json` for Slack/Discord webhooks and CI/CD pipelines.
   - Both with HTTP cache headers (`s-maxage=3600`).
6. **Standards 3.0 Design:** Warm stone/paper palette (`#fafaf9`), deep slate typography, Radix Vue headless accessible primitives, full `prefers-reduced-motion` compliance, and a strict zero-emoji UI policy (100% semantic Lucide icons).

### The Technical Challenge: Serverless SQLite
I wanted Chronicle to be zero-dependency and runnable anywhere—including Vercel's serverless AWS Lambda environment. However, Vercel functions have a read-only root filesystem and ephemeral lifecycles.

To solve this without requiring an external hosted database for quick demos:
- The database utility points to `/tmp/chronicle.db` (writable in AWS Lambda).
- On serverless cold start, it hydrates `/tmp/chronicle.db` using candidate starter DBs or decodes an embedded compile-time Base64 binary template.
- Dedicated HEAD route handlers (`/api/releases`, `/api/feed.xml`, `/api/feed.json`) ensure uptime monitors and `curl -sI` checks return instant 200 OK without running SSR.

### Links & Code
- **Live Demo:** https://chronicle-changelog.vercel.app
- **GitHub (MIT):** https://github.com/iammuttaqi/chronicle-changelog
- **Automated Test Suite:** 106 assertions verifying SemVer logic, export formats, feed schemas, and design rules.

I'd love feedback on the authoring flow, the SemVer engine, or the UI design!
```

---

## 4. Hacker News "Show HN" Post Draft

### Title
```
Show HN: Chronicle – Editorial changelog studio with SemVer guidance and dual feeds
```

### URL
```
https://chronicle-changelog.vercel.app
```

### Post Body
```markdown
Hi HN,

I built Chronicle (https://github.com/iammuttaqi/chronicle-changelog), an open-source release notes and changelog studio designed for software teams that value editorial craft and disciplined versioning.

### Motivation
Most product changelogs suffer from one of two extremes:
1. Raw, uncurated Git commit dumps on GitHub Releases that non-technical users cannot decipher.
2. Cluttered commercial SaaS widgets that charge $50–$150/mo, inject client-side tracking scripts, and lock basic machine-readable feeds behind paywalls.

We wanted an independent, high-craft platform where writing release notes feels like editorial publishing, while remaining deeply rooted in engineering discipline.

### Architecture & Technical Highlights

1. **SemVer Recommendation Engine:**
   Releases are structured into categorized change items (Features, Improvements, Fixes, and Breaking Changes). An internal rule-engine evaluates change impact against the latest published version and suggests the correct SemVer increment:
   - Any `BREAKING` item -> Major bump (`v2.0.0`)
   - Any `FEATURE` item -> Minor bump (`v1.3.0`)
   - `FIX` or `IMPROVEMENT` only -> Patch bump (`v1.2.4`)

2. **Serverless SQLite Cold-Start Adapter:**
   Deploying embedded SQLite onto serverless platforms like Vercel Lambda is notoriously tricky because the root filesystem is read-only. We implemented an adapter that copies and hydrates `/tmp/chronicle.db` on cold start via a compile-time base64-encoded starter binary template. Reads and writes execute locally without external dependencies. (For multi-region persistent production, Prisma can be swapped to Postgres or Turso libSQL by updating `DATABASE_URL`).

3. **Dual Developer Syndication:**
   - RSS 2.0 (`/api/feed.xml`) strictly adheres to RFC 822 date formats, XML namespaces (`atom`, `content`), and CDATA-wrapped rich HTML summaries.
   - JSON Feed v1.1 (`/api/feed.json`) provides a clean JSON API for ingest into Slack bots, Discord webhooks, or automated release pipelines.

4. **1-Click Multi-Exporter:**
   A built-in transformer generates copy formatted specifically for GitHub Releases (`## What's Changed in vX.Y.Z`), Slack mrkdwn (`• *Feature:* description`), and standalone responsive HTML embed cards for documentation embeds.

5. **Standards 3.0 Design & Accessibility:**
   - Built with Nuxt 3, Vue 3, Radix Vue headless primitives, and Tailwind CSS.
   - Warm stone/paper palette (`#fafaf9`) and high-contrast deep slate typography (`#0f172a`).
   - Strict zero-emoji UI policy using semantic SVG icons from `lucide-vue-next`.
   - Accessible motion physics respecting `prefers-reduced-motion`.

The automated test suite runs 106 assertions covering SemVer edge cases, syndication validation, export transformers, cascade deletions, and cold-start simulation.

Source code: https://github.com/iammuttaqi/chronicle-changelog
Live demo: https://chronicle-changelog.vercel.app

Looking forward to your comments, questions, and critique on the architecture and design.
```

---

## 5. Marketing Launch Checklist

- [x] Production deployment verified at `https://chronicle-changelog.vercel.app` (HTTP 200).
- [x] RSS feed (`/api/feed.xml`) and JSON Feed (`/api/feed.json`) validated with cURL smoke tests.
- [x] Public GitHub repository live at `https://github.com/iammuttaqi/chronicle-changelog`.
- [x] Automated test suite verified (106/106 passing).
- [x] Product Hunt assets, tagline, and maker comment prepared.
- [x] 4-Tweet launch thread formatted with zero AI buzzwords.
- [x] Reddit showcase post customized for r/SideProject and r/webdev.
- [x] Hacker News Show HN draft prepared with technical depth on serverless SQLite.
