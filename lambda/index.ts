import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import type { LambdaEvent, LambdaContext } from 'hono/aws-lambda'
import { Controller } from '../controller'


type Bindings = {
    event: LambdaEvent
    context: LambdaContext 
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', Controller.read )
app.post('/create', Controller.create)
app.patch('/update/:id', Controller.update)
app.delete('/delete/:id', Controller.delete)

export const handler = handle(app)