import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'
import path from 'node:path'
import { STARTER_DB_BASE64 } from './starter-db-data'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

function resolveDatabase(): string {
  // If explicitly overridden via environment variable and not in Vercel serverless
  if (process.env.DATABASE_URL && !process.env.VERCEL) {
    return process.env.DATABASE_URL
  }

  const tmpDbPath = path.resolve('/tmp', 'chronicle.db')
  const possibleStarterPaths = [
    path.resolve(process.cwd(), 'prisma', 'starter.db'),
    path.resolve(process.cwd(), 'public', 'starter.db'),
    path.resolve(process.cwd(), 'starter.db'),
    path.resolve('/var/task', 'prisma', 'starter.db'),
    path.resolve('/var/task', 'public', 'starter.db'),
    path.resolve('/var/task', 'starter.db')
  ]

  let starterPath = ''
  for (const candidate of possibleStarterPaths) {
    try {
      if (fs.existsSync(candidate) && fs.statSync(candidate).size > 0) {
        starterPath = candidate
        break
      }
    } catch {
      // Ignore path check errors
    }
  }

  // Check if /tmp/chronicle.db exists and is populated
  const tmpExists = fs.existsSync(tmpDbPath)
  const tmpSize = tmpExists ? fs.statSync(tmpDbPath).size : 0

  if (!tmpExists || tmpSize === 0) {
    if (starterPath) {
      try {
        fs.copyFileSync(starterPath, tmpDbPath)
        console.log(`[Chronicle DB] Successfully hydrated /tmp/chronicle.db from ${starterPath}`)
      } catch (err) {
        console.error('[Chronicle DB] Failed to copy starter.db to /tmp/chronicle.db:', err)
      }
    } else if (STARTER_DB_BASE64 && STARTER_DB_BASE64.length > 0) {
      try {
        const buffer = Buffer.from(STARTER_DB_BASE64, 'base64')
        fs.writeFileSync(tmpDbPath, buffer)
        console.log(`[Chronicle DB] Successfully hydrated /tmp/chronicle.db from embedded base64 template (${buffer.length} bytes)`)
      } catch (err) {
        console.error('[Chronicle DB] Failed to hydrate /tmp/chronicle.db from embedded fallback:', err)
      }
    } else {
      try {
        fs.writeFileSync(tmpDbPath, '')
        console.warn('[Chronicle DB] Starter database not found; created blank /tmp/chronicle.db')
      } catch (err) {
        console.error('[Chronicle DB] Failed to write empty /tmp/chronicle.db:', err)
      }
    }
  }

  return `file:${tmpDbPath}`
}

export function getPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    if (!globalThis.__prisma) {
      const dbUrl = resolveDatabase()
      globalThis.__prisma = new PrismaClient({
        datasources: {
          db: {
            url: dbUrl
          }
        }
      })
    }
    return globalThis.__prisma
  }

  // Development environment
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient({
      log: ['error', 'warn']
    })
  }
  return globalThis.__prisma
}

export const prisma = getPrismaClient()
