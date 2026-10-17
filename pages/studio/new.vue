<template>
  <div class="space-y-6 pb-16">
    <!-- Header with Breadcrumbs & Autosave indicator -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
      <div class="space-y-1">
        <NuxtLink
          to="/studio"
          class="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </NuxtLink>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
          Author New Release
        </h1>
      </div>

      <!-- Autosave indicator -->
      <div class="flex items-center gap-3">
        <div
          v-if="autosavedAt"
          class="text-xs font-mono text-slate-500 flex items-center gap-1.5"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Autosaved {{ formattedAutosaveTime }}</span>
        </div>

        <UiButton
          v-if="hasRecoverableDraft"
          variant="outline"
          size="sm"
          @click="restoreRecoveredDraft"
        >
          <RotateCcw class="w-3.5 h-3.5 mr-1" />
          <span>Restore Backup</span>
        </UiButton>
      </div>
    </div>

    <!-- Main Authoring Form -->
    <form
      class="space-y-8"
      @submit.prevent="handlePublish"
    >
      <!-- Step 1: Version & SemVer Validation -->
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Version Input -->
          <div class="space-y-1.5">
            <label
              for="release-version"
              class="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono"
            >
              Release Version *
            </label>
            <input
              id="release-version"
              v-model="draft.version"
              type="text"
              required
              placeholder="v1.3.0"
              class="w-full text-sm font-mono bg-white border border-stone-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 shadow-paper-sm transition-all"
            >
          </div>

          <!-- Title Input -->
          <div class="md:col-span-2 space-y-1.5">
            <label
              for="release-title"
              class="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono"
            >
              Editorial Release Title *
            </label>
            <input
              id="release-title"
              v-model="draft.title"
              type="text"
              required
              placeholder="e.g. Real-Time Split Studio & Slack Multi-Exporter"
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
            for="release-summary"
            class="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono"
          >
            Executive Summary
          </label>
          <textarea
            id="release-summary"
            v-model="draft.summary"
            rows="3"
            placeholder="A concise 1-2 sentence executive overview explaining the core user and architectural impact of this release..."
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
              for="scheduled-date"
              class="block text-[11px] font-mono text-slate-600"
            >
              Scheduled Publication Date:
            </label>
            <input
              id="scheduled-date"
              v-model="draft.scheduledFor"
              type="datetime-local"
              class="w-full text-xs font-mono bg-stone-50 border border-stone-200 rounded p-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
          </div>

          <!-- Author attribution -->
          <div class="space-y-1">
            <label
              for="author-name"
              class="block text-[11px] font-mono text-slate-600"
            >
              Author Attribution:
            </label>
            <input
              id="author-name"
              v-model="draft.authorName"
              type="text"
              placeholder="Core Engineering"
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
          <UiButton
            variant="outline"
            size="sm"
            @click="handleReset"
          >
            Reset Form
          </UiButton>
        </div>

        <div class="flex items-center gap-3">
          <UiButton
            variant="secondary"
            size="md"
            :loading="isSaving"
            @click="handleSaveDraft"
          >
            <Bookmark class="w-4 h-4 mr-1.5 text-slate-500" />
            <span>Save as Draft</span>
          </UiButton>

          <UiButton
            variant="primary"
            size="md"
            type="submit"
            :loading="isSaving"
            :disabled="!isValidVersion || !draft.title"
          >
            <Check class="w-4 h-4 mr-1.5" />
            <span>{{ draft.status === 'PUBLISHED' ? 'Publish Release Now' : draft.status === 'SCHEDULED' ? 'Schedule Release' : 'Save & Close' }}</span>
          </UiButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, RotateCcw, Bookmark, Check } from 'lucide-vue-next'
import { useStudio } from '~/composables/useStudio'
import { useToast } from '~/composables/useToast'
import type { SemverType } from '~/types/chronicle'

definePageMeta({
  layout: 'studio'
})

useHead({
  title: 'Author New Release — Chronicle Studio'
})

const router = useRouter()
const toast = useToast()

const {
  draft,
  isSaving,
  autosavedAt,
  isValidVersion,
  versionError,
  recommendedBump,
  latestPublishedVersion,
  fetchLatestVersion,
  restoreAutosave,
  clearAutosave,
  saveRelease
} = useStudio()

const hasRecoverableDraft = ref(false)

onMounted(async () => {
  await fetchLatestVersion()

  // Check if localStorage has an unsaved draft
  if (process.client) {
    const backup = localStorage.getItem('chronicle:studio:draft_backup')
    if (backup) {
      hasRecoverableDraft.value = true
    }
  }
})

const restoreRecoveredDraft = () => {
  const success = restoreAutosave()
  if (success) {
    hasRecoverableDraft.value = false
    toast.info('Draft Restored', 'Recovered unsaved draft content from local backup.')
  }
}

const formattedAutosaveTime = computed(() => {
  if (!autosavedAt.value) return ''
  return autosavedAt.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})

const handleApplyRecommendation = (version: string, bumpType: SemverType) => {
  draft.value.version = version
  draft.value.semverType = bumpType
  toast.success('Version Updated', `Applied recommended SemVer ${bumpType} bump to ${version}.`)
}

const handleSaveDraft = async () => {
  const id = await saveRelease('DRAFT')
  if (id) {
    router.push('/studio')
  }
}

const handlePublish = async () => {
  const targetStatus = draft.value.status || 'PUBLISHED'
  const id = await saveRelease(targetStatus)
  if (id) {
    if (targetStatus === 'PUBLISHED') {
      router.push(`/#${draft.value.version}`)
    } else {
      router.push('/studio')
    }
  }
}

const handleReset = () => {
  if (confirm('Are you sure you want to discard unsaved changes?')) {
    clearAutosave()
    draft.value = {
      version: recommendedBump.value.suggestedVersion,
      title: '',
      summary: '',
      contentMarkdown: '',
      status: 'DRAFT',
      semverType: recommendedBump.value.bumpType,
      scheduledFor: null,
      publishedAt: null,
      authorName: 'Core Engineering',
      authorAvatar: null,
      items: []
    }
    toast.info('Form Reset', 'Draft form has been cleared.')
  }
}
</script>
