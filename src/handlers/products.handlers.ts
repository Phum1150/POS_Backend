import type { Context } from 'hono'
import prisma from '../db'
import { Prisma } from '../generated/prisma/client'
import { parseProductId, parseProductInput, parseProductType } from '../validators/products.validator'

export const getProducts = async (c: Context) => {
  const typeResult = parseProductType(c.req.query('type'))

  if (!typeResult.ok) {
    return c.json({ error: typeResult.error }, 400)
  }

  const type = typeResult.data
  const search = c.req.query('search')

  const products = await prisma.product.findMany({
    where: {
      ...(type ? { type } : {}),
      ...(search ? { name: { contains: search } } : {}),
    },
  })

  return c.json(products)
}

export const createProduct = async (c: Context) => {
  const body = await c.req.json()
  const result = parseProductInput(body)

  if (!result.ok) {
    return c.json({ error: result.error }, 400)
  }

  const product = await prisma.product.create({ data: result.data })

  return c.json(product, 201)
}

export const updateProduct = async (c: Context) => {
  const idResult = parseProductId(c.req.param('id'))

  if (!idResult.ok) {
    return c.json({ error: idResult.error }, 400)
  }

  const body = await c.req.json()
  const result = parseProductInput(body)

  if (!result.ok) {
    return c.json({ error: result.error }, 400)
  }

  try {
    const product = await prisma.product.update({
      where: { id: idResult.data },
      data: result.data,
    })

    return c.json(product, 200)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return c.json({ error: 'Product not found' }, 404)
    }

    throw error
  }
}

export const deleteProduct = async (c: Context) => {
  const idResult = parseProductId(c.req.param('id'))

  if (!idResult.ok) {
    return c.json({ error: idResult.error }, 400)
  }

  try {
    const product = await prisma.product.delete({ where: { id: idResult.data } })

    return c.json(product, 200)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return c.json({ error: 'Product not found' }, 404)
    }

    throw error
  }
}
