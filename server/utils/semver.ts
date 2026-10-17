export interface ParsedSemver {
  major: number
  minor: number
  patch: number
  prerelease?: string
  raw: string
}

const SEMVER_REGEX = /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/

export function isValidSemver(version: string): boolean {
  if (!version || typeof version !== 'string') return false
  return SEMVER_REGEX.test(version.trim())
}

export function parseSemver(version: string): ParsedSemver | null {
  const trimmed = version.trim()
  const match = trimmed.match(SEMVER_REGEX)
  if (!match) return null

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4],
    raw: trimmed
  }
}

export function normalizeVersion(version: string): string {
  const trimmed = version.trim()
  if (!trimmed.startsWith('v')) {
    return `v${trimmed}`
  }
  return trimmed
}

export function formatSlug(version: string): string {
  const norm = normalizeVersion(version)
  return norm.replace(/\./g, '-')
}

export function compareSemver(v1: string, v2: string): number {
  const p1 = parseSemver(v1)
  const p2 = parseSemver(v2)

  if (!p1 && !p2) return 0
  if (!p1) return -1
  if (!p2) return 1

  if (p1.major !== p2.major) return p1.major - p2.major
  if (p1.minor !== p2.minor) return p1.minor - p2.minor
  if (p1.patch !== p2.patch) return p1.patch - p2.patch

  return 0
}

export function recommendNextVersion(
  currentVersion: string,
  categories: string[]
): { nextVersion: string; bumpType: 'MAJOR' | 'MINOR' | 'PATCH'; reason: string } {
  const parsed = parseSemver(currentVersion) || { major: 1, minor: 0, patch: 0, raw: 'v1.0.0' }

  const hasBreaking = categories.includes('BREAKING')
  const hasFeature = categories.includes('FEATURE')

  if (hasBreaking) {
    return {
      nextVersion: `v${parsed.major + 1}.0.0`,
      bumpType: 'MAJOR',
      reason: 'Contains breaking change item'
    }
  }

  if (hasFeature) {
    return {
      nextVersion: `v${parsed.major}.${parsed.minor + 1}.0`,
      bumpType: 'MINOR',
      reason: 'Contains new feature item'
    }
  }

  return {
    nextVersion: `v${parsed.major}.${parsed.minor}.${parsed.patch + 1}`,
    bumpType: 'PATCH',
    reason: 'Contains bug fixes and improvements'
  }
}
