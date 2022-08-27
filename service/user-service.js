const {User} = require('../models/models')
const ApiError = require('../extention/api-error')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')


class UserService {
    async registration(email, password) {
        const candidate = await User.findOne({
            where: {
                email
            }
        })
        if(candidate) {
            throw ApiError.BadRequest('Пользователь уже зарегестрирован')
        }
        const hashPassword = bcrypt.hashSync(password, 3)
        const activationLink = uuid.v4()

        await mailService.sendActivationMail(email, `http://localhost:5000/api/auth/activate/${activationLink}`)
        
        const user = await User.create({email, password : hashPassword, activationLink})
        
        const tokens = tokenService.generateToken({
            ...user.id, 
            ...user.isActivated, 
            ...user.email
        })

        await tokenService.saveToken(user.id, tokens.refreshToken) 

        return {
            ...tokens,
            user: user,
            ok: true
        }
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnavthovrizedError()
        }
        const userData = tokenService.valdateRefreshToken(refreshToken)
        const tokenDromDb = await tokenService.findToken(refreshToken)
        if(!userData || !tokenDromDb) {
            throw ApiError.UnavthovrizedError()
        }
        const user = await User.findOne({
            where : userData.id
        })

        const tokens = tokenService.generateToken({
            ...user.id, 
            ...user.email, 
            ...user.isActivated
        })
        await tokenService.saveToken(user.id, tokens.refreshToken)
        return {...tokens, user}
    }

    async login(email, password) {
        const user = await User.findOne({
            where:{email} 
        })
        if(!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const isPassEquals = bcrypt.compareSync(password, user.password)

        if(!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль')
        }
        
        const tokens = tokenService.generateToken({
            ...user.id, 
            ...user.email, 
            ...user.isActivated
        })

        await tokenService.saveToken(user.id, tokens.refreshToken)
        return {...tokens, user}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async activate(activationLink) {
        const user = await User.findOne({ 
            where: {activationLink} 
        })
        
        if(!user) {
            throw ApiError.BadRequest('Некоректная ссылка активации')
        }
        user.isActivated = true
        await user.save()
    }
}

module.exports = new UserService()