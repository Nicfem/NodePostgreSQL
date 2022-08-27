const jwt = require('jsonwebtoken')
const {RefreshToken} = require('../models/models')


const jwtAccessSecret = process.env.JWT_ACCESS_SECRET
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, jwtAccessSecret, {expiresIn: '1m'})
        const refreshToken = jwt.sign(payload, jwtRefreshSecret, {expiresIn: '1m'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, jwtAccessSecret)
            return userData
        } catch(e) {
            return null
        }
    }

    valdateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, jwtRefreshSecret)
            return userData
        } catch(e) {
            return null
        }
    }

    async saveToken (userId, refreshToken) {

        console.log(userId, refreshToken)

        const tokenData = await RefreshToken.findOne({
            where : {userId}
        })

        if (tokenData) {
            console.log(tokenData.refreshToken)
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        const token = await RefreshToken.create({userId, refreshToken})
        return token
    }

    async removeToken(refreshToken) {
        const tokenData = await RefreshToken.destroy({
            where:  {refreshToken}
        })
        return tokenData
    }

    async findToken(refreshToken) {
        const tokenData = await RefreshToken.findOne({
            where: {refreshToken}    
        })
        return tokenData
    }
}


module.exports = new TokenService()