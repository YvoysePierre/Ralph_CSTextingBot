const express = require('express')
const app = express()
const port = 3001

app.get('/test', (req, res) => {
    console.log('x');
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})