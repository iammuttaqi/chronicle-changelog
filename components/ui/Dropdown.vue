<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :side-offset="5"
        align="end"
        class="z-50 min-w-[180px] bg-white border border-stone-200 rounded-lg p-1 shadow-paper-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
      >
        <slot>
          <template
            v-for="(item, idx) in items"
            :key="idx"
          >
            <DropdownMenuSeparator
              v-if="item.separator"
              class="my-1 h-px bg-stone-200"
            />
            <DropdownMenuItem
              v-else
              :disabled="item.disabled"
              :class="[
                'group flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium cursor-pointer select-none outline-none transition-colors',
                item.danger
                  ? 'text-rose-600 hover:bg-rose-50 focus:bg-rose-50'
                  : 'text-slate-700 hover:bg-stone-100 hover:text-slate-900 focus:bg-stone-100 focus:text-slate-900',
                item.disabled ? 'opacity-50 pointer-events-none' : ''
              ]"
              @select="item.onSelect ? item.onSelect() : null"
            >
              <component
                :is="item.icon"
                v-if="item.icon"
                class="w-3.5 h-3.5 shrink-0 text-slate-500 group-hover:text-slate-900"
              />
              <span class="flex-1 text-left">{{ item.label }}</span>
            </DropdownMenuItem>
          </template>
        </slot>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<script setup lang="ts">
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from 'radix-vue'

export interface DropdownItem {
  label?: string
  icon?: any
  danger?: boolean
  disabled?: boolean
  separator?: boolean
  onSelect?: () => void
}

defineProps<{
  items?: DropdownItem[]
}>()
</script>
