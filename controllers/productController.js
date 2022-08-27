const {Product, ProductInfo} = require('../models/models')
const uuid = require('uuid')
const path = require('path')

class ProductController {
    async getAll(req, res, next) {
        try {
            const {brandId, typeId} = req.query
            let {limit, page} = req.query

            page = page || 1
            limit = limit || 9
            const offset = page * limit - limit
            
            let products
            if(!brandId && !typeId) {
                products = await Product.findAndCountAll({
                    limit, 
                    offset
                })
            }

            if(brandId && !typeId) {
                products = await Product.findAndCountAll({
                    where: {
                        brandId
                    },
                    limit,
                    offset
                })
            }
            if(!brandId && typeId) {
                products = await Product.findAndCountAll({
                    where: {
                        typeId
                    },
                    limit,
                    offset
                })
            }

            if(brandId && typeId) {
                products = await Product.findAndCountAll({
                    where : {
                        brandId,
                        typeId
                    },
                    limit, 
                    offset
                })
            }
            res.json(products)
        } catch(e) {
            next(e)
        }
    }

    async getOne(req, res, next) {
        const {id} = req.params
        try {
            const product = await Product.findOne({
                where: {id},
                include: [{model: ProductInfo, as: 'productInfos'}]
            })

            res.json(product)
        } catch(e) {
            next(e)
        }
    }

    async create(req, res, next) {
        try {
            const {name, price, brandId, typeId} = req.body
            let {info} = req.body
            const {img} = req.files

            const filaName = uuid.v4() + '.jpg'
            img.mv(path.resolve(__dirname, '..', 'static', filaName))

            const product = await Product.create({name, price, brandId, typeId, img: filaName})

            console.log(product.id)

            if(info) {
                info = JSON.parse(info)
                info.forEach(x => 
                    ProductInfo.create({
                        title: x.title,
                        description: x.description,
                        productId: product.id
                    })
                )
            }


            res.json(product)
        } catch(e) {
            next(e)
        }
    }
}

module.exports = new ProductController()