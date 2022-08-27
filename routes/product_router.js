const Router = require('express')
const router = Router()
const productController = require('../controllers/productController')

router.get('/', productController.getAll)
router.get('/:id', productController.getOne)
router.post('/', productController.create)


module.exports = router