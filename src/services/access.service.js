'use strict'
const bcypt = require('bcrypt')
const userModel = require('../models/user.model')
const KeyTokenService = require('./keyToken.service')
const { BadRequestError, ForbiddenError, AuthenticateError, NotFoundError } = require('../core/error.response')
const UserRole = require('../core/user.roles')
const {generateKeyPair, generateTokenPair, removeKeyTokenById} = require('../models/repositories/keyToken.repo')
const {getInstancesData} = require('../utils/index')
const { checkUserExistByEmail, checkUserExistByUserName } = require('../models/repositories/user.repo')
const { StatusCodes } = require('../utils/statuscode/httpStatusCode')
class AccessService {

    static login = async({email, userName, password}) => {
        const foundUser = await userModel.findOne({email})
        if(!foundUser) throw new BadRequestError('Không tìm thấy người dùng')

        const validPassword = bcypt.compareSync(password, foundUser.password)
        if(!validPassword) throw new BadRequestError('Mật khẩu không đúng!')
        
        const {publicKey, privateKey} =  generateKeyPair()
        const {accessToken, refreshToken} = await generateTokenPair({payload: {userName, email, userId: foundUser._id, roles: foundUser.roles}, publicKey, privateKey})
        const keyStore = await KeyTokenService.createKeyToken({
            privateKey, 
            publicKey,
            refreshToken,
            userId: foundUser._id
        })
        if(!keyStore) throw new ForbiddenError('Có lỗi đã xảy ra!')
        return {
            tokens: {
                accessToken, refreshToken
            },
            user: getInstancesData({object: foundUser, fields: ['_id', 'userName', 'email', 'roles']})
        }
    }

    static signup = async({userName, password, email, lastName, firstName}) => {

        const foundEmail = await  checkUserExistByEmail({email})
        if(foundEmail) throw new BadRequestError('Email đã được sử dụng!')
        const hashedPassword = await bcypt.hash(password, 10)
        const newUser = await userModel.create({
            userName,
            password: hashedPassword,
            email,
            lastName,
            firstName,
            roles: [UserRole.DEFAULT]
        })

        if(!newUser) throw new ForbiddenError('Có lỗi đã xảy ra!')
        const {publicKey, privateKey} =  generateKeyPair()
        // console.log(`[PUBLICKEY, PRIVATEKEY]:::`,{publicKey, privateKey})
        const {accessToken, refreshToken} = await generateTokenPair({payload: {userName, email, userId: newUser._id, roles: newUser.roles}, publicKey, privateKey})
        // console.log(`[ACCESSTOKEN, REFRESHTOKEN]:::`,{accessToken, refreshToken})
        const keyStore = await KeyTokenService.createKeyToken({
            privateKey, 
            publicKey,
            refreshToken,
            userId: newUser._id
        })
        if(!keyStore) throw new ForbiddenError('Có lỗi đã xảy ra!')
        return {
            tokens: {
                accessToken, refreshToken
            },
            user: getInstancesData({object: newUser, fields: ['_id', 'userName', 'email', 'roles']})
        }
    }

    static userExist = async({email}) => {
        const emailExist = await checkUserExistByEmail({email})
        if(emailExist) return true
        else return false
    }

    static refreshToken = async({refreshToken, user, keyHolder} ) => {
        const {email, userId, roles, userName} = user

        if(keyHolder?.refreshTokenUsed?.includes(refreshToken)) 
        {
            await removeKeyTokenById(keyHolder._id)
            throw new AuthenticateError('Something was wrong', StatusCodes.NON_AUTHORITATIVE_INFORMATION)
        }
        if(keyHolder.refreshToken != refreshToken)
        {
            await removeKeyTokenById(keyHolder._id)
            throw new AuthenticateError('Something was wrong')
        }
        const userExist = await checkUserExistByEmail({email})
        if(!userExist)  throw new AuthenticateError(`Shop wasn't registered!`)
        
        const tokens = await generateTokenPair({payload: {userName, email, userId, roles}, publicKey: keyHolder.publicKey, privateKey: keyHolder.privateKey})
        keyHolder.refreshToken = tokens.refreshToken
        keyHolder.refreshTokenUsed.push(refreshToken)
        keyHolder.save()
        return {
            tokens,
            user: getInstancesData({object: {
                _id: user.userId,
                ...user
            }, fields: ['_id', 'userName', 'email', 'roles']})
        }
    }

    static logout = async({keyHolder, user}) => {
        const {email, userId, roles, userName} = user
        const userExist = await checkUserExistByEmail({email})
        if(!userExist)  throw new AuthenticateError(`Shop wasn't registered!`)
        return await removeKeyTokenById(keyHolder._id)
    }
}

module.exports = AccessService