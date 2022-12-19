const express = require('express')
const router = express.Router()
const multer = require('multer')
const login = require('../middleware/login')

const ProdutosController = require('../controllers/produtos-controller')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        let data = new Date().toISOString().replace(/:/g, '-') + '-'
        cb(null, data + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
        
    },
    fileFilter: fileFilter
})

// USANDO GET
router.get('/', ProdutosController.getProdutos)

// USANDO POST
router.post('/', 
    login.obrigatorio, 
    upload.single('produto_imagem'), 
    ProdutosController.postProdutos
)

// USANDO GET EXPECIFICO
router.get('/:id_produtos', ProdutosController.getExpecificoProdutos)

//USANDO PATCH
router.patch('/',
    login.obrigatorio, 
    ProdutosController.patchProdutos
)

// USANDo DELETE
router.delete('/',login.obrigatorio, ProdutosController.deleteProdutos)

//DELETE: deletar dados,
//PATCH: atualizar dados,
//POST: criar dados,
//GET: vizualizar dados,

module.exports = router