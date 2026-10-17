<template>
  <div class="min-h-screen flex flex-col bg-stone-50 text-slate-800">
    <!-- Studio Header -->
    <header class="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <!-- Logo & Studio Tag -->
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/studio"
            class="flex items-center gap-2.5 group"
          >
            <div class="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-paper-sm group-hover:bg-orange-600 transition-colors">
              <PenTool class="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-sm tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                  Chronicle Studio
                </span>
                <span class="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                  Editorial
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Right navigation -->
        <div class="flex items-center gap-3">
          <!-- Link to Public Changelog -->
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-1.5 text-xs font-mono text-slate-600 hover:text-orange-600 px-3 py-1.5 rounded-md hover:bg-stone-100 transition-colors"
          >
            <Globe class="w-3.5 h-3.5" />
            <span>Public Changelog</span>
          </NuxtLink>

          <!-- Studio Dashboard Link -->
          <NuxtLink
            to="/studio"
            class="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-stone-100 transition-colors"
          >
            <LayoutDashboard class="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </NuxtLink>

          <!-- New Release CTA Button -->
          <NuxtLink to="/studio/new">
            <UiButton
              variant="primary"
              size="sm"
            >
              <Plus class="w-3.5 h-3.5 mr-1" />
              <span>New Release</span>
            </UiButton>
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Studio Content Slot -->
    <main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
      <slot />
    </main>

    <!-- Studio Mini Footer -->
    <footer class="border-t border-stone-200 bg-white py-6 mt-12 text-slate-500 text-xs">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <span class="font-mono text-[11px]">Chronicle Editorial Engine v1.0 • Standards 3.0</span>
        <NuxtLink
          to="/"
          class="hover:text-orange-600 transition-colors font-mono text-[11px]"
        >
          &larr; View Live Feed
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { PenTool, Globe, LayoutDashboard, Plus } from 'lucide-vue-next'
</script>
