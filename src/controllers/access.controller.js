'use strict'

const UserHeader = require("../configs/user.header.config")
const { CreatedResponse, OKResponse } = require("../core/success.response")
const AccessService = require('../services/access.service')
class AccessController {
    static signup = async(req, res, next) => {
        const {email, firstName, lastName, password, userName} = req.body
        const metadata = await AccessService.signup({
            email, firstName, lastName, password, userName
        })
        new CreatedResponse({
            message: "Tạo tài khoản thành công!",
            metadata
        }).send(res, {
            cookies: [
                {
                    name: UserHeader.REFRESH_TOKEN,
                    value: metadata.tokens.refreshToken,
                    option: {
                        httpOnly: true,
                        secure: true,
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                        sameSite: 'None'
                    }
                },
                {
                    name: UserHeader.USERID,
                    value: metadata.user._id,
                    option: {
                        httpOnly: true,
                        secure: true,
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                        sameSite: 'None'
                    }
                }
            ]
        })
    }

    static login = async (req, res, next) => { 
        const {email, password, userName} = req.body
        const metadata = await AccessService.login({
            email, password, userName
        })
        new OKResponse({
            message: "Đăng nhập thành công!",
            metadata
        }).send(res, {
            cookies: [
                {
                    name: UserHeader.REFRESH_TOKEN,
                    value: metadata.tokens.refreshToken,
                    option: {
                        httpOnly: true,
                        secure: true,
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                        sameSite: 'None'
                    }
                },
                {
                    name: UserHeader.USERID,
                    value: metadata.user._id,
                    option: {
                        httpOnly: true,
                        secure: true,
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                        sameSite: 'None'
                    }
                }
            ]
        })
    }

    static refreshToken =  async (req, res, next) => {
        const refreshToken = req.refreshToken
        const user = req.user
        const keyHolder = req.keyHolder
        const metadata = await AccessService.refreshToken({refreshToken, user, keyHolder})
        new OKResponse({
            message: "Refresh token thành công",
            metadata
        }).send(res, {
            cookies: [
                {
                    name: UserHeader.REFRESH_TOKEN,
                    value: metadata.tokens.refreshToken,
                    option: {
                        httpOnly: true,
                        secure: true,
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                        sameSite: 'None'
                    }
                },
                {
                    name: UserHeader.USERID,
                    value: metadata.user._id,
                    option: {
                        httpOnly: true,
                        secure: true,
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                        sameSite: 'None'
                    }
                }
            ]
        })
    }

    static userExist = async (req, res, next) => { 
        const {email} = req.body
        const metadata = await AccessService.userExist({
            email
        })
        new OKResponse({
            message: metadata ? 'Email chưa được sử dụng' : 'Email đã tồn tại',
            metadata
        }).send(res)
    }

    static logout = async(req, res, next) => {
        const keyHolder = req.keyHolder
        const user = req.user
        const metadata = await AccessService.logout({keyHolder, user})
        new OKResponse({
            message:  'Đã đăng xuất thành công',
            metadata
        }).send(res, {
            clearCookie: true   
        })
    }
}

module.exports = AccessController