import { Hono } from 'hono'
import { createProduct, getProducts, updateProduct, updateProductStatus, deleteProduct } from '../handlers/products.handlers'

const router = new Hono()

router.get('/', getProducts)
router.post('/create', createProduct)
router.put('/update/:id', updateProduct)
router.patch('/status/:id', updateProductStatus)
router.delete('/delete/:id', deleteProduct)

export default router
