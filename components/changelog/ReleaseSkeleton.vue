<template>
  <div class="relative bg-white border border-stone-200 rounded-xl p-6 sm:p-8 shadow-paper-sm animate-pulse space-y-6">
    <!-- Header row -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
      <div class="flex items-center gap-3">
        <div class="h-7 w-20 bg-stone-200 rounded-md" />
        <div class="h-6 w-48 bg-stone-200 rounded" />
      </div>
      <div class="flex items-center gap-3">
        <div class="h-4 w-24 bg-stone-200 rounded" />
        <div class="h-8 w-20 bg-stone-200 rounded-md" />
      </div>
    </div>

    <!-- Summary -->
    <div class="space-y-2">
      <div class="h-4 w-full bg-stone-200 rounded" />
      <div class="h-4 w-3/4 bg-stone-200 rounded" />
    </div>

    <!-- Change items list -->
    <div class="space-y-3 pt-2">
      <div class="h-4 w-28 bg-stone-200 rounded" />
      <div class="space-y-2 pl-2">
        <div
          v-for="i in 3"
          :key="i"
          class="flex items-center gap-3"
        >
          <div class="h-5 w-24 bg-stone-200 rounded shrink-0" />
          <div class="h-4 w-2/3 bg-stone-200 rounded" />
        </div>
      </div>
    </div>

    <!-- Markdown body skeleton -->
    <div class="space-y-3 pt-4 border-t border-stone-100">
      <div class="h-5 w-40 bg-stone-200 rounded" />
      <div class="h-4 w-full bg-stone-200 rounded" />
      <div class="h-4 w-5/6 bg-stone-200 rounded" />
      <div class="h-4 w-4/6 bg-stone-200 rounded" />
    </div>
  </div>
</template>
