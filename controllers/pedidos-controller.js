const mysql = require('../mysql').pool

exports.getPedidos = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `SELECT pedidos.id_pedido,
                    pedidos.quantidade,
                    pedidos.id_produtos,
                    produtos.nome,
                    produtos.preco
               FROM pedidos
         INNER JOIN produtos
                 ON produtos.id_produtos = pedidos.id_produtos
            `,
            (error, result, field) => {
                if(error) {return res.status(500).send({error: error})}
                const response = {
                    quantidade: result.length,
                    pedidos: result.map(pedido => {
                        return {
                            id_pedido: pedido.id_pedido,
                            quantidade: pedido.quantidade,
                            produto: {
                                id_produtos: pedido.id_produtos,
                                nome: pedido.nome,
                                preco: pedido.preco
                            },
                            request: {
                                type: 'GET',
                                descricao: 'Retorna detalhes sobre o pedido',
                                url: process.env.URL_API + '/pedidos/' + pedido.id_pedido
                            }
                        }
                    })
                }
                return res.status(200).send(response)
            }
        )
    })
}

exports.postPedidos = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM produtos WHERE id_produtos = ?',
            [req.body.id_produtos],
            (error, result, field) => {
                if(error) {return res.status(500).send({error: error})}
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Nao foi encontrado o produto com este ID'
                    })
                }
                conn.query(
                    'INSERT INTO pedidos (id_produtos, quantidade) VALUES (?,?)',
                    [req.body.id_produtos, req.body.quantidade],
                    (error, result, field) => {
                        conn.release()
                        if(error) {return res.status(500).send({error: error})}
                        const response = {
                            mensagem: 'Pedido inserido com sucesso',
                            pedidoCriado: {
                                id_pedido: result.insertId,
                                id_produtos: req.body.id_produtos,
                                quantidade: req.body.quantidade,
                                request: {
                                    type: 'GET',
                                    descricao: 'Retorna todos os pedidos',
                                    url: process.env.URL_API + '/pedidos'
                                }
                            }
                        }
                        return res.status(201).send(response)
                    }
                )
            }
        )
    })
}

exports.getExpecificoPedidos = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?;',
            [req.params.id_pedido],
            (error, result, field) => {
                if(error) {return res.status(500).send({error: error})}

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Nao foi encontrado o pedido com este ID'
                    })
                }

                const response = {
                    pedido: {
                        id_pedido: result[0].id_pedido,
                        quantidade: result[0].quantidade,
                        id_produtos: result[0].id_produtos,
                        request: {
                            type: 'GET',
                            descricao: 'Retorna todos os pedidos',
                            url: process.env.URL_API + '/pedidos'
                        }
                    }
                }
                return res.status(200).send(response)
            }
        )
    })
}

exports.deletePedidos = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `DELETE FROM pedidos WHERE id_pedido = ?`,
            [req.body.id_pedido],
            (error, result, field) => {
                conn.release()
                if(error) {return res.status(500).send({error: error})}
                const response = {
                    mensagem: 'pedido excluido co sux=cesso :(',
                    request: {
                        type: 'POST',
                        descricao: 'Insere um pedido',
                        url: process.env.URL_API + '/pedidos',
                        body: {
                            id_produtos: "Number",
                            quantidade: "Number"
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )
    })
}