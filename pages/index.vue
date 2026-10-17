<template>
  <div class="space-y-8">
    <!-- Hero Banner -->
    <section class="border-b border-stone-200/80 pb-8 pt-2">
      <div class="max-w-3xl space-y-3">
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-mono font-medium">
          <span class="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
          <span>Continuous Delivery Stream</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Engineering Momentum &amp; Release Notes
        </h1>
        <p class="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          Disciplined Semantic Versioning, categorized change logs, and syndication feeds for modern library consumers and engineering teams.
        </p>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="mt-6 flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
        <div class="bg-white border border-stone-200 px-3 py-1.5 rounded-md shadow-paper-sm flex items-center gap-2">
          <span class="text-slate-400">Published:</span>
          <span class="font-bold text-slate-900">{{ stats.totalPublished }} versions</span>
        </div>
        <div class="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md text-emerald-800 flex items-center gap-1.5">
          <Sparkles class="w-3.5 h-3.5 text-emerald-600" />
          <span>{{ stats.featuresCount }} features</span>
        </div>
        <div class="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-md text-rose-800 flex items-center gap-1.5">
          <AlertTriangle class="w-3.5 h-3.5 text-rose-600" />
          <span>{{ stats.breakingCount }} breaking</span>
        </div>
        <div class="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-md text-amber-800 flex items-center gap-1.5">
          <Wrench class="w-3.5 h-3.5 text-amber-600" />
          <span>{{ stats.fixesCount }} fixes</span>
        </div>
      </div>
    </section>

    <!-- Sticky Filter & Search Bar -->
    <ChangelogFilterBar :total-count="filteredReleases.length" />

    <!-- Timeline Stream -->
    <section
      class="space-y-8"
      aria-label="Releases Timeline"
    >
      <!-- Loading Shimmers -->
      <div
        v-if="loading && releases.length === 0"
        class="space-y-8"
      >
        <ChangelogReleaseSkeleton
          v-for="i in 3"
          :key="i"
        />
      </div>

      <!-- Zero Results Empty State -->
      <ChangelogEmptyState
        v-else-if="filteredReleases.length === 0"
        :title="filters.searchQuery ? `No releases matching '${filters.searchQuery}'` : 'No releases found'"
        description="Try adjusting your search terms or resetting the active category filter."
        :show-reset="filters.searchQuery !== '' || filters.activeCategory !== 'ALL' || filters.activeSemverType !== 'ALL'"
        @reset="resetFilters"
      />

      <!-- Release Cards List -->
      <div
        v-else
        class="space-y-8"
      >
        <ChangelogReleaseCard
          v-for="release in filteredReleases"
          :key="release.id"
          :release="release"
          @export="openExporter"
        />
      </div>
    </section>

    <!-- Exporter Modal -->
    <ChangelogExporterModal
      v-model:open="showExporter"
      :release="selectedExportRelease"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Sparkles, AlertTriangle, Wrench } from 'lucide-vue-next'
import { useChronicle } from '~/composables/useChronicle'
import type { Release } from '~/types/chronicle'

useHead({
  title: 'Chronicle — Engineering Changelog & Release Stream'
})

const {
  releases,
  loading,
  filters,
  filteredReleases,
  stats,
  fetchReleases,
  resetFilters
} = useChronicle()

const showExporter = ref(false)
const selectedExportRelease = ref<Release | null>(null)

const openExporter = (release: Release) => {
  selectedExportRelease.value = release
  showExporter.value = true
}

// Initial fetch & hash anchor scroll
onMounted(async () => {
  await fetchReleases()

  // Scroll to hash target if provided in URL (e.g. #v1.2.0)
  if (window.location.hash) {
    await nextTick()
    const targetId = window.location.hash.replace('#', '')
    const el = document.getElementById(targetId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
})
</script>
