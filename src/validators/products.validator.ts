import { z } from 'zod'
import { ProductType } from '../generated/prisma/enums'

const ProductSchema = z.object({
  name: z.string().trim().min(1),
  price: z.number().positive(),
  type: z.enum(ProductType),
  isActive: z.boolean().optional(),
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

const ProductBulkSchema = z.array(ProductSchema).min(1)

export type ProductBulkInput = z.infer<typeof ProductBulkSchema>
export type ParseProductBulkInputResult = { ok: true; data: ProductBulkInput } | { ok: false; error: string }

export function parseProductBulkInput(body: unknown): ParseProductBulkInputResult {
  const result = ProductBulkSchema.safeParse(body)

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

const IsActiveQuerySchema = z
  .enum(['true', 'false'])
  .optional()
  .transform((value) => (value === undefined ? undefined : value === 'true'))

export type ParseIsActiveQueryResult = { ok: true; data: boolean | undefined } | { ok: false; error: string }

export function parseIsActiveQuery(rawIsActive: string | undefined): ParseIsActiveQueryResult {
  const result = IsActiveQuerySchema.safeParse(rawIsActive)

  if (!result.success) {
    return { ok: false, error: result.error.issues.map((issue) => issue.message).join('; ') }
  }

  return { ok: true, data: result.data }
}

const ProductStatusSchema = z.object({
  isActive: z.boolean(),
})

export type ProductStatusInput = z.infer<typeof ProductStatusSchema>
export type ParseProductStatusResult = { ok: true; data: ProductStatusInput } | { ok: false; error: string }

export function parseProductStatus(body: unknown): ParseProductStatusResult {
  const result = ProductStatusSchema.safeParse(body)

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
