<template>
  <div class="space-y-6">
    <!-- Dashboard Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Changelog Management
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Draft, validate Semantic Versioning, and publish releases to your public timeline and syndication feeds.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink to="/studio/new">
          <UiButton
            variant="primary"
            size="md"
          >
            <Plus class="w-4 h-4 mr-1.5" />
            <span>Draft Release</span>
          </UiButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Status Tabs -->
    <div class="flex items-center gap-2 border-b border-stone-200 pb-px">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        type="button"
        :class="[
          'px-3.5 py-2 text-xs font-medium border-b-2 transition-colors select-none flex items-center gap-2',
          activeTab === tab.value
            ? 'border-orange-600 text-slate-900 font-semibold'
            : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-stone-300'
        ]"
        @click="activeTab = tab.value"
      >
        <span>{{ tab.label }}</span>
        <span
          :class="[
            'text-[11px] font-mono px-1.5 py-0.2 rounded-full',
            activeTab === tab.value ? 'bg-orange-100 text-orange-800' : 'bg-stone-100 text-slate-500'
          ]"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Loading State -->
    <div
      v-if="pending"
      class="space-y-4"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="h-20 bg-stone-100 rounded-lg animate-pulse"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredReleases.length === 0"
      class="bg-white border border-stone-200 rounded-xl p-12 text-center shadow-paper-sm max-w-lg mx-auto space-y-4"
    >
      <div class="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 text-slate-500 flex items-center justify-center mx-auto">
        <FileText class="w-6 h-6 text-slate-600" />
      </div>
      <div>
        <h3 class="text-base font-semibold text-slate-900">
          No releases found
        </h3>
        <p class="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          {{ activeTab === 'ALL' ? 'No releases authored yet. Start drafting your initial release.' : `No releases currently in ${activeTab.toLowerCase()} status.` }}
        </p>
      </div>
      <div class="pt-2">
        <NuxtLink to="/studio/new">
          <UiButton
            variant="primary"
            size="sm"
          >
            <Plus class="w-3.5 h-3.5 mr-1" />
            <span>Create Release</span>
          </UiButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Releases List -->
    <div
      v-else
      class="bg-white border border-stone-200 rounded-xl shadow-paper-sm divide-y divide-stone-100 overflow-hidden"
    >
      <div
        v-for="rel in filteredReleases"
        :key="rel.id"
        class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors"
      >
        <!-- Version & Details -->
        <div class="space-y-1.5 flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <span class="font-mono font-bold text-sm text-slate-900 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
              {{ rel.version }}
            </span>
            <UiBadge
              :variant="statusBadgeVariant(rel.status)"
              size="sm"
            >
              {{ rel.status }}
            </UiBadge>
            <UiBadge
              variant="subtle"
              size="sm"
            >
              {{ rel.semverType }}
            </UiBadge>
            <span class="text-xs text-slate-400 font-mono">
              {{ rel.items?.length || 0 }} {{ (rel.items?.length || 0) === 1 ? 'change' : 'changes' }}
            </span>
          </div>

          <h3 class="text-base font-semibold text-slate-900 truncate">
            {{ rel.title }}
          </h3>

          <p
            v-if="rel.summary"
            class="text-xs text-slate-500 line-clamp-1"
          >
            {{ rel.summary }}
          </p>

          <div class="text-[11px] text-slate-400 font-mono">
            <span v-if="rel.status === 'PUBLISHED' && rel.publishedAt">
              Published on {{ formatDate(rel.publishedAt) }}
            </span>
            <span v-else-if="rel.status === 'SCHEDULED' && rel.scheduledFor">
              Scheduled for {{ formatDate(rel.scheduledFor) }}
            </span>
            <span v-else>
              Last modified {{ formatDate(rel.updatedAt) }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <NuxtLink
            v-if="rel.status === 'PUBLISHED'"
            :to="`/#${rel.version}`"
            target="_blank"
            class="p-2 text-slate-400 hover:text-slate-700 hover:bg-stone-100 rounded-md transition-colors"
            title="View on Public Timeline"
          >
            <ExternalLink class="w-4 h-4" />
          </NuxtLink>

          <NuxtLink :to="`/studio/${rel.id}`">
            <UiButton
              variant="secondary"
              size="sm"
            >
              <Pencil class="w-3.5 h-3.5 mr-1 text-slate-500" />
              <span>Edit</span>
            </UiButton>
          </NuxtLink>

          <button
            type="button"
            class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            title="Delete release"
            @click="confirmDelete(rel)"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <UiDialog
      :open="showDeleteDialog"
      title="Delete Release"
      description="Are you sure you want to delete this release? This will permanently remove its categorized change items and revoke public permalinks."
      max-width="md"
      @update:open="showDeleteDialog = $event"
    >
      <div
        v-if="releaseToDelete"
        class="space-y-4 pt-2"
      >
        <div class="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
          Target version: <strong>{{ releaseToDelete.version }} — {{ releaseToDelete.title }}</strong>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2">
          <UiButton
            variant="ghost"
            size="sm"
            @click="showDeleteDialog = false"
          >
            Cancel
          </UiButton>
          <UiButton
            variant="danger"
            size="sm"
            :loading="deleting"
            @click="handleDelete"
          >
            <Trash2 class="w-3.5 h-3.5 mr-1.5" />
            <span>Confirm Delete</span>
          </UiButton>
        </div>
      </div>
    </UiDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, ExternalLink, Pencil, Trash2, FileText } from 'lucide-vue-next'
import { useToast } from '~/composables/useToast'
import type { Release } from '~/types/chronicle'

definePageMeta({
  layout: 'studio'
})

useHead({
  title: 'Changelog Management — Chronicle Studio'
})

const toast = useToast()
const activeTab = ref<'ALL' | 'DRAFT' | 'SCHEDULED' | 'PUBLISHED'>('ALL')
const showDeleteDialog = ref(false)
const releaseToDelete = ref<Release | null>(null)
const deleting = ref(false)

const { data: response, pending, refresh } = await useFetch<{ success: boolean; data: Release[] }>(
  '/api/releases?status=ALL',
  { key: 'studio:releases:all' }
)

const releases = computed(() => response.value?.data || [])

const tabs = computed(() => [
  { value: 'ALL', label: 'All Releases', count: releases.value.length },
  { value: 'PUBLISHED', label: 'Published', count: releases.value.filter((r) => r.status === 'PUBLISHED').length },
  { value: 'DRAFT', label: 'Drafts', count: releases.value.filter((r) => r.status === 'DRAFT').length },
  { value: 'SCHEDULED', label: 'Scheduled', count: releases.value.filter((r) => r.status === 'SCHEDULED').length }
])

const filteredReleases = computed(() => {
  if (activeTab.value === 'ALL') return releases.value
  return releases.value.filter((r) => r.status === activeTab.value)
})

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case 'PUBLISHED': return 'published'
    case 'SCHEDULED': return 'scheduled'
    case 'DRAFT':
    default: return 'draft'
  }
}

const formatDate = (dateInput: Date | string) => {
  const d = new Date(dateInput)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const confirmDelete = (rel: Release) => {
  releaseToDelete.value = rel
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!releaseToDelete.value) return
  deleting.value = true
  try {
    await $fetch(`/api/releases/${releaseToDelete.value.id}`, {
      method: 'DELETE'
    })
    toast.success('Release Deleted', `Release ${releaseToDelete.value.version} was removed.`)
    showDeleteDialog.value = false
    releaseToDelete.value = null
    await refresh()
  } catch (err: any) {
    toast.error('Delete Failed', err?.data?.statusMessage || 'Could not delete release.')
  } finally {
    deleting.value = false
  }
}
</script>
