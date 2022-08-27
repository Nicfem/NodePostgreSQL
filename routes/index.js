const router = require('express')()
const typeRouter = require('./type_router')
const brandRouter = require('./brand_router')
const productRouter = require('./product_router')
const authRouter = require('./auth_router')

router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/product', productRouter)
router.use('/auth', authRouter)


module.exports = router