const express = require('express')
const router = express.Router()

const PedidosController = require('../controllers/pedidos-controller')

// USANDO GET
router.get('/', PedidosController.getPedidos)

// USANDO POST
router.post('/', PedidosController.postPedidos)

// USANDO GET EXPECIFICO
router.get('/:id_pedido', PedidosController.getExpecificoPedidos)

// USANDo DELETE
router.delete('/', PedidosController.deletePedidos)

//DELETE: deletar dados,
//PATCH: atualizar dados,
//POST: criar dados,
//GET: vizualizar dados,

module.exports = router