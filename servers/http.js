/**
 * Servidor NodeJS rodando protocolo http com express
 */

var express = require('express')
var app = express()

app.use('/', express.static('public'))
app.use('/node_modules', express.static('node_modules'))

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

app.listen(8000, () => {
    console.log('HTTP server runing on pot 8000!')
})