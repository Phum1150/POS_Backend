import { Hono } from 'hono'
import { createCheckoutHistory, getCheckoutHistories } from '../handlers/checkout.handlers'

const router = new Hono()

router.post('/', createCheckoutHistory)
router.get('/history', getCheckoutHistories)

export default router
