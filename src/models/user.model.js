'use strict'

const {Schema, Types, model} = require('mongoose')

const DOCUMENT_NAME = "User"
const COLLECTION_NAME = "Users"
const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        trim: true,
        maxLength: 50
    },
    roles: {
        type: Array,
        default: []
    },
    verify: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive"
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, UserSchema)