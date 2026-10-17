<template>
  <div class="min-h-screen flex flex-col bg-stone-50 text-slate-800">
    <!-- Header -->
    <header class="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <!-- Logo & Branding -->
        <NuxtLink
          to="/"
          class="flex items-center gap-3 group"
        >
          <div class="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white shadow-paper-sm group-hover:bg-orange-700 transition-colors">
            <Flame class="w-4 h-4 fill-white stroke-white" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-base tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                Chronicle
              </span>
              <span class="text-[11px] font-mono font-medium px-1.5 py-0.5 rounded bg-stone-100 text-slate-600 border border-stone-200">
                v1.2.1
              </span>
            </div>
            <p class="text-[11px] text-slate-500 hidden sm:block leading-none mt-0.5">
              Engineering Release Log &amp; Syndication
            </p>
          </div>
        </NuxtLink>

        <!-- Syndication & Studio Links -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- RSS Feed Link -->
          <a
            href="/api/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden md:inline-flex items-center gap-1.5 text-xs font-mono text-slate-600 hover:text-orange-600 px-2.5 py-1.5 rounded-md hover:bg-stone-100 transition-colors"
            title="Subscribe via RSS 2.0 XML feed"
          >
            <Rss class="w-3.5 h-3.5 text-orange-600" />
            <span>RSS</span>
          </a>

          <!-- JSON Feed Link -->
          <a
            href="/api/feed.json"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden md:inline-flex items-center gap-1.5 text-xs font-mono text-slate-600 hover:text-orange-600 px-2.5 py-1.5 rounded-md hover:bg-stone-100 transition-colors"
            title="Automate with JSON Feed v1.1"
          >
            <Code2 class="w-3.5 h-3.5 text-slate-500" />
            <span>JSON</span>
          </a>

          <!-- Subscribe Button -->
          <UiButton
            variant="secondary"
            size="sm"
            @click="showSubscribe = true"
          >
            <Mail class="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            <span>Subscribe</span>
          </UiButton>

          <!-- Studio Dashboard Link -->
          <NuxtLink to="/studio">
            <UiButton
              variant="primary"
              size="sm"
            >
              <PenTool class="w-3.5 h-3.5 mr-1.5" />
              <span>Studio</span>
            </UiButton>
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content Slot -->
    <main class="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-stone-200 bg-white py-12 mt-16 text-slate-600 text-xs">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-slate-900">Chronicle Changelog Studio</span>
            <span class="text-stone-300">•</span>
            <span class="font-mono text-slate-500">Standards 3.0 Edition</span>
          </div>
          <p class="text-slate-500 max-w-md leading-relaxed">
            Curated editorial narratives for modern engineering momentum. Strictly adheres to Semantic Versioning 2.0.0. Zero emojis in system controls.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-4 text-xs font-mono">
          <a
            href="/api/feed.xml"
            class="hover:text-orange-600 transition-colors flex items-center gap-1"
          >
            <Rss class="w-3 h-3 text-orange-600" />
            <span>RSS 2.0</span>
          </a>
          <a
            href="/api/feed.json"
            class="hover:text-orange-600 transition-colors flex items-center gap-1"
          >
            <Code2 class="w-3 h-3 text-slate-500" />
            <span>JSON Feed v1.1</span>
          </a>
          <NuxtLink
            to="/studio"
            class="hover:text-orange-600 transition-colors flex items-center gap-1"
          >
            <PenTool class="w-3 h-3 text-slate-500" />
            <span>Changelog Studio</span>
          </NuxtLink>
        </div>
      </div>
    </footer>

    <!-- Global Subscribe Modal -->
    <ChangelogSubscribeModal v-model:open="showSubscribe" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Flame, Rss, Code2, Mail, PenTool } from 'lucide-vue-next'

const showSubscribe = ref(false)
</script>
