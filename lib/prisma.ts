import { Prisma, PrismaClient } from '@prisma/client'

let prisma: PrismaClient

// user with includes prisma
export type user = Prisma.UserGetPayload<{
  include: {
    profileImage: true,
    favoriteTours: true,
    startedTours: true,
    coupons: true
  }
}>


export const getPrismaInstance = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}