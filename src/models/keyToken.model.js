'use strict'

const {Schema, Types, model} = require('mongoose')

const DOCUMENT_NAME = "KeyToken"
const COLLECTION_NAME = "KeyTokens"
const UserSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
        ref: 'User'
    },
    publicKey: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    refreshTokenUsed: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, UserSchema)