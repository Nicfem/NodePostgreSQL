const {Brand} = require('../models/models')

class BrandController {
    async getAll(req, res) {
        try {
            const brands = await Brand.findAll()
            res.json(brands)
        } catch(e) {
            res.json(e.message)
        }
    }

    async create(req, res) {
        try {
            const {name} = req.body
            const brand = await Brand.create({name})
            res.json(brand)
        } catch(e) {
            res.json(e.message)
        }
    }

    async delite(req, res) {
        try {
            const {name} = req.body
            await Brand.destroy({
                where: {
                    name
                }
            })
            res.json('ok')
        } catch(e) {
            res.json(e.message)
        }
    }
}

module.exports = new BrandController()