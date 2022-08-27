const userService = require('../service/user-service')

class AuthController {
    async registration(req, res, next) {
        const {email, password} = req.body
        try {
            const UserData = await userService.registration(email, password)

            res.cookie('refreshToken', UserData.refreshToken, {maxAge: 1 * 60 * 1000, httpOnly: true})
            res.json(UserData)
        } catch(e) {
            next(e)
        }
    }

    async login (req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 1 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        // const {refreshToken} = req.cookies
        try {
            const {refresh} = req.query

            const userData = await userService.refresh(refresh)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 1 * 60 * 1000, httpOnly: true})
            return res.json(userData)

        } catch(e) {
            next(e)
        }
    }

    async logout (req, res, next) {
        try {
            // const {refreshToken} = req.cookies
            const {refresh} = req.query
            const token = await userService.logout(refresh)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }

    async activate (req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect('http://localhost:3000/')
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new AuthController()