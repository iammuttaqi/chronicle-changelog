<template>
  <div class="bg-white border border-stone-200 rounded-xl p-12 text-center shadow-paper-sm max-w-lg mx-auto">
    <div class="mx-auto w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-slate-500 mb-4">
      <Search class="w-5 h-5 text-slate-600" />
    </div>
    <h3 class="text-base font-semibold text-slate-900 tracking-tight">
      {{ title }}
    </h3>
    <p class="text-sm text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
      {{ description }}
    </p>
    <div
      v-if="showReset"
      class="mt-5"
    >
      <UiButton
        variant="secondary"
        size="sm"
        @click="$emit('reset')"
      >
        <RotateCcw class="w-3.5 h-3.5 mr-1.5 text-slate-500" />
        Clear filters
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, RotateCcw } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    showReset?: boolean
  }>(),
  {
    title: 'No releases found',
    description: 'We could not find any releases matching your search query or selected category filter.',
    showReset: true
  }
)

defineEmits<{
  reset: []
}>()
</script>
