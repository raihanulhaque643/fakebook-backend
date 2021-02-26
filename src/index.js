const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')

const app = express()
const port = process.env.PORT

app.use(express.json())

app.use(userRouter)

app.get('/', (req, res) => {
  res.send('Hello!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})