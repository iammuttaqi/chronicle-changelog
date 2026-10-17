<template>
  <div class="bg-white border border-stone-200 rounded-xl shadow-paper-sm overflow-hidden flex flex-col">
    <!-- Header / Toolbar -->
    <div class="bg-stone-50 border-b border-stone-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
      <!-- Formatting Buttons -->
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="p-1.5 rounded hover:bg-stone-200 text-slate-600 transition-colors"
          title="Bold"
          @click="insertFormat('**', '**')"
        >
          <Bold class="w-4 h-4" />
        </button>
        <button
          type="button"
          class="p-1.5 rounded hover:bg-stone-200 text-slate-600 transition-colors"
          title="Italic"
          @click="insertFormat('*', '*')"
        >
          <Italic class="w-4 h-4" />
        </button>
        <button
          type="button"
          class="p-1.5 rounded hover:bg-stone-200 text-slate-600 transition-colors"
          title="Heading"
          @click="insertFormat('## ', '')"
        >
          <Heading class="w-4 h-4" />
        </button>
        <span class="w-px h-4 bg-stone-300 mx-1" />
        <button
          type="button"
          class="p-1.5 rounded hover:bg-stone-200 text-slate-600 transition-colors"
          title="Code Block"
          @click="insertFormat('```\n', '\n```')"
        >
          <Code2 class="w-4 h-4" />
        </button>
        <button
          type="button"
          class="p-1.5 rounded hover:bg-stone-200 text-slate-600 transition-colors"
          title="Bullet List"
          @click="insertFormat('- ', '')"
        >
          <List class="w-4 h-4" />
        </button>
        <button
          type="button"
          class="p-1.5 rounded hover:bg-stone-200 text-slate-600 transition-colors"
          title="Quote"
          @click="insertFormat('> ', '')"
        >
          <Quote class="w-4 h-4" />
        </button>
        <button
          type="button"
          class="p-1.5 rounded hover:bg-stone-200 text-slate-600 transition-colors"
          title="Link"
          @click="insertFormat('[', '](https://)')"
        >
          <LinkIcon class="w-4 h-4" />
        </button>
      </div>

      <!-- View Mode Tabs (for responsive layouts) -->
      <div class="flex items-center gap-1 bg-stone-200/70 p-0.5 rounded-lg text-xs font-medium lg:hidden">
        <button
          type="button"
          :class="[
            'px-2.5 py-1 rounded transition-colors',
            mobileView === 'split' ? 'bg-white shadow-paper-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
          ]"
          @click="mobileView = 'split'"
        >
          Split
        </button>
        <button
          type="button"
          :class="[
            'px-2.5 py-1 rounded transition-colors',
            mobileView === 'write' ? 'bg-white shadow-paper-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
          ]"
          @click="mobileView = 'write'"
        >
          Write
        </button>
        <button
          type="button"
          :class="[
            'px-2.5 py-1 rounded transition-colors',
            mobileView === 'preview' ? 'bg-white shadow-paper-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
          ]"
          @click="mobileView = 'preview'"
        >
          Preview
        </button>
      </div>

      <!-- Status indicator -->
      <div class="text-xs text-slate-500 font-mono hidden sm:flex items-center gap-3">
        <span>{{ wordCount }} words</span>
        <span>•</span>
        <span>{{ modelValue ? modelValue.length : 0 }} chars</span>
      </div>
    </div>

    <!-- Split-Screen Body -->
    <div class="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-stone-200 min-h-[420px]">
      <!-- Left Pane: Markdown Input -->
      <div
        :class="[
          'relative flex flex-col',
          mobileView === 'preview' ? 'hidden lg:flex' : 'flex'
        ]"
      >
        <div class="bg-stone-50/70 px-4 py-1.5 border-b border-stone-200/60 text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <span>MARKDOWN SOURCE</span>
          <span class="text-stone-400">GitHub Flavored Markdown</span>
        </div>
        <textarea
          ref="textareaRef"
          :value="modelValue"
          rows="18"
          placeholder="Write in-depth editorial notes, architectural context, code snippets, or migration guides..."
          class="w-full flex-1 p-4 font-mono text-xs sm:text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none resize-none leading-relaxed selection:bg-orange-100 selection:text-orange-900"
          @input="handleInput"
        />
      </div>

      <!-- Right Pane: Live HTML Preview -->
      <div
        :class="[
          'flex flex-col bg-white overflow-y-auto',
          mobileView === 'write' ? 'hidden lg:flex' : 'flex'
        ]"
      >
        <div class="bg-stone-50/70 px-4 py-1.5 border-b border-stone-200/60 text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <span>REAL-TIME PREVIEW</span>
          <span class="text-emerald-600 font-medium flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Live Sync
          </span>
        </div>
        <div class="p-4 sm:p-6 overflow-y-auto max-h-[600px]">
          <div
            v-if="renderedHtml"
            class="prose prose-sm sm:prose-base max-w-none text-slate-700"
            v-html="renderedHtml"
          />
          <div
            v-else
            class="h-48 flex items-center justify-center text-slate-400 text-xs italic font-sans"
          >
            Markdown preview will render here in real time...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Bold,
  Italic,
  Heading,
  Code2,
  List,
  Quote,
  Link as LinkIcon
} from 'lucide-vue-next'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'

const props = withDefaults(
  defineProps<{
    modelValue: string
  }>(),
  {
    modelValue: ''
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const mobileView = ref<'split' | 'write' | 'preview'>('split')

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  typographer: true
})

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const renderedHtml = computed(() => {
  if (!props.modelValue) return ''
  const rawHtml = md.render(props.modelValue)
  if (process.client && typeof window !== 'undefined') {
    return DOMPurify.sanitize(rawHtml)
  }
  return rawHtml
})

const wordCount = computed(() => {
  if (!props.modelValue) return 0
  return props.modelValue.trim().split(/\s+/).filter(Boolean).length
})

const insertFormat = (before: string, after: string) => {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  const selected = text.substring(start, end)

  const replacement = `${before}${selected || 'text'}${after}`
  const newValue = text.substring(0, start) + replacement + text.substring(end)

  emit('update:modelValue', newValue)

  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(
      start + before.length,
      start + before.length + (selected.length || 4)
    )
  }, 10)
}
</script>
