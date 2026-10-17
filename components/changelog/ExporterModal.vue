<template>
  <UiDialog
    :open="open"
    title="Export Release Notes"
    description="Copy formatted announcement copy for engineering and community syndication channels."
    max-width="xl"
    @update:open="$emit('update:open', $event)"
  >
    <div
      v-if="release"
      class="space-y-4 pt-1"
    >
      <!-- Target selection tabs -->
      <div class="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg border border-stone-200">
        <button
          type="button"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-md transition-all select-none',
            activeTab === 'GITHUB'
              ? 'bg-white text-slate-900 shadow-paper-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          ]"
          @click="selectTab('GITHUB')"
        >
          <Code2 class="w-3.5 h-3.5" />
          <span>GitHub Release</span>
        </button>

        <button
          type="button"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-md transition-all select-none',
            activeTab === 'SLACK'
              ? 'bg-white text-slate-900 shadow-paper-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          ]"
          @click="selectTab('SLACK')"
        >
          <MessageSquare class="w-3.5 h-3.5" />
          <span>Slack mrkdwn</span>
        </button>

        <button
          type="button"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-md transition-all select-none',
            activeTab === 'HTML_EMBED'
              ? 'bg-white text-slate-900 shadow-paper-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          ]"
          @click="selectTab('HTML_EMBED')"
        >
          <FileCode class="w-3.5 h-3.5" />
          <span>HTML Embed Card</span>
        </button>
      </div>

      <!-- Preview Textarea -->
      <div class="relative">
        <div
          v-if="loading"
          class="h-64 flex items-center justify-center bg-stone-900 rounded-lg text-slate-400 text-xs font-mono"
        >
          Generating formatted copy...
        </div>
        <textarea
          v-else
          :value="formattedContent"
          readonly
          rows="12"
          class="w-full font-mono text-xs p-3.5 bg-stone-900 text-stone-100 rounded-lg border border-stone-800 focus:outline-none resize-none leading-relaxed selection:bg-orange-600 selection:text-white"
        />
      </div>

      <!-- Action Footer -->
      <div class="flex items-center justify-between pt-2">
        <span class="text-xs text-slate-500 font-mono">
          Target: {{ activeTabLabel }}
        </span>
        <div class="flex items-center gap-2">
          <UiButton
            variant="ghost"
            size="sm"
            @click="$emit('update:open', false)"
          >
            Cancel
          </UiButton>
          <UiButton
            variant="primary"
            size="sm"
            :loading="loading"
            @click="handleCopy"
          >
            <component
              :is="copied ? Check : Copy"
              class="w-3.5 h-3.5 mr-1.5"
            />
            <span>{{ copied ? 'Copied to Clipboard' : 'Copy Formatted Text' }}</span>
          </UiButton>
        </div>
      </div>
    </div>
  </UiDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Code2, MessageSquare, FileCode, Copy, Check } from 'lucide-vue-next'
import { useExporter } from '~/composables/useExporter'
import { useToast } from '~/composables/useToast'
import type { Release, ExportTarget } from '~/types/chronicle'

const props = defineProps<{
  open: boolean
  release: Release | null
}>()

defineEmits<{
  'update:open': [value: boolean]
}>()

const activeTab = ref<ExportTarget>('GITHUB')
const formattedContent = ref('')
const loading = ref(false)
const copied = ref(false)

const { exportRelease } = useExporter()
const toast = useToast()

const activeTabLabel = computed(() => {
  switch (activeTab.value) {
    case 'GITHUB': return 'GitHub Release Markdown'
    case 'SLACK': return 'Slack mrkdwn format'
    case 'HTML_EMBED': return 'Standalone HTML card'
  }
})

const loadExport = async () => {
  if (!props.release) return
  loading.value = true
  try {
    const text = await exportRelease(props.release.id, activeTab.value)
    formattedContent.value = text
  } finally {
    loading.value = false
  }
}

const selectTab = (tab: ExportTarget) => {
  activeTab.value = tab
  copied.value = false
  loadExport()
}

watch(
  () => [props.open, props.release],
  ([isOpen, rel]) => {
    if (isOpen && rel) {
      copied.value = false
      loadExport()
    }
  }
)

const handleCopy = async () => {
  if (!formattedContent.value) return
  try {
    await navigator.clipboard.writeText(formattedContent.value)
    copied.value = true
    toast.success(
      `Copied ${activeTabLabel.value}`,
      'Formatted release copy is in your clipboard.'
    )
    setTimeout(() => {
      copied.value = false
    }, 2500)
  } catch (err) {
    console.error('Failed to copy text', err)
  }
}
</script>
