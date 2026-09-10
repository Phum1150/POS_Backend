import { z } from 'zod'
import { ProductType } from '../generated/prisma/enums'

const ProductSchema = z.object({
  name: z.string().trim().min(1),
  price: z.number().positive(),
  type: z.enum(ProductType),
})

export type ProductInput = z.infer<typeof ProductSchema>
export type ParseProductInputResult = { ok: true; data: ProductInput } | { ok: false; error: string }

export function parseProductInput(body: unknown): ParseProductInputResult {
  const result = ProductSchema.safeParse(body)

  if (!result.success) {
    return { ok: false, error: result.error.issues.map((issue) => issue.message).join('; ') }
  }

  return { ok: true, data: result.data }
}

const ProductTypeQuerySchema = z.enum(ProductType).optional()

export type ParseProductTypeResult = { ok: true; data: ProductType | undefined } | { ok: false; error: string }

export function parseProductType(rawType: string | undefined): ParseProductTypeResult {
  const result = ProductTypeQuerySchema.safeParse(rawType)

  if (!result.success) {
    return { ok: false, error: result.error.issues.map((issue) => issue.message).join('; ') }
  }

  return { ok: true, data: result.data }
}

const ProductIdSchema = z.coerce.number().int()

export type ParseProductIdResult = { ok: true; data: number } | { ok: false; error: string }

export function parseProductId(rawId: string | undefined): ParseProductIdResult {
  const result = ProductIdSchema.safeParse(rawId)

  if (!result.success) {
    return { ok: false, error: result.error.issues.map((issue) => issue.message).join('; ') }
  }

  return { ok: true, data: result.data }
}
