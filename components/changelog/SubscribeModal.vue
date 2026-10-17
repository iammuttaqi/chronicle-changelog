<template>
  <UiDialog
    :open="open"
    title="Subscribe to Release Alerts"
    description="Receive timely release notes directly when new versions, features, and security patches are published."
    max-width="md"
    @update:open="$emit('update:open', $event)"
  >
    <div
      v-if="isSuccess"
      class="py-6 text-center space-y-3"
    >
      <div class="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
        <CheckCircle2 class="w-6 h-6" />
      </div>
      <h4 class="text-base font-semibold text-slate-900">
        Subscription Confirmed
      </h4>
      <p class="text-sm text-slate-600 max-w-xs mx-auto">
        You are now subscribed to Chronicle releases. You can also monitor our RSS or JSON feeds anytime.
      </p>
      <div class="pt-2">
        <UiButton
          variant="secondary"
          size="sm"
          @click="handleClose"
        >
          Dismiss
        </UiButton>
      </div>
    </div>

    <form
      v-else
      class="space-y-4 pt-2"
      @submit.prevent="handleSubmit"
    >
      <div class="space-y-1.5">
        <label
          for="subscriber-email"
          class="block text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          Developer Work Email
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Mail class="w-4 h-4" />
          </div>
          <input
            id="subscriber-email"
            v-model="email"
            type="email"
            required
            placeholder="developer@company.com"
            class="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-200 rounded-lg placeholder-slate-400 text-slate-800 shadow-paper-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
          >
        </div>
        <p
          v-if="errorMessage"
          class="text-xs text-rose-600"
        >
          {{ errorMessage }}
        </p>
      </div>

      <div class="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-slate-500 leading-relaxed">
        We respect developer focus. We syndicate strictly when official versions are tagged. Zero promotional marketing spam.
      </div>

      <div class="flex items-center justify-end gap-2 pt-2">
        <UiButton
          variant="ghost"
          size="sm"
          type="button"
          @click="handleClose"
        >
          Cancel
        </UiButton>
        <UiButton
          variant="primary"
          size="sm"
          type="submit"
          :loading="loading"
        >
          <Bell class="w-3.5 h-3.5 mr-1.5" />
          <span>Subscribe</span>
        </UiButton>
      </div>
    </form>
  </UiDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Mail, Bell, CheckCircle2 } from 'lucide-vue-next'
import { useToast } from '~/composables/useToast'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const email = ref('')
const loading = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')
const toast = useToast()

const handleSubmit = async () => {
  errorMessage.value = ''
  if (!email.value) return

  loading.value = true
  try {
    const res = await $fetch<{ success: boolean; message: string }>('/api/subscribers', {
      method: 'POST',
      body: { email: email.value }
    })
    if (res.success) {
      isSuccess.value = true
      toast.success('Subscribed to Chronicle', res.message)
    }
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage || 'Failed to register subscriber email.'
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  emit('update:open', false)
  setTimeout(() => {
    isSuccess.value = false
    email.value = ''
    errorMessage.value = ''
  }, 300)
}
</script>
