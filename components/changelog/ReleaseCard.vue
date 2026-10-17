<template>
  <article
    :id="release.version"
    class="group relative bg-white border border-stone-200 rounded-xl p-6 sm:p-8 shadow-paper-sm hover:shadow-paper-md transition-all duration-200 target:ring-2 target:ring-orange-500 target:ring-offset-4"
  >
    <!-- Header: Version, SemVer badge, Dates, Exporter trigger -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Version Anchor Chip -->
        <a
          :href="`#${release.version}`"
          class="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-slate-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 px-2.5 py-1 rounded-md transition-colors group/anchor"
          title="Click to copy permalink"
          @click.prevent="copyPermalink(release.version)"
        >
          <Hash class="w-3.5 h-3.5 text-slate-400 group-hover/anchor:text-orange-600 transition-colors" />
          <span>{{ release.version }}</span>
        </a>

        <!-- SemVer Type Badge -->
        <UiBadge
          :variant="semverBadgeVariant"
          size="sm"
        >
          {{ release.semverType }}
        </UiBadge>

        <!-- Publication Date -->
        <time
          v-if="release.publishedAt"
          :datetime="new Date(release.publishedAt).toISOString()"
          class="text-xs font-mono text-slate-500 flex items-center gap-1.5"
        >
          <Calendar class="w-3.5 h-3.5 text-slate-400" />
          <span>{{ formattedDate }}</span>
          <span class="text-stone-300">•</span>
          <span class="text-slate-400 font-sans">{{ relativeDate }}</span>
        </time>
      </div>

      <!-- Actions: Exporter & Permalink Button -->
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <UiButton
          variant="secondary"
          size="sm"
          class="text-xs"
          title="Export formatted release announcement"
          @click="$emit('export', release)"
        >
          <Share2 class="w-3.5 h-3.5 mr-1.5 text-slate-500" />
          <span>Export</span>
        </UiButton>

        <NuxtLink
          :to="`/release/${release.slug}`"
          class="inline-flex items-center justify-center p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors"
          title="Open standalone permalink page"
        >
          <ExternalLink class="w-4 h-4" />
          <span class="sr-only">View Permalink</span>
        </NuxtLink>
      </div>
    </header>

    <!-- Release Title & Executive Summary -->
    <div class="mt-5 space-y-2">
      <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug">
        <NuxtLink
          :to="`/release/${release.slug}`"
          class="hover:text-orange-600 transition-colors"
        >
          {{ release.title }}
        </NuxtLink>
      </h2>

      <p
        v-if="release.summary"
        class="text-sm sm:text-base text-slate-700 leading-relaxed font-normal"
      >
        {{ release.summary }}
      </p>
    </div>

    <!-- Categorized Change Items List -->
    <section
      v-if="release.items && release.items.length > 0"
      class="mt-6 pt-5 border-t border-stone-100"
      aria-label="Categorized Changes"
    >
      <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 font-mono">
        <Tag class="w-3.5 h-3.5 text-slate-400" />
        <span>Categorized Changes ({{ release.items.length }})</span>
      </h3>

      <ul class="space-y-2.5">
        <li
          v-for="item in release.items"
          :key="item.id"
          class="flex flex-col sm:flex-row sm:items-baseline gap-2 p-2 rounded-lg hover:bg-stone-50/80 transition-colors"
        >
          <div class="shrink-0">
            <CategoryBadge
              :category="item.category"
              size="sm"
            />
          </div>
          <div class="flex-1 min-w-0 text-sm text-slate-800 leading-relaxed">
            <span>{{ item.description }}</span>
            <span
              v-if="item.authorName"
              class="ml-2 inline-flex items-center text-xs text-slate-400 font-mono"
            >
              by {{ item.authorName }}
            </span>
            <span
              v-if="item.prNumber"
              class="ml-1.5 inline-flex items-center font-mono text-xs text-orange-600 bg-orange-50 border border-orange-200/80 px-1.5 py-0.2 rounded"
            >
              #{{ item.prNumber }}
            </span>
          </div>
        </li>
      </ul>
    </section>

    <!-- Rich Markdown Release Body -->
    <section
      v-if="release.contentMarkdown"
      class="mt-6 pt-5 border-t border-stone-100"
      aria-label="Detailed Notes"
    >
      <div
        class="prose prose-sm sm:prose-base max-w-none text-slate-700"
        v-html="renderedMarkdown"
      />
    </section>

    <!-- Card Footer / Attribution -->
    <footer class="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-slate-400 font-mono">
      <div class="flex items-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-stone-300" />
        <span>Published by {{ release.authorName || 'Core Team' }}</span>
      </div>
      <button
        type="button"
        class="hover:text-slate-600 transition-colors flex items-center gap-1"
        @click="copyPermalink(release.version)"
      >
        <Link2 class="w-3 h-3" />
        <span>Copy link</span>
      </button>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Hash,
  Calendar,
  Share2,
  ExternalLink,
  Tag,
  Link2
} from 'lucide-vue-next'
import MarkdownIt from 'markdown-it'
import { useChronicle } from '~/composables/useChronicle'
import type { Release } from '~/types/chronicle'

const props = defineProps<{
  release: Release
}>()

defineEmits<{
  export: [release: Release]
}>()

const { copyPermalink } = useChronicle()

// Client-side markdown renderer
const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  typographer: true
})

const renderedMarkdown = computed(() => {
  if (!props.release.contentMarkdown) return ''
  return md.render(props.release.contentMarkdown)
})

const semverBadgeVariant = computed(() => {
  switch (props.release.semverType) {
    case 'MAJOR': return 'accent'
    case 'PATCH': return 'subtle'
    case 'MINOR':
    default: return 'default'
  }
})

const formattedDate = computed(() => {
  if (!props.release.publishedAt) return 'Unpublished'
  const date = new Date(props.release.publishedAt)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
})

const relativeDate = computed(() => {
  if (!props.release.publishedAt) return ''
  const date = new Date(props.release.publishedAt)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 30) return `${diffDays}d ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return `${Math.floor(diffDays / 365)}y ago`
})
</script>
