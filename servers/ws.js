/**
 * Servidor NodeJS rodando protocolo websocket
 * com socket.io
 */


const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const mysql  = require('mysql2/promise')

let pessoas = []

const connect = async () => {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'websocket',
        password: 'websocket',
        database: 'websocket_teste'
    });
}

const query = async (connection, sql) => {
    return await connection.execute(sql);
}

const getPessoas = async () => {
    const connection = await connect()
    const [rows] = await query(connection, 'SELECT * FROM pessoas')
    connection.destroy()
    return rows
}

const setPessoas = async pessoa => {
    const connection = await connect()
    const sql = `INSERT INTO pessoas (nome, telefone) values ('${pessoa.nome}','${pessoa.telefone}')`
    const result = await query(connection,sql); 
    connection.destroy()
    return result[0].insertId
} 

const deletePessoa = async id => {
    const connection = await connect()
    const sql = `DELETE FROM pessoas WHERE id = ${id}`
    await query(connection,sql);
    connection.destroy()
}

io.on('connection', async socket => {

    pessoas = await getPessoas()
    
    socket.emit('cadastros',JSON.stringify(pessoas))
    
    socket.on('disconnect', () => { /*console.log(socket.id)*/ })
    
    socket.on('cadastro', async pessoa => {
        pessoaObj = JSON.parse(pessoa)
        pessoaObj.id = await setPessoas(pessoaObj)
        pessoa = JSON.stringify(pessoaObj)
        console.log('pessoa cadastrada: ' + pessoa)
        socket.emit('novo cadastro', pessoa )
        socket.broadcast.emit('novo cadastro', pessoa )
    } )

    socket.on('delete', async id => {
        console.log('deletando pessoa: ' + id)
        await deletePessoa(id)
        pessoas = await getPessoas()
        socket.emit('cadastros', JSON.stringify(pessoas))
        socket.broadcast.emit('cadastros', JSON.stringify(pessoas))
    })
    
})
server.listen(3000, () => {
    console.log('Servidor Websocket rodando na porta 3000!')
})