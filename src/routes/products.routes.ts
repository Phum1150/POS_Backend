import { Hono } from 'hono'
import { createProduct, createProductBulk, getProducts, updateProduct, updateProductStatus, deleteProduct } from '../handlers/products.handlers'

const router = new Hono()

router.get('/', getProducts)
router.post('/create', createProduct)
router.post('/create/bulk', createProductBulk)
router.put('/update/:id', updateProduct)
router.patch('/status/:id', updateProductStatus)
router.delete('/delete/:id', deleteProduct)

export default router
