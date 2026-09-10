import { Hono } from 'hono'
import { createCart, deleteCart, getCartById, getCarts, updateCartItems } from '../handlers/carts.handlers'

const router = new Hono()

router.get('/', getCarts)
router.get('/:id', getCartById)
router.post('/create', createCart)
router.put('/update/:id', updateCartItems)
router.delete('/delete/:id', deleteCart)

export default router
