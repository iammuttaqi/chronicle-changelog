export interface ToastMessage {
  id: string
  title: string
  description?: string
  type?: 'success' | 'info' | 'error'
  duration?: number
}

const toastsState = () => useState<ToastMessage[]>('chronicle:toasts', () => [])

export function useToast() {
  const toasts = toastsState()

  const show = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const duration = toast.duration ?? 3500

    toasts.value.push({ ...toast, id })

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }
  }

  const dismiss = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const success = (title: string, description?: string) => {
    show({ title, description, type: 'success' })
  }

  const error = (title: string, description?: string) => {
    show({ title, description, type: 'error' })
  }

  const info = (title: string, description?: string) => {
    show({ title, description, type: 'info' })
  }

  return {
    toasts,
    show,
    dismiss,
    success,
    error,
    info
  }
}
