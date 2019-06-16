let host = '192.168.1.100'

let socket = io(`http://${host}:3000`)
socket.on('connect', () => {
    if (typeof app != 'undefined' && app.pessoas.length) app.pessoas = []
    status_conexao.innerHTML = 'conectado!'
    status_conexao.style.backgroundColor = 'green'
    status_conexao.style.padding = '0 5px'
    status_conexao.style.color = 'white'
    console.log('conectou!')
})
socket.on('disconnect', () => {
    status_conexao.innerHTML = 'desconectado!'
    status_conexao.style.backgroundColor = 'red'
    status_conexao.style.padding = '0 5px'
    status_conexao.style.color = 'white'
    console.log('desconectou!')
})

let app = new Vue({
    el: '#app',
    data: {
        pessoas: []
    },
    methods: {
        cadastrarPessoa: function () {
            if (nome.value && telefone.value) {
                let pessoa = {
                    nome: nome.value,
                    telefone: telefone.value
                }
                socket.emit('cadastro', JSON.stringify(pessoa))
                nome.value = telefone.value = ''
            } else {
                alert('Preencha todos os campos!')
            }
        },
        addPessoa: function (pessoa) {
            this.pessoas.push({
                id: pessoa.id,
                nome: pessoa.nome,
                telefone: pessoa.telefone,
                data_cadastro: moment(pessoa.data_cadastro).format('DD/MM/YYYY HH:mm:ss')
            })
        },
        deletePessoa: function (id) {
            socket.emit('delete', id)
        }
    }
})

socket.on('cadastros', data => {
    app.pessoas = []
    let pessoas = JSON.parse(data)
    pessoas.forEach(pessoa => {
        app.addPessoa(pessoa)
    })
})

socket.on('novo cadastro', data => {
    let pessoa = JSON.parse(data)
    app.addPessoa(pessoa)
})