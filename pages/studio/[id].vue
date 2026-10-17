<template>
  <div class="space-y-6 pb-16">
    <!-- Header with Breadcrumbs & Action bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
      <div class="space-y-1">
        <NuxtLink
          to="/studio"
          class="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </NuxtLink>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">
            Edit Release
          </h1>
          <span class="font-mono text-sm font-bold bg-stone-100 border border-stone-200 px-2 py-0.5 rounded text-slate-800">
            {{ draft.version }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          v-if="draft.status === 'PUBLISHED'"
          :to="`/#${draft.version}`"
          target="_blank"
          class="inline-flex items-center gap-1.5 text-xs font-mono text-slate-600 hover:text-orange-600 px-3 py-1.5 rounded-md hover:bg-stone-100 transition-colors"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          <span>View on Public Timeline</span>
        </NuxtLink>

        <UiButton
          variant="danger"
          size="sm"
          @click="showDeleteDialog = true"
        >
          <Trash2 class="w-3.5 h-3.5 mr-1" />
          <span>Delete</span>
        </UiButton>
      </div>
    </div>

    <!-- Main Authoring Form -->
    <form
      class="space-y-8"
      @submit.prevent="handleSave"
    >
      <!-- Step 1: Version & SemVer Validation -->
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Version Input -->
          <div class="space-y-1.5">
            <label
              for="edit-version"
              class="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono"
            >
              Release Version *
            </label>
            <input
              id="edit-version"
              v-model="draft.version"
              type="text"
              required
              class="w-full text-sm font-mono bg-white border border-stone-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 shadow-paper-sm transition-all"
            >
          </div>

          <!-- Title Input -->
          <div class="md:col-span-2 space-y-1.5">
            <label
              for="edit-title"
              class="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono"
            >
              Editorial Release Title *
            </label>
            <input
              id="edit-title"
              v-model="draft.title"
              type="text"
              required
              class="w-full text-sm bg-white border border-stone-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 shadow-paper-sm transition-all"
            >
          </div>
        </div>

        <!-- SemVer Guidance Banner -->
        <StudioSemverHelper
          :current-version="draft.version"
          :is-valid="isValidVersion"
          :error-message="versionError"
          :latest-version="latestPublishedVersion"
          :recommendation="recommendedBump"
          @apply="handleApplyRecommendation"
        />
      </div>

      <!-- Step 2: Executive Summary & Publication Status -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Executive Summary -->
        <div class="md:col-span-2 space-y-1.5">
          <label
            for="edit-summary"
            class="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono"
          >
            Executive Summary
          </label>
          <textarea
            id="edit-summary"
            v-model="draft.summary"
            rows="3"
            class="w-full text-sm bg-white border border-stone-200 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 shadow-paper-sm resize-none leading-relaxed transition-all"
          />
        </div>

        <!-- Status & Author Info -->
        <div class="space-y-4 bg-white border border-stone-200 rounded-xl p-4 shadow-paper-sm">
          <!-- Status Picker -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono">
              Publication State
            </label>
            <div class="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs font-medium">
              <button
                type="button"
                :class="[
                  'py-1.5 text-center rounded transition-all select-none',
                  draft.status === 'DRAFT'
                    ? 'bg-white text-slate-900 font-semibold shadow-paper-sm'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
                @click="draft.status = 'DRAFT'"
              >
                Draft
              </button>
              <button
                type="button"
                :class="[
                  'py-1.5 text-center rounded transition-all select-none',
                  draft.status === 'SCHEDULED'
                    ? 'bg-white text-slate-900 font-semibold shadow-paper-sm'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
                @click="draft.status = 'SCHEDULED'"
              >
                Schedule
              </button>
              <button
                type="button"
                :class="[
                  'py-1.5 text-center rounded transition-all select-none',
                  draft.status === 'PUBLISHED'
                    ? 'bg-white text-slate-900 font-semibold shadow-paper-sm'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
                @click="draft.status = 'PUBLISHED'"
              >
                Publish
              </button>
            </div>
          </div>

          <!-- Scheduled Date Picker if SCHEDULED -->
          <div
            v-if="draft.status === 'SCHEDULED'"
            class="space-y-1"
          >
            <label
              for="edit-scheduled-date"
              class="block text-[11px] font-mono text-slate-600"
            >
              Scheduled Publication Date:
            </label>
            <input
              id="edit-scheduled-date"
              v-model="draft.scheduledFor"
              type="datetime-local"
              class="w-full text-xs font-mono bg-stone-50 border border-stone-200 rounded p-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
          </div>

          <!-- Author attribution -->
          <div class="space-y-1">
            <label
              for="edit-author-name"
              class="block text-[11px] font-mono text-slate-600"
            >
              Author Attribution:
            </label>
            <input
              id="edit-author-name"
              v-model="draft.authorName"
              type="text"
              class="w-full text-xs bg-stone-50 border border-stone-200 rounded p-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
          </div>
        </div>
      </div>

      <!-- Step 3: Categorized Change Items Manager -->
      <StudioChangeItemManager :items="draft.items" />

      <!-- Step 4: Split-Screen Live Markdown Authoring -->
      <div class="space-y-2">
        <label class="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono">
          Editorial Release Notes (Markdown &amp; Real-Time Preview)
        </label>
        <StudioMarkdownEditor v-model="draft.contentMarkdown" />
      </div>

      <!-- Sticky Footer Action Bar -->
      <div class="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md border border-stone-200 p-4 rounded-xl shadow-paper-lg flex items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <NuxtLink to="/studio">
            <UiButton
              variant="ghost"
              size="sm"
            >
              Cancel
            </UiButton>
          </NuxtLink>
        </div>

        <div class="flex items-center gap-3">
          <UiButton
            variant="primary"
            size="md"
            type="submit"
            :loading="isSaving"
            :disabled="!isValidVersion || !draft.title"
          >
            <Check class="w-4 h-4 mr-1.5" />
            <span>Save Changes</span>
          </UiButton>
        </div>
      </div>
    </form>

    <!-- Delete Confirmation Dialog -->
    <UiDialog
      :open="showDeleteDialog"
      title="Delete Release"
      description="Are you sure you want to delete this release permanently?"
      max-width="md"
      @update:open="showDeleteDialog = $event"
    >
      <div class="space-y-4 pt-2">
        <div class="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
          Target version: <strong>{{ draft.version }} — {{ draft.title }}</strong>
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
import { ref, onMounted } from 'vue'
import { ArrowLeft, ExternalLink, Trash2, Check } from 'lucide-vue-next'
import { useStudio } from '~/composables/useStudio'
import { useToast } from '~/composables/useToast'
import type { SemverType } from '~/types/chronicle'

definePageMeta({
  layout: 'studio'
})

useHead({
  title: 'Edit Release — Chronicle Studio'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const releaseId = route.params.id as string

const showDeleteDialog = ref(false)
const deleting = ref(false)

const {
  draft,
  isSaving,
  isValidVersion,
  versionError,
  recommendedBump,
  latestPublishedVersion,
  fetchLatestVersion,
  loadRelease,
  saveRelease
} = useStudio(releaseId)

onMounted(async () => {
  await fetchLatestVersion()
  await loadRelease(releaseId)
})

const handleApplyRecommendation = (version: string, bumpType: SemverType) => {
  draft.value.version = version
  draft.value.semverType = bumpType
  toast.success('Version Updated', `Applied recommended SemVer ${bumpType} bump.`)
}

const handleSave = async () => {
  const id = await saveRelease()
  if (id) {
    router.push('/studio')
  }
}

const handleDelete = async () => {
  deleting.value = true
  try {
    await $fetch(`/api/releases/${releaseId}`, {
      method: 'DELETE'
    })
    toast.success('Release Deleted', `Release ${draft.value.version} was removed.`)
    showDeleteDialog.value = false
    router.push('/studio')
  } catch (err: any) {
    toast.error('Delete Failed', err?.data?.statusMessage || 'Could not delete release.')
  } finally {
    deleting.value = false
  }
}
</script>
