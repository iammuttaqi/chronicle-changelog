import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing release identifier.'
    })
  }

  const existing = await prisma.release.findUnique({
    where: { id }
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: `Release "${id}" not found.`
    })
  }

  await prisma.release.delete({
    where: { id }
  })

  return {
    success: true,
    deletedId: id
  }
})
