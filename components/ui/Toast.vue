<template>
  <div
    class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    aria-live="polite"
  >
    <TransitionGroup
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform translate-y-2 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto bg-white border border-stone-200 rounded-lg p-3.5 shadow-paper-lg flex items-start gap-3 text-sm text-slate-800"
      >
        <div class="mt-0.5 shrink-0">
          <CheckCircle2
            v-if="toast.type === 'success'"
            class="w-4 h-4 text-emerald-600"
          />
          <AlertCircle
            v-else-if="toast.type === 'error'"
            class="w-4 h-4 text-rose-600"
          />
          <Info
            v-else
            class="w-4 h-4 text-slate-600"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-slate-900 leading-snug">{{ toast.title }}</p>
          <p
            v-if="toast.description"
            class="text-xs text-slate-500 mt-0.5 leading-relaxed"
          >
            {{ toast.description }}
          </p>
        </div>
        <button
          type="button"
          class="shrink-0 p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          @click="dismiss(toast.id)"
        >
          <X class="w-3.5 h-3.5" />
          <span class="sr-only">Close</span>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-vue-next'
import { useToast } from '~/composables/useToast'

const { toasts, dismiss } = useToast()
</script>
