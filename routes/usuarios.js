const express = require('express')
const router = express.Router()
// const multer = require('multer')

const UsuariosController = require('../controllers/usuarios-controller')

router.post('/cadastro', UsuariosController.cadastrarUsuario)

router.post('/login', UsuariosController.loginUsuario)

module.exports = router