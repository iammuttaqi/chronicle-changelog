<template>
  <div class="bg-white border border-stone-200 rounded-xl p-4 shadow-paper-sm space-y-3">
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <Tag class="w-4 h-4 text-orange-600" />
        <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-800 font-mono">
          Semantic Versioning Validator
        </h4>
      </div>

      <!-- Live validation indicator -->
      <div class="flex items-center gap-1.5 text-xs font-mono">
        <span
          v-if="isValid"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200"
        >
          <Check class="w-3 h-3 stroke-[2.5]" />
          <span>Valid SemVer</span>
        </span>
        <span
          v-else
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200"
        >
          <AlertCircle class="w-3 h-3 stroke-[2.5]" />
          <span>Invalid SemVer</span>
        </span>
      </div>
    </div>

    <!-- Recommendation Box -->
    <div
      v-if="recommendation"
      class="bg-stone-50 border border-stone-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
    >
      <div class="space-y-0.5">
        <div class="flex items-center gap-2">
          <span class="text-slate-500 font-medium">Recommended Next Bump:</span>
          <span class="font-mono font-bold text-slate-900 bg-white border border-stone-200 px-2 py-0.5 rounded">
            {{ recommendation.suggestedVersion }}
          </span>
          <UiBadge
            :variant="recommendation.bumpType === 'MAJOR' ? 'accent' : 'default'"
            size="sm"
          >
            {{ recommendation.bumpType }}
          </UiBadge>
        </div>
        <p class="text-slate-500 text-[11px] leading-relaxed">
          {{ recommendation.reason }} (Base: {{ latestVersion }})
        </p>
      </div>

      <UiButton
        v-if="currentVersion !== recommendation.suggestedVersion"
        variant="secondary"
        size="sm"
        class="shrink-0 text-xs"
        @click="$emit('apply', recommendation.suggestedVersion, recommendation.bumpType)"
      >
        <Sparkles class="w-3.5 h-3.5 mr-1.5 text-orange-600" />
        <span>Apply Suggested</span>
      </UiButton>
    </div>

    <p
      v-if="errorMessage"
      class="text-xs text-rose-600 font-mono"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Tag, Check, AlertCircle, Sparkles } from 'lucide-vue-next'
import type { SemverType } from '~/types/chronicle'

defineProps<{
  currentVersion: string
  isValid: boolean
  errorMessage?: string | null
  latestVersion: string
  recommendation?: {
    suggestedVersion: string
    bumpType: SemverType
    reason: string
  }
}>()

defineEmits<{
  apply: [version: string, bumpType: SemverType]
}>()
</script>
