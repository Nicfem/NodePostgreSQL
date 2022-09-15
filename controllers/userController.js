const ApiError = require('../extention/api-error')
const {Basket, BasketProduct, Product} = require('../models/models')

class UserController {
    async addBasket(req, res, next) {
        try {
            const {productId, userId} = req.body

            const basket = await Basket.findOne({
                where: {userId}
            })

            if(!basket) {
                throw ApiError.BadRequest('Пользователь не найден')
            }
    
            await BasketProduct.create({
                basketId : basket.id, productId
            }).catch(err => {
                throw ApiError.BadRequest(err.message, err.parent)
            })

            res.json('ok')
        } catch(e) {
            next(e)
        }
    }

    async delBasket(req, res, next) {
        try {
            const {productId, userId} = req.body

            const basket = await Basket.findOne({
                where: {userId}
            })

            if(!basket) {
                throw ApiError.BadRequest('Пользователь не найден')
            }
    
            await BasketProduct.destroy({
                where : {productId}
            }).catch(err => {
                throw ApiError.BadRequest(err.message, err.parent)
            })

            res.json('ok')
        } catch(e) {
            next(e)
        }
    }

    async getBasket(req, res, next) {
        try {
            const {id} = req.params

            const basket = await Basket.findOne({
                where : {userId : id},
                include: [
                    {model: BasketProduct, include : [
                        {model: Product}
                    ]}
                ]
            })

            res.json(basket)
        } catch(e) {
            next(e)
        }
    }
}

module.exports = new UserController()