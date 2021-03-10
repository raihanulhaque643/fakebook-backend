const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const opinionRouter = require('./routers/opinion')

const app = express()
const port = process.env.PORT

const cors = require('cors')
app.use(cors({origin: '*'}))

app.use(express.json())

app.use(
  userRouter, 
  opinionRouter
)

app.get('/', (req, res) => {
  res.send('Hello!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})