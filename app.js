var express = require('express')
var app = express()
var net = require('net')

var uploadform = require('./routes/uploadform.js')

app.set('view engine', 'pug')
app.set('views', './views')

app.use('/classify', uploadform)

app.post('/classify', (req, res) => {
    //classify image
    res.send('classified')
});

app.get('/test', (req, res) => {
    var client = new net.Socket()
    client.connect(10000, '127.0.0.1', () => {
        console.log('connected')
        client.write('ask server')
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