import express from 'express'
import { config } from 'dotenv'
import mongoose from 'mongoose'
import { router } from './routes/book.routes.js'
import bodyParser from 'body-parser'

config() //agregar las variables de entorno al proceso
const app = express() //usamos express para los middlewares
app.use(bodyParser.json()) //parseo del body

//conectamos la base de datos
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME })
const db = mongoose.connection

app.use('/books', router) //vincular las rutas
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server running in port: ${port}`)
})