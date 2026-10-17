import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  // Trigger cold-start check and return 200 OK headers
  await prisma.release.count()
  setResponseHeader(event, 'content-type', 'application/json; charset=utf-8')
  setResponseStatus(event, 200)
  return ''
})
