import type { Release, ExportTarget } from '~/types/chronicle'
import { useToast } from './useToast'

export function useExporter() {
  const toast = useToast()
  const exporting = ref(false)

  const exportRelease = async (releaseId: string, target: ExportTarget): Promise<string> => {
    exporting.value = true
    try {
      const response = await $fetch<{ target: ExportTarget; formattedText: string }>('/api/export', {
        method: 'POST',
        body: { releaseId, target }
      })
      return response.formattedText
    } catch (err) {
      console.error('Export API error:', err)
      toast.error('Export failed', 'Could not generate formatted release text.')
      return ''
    } finally {
      exporting.value = false
    }
  }

  const copyExportToClipboard = async (releaseId: string, target: ExportTarget, targetLabel: string) => {
    const text = await exportRelease(releaseId, target)
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      toast.success(
        `Copied ${targetLabel} to clipboard`,
        'Formatted release text is ready to paste.'
      )
    } catch (err) {
      console.error('Clipboard copy failed:', err)
      toast.error('Copy failed', 'Your browser did not allow clipboard write.')
    }
  }

  return {
    exporting,
    exportRelease,
    copyExportToClipboard
  }
}
