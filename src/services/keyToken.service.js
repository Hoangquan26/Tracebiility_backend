'use strict'

const keyTokenModel = require("../models/keyToken.model")

class KeyTokenService {
    static createKeyToken = async({ privateKey, publicKey, refreshToken, userId}) => {
        try {
            const filter = {userId: userId}
            const update = {
                privateKey,
                publicKey,
                refreshToken
            }
            const options = {new: true, upsert: true}
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
            console.log(`:::Tokens:::${tokens}`)
            return tokens ? {publicKey, privateKey} : null
        }
        catch (err) {
            return err
        }
    }
}

module.exports = KeyTokenService