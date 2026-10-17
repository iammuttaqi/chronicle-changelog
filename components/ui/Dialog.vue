<template>
  <DialogRoot
    :open="open"
    @update:open="$emit('update:open', $event)"
  >
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-150 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogContent
        :class="[
          'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full bg-white border border-stone-200 rounded-xl p-6 shadow-modal duration-200 focus:outline-none max-h-[90vh] overflow-y-auto',
          maxWidthClass
        ]"
      >
        <div class="flex items-start justify-between gap-4 mb-4">
          <div class="flex-1 min-w-0">
            <DialogTitle
              v-if="title"
              class="text-lg font-semibold text-slate-900 leading-snug tracking-tight"
            >
              {{ title }}
            </DialogTitle>
            <DialogDescription
              v-if="description"
              class="text-sm text-slate-500 mt-1 leading-relaxed"
            >
              {{ description }}
            </DialogDescription>
          </div>
          <DialogClose class="shrink-0 rounded-md p-1.5 text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900">
            <X class="w-4 h-4" />
            <span class="sr-only">Close</span>
          </DialogClose>
        </div>
        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose
} from 'radix-vue'
import { X } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    description?: string
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  }>(),
  {
    open: false,
    title: '',
    description: '',
    maxWidth: 'lg'
  }
)

defineEmits<{
  'update:open': [value: boolean]
}>()

const maxWidthClass = computed(() => {
  switch (props.maxWidth) {
    case 'sm': return 'max-w-sm'
    case 'md': return 'max-w-md'
    case 'xl': return 'max-w-xl'
    case '2xl': return 'max-w-2xl'
    case 'lg':
    default: return 'max-w-lg'
  }
})
</script>
