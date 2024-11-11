'use strict'

const userModel = require("../user.model")

const checkUserExistByEmail = async({email}) => {
    return await userModel.exists({email})
}

const checkUserExistByUserName = async({email}) => {
    return await userModel.exists({email})
}

module.exports = {
    checkUserExistByEmail,
    checkUserExistByUserName
}