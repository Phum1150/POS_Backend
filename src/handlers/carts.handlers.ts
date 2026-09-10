import type { Context } from 'hono'
import prisma from '../db'
import { Prisma } from '../generated/prisma/client'
import { parseCartId, parseCartInput, parseCartItemsInput } from '../validators/carts.validator'

export const getCarts = async (c: Context) => {
  const carts = await prisma.cart.findMany({ include: { items: true } })

  return c.json(carts)
}

export const getCartById = async (c: Context) => {
  const idResult = parseCartId(c.req.param('id'))

  if (!idResult.ok) {
    return c.json({ error: idResult.error }, 400)
  }

  const cart = await prisma.cart.findUnique({
    where: { id: idResult.data },
    include: { items: { include: { product: true } } },
  })

  if (!cart) {
    return c.json({ error: 'Cart not found' }, 404)
  }

  return c.json(cart)
}

export const createCart = async (c: Context) => {
  const body = await c.req.json()
  const result = parseCartInput(body)

  if (!result.ok) {
    return c.json({ error: result.error }, 400)
  }

  try {
    const cart = await prisma.cart.create({
      data: {
        name: result.data.name,
        items: { create: result.data.items },
      },
      include: { items: true },
    })

    return c.json(cart, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      return c.json({ error: 'Invalid productId' }, 400)
    }

    throw error
  }
}

export const updateCartItems = async (c: Context) => {
  const idResult = parseCartId(c.req.param('id'))

  if (!idResult.ok) {
    return c.json({ error: idResult.error }, 400)
  }

  const body = await c.req.json()
  const result = parseCartItemsInput(body)

  if (!result.ok) {
    return c.json({ error: result.error }, 400)
  }

  const existingCart = await prisma.cart.findUnique({ where: { id: idResult.data } })

  if (!existingCart) {
    return c.json({ error: 'Cart not found' }, 404)
  }

  try {
    const cart = await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { cartId: idResult.data } })
      await tx.cartItem.createMany({
        data: result.data.items.map((item) => ({ ...item, cartId: idResult.data })),
      })

      return tx.cart.findUniqueOrThrow({
        where: { id: idResult.data },
        include: { items: true },
      })
    })

    return c.json(cart, 200)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      return c.json({ error: 'Invalid productId' }, 400)
    }

    throw error
  }
}

export const deleteCart = async (c: Context) => {
  const idResult = parseCartId(c.req.param('id'))

  if (!idResult.ok) {
    return c.json({ error: idResult.error }, 400)
  }

  try {
    const cart = await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { cartId: idResult.data } })

      return tx.cart.delete({ where: { id: idResult.data } })
    })

    return c.json(cart, 200)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return c.json({ error: 'Cart not found' }, 404)
    }

    throw error
  }
}
