const Router = require('express')
const router = Router()
const brandController = require('../controllers/brandController')

router.get('/', brandController.getAll)
router.post('/', brandController.create)
router.delete('/', brandController.delite)

module.exports = router