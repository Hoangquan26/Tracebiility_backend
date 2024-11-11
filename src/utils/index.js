'use strict'
const _ = require('lodash')

const getInstancesData = ({fields = {}, object = {}}) => {
    return _.pick(object, fields)
}

const asyncHandle = (fn) => {
    return (req, res, next) => {
        return fn(req, res, next).catch(next)
    }
}

module.exports =  {
    getInstancesData,
    asyncHandle
}