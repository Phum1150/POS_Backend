import { z } from 'zod'

const CheckoutHistoryItemSchema = z
  .object({
    id: z.number().int().positive(),
    quantity: z.number().int().positive(),
  })
  .transform(({ id, quantity }) => ({ productId: id, quantity }))

const CheckoutHistorySchema = z.object({
  promotion: z.string().trim().min(1).optional(),
  netPrice: z.number().positive(),
  items: z.array(CheckoutHistoryItemSchema).min(1),
})

export type CheckoutHistoryInput = z.infer<typeof CheckoutHistorySchema>
export type ParseCheckoutHistoryInputResult =
  | { ok: true; data: CheckoutHistoryInput }
  | { ok: false; error: string }

export function parseCheckoutHistoryInput(body: unknown): ParseCheckoutHistoryInputResult {
  const result = CheckoutHistorySchema.safeParse(body)

  if (!result.success) {
    return { ok: false, error: result.error.issues.map((issue) => issue.message).join('; ') }
  }

  return { ok: true, data: result.data }
}
