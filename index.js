var express = require('express')
var app = express()
var net = require('net')

app.get('/api', (req, res) => {
    var client = new net.Socket()
    client.connect(10000, '127.0.0.1', () => {
        console.log('connected')
        client.write('Hi')
    })
    client.on('data', (data) => {
        console.log(`received ${data}`)
        client.destroy()
    })
    client.on('close', () => {
        console.log('connection closed')
        res.send('successful python serve call')
    })
})
app.get('*', (req, res) => {
    res.status(403)
    res.send('Bad request')
})
app.listen(8000)