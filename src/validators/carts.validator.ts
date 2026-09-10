import { z } from 'zod'

const CartItemSchema = z
  .object({
    id: z.number().int().positive(),
    quantity: z.number().int().positive(),
  })
  .transform(({ id, quantity }) => ({ productId: id, quantity }))

const CartSchema = z.object({
  name: z.string().trim().min(1),
  items: z.array(CartItemSchema).min(1),
})

export type CartInput = z.infer<typeof CartSchema>
export type ParseCartInputResult = { ok: true; data: CartInput } | { ok: false; error: string }

export function parseCartInput(body: unknown): ParseCartInputResult {
  const result = CartSchema.safeParse(body)

  if (!result.success) {
    return { ok: false, error: result.error.issues.map((issue) => issue.message).join('; ') }
  }

  return { ok: true, data: result.data }
}

const CartItemsSchema = z.object({
  items: z.array(CartItemSchema).min(1),
})

export type CartItemsInput = z.infer<typeof CartItemsSchema>
export type ParseCartItemsInputResult = { ok: true; data: CartItemsInput } | { ok: false; error: string }

export function parseCartItemsInput(body: unknown): ParseCartItemsInputResult {
  const result = CartItemsSchema.safeParse(body)

  if (!result.success) {
    return { ok: false, error: result.error.issues.map((issue) => issue.message).join('; ') }
  }

  return { ok: true, data: result.data }
}

const CartIdSchema = z.coerce.number().int()

export type ParseCartIdResult = { ok: true; data: number } | { ok: false; error: string }

export function parseCartId(rawId: string | undefined): ParseCartIdResult {
  const result = CartIdSchema.safeParse(rawId)

  if (!result.success) {
    return { ok: false, error: result.error.issues.map((issue) => issue.message).join('; ') }
  }

  return { ok: true, data: result.data }
}
