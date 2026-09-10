import type { Context } from 'hono'
import prisma from '../db'
import { Prisma } from '../generated/prisma/client'
import {
  parseIsActiveQuery,
  parseProductId,
  parseProductInput,
  parseProductStatus,
  parseProductType,
} from '../validators/products.validator'

export const getProducts = async (c: Context) => {
  const typeResult = parseProductType(c.req.query('type'))

  if (!typeResult.ok) {
    return c.json({ error: typeResult.error }, 400)
  }

  const isActiveResult = parseIsActiveQuery(c.req.query('isActive'))

  if (!isActiveResult.ok) {
    return c.json({ error: isActiveResult.error }, 400)
  }

  const type = typeResult.data
  const search = c.req.query('search')
  const isActive = isActiveResult.data

  const products = await prisma.product.findMany({
    where: {
      ...(type ? { type } : {}),
      ...(search ? { name: { contains: search } } : {}),
      ...(isActive ? { isActive } : {}),
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

export const updateProductStatus = async (c: Context) => {
  const idResult = parseProductId(c.req.param('id'))

  if (!idResult.ok) {
    return c.json({ error: idResult.error }, 400)
  }

  const body = await c.req.json()
  const result = parseProductStatus(body)

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
