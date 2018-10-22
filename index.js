var express = require('express')
var app = express()

app.get('/api', (req, res) => {
    res.send('Under construction')
})
app.get('*', (req, res) => {
    res.status(403)
    res.send('Bad request')
})
app.listen(8000)