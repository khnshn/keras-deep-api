var express = require('express')
var app = express()
var net = require('net')
var multer = require('multer')

var filename

var upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './uploads/')
        },
        filename: (req, file, cb) => {
            var ext = require('path').extname(file.originalname)
            filename = file.fieldname + '-' + Date.now() + ext
            cb(null, filename)
        }
    })
})

var uploadform = require('./routes/uploadform.js')

app.set('view engine', 'pug')
app.set('views', './views')

app.use('/classify', uploadform)

app.post('/classify', upload.single('image'), (req, res) => {
    var client = new net.Socket()
    client.connect(10000, '127.0.0.1', () => {
        console.log('connected')
        client.write(filename)
    })
    client.on('data', (data) => {
        console.log(`received ${data}`)
        res.send(data.toString('utf8'))
        client.destroy()
    })
    client.on('close', () => {
        console.log('connection closed')
    })
})

app.get('*', (req, res) => {
    res.status(403)
    res.send('Bad request')
})
app.listen(8000)