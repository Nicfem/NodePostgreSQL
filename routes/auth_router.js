const Router = require('express')
const router = Router()
const authController = require('../controllers/authController')

router.post('/registration', authController.registration)
router.get('/refresh', authController.refresh)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/activate/:link', authController.activate)

module.exports = router