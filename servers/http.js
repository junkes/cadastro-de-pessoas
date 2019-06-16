/**
 * Servidor NodeJS rodando protocolo http com express
 */

var express = require('express')
var app = express()

app.use('/', express.static('public'))
app.use('/node_modules', express.static('node_modules'))

app.listen(8000, () => {
    console.log('Servidor http rodando na porta 8000!')
})