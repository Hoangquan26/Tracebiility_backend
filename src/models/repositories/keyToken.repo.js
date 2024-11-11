'use strict'
const jwt = require('jsonwebtoken')
const crypto = require('node:crypto')
const keyTokenModel = require('../keyToken.model')
const generateKeyPair = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    })
    return { publicKey, privateKey }
}

const generateTokenPair = async({payload, publicKey, privateKey}) => {
    try {
        const accessToken = await jwt.sign(payload, privateKey, {
            expiresIn: '2 days',
            algorithm: 'RS256'
        })
        const refreshToken = await jwt.sign(payload, privateKey, {
            expiresIn: '7 days',
            algorithm: 'RS256'
        })

        return {accessToken, refreshToken}
    }
    catch(error){
        console.log(error)
    }
}

const removeKeyTokenById = async(id) => {
    return await keyTokenModel.findByIdAndDelete(id)
}


module.exports = {
    generateTokenPair,
    generateKeyPair,
    removeKeyTokenById
}