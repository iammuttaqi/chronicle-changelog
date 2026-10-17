<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="classes"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-0.5 mr-2 h-4 w-4 shrink-0 text-current opacity-75"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg' | 'icon'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    class?: string
  }>(),
  {
    variant: 'secondary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    class: ''
  }
)

const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 ease-out select-none focus:outline-none disabled:opacity-50 disabled:pointer-events-none'

const variantStyles: Record<string, string> = {
  primary: 'bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800 border border-orange-700/20 shadow-paper-sm focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2',
  secondary: 'bg-white text-slate-800 hover:bg-stone-50 active:bg-stone-100 border border-stone-200 shadow-paper-sm focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2',
  outline: 'bg-transparent text-slate-700 hover:bg-stone-100 border border-stone-300 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2',
  ghost: 'bg-transparent text-slate-700 hover:bg-stone-100 active:bg-stone-200 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 border border-rose-700/20 shadow-paper-sm focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2'
}

const sizeStyles: Record<string, string> = {
  sm: 'text-xs px-2.5 py-1.5 h-8 gap-1.5 rounded-md',
  md: 'text-sm px-3.5 py-2 h-9 gap-2 rounded-md',
  lg: 'text-base px-5 py-2.5 h-11 gap-2.5 rounded-lg',
  icon: 'h-8 w-8 p-0 rounded-md justify-center'
}

const classes = computed(() => {
  return [
    baseStyles,
    variantStyles[props.variant] || variantStyles.secondary,
    sizeStyles[props.size] || sizeStyles.md,
    props.class
  ].join(' ')
})
</script>
