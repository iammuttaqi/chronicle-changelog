<template>
  <span
    :class="[
      'inline-flex items-center font-medium border select-none transition-all duration-150',
      categoryStyle.container,
      size === 'sm' ? 'text-[11px] px-2 py-0.5 rounded gap-1 font-mono uppercase tracking-wider' : 'text-xs px-2.5 py-1 rounded-md gap-1.5',
      interactive ? 'cursor-pointer hover:shadow-paper-sm active:scale-[0.98]' : '',
      active ? 'ring-2 ring-slate-900 ring-offset-1 font-semibold' : ''
    ]"
  >
    <component
      :is="categoryStyle.icon"
      v-if="showIcon"
      :class="[size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5', 'shrink-0 stroke-[2]']"
    />
    <span>{{ categoryStyle.label }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Sparkles, Zap, Wrench, AlertTriangle } from 'lucide-vue-next'
import type { ChangeCategory } from '~/types/chronicle'

const props = withDefaults(
  defineProps<{
    category: ChangeCategory | string
    size?: 'sm' | 'md'
    showIcon?: boolean
    interactive?: boolean
    active?: boolean
  }>(),
  {
    size: 'sm',
    showIcon: true,
    interactive: false,
    active: false
  }
)

const categoryStyle = computed(() => {
  const cat = (props.category || 'FEATURE').toUpperCase()

  switch (cat) {
    case 'BREAKING':
      return {
        label: 'Breaking Change',
        icon: AlertTriangle,
        container: 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-300'
      }
    case 'IMPROVEMENT':
      return {
        label: 'Improvement',
        icon: Zap,
        container: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-300'
      }
    case 'FIX':
      return {
        label: 'Fix',
        icon: Wrench,
        container: 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-300'
      }
    case 'FEATURE':
    default:
      return {
        label: 'Feature',
        icon: Sparkles,
        container: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-300'
      }
  }
})
</script>
