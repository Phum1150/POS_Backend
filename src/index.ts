import { Hono } from 'hono'
import { cors } from 'hono/cors'
import productsRouter from './routes/products.routes'
import cartsRouter from './routes/carts.routes'

const app = new Hono()

app.use('*', cors({
  origin: 'http://localhost:5173',
}))

app.route('/products', productsRouter)
app.route('/carts', cartsRouter)

export default app
