'use strict'

const jwt = require('jsonwebtoken')

const verifyToken = ({token, key}) => {
    return jwt.verify(token, key)
}

module.exports = {
    verifyToken
}