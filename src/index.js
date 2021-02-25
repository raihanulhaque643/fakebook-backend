const express = require('express')
require('./db/mongoose')

const app = express()
const port = process.env.PORT

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})