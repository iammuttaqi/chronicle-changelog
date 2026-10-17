<template>
  <div class="sticky top-0 z-30 bg-stone-50/95 backdrop-blur-md border-b border-stone-200 py-3.5 -mx-4 px-4 sm:-mx-6 sm:px-6 transition-all duration-150">
    <div class="max-w-4xl mx-auto flex flex-col gap-3">
      <!-- Search Input & Results Count -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="relative flex-1 max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search class="w-4 h-4" />
          </div>
          <input
            v-model="filters.searchQuery"
            type="text"
            placeholder="Search releases, PRs, or changes..."
            class="w-full pl-9 pr-8 py-2 text-sm bg-white border border-stone-200 rounded-lg placeholder-slate-400 text-slate-800 shadow-paper-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
          >
          <button
            v-if="filters.searchQuery"
            type="button"
            class="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
            @click="filters.searchQuery = ''"
          >
            <X class="w-4 h-4" />
            <span class="sr-only">Clear search</span>
          </button>
        </div>

        <div class="text-xs text-slate-500 font-mono flex items-center gap-1.5 shrink-0">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span v-if="filters.searchQuery">
            Showing {{ totalCount }} releases matching "{{ filters.searchQuery }}"
          </span>
          <span v-else>
            {{ totalCount }} {{ totalCount === 1 ? 'release' : 'releases' }} cataloged
          </span>
        </div>
      </div>

      <!-- Category Filter Pills & SemVer Selector -->
      <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-200/50">
        <!-- Category Pills -->
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            :class="[
              'px-2.5 py-1 text-xs font-medium rounded-md border transition-all duration-150 select-none flex items-center gap-1.5',
              filters.activeCategory === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900 shadow-paper-sm'
                : 'bg-white text-slate-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
            ]"
            @click="filters.activeCategory = 'ALL'"
          >
            <span>All Categories</span>
            <span :class="filters.activeCategory === 'ALL' ? 'text-slate-300' : 'text-slate-400'">
              {{ stats.totalPublished }}
            </span>
          </button>

          <button
            type="button"
            :class="[
              'px-2.5 py-1 text-xs font-medium rounded-md border transition-all duration-150 select-none flex items-center gap-1.5',
              filters.activeCategory === 'FEATURE'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-paper-sm'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-300'
            ]"
            @click="toggleCategory('FEATURE')"
          >
            <Sparkles class="w-3.5 h-3.5 shrink-0" />
            <span>Features</span>
            <span class="text-xs opacity-75 font-mono">({{ stats.featuresCount }})</span>
          </button>

          <button
            type="button"
            :class="[
              'px-2.5 py-1 text-xs font-medium rounded-md border transition-all duration-150 select-none flex items-center gap-1.5',
              filters.activeCategory === 'IMPROVEMENT'
                ? 'bg-indigo-700 text-white border-indigo-700 shadow-paper-sm'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-300'
            ]"
            @click="toggleCategory('IMPROVEMENT')"
          >
            <Zap class="w-3.5 h-3.5 shrink-0" />
            <span>Improvements</span>
            <span class="text-xs opacity-75 font-mono">({{ stats.improvementsCount }})</span>
          </button>

          <button
            type="button"
            :class="[
              'px-2.5 py-1 text-xs font-medium rounded-md border transition-all duration-150 select-none flex items-center gap-1.5',
              filters.activeCategory === 'FIX'
                ? 'bg-amber-700 text-white border-amber-700 shadow-paper-sm'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-300'
            ]"
            @click="toggleCategory('FIX')"
          >
            <Wrench class="w-3.5 h-3.5 shrink-0" />
            <span>Fixes</span>
            <span class="text-xs opacity-75 font-mono">({{ stats.fixesCount }})</span>
          </button>

          <button
            type="button"
            :class="[
              'px-2.5 py-1 text-xs font-medium rounded-md border transition-all duration-150 select-none flex items-center gap-1.5',
              filters.activeCategory === 'BREAKING'
                ? 'bg-rose-700 text-white border-rose-700 shadow-paper-sm'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-300'
            ]"
            @click="toggleCategory('BREAKING')"
          >
            <AlertTriangle class="w-3.5 h-3.5 shrink-0" />
            <span>Breaking</span>
            <span class="text-xs opacity-75 font-mono">({{ stats.breakingCount }})</span>
          </button>
        </div>

        <!-- SemVer Type Filter Pills -->
        <div class="flex items-center gap-1 text-xs">
          <span class="text-slate-400 font-mono text-[11px] mr-1 hidden md:inline">SemVer:</span>
          <button
            v-for="s in (['ALL', 'MAJOR', 'MINOR', 'PATCH'] as const)"
            :key="s"
            type="button"
            :class="[
              'px-2 py-0.5 rounded text-[11px] font-mono transition-colors select-none',
              filters.activeSemverType === s
                ? 'bg-stone-800 text-white'
                : 'text-slate-600 hover:bg-stone-200/70'
            ]"
            @click="filters.activeSemverType = s"
          >
            {{ s }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, X, Sparkles, Zap, Wrench, AlertTriangle } from 'lucide-vue-next'
import { useChronicle } from '~/composables/useChronicle'
import type { ChangeCategory } from '~/types/chronicle'

defineProps<{
  totalCount: number
}>()

const { filters, stats } = useChronicle()

const toggleCategory = (category: ChangeCategory) => {
  if (filters.value.activeCategory === category) {
    filters.value.activeCategory = 'ALL'
  } else {
    filters.value.activeCategory = category
  }
}
</script>
