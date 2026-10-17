import { prisma } from '~/server/utils/prisma'
import type { SubscriberInput } from '~/types/chronicle'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const body = await readBody<SubscriberInput>(event)

  if (!body || !body.email || !EMAIL_REGEX.test(body.email.trim())) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please provide a valid email address.'
    })
  }

  const email = body.email.trim().toLowerCase()

  try {
    await prisma.subscriber.upsert({
      where: { email },
      update: {
        confirmed: true,
        confirmedAt: new Date()
      },
      create: {
        email,
        confirmed: true,
        confirmedAt: new Date()
      }
    })

    return {
      success: true,
      message: 'Subscribed successfully to Chronicle release alerts.'
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to save subscription. Please try again later.'
    })
  }
})
