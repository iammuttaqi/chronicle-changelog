<template>
  <div class="space-y-6">
    <!-- Back Navigation -->
    <div>
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        <span>Back to Full Changelog Timeline</span>
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div
      v-if="pending"
      class="py-8"
    >
      <ChangelogReleaseSkeleton />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error || !release"
      class="bg-white border border-stone-200 rounded-xl p-12 text-center shadow-paper-sm max-w-lg mx-auto"
    >
      <div class="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle class="w-6 h-6" />
      </div>
      <h2 class="text-lg font-semibold text-slate-900">
        Release Not Found
      </h2>
      <p class="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
        We could not locate release notes for slug "{{ route.params.slug }}".
      </p>
      <div class="mt-6">
        <NuxtLink to="/">
          <UiButton
            variant="secondary"
            size="sm"
          >
            Return to Changelog
          </UiButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Full Release Card -->
    <div
      v-else
      class="space-y-6"
    >
      <ChangelogReleaseCard
        :release="release"
        @export="openExporter"
      />
    </div>

    <!-- Exporter Modal -->
    <ChangelogExporterModal
      v-model:open="showExporter"
      :release="selectedExportRelease"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft, AlertTriangle } from 'lucide-vue-next'
import type { Release } from '~/types/chronicle'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: response, pending, error } = await useFetch<{ success: boolean; data: Release }>(
  `/api/releases/${slug.value}`,
  { key: `release:${slug.value}` }
)

const release = computed(() => response.value?.data || null)

useHead(() => ({
  title: release.value
    ? `${release.value.version} — ${release.value.title} | Chronicle`
    : 'Release Notes | Chronicle',
  meta: [
    {
      name: 'description',
      content: release.value?.summary || 'Detailed release notes and change list on Chronicle.'
    },
    {
      property: 'og:title',
      content: release.value ? `${release.value.version} — ${release.value.title}` : 'Release Notes'
    },
    {
      property: 'og:description',
      content: release.value?.summary || 'Engineering release notes on Chronicle.'
    }
  ]
}))

const showExporter = ref(false)
const selectedExportRelease = ref<Release | null>(null)

const openExporter = (rel: Release) => {
  selectedExportRelease.value = rel
  showExporter.value = true
}
</script>
