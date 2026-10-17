<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'outline' | 'subtle' | 'accent' | 'published' | 'draft' | 'scheduled'
    size?: 'sm' | 'md'
    class?: string
  }>(),
  {
    variant: 'default',
    size: 'md',
    class: ''
  }
)

const baseStyles = 'inline-flex items-center font-medium select-none transition-colors'

const variantStyles: Record<string, string> = {
  default: 'bg-stone-100 text-slate-800 border border-stone-200',
  outline: 'bg-transparent text-slate-700 border border-stone-300',
  subtle: 'bg-stone-50 text-slate-600 border border-stone-200/80',
  accent: 'bg-orange-50 text-orange-700 border border-orange-200',
  published: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  draft: 'bg-amber-50 text-amber-700 border border-amber-200',
  scheduled: 'bg-sky-50 text-sky-700 border border-sky-200'
}

const sizeStyles: Record<string, string> = {
  sm: 'text-[11px] px-2 py-0.5 rounded tracking-wide font-mono',
  md: 'text-xs px-2.5 py-1 rounded-md tracking-normal'
}

const classes = computed(() => {
  return [
    baseStyles,
    variantStyles[props.variant] || variantStyles.default,
    sizeStyles[props.size] || sizeStyles.md,
    props.class
  ].join(' ')
})
</script>
