'use strict'
const UserHeader = require('../configs/user.header.config')
const {  AuthenticateError } = require('../core/error.response')
const keyTokenModel = require('../models/keyToken.model')
const { asyncHandle } = require('../utils')
const { verifyToken } = require('../utils/sercurity')
const authUser = asyncHandle(
    async(req, res, next) => {
        const accessToken = req.headers[UserHeader.ACCESS_TOKEN]
        const userId = req.cookies[UserHeader.USERID]
        const refreshToken = req.cookies[UserHeader.REFRESH_TOKEN]
     
        if(!userId) throw new AuthenticateError('Auth failed-')
        const keyHolder = await keyTokenModel.findOne({userId})
        
        if(refreshToken) {
            const decodeToken = verifyToken({token: refreshToken, key: keyHolder.publicKey})

            if(!decodeToken) throw new AuthenticateError('Auth failed--')

            const validUser = decodeToken?.userId === userId
            if(!validUser) throw new AuthenticateError('Auth failed---')
            req.keyHolder = keyHolder
            req.user = decodeToken
            req.refreshToken = refreshToken
            return next()
        }

        const decodeToken = verifyToken({token: accessToken, key: keyHolder.publicKey})
        if(!decodeToken) throw new AuthenticateError('Auth failed--')

        const validUser = decodeToken?.userId === userId
        if(!validUser) throw new AuthenticateError('Auth failed---')
        req.keyHolder = keyHolder
        req.user = decodeToken
        return next()
    }
)


const authUserRoles = (permissions) => {
    return (req, res, next) => {
        const roles = req.user.roles
        if(roles.length) throw new AuthenticateError('Auth failed:::permission denied!')
        const validUser = roles.find(role => permissions.includes(role))
        if(!validUser) throw new AuthenticateError('Auth failed:::permission denied!')
        return next()
    }
}

module.exports = {
    authUser,
    authUserRoles
}