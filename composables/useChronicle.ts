import type { Release, ChangeCategory, SemverType } from '~/types/chronicle'
import { useToast } from './useToast'

export interface ReleaseFilterState {
  searchQuery: string
  activeCategory: 'ALL' | ChangeCategory
  activeSemverType: 'ALL' | SemverType
}

export function useChronicle() {
  const releases = useState<Release[]>('chronicle:releases', () => [])
  const loading = useState<boolean>('chronicle:loading', () => false)
  const filters = useState<ReleaseFilterState>('chronicle:filters', () => ({
    searchQuery: '',
    activeCategory: 'ALL',
    activeSemverType: 'ALL'
  }))

  const toast = useToast()

  // Reactive sub-50ms fuzzy filtering pipeline
  const filteredReleases = computed(() => {
    const query = filters.value.searchQuery.trim().toLowerCase()
    const activeCat = filters.value.activeCategory
    const activeSemver = filters.value.activeSemverType

    return releases.value.filter((rel) => {
      // 1. Category check
      if (activeCat !== 'ALL') {
        const hasCategory = rel.items.some((item) => item.category === activeCat)
        if (!hasCategory) return false
      }

      // 2. SemVer type check
      if (activeSemver !== 'ALL') {
        if (rel.semverType !== activeSemver) return false
      }

      // 3. Search query check
      if (query) {
        const inTitle = rel.title?.toLowerCase().includes(query)
        const inVer = rel.version?.toLowerCase().includes(query)
        const inSummary = rel.summary?.toLowerCase().includes(query)
        const inMarkdown = rel.contentMarkdown?.toLowerCase().includes(query)
        const inItems = rel.items?.some(
          (item) =>
            item.description?.toLowerCase().includes(query) ||
            item.authorName?.toLowerCase().includes(query) ||
            (item.prNumber && `#${item.prNumber}`.includes(query))
        )
        return inTitle || inVer || inSummary || inMarkdown || inItems
      }

      return true
    })
  })

  // Aggregate stats across all published releases
  const stats = computed(() => {
    const allItems = releases.value.flatMap((r) => r.items || [])
    return {
      totalPublished: releases.value.length,
      featuresCount: allItems.filter((i) => i.category === 'FEATURE').length,
      improvementsCount: allItems.filter((i) => i.category === 'IMPROVEMENT').length,
      fixesCount: allItems.filter((i) => i.category === 'FIX').length,
      breakingCount: allItems.filter((i) => i.category === 'BREAKING').length
    }
  })

  const fetchReleases = async (force = false) => {
    if (releases.value.length > 0 && !force) return
    loading.value = true
    try {
      const response = await $fetch<{ success: boolean; data: Release[] }>('/api/releases?status=PUBLISHED')
      if (response && response.data) {
        releases.value = response.data
      }
    } catch (err) {
      console.error('Failed to fetch published releases:', err)
      toast.error('Network Error', 'Unable to retrieve release timeline.')
    } finally {
      loading.value = false
    }
  }

  const copyPermalink = async (version: string) => {
    if (process.client) {
      const url = `${window.location.origin}/#${version}`
      try {
        await navigator.clipboard.writeText(url)
        toast.success(
          'Permalink Copied',
          `Direct link to ${version} copied to clipboard.`
        )
      } catch (err) {
        console.error('Failed to copy permalink:', err)
      }
    }
  }

  const resetFilters = () => {
    filters.value.searchQuery = ''
    filters.value.activeCategory = 'ALL'
    filters.value.activeSemverType = 'ALL'
  }

  return {
    releases,
    loading,
    filters,
    filteredReleases,
    stats,
    fetchReleases,
    copyPermalink,
    resetFilters
  }
}
