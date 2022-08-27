const {Type} = require('../models/models')

class TypeController {
    async getAll(req, res, next) {
        try {
            const types = await Type.findAll()
            res.json(types)
        } catch(e) {
            next(e)
        }
    }

    async create(req, res, next) {
        try {
            const {name} = req.body
            const type = await Type.create({name})
            res.json(type)
        } catch(e) {
            next(e)
        }
        
    }

    async delite(req, res, next) {
        try {
            const {name} = req.body
            await Type.destroy({
                where: {
                    name
                }
            }) 
            res.json('ok')
        } catch(e) {
            next(e)
        }
    }
}

module.exports = new TypeController()