<template>
  <div class="bg-white border border-stone-200 rounded-xl p-5 shadow-paper-sm space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Categorized Change Items</span>
          <span class="text-xs font-mono font-normal text-slate-500">({{ items.length }})</span>
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">
          Atomic change items feed the SemVer recommender and multi-format exporters.
        </p>
      </div>

      <UiButton
        variant="secondary"
        size="sm"
        @click="addItem"
      >
        <Plus class="w-3.5 h-3.5 mr-1 text-slate-600" />
        <span>Add Change Item</span>
      </UiButton>
    </div>

    <!-- Empty state -->
    <div
      v-if="items.length === 0"
      class="border border-dashed border-stone-200 rounded-lg p-6 text-center bg-stone-50/50"
    >
      <p class="text-xs text-slate-500 mb-2">
        No categorized change items added yet.
      </p>
      <UiButton
        variant="outline"
        size="sm"
        @click="addItem"
      >
        <Plus class="w-3.5 h-3.5 mr-1" />
        <span>Add first item</span>
      </UiButton>
    </div>

    <!-- Items list -->
    <div
      v-else
      class="space-y-3"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="border border-stone-200 rounded-lg p-3.5 bg-stone-50/40 hover:bg-stone-50 transition-colors space-y-3"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <!-- Category selector pills -->
          <div class="flex flex-wrap items-center gap-1.5">
            <button
              v-for="cat in categories"
              :key="cat.value"
              type="button"
              :class="[
                'px-2 py-1 text-xs font-medium rounded border transition-all flex items-center gap-1 select-none',
                item.category === cat.value
                  ? cat.activeClass
                  : 'bg-white text-slate-600 border-stone-200 hover:bg-stone-100'
              ]"
              @click="item.category = cat.value"
            >
              <component
                :is="cat.icon"
                class="w-3 h-3 shrink-0"
              />
              <span>{{ cat.label }}</span>
            </button>
          </div>

          <!-- Reorder & Delete controls -->
          <div class="flex items-center gap-1 self-end sm:self-auto">
            <button
              type="button"
              :disabled="index === 0"
              class="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-stone-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Move Up"
              @click="moveItem(index, -1)"
            >
              <ChevronUp class="w-4 h-4" />
            </button>

            <button
              type="button"
              :disabled="index === items.length - 1"
              class="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-stone-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Move Down"
              @click="moveItem(index, 1)"
            >
              <ChevronDown class="w-4 h-4" />
            </button>

            <button
              type="button"
              class="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors ml-1"
              title="Delete item"
              @click="removeItem(index)"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Description input -->
        <div>
          <input
            v-model="item.description"
            type="text"
            required
            placeholder="Describe the change, feature addition, or breaking adjustment..."
            class="w-full text-sm bg-white border border-stone-200 rounded-md px-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
          >
        </div>

        <!-- Optional PR # and author attribution -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div class="flex items-center gap-2">
            <span class="text-slate-400 font-mono">PR #:</span>
            <input
              v-model.number="item.prNumber"
              type="number"
              placeholder="142"
              class="flex-1 bg-white border border-stone-200 rounded-md px-2.5 py-1 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
            >
          </div>

          <div class="flex items-center gap-2">
            <span class="text-slate-400 font-mono">Author:</span>
            <input
              v-model="item.authorName"
              type="text"
              placeholder="@contributor"
              class="flex-1 bg-white border border-stone-200 rounded-md px-2.5 py-1 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Trash2, ChevronUp, ChevronDown, Sparkles, Zap, Wrench, AlertTriangle } from 'lucide-vue-next'
import type { ChangeCategory } from '~/types/chronicle'

interface DraftItem {
  category: ChangeCategory
  description: string
  prNumber?: number | null
  authorName?: string | null
  sortOrder?: number
}

const props = defineProps<{
  items: DraftItem[]
}>()

const categories: Array<{
  value: ChangeCategory
  label: string
  icon: any
  activeClass: string
}> = [
  {
    value: 'FEATURE',
    label: 'Feature',
    icon: Sparkles,
    activeClass: 'bg-emerald-700 text-white border-emerald-700 shadow-paper-sm'
  },
  {
    value: 'IMPROVEMENT',
    label: 'Improvement',
    icon: Zap,
    activeClass: 'bg-indigo-700 text-white border-indigo-700 shadow-paper-sm'
  },
  {
    value: 'FIX',
    label: 'Fix',
    icon: Wrench,
    activeClass: 'bg-amber-700 text-white border-amber-700 shadow-paper-sm'
  },
  {
    value: 'BREAKING',
    label: 'Breaking',
    icon: AlertTriangle,
    activeClass: 'bg-rose-700 text-white border-rose-700 shadow-paper-sm'
  }
]

const addItem = () => {
  props.items.push({
    category: 'FEATURE',
    description: '',
    prNumber: null,
    authorName: '',
    sortOrder: props.items.length
  })
}

const removeItem = (index: number) => {
  props.items.splice(index, 1)
  // Re-index sort order
  props.items.forEach((item, idx) => {
    item.sortOrder = idx
  })
}

const moveItem = (index: number, direction: number) => {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= props.items.length) return

  const temp = props.items[index]
  props.items[index] = props.items[targetIndex]
  props.items[targetIndex] = temp

  props.items.forEach((item, idx) => {
    item.sortOrder = idx
  })
}
</script>
