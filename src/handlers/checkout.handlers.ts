import type { Context } from 'hono'
import prisma from '../db'
import { parseCheckoutHistoryInput } from '../validators/checkout.validator'

export const createCheckoutHistory = async (c: Context) => {
  const body = await c.req.json()
  const result = parseCheckoutHistoryInput(body)

  if (!result.ok) {
    return c.json({ error: result.error }, 400)
  }

  const productIds = [...new Set(result.data.items.map((item) => item.productId))]
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
  const productById = new Map(products.map((product) => [product.id, product]))

  const missingId = productIds.find((id) => !productById.has(id))
  if (missingId !== undefined) {
    return c.json({ error: 'Invalid productId' }, 400)
  }

  const history = await prisma.checkoutHistory.create({
    data: {
      promotion: result.data.promotion,
      netPrice: result.data.netPrice,
      items: {
        create: result.data.items.map((item) => {
          const product = productById.get(item.productId)!

          return {
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: item.quantity,
          }
        }),
      },
    },
    select: {
      id: true,
      promotion: true,
      netPrice: true,
      createdAt: true,
      items: { select: { id: true, productId: true, productName: true, price: true, quantity: true } },
    },
  })

  return c.json(history, 201)
}

export const getCheckoutHistories = async (c: Context) => {
  const histories = await prisma.checkoutHistory.findMany({
    select: {
      id: true,
      promotion: true,
      netPrice: true,
      createdAt: true,
      items: { select: { id: true, productId: true, productName: true, price: true, quantity: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return c.json(histories)
}
