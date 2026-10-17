import { ref, computed, watch } from 'vue'
import type { ReleaseDraftInput, Release, ChangeCategory, SemverType, ReleaseStatus } from '~/types/chronicle'
import { useToast } from './useToast'
import { isValidSemver, normalizeVersion, parseSemver } from '~/server/utils/semver'

const AUTOSAVE_STORAGE_KEY = 'chronicle:studio:draft_backup'

export function useStudio(releaseId?: string) {
  const toast = useToast()
  const router = useRouter()

  const draft = ref<ReleaseDraftInput>({
    version: 'v1.3.0',
    title: '',
    summary: '',
    contentMarkdown: '',
    status: 'DRAFT',
    semverType: 'MINOR',
    scheduledFor: null,
    publishedAt: null,
    authorName: 'Core Engineering',
    authorAvatar: null,
    items: []
  })

  const isSaving = ref(false)
  const isDirty = ref(false)
  const autosavedAt = ref<Date | null>(null)
  const latestPublishedVersion = ref<string>('v1.2.1')

  // Validation
  const isValidVersion = computed(() => {
    return isValidSemver(draft.value.version)
  })

  const versionError = computed(() => {
    if (!draft.value.version) return 'Version string is required.'
    if (!isValidSemver(draft.value.version)) {
      return 'Must match Semantic Versioning format (e.g. v1.3.0 or 1.3.0)'
    }
    return null
  })

  // SemVer recommendation based on draft items
  const recommendedBump = computed<{
    suggestedVersion: string
    bumpType: SemverType
    reason: string
  }>(() => {
    const items = draft.value.items || []
    const baseVer = latestPublishedVersion.value || 'v1.0.0'
    const parsed = parseSemver(baseVer) || { major: 1, minor: 0, patch: 0, raw: 'v1.0.0' }

    const hasBreaking = items.some((i) => i.category === 'BREAKING')
    const hasFeature = items.some((i) => i.category === 'FEATURE')

    if (hasBreaking) {
      return {
        suggestedVersion: `v${parsed.major + 1}.0.0`,
        bumpType: 'MAJOR',
        reason: 'Contains breaking change item'
      }
    }

    if (hasFeature) {
      return {
        suggestedVersion: `v${parsed.major}.${parsed.minor + 1}.0`,
        bumpType: 'MINOR',
        reason: 'Contains new feature item'
      }
    }

    return {
      suggestedVersion: `v${parsed.major}.${parsed.minor}.${parsed.patch + 1}`,
      bumpType: 'PATCH',
      reason: 'Bug fixes and performance improvements'
    }
  })

  // LocalStorage autosave mechanics
  const persistAutosave = () => {
    if (process.client && !releaseId) {
      try {
        localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(draft.value))
        autosavedAt.value = new Date()
      } catch (err) {
        console.error('Failed to write to localStorage:', err)
      }
    }
  }

  const restoreAutosave = (): boolean => {
    if (process.client && !releaseId) {
      try {
        const stored = localStorage.getItem(AUTOSAVE_STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          draft.value = parsed
          autosavedAt.value = new Date()
          return true
        }
      } catch (err) {
        console.error('Failed to restore autosaved draft:', err)
      }
    }
    return false
  }

  const clearAutosave = () => {
    if (process.client) {
      localStorage.removeItem(AUTOSAVE_STORAGE_KEY)
      autosavedAt.value = null
    }
  }

  // Load latest published version from DB to compute recommendation
  const fetchLatestVersion = async () => {
    try {
      const res = await $fetch<{ success: boolean; data: Release[] }>('/api/releases?status=PUBLISHED')
      if (res.data && res.data.length > 0) {
        latestPublishedVersion.value = res.data[0].version
        // If draft is still default, apply recommended version
        if (draft.value.title === '' && draft.value.items.length === 0) {
          draft.value.version = recommendedBump.value.suggestedVersion
          draft.value.semverType = recommendedBump.value.bumpType
        }
      }
    } catch (e) {
      console.warn('Could not fetch latest published version for SemVer recommendation')
    }
  }

  // Load existing release by ID
  const loadRelease = async (id: string) => {
    try {
      const res = await $fetch<{ success: boolean; data: Release }>(`/api/releases/${id}`)
      if (res.success && res.data) {
        const r = res.data
        draft.value = {
          version: r.version,
          title: r.title,
          summary: r.summary,
          contentMarkdown: r.contentMarkdown,
          status: r.status,
          semverType: r.semverType,
          scheduledFor: r.scheduledFor ? new Date(r.scheduledFor).toISOString() : null,
          publishedAt: r.publishedAt ? new Date(r.publishedAt).toISOString() : null,
          authorName: r.authorName,
          authorAvatar: r.authorAvatar,
          items: r.items.map((i) => ({
            id: i.id,
            category: i.category,
            description: i.description,
            prNumber: i.prNumber,
            authorName: i.authorName,
            sortOrder: i.sortOrder
          }))
        }
      }
    } catch (err: any) {
      toast.error('Load failed', err?.data?.statusMessage || 'Could not fetch release.')
    }
  }

  // Save release (Create or Update)
  const saveRelease = async (targetStatus?: ReleaseStatus) => {
    if (!isValidVersion.value) {
      toast.error('Invalid Version', versionError.value || 'Please check SemVer formatting.')
      return null
    }

    if (!draft.value.title.trim()) {
      toast.error('Title Required', 'Please provide an editorial title for this release.')
      return null
    }

    isSaving.value = true
    try {
      if (targetStatus) {
        draft.value.status = targetStatus
      }

      // Sync SemVer type recommendation if not customized
      if (!draft.value.semverType) {
        draft.value.semverType = recommendedBump.value.bumpType
      }

      const payload = {
        ...draft.value,
        version: normalizeVersion(draft.value.version)
      }

      let resultId = releaseId

      if (releaseId) {
        // PUT update
        const res = await $fetch<{ success: boolean; data: Release }>(`/api/releases/${releaseId}`, {
          method: 'PUT',
          body: payload
        })
        resultId = res.data.id
        toast.success(
          'Release Updated',
          `Successfully saved changes to ${payload.version}.`
        )
      } else {
        // POST create
        const res = await $fetch<{ success: boolean; data: { id: string; version: string } }>('/api/releases', {
          method: 'POST',
          body: payload
        })
        resultId = res.data.id
        clearAutosave()
        toast.success(
          draft.value.status === 'PUBLISHED' ? 'Release Published' : 'Draft Saved',
          `Release ${payload.version} is now saved in Chronicle.`
        )
      }

      isDirty.value = false
      return resultId
    } catch (err: any) {
      console.error('Failed to save release:', err)
      toast.error('Save Failed', err?.data?.statusMessage || 'Unable to persist release.')
      return null
    } finally {
      isSaving.value = false
    }
  }

  // Auto-track dirty state and save draft to local storage
  watch(
    () => draft.value,
    () => {
      isDirty.value = true
      persistAutosave()
    },
    { deep: true }
  )

  return {
    draft,
    isSaving,
    isDirty,
    autosavedAt,
    isValidVersion,
    versionError,
    recommendedBump,
    latestPublishedVersion,
    persistAutosave,
    restoreAutosave,
    clearAutosave,
    fetchLatestVersion,
    loadRelease,
    saveRelease
  }
}
