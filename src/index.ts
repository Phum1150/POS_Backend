import { Hono } from 'hono'
import { cors } from 'hono/cors'
import productsRouter from './routes/products.routes'

const app = new Hono()

app.use('*', cors({
  origin: 'http://localhost:5173',
}))

app.route('/products', productsRouter)

export default app
